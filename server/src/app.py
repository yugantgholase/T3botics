from flask import Flask
from flask_socketio import SocketIO, emit
from document_loader import process_directory
from embedding import embed_chunks
from vector_store import create_vector_store, query_vector_store
from sentence_transformers import SentenceTransformer
import numpy as np
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from langchain_core.runnables import RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from typing import TypedDict, List
from langchain_core.prompts import PromptTemplate
import asyncio
from langchain_core.messages import BaseMessage

class GraphState(TypedDict):
    messages: List[BaseMessage]  # Optional: you might not even be using this yet
    question: str
    user_id: str
    context: str
    answer: str


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Load and process documents
directory_path = 'files'
chunks = process_directory(directory_path, chunk_size=2500, overlap=250)
embeddings = embed_chunks(chunks)
vector_store = create_vector_store(np.array(embeddings))
print("Vector store created with", vector_store.ntotal, "vectors.")

# Embedding model
embed_model = SentenceTransformer('all-MiniLM-L6-v2')

# LLM
llm = ChatOllama(model="t3k-llama2", keep_alive=-1)

# Memory structure to retain only relevant history
chat_histories = {}

namespace = '/chat'

followup_prompt = PromptTemplate.from_template("""
You are an assistant that suggests follow-up questions.
Given the previous user question and the assistant's answer, generate 3 follow-up questions in JSON array format only
do not add anything infront and at the end just a JSON like this:
{{"questions": ["...", "...", "..."]}}

User question: {user_question}
Assistant answer: {answer}
""")

def create_graph():
    def store_history(state):
        user_id = state["user_id"]
        if user_id not in chat_histories:
            chat_histories[user_id] = []
        chat_histories[user_id].append(HumanMessage(content=state["question"]))
        return state

    def retrieve_context(state):
        user_query = state["question"]
        indices = query_vector_store(user_query, vector_store, embed_model, k=3)
        context = ""
        for i, idx in enumerate(indices):
            chunk_data = chunks[idx]
            citation = f"[{i+1}] (File: {chunk_data['file_name']}, Page: {chunk_data['page_number']})"
            context += f"{citation}\n{chunk_data['content']}\n\n"
        state["context"] = context
        return state

    async def call_llm(state):
        user_id = state["user_id"]
        history = chat_histories.get(user_id, [])
        context = state["context"]
        query = state["question"]
        messages = history + [HumanMessage(content=f"Context:\n{context}"), HumanMessage(content=query)]
        print("llm context", messages)

        response_text = ""
        async def stream_llm():
            nonlocal response_text
            async for chunk in llm.astream(messages):
                delta = getattr(chunk, "content", None)
                print(delta)
                if delta:
                    if response_text == "":
                        emit('stream_starting', {'flag': True})
                    response_text += delta
                    emit('bot_response', {'data': delta}, namespace=namespace)

        await stream_llm()
        chat_histories[user_id].append(AIMessage(content=response_text))
        state["answer"] = response_text
        return state

    def generate_followups(state):
        chain = followup_prompt | llm | StrOutputParser()
        result = chain.invoke({"user_question": state["question"], "answer": state["answer"]})
        print("followup ", result)
        emit("followup_questions", result, namespace=namespace)
        return state

    workflow = StateGraph(GraphState)
    workflow.add_node("store_history", RunnableLambda(store_history))
    workflow.add_node("retrieve_context", RunnableLambda(retrieve_context))
    workflow.add_node("call_llm", RunnableLambda(call_llm))
    workflow.add_node("generate_followups", RunnableLambda(generate_followups))

    workflow.set_entry_point("store_history")
    workflow.add_edge("store_history", "retrieve_context")
    workflow.add_edge("retrieve_context", "call_llm")
    workflow.add_edge("call_llm", "generate_followups")
    workflow.add_edge("generate_followups", END)

    return workflow.compile()

graph = create_graph()

@socketio.on('connect', namespace=namespace)
def handle_connect():
    print('Client connected')
    emit('connection_status', {'data': 'Connected to Flask-SocketIO server'}, namespace=namespace)

@socketio.on('disconnect', namespace=namespace)
def handle_disconnect():
    print('Client disconnected')

@socketio.on('user_message', namespace=namespace)
def handle_message(data):
    user_query = data.get("query", "")
    user_id = data.get("user_id", "anonymous")
    print("User query:", user_query)

    state = {"user_id": user_id, "question": user_query}

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(graph.ainvoke(state))

    emit('bot_response_done', {'done': True}, namespace=namespace)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
