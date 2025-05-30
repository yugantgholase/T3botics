from flask import Flask
from flask_socketio import SocketIO, emit
from document_loader import process_directory
from embedding import embed_chunks
from vector_store import create_vector_store
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from langchain.memory import ConversationBufferMemory
from langchain_ollama import ChatOllama
from langchain.schema import HumanMessage
import asyncio

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Load and process documents
directory_path = 'files'
chunks = process_directory(directory_path, chunk_size=500)
embeddings = embed_chunks(chunks)
vector_store = create_vector_store(np.array(embeddings))
print("Vector store created with", vector_store.ntotal, "vectors.")

# Initialize the embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize LangChain memory and LLM
memory = ConversationBufferMemory(return_messages=True)
llm = ChatOllama(base_url="http://localhost:11434", model="t3k-llama2")

# Define a namespace for chat
namespace = '/chat'

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
    print(user_query)
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

    print("context is as follows : ", messages)

    response_text = ""
    print("started answering")

    async def process_stream():
        async for chunk in llm.astream(messages):
            delta = getattr(chunk, "content", None)
            print(delta)
            if delta:
                nonlocal response_text
                if response_text == "":
                    emit('stream_starting', {'flag' : True})
                response_text += delta
                emit('bot_response', {'data': delta}, namespace=namespace)

    # Create a new event loop for the async function
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(process_stream())

    # Add bot response to memory
    memory.chat_memory.add_ai_message(response_text)
    emit('bot_response_done', {'done': True}, namespace=namespace)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)