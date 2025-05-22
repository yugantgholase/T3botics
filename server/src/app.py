from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from .document_loader import process_directory
from .embedding import embed_chunks
from .vector_store import create_vector_store
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from langchain.memory import ConversationBufferMemory
from langchain_ollama import ChatOllama  # Updated import for latest LangChain Ollama integration
from langchain.schema import HumanMessage

app = FastAPI()

# Load and process documents
directory_path = 'files'
chunks = process_directory(directory_path, chunk_size=500)
embeddings = embed_chunks(chunks)
vector_store = create_vector_store(np.array(embeddings))
print("Vector store created with", vector_store.ntotal, "vectors.")

# Initialize the embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize LangChain memory and LLM (using your custom model from Modelfile)
memory = ConversationBufferMemory(return_messages=True)
llm = ChatOllama(base_url="http://localhost:11434", model="t3k-llama2")

class Query(BaseModel):
    query: str

@app.post("/chat")
async def chat(query: Query):
    # Embed the query
    query_embedding = model.encode([query.query])

    # Calculate similarity scores
    similarity_scores = cosine_similarity(query_embedding, embeddings)

    # Find the most relevant chunk
    most_relevant_index = np.argmax(similarity_scores)
    most_relevant_chunk = chunks[most_relevant_index]

    # Add user message to memory
    memory.chat_memory.add_user_message(query.query)

    # Prepare messages for LLM (conversation history + context)
    messages = [
        *memory.chat_memory.messages,
        HumanMessage(content=f"Context: {most_relevant_chunk}")
    ]

    # Get LLM response (use .invoke for latest LangChain)
    response = llm.invoke(messages)
    answer = response.content

    # Add bot response to memory
    memory.chat_memory.add_ai_message(answer)

    return {"response": answer}

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            user_query = data.get("query", "")

            # Embed the query
            query_embedding = model.encode([user_query])
            similarity_scores = cosine_similarity(query_embedding, embeddings)
            most_relevant_index = np.argmax(similarity_scores)
            most_relevant_chunk = chunks[most_relevant_index]

            # Add user message to memory
            memory.chat_memory.add_user_message(user_query)

            # Prepare messages for LLM (conversation history + context)
            messages = [
                *memory.chat_memory.messages,
                HumanMessage(content=f"Context: {most_relevant_chunk}")
            ]

            # Stream LLM response (assuming .astream exists)
            response_text = ""
            async for chunk in llm.astream(messages):
                delta = getattr(chunk, "content", None)
                if delta:
                    response_text += delta
                    await websocket.send_json({"response": delta})

            # Add bot response to memory
            memory.chat_memory.add_ai_message(response_text)
            await websocket.send_json({"done": True})

    except WebSocketDisconnect:
        pass