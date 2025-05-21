import requests
from document_loader import process_directory
from embedding import embed_chunks
from vector_store import create_vector_store
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def generate_chat_completion_with_olla(query, context):
    url = "http://localhost:11434/api/chat"
    prompt = (
        f"You are T3K Chat. Here is the user query: '{query}'. "
        f"Based on the following context, please answer the user's question concisely. "
        f"Context: {context} "
        "Please provide only the answer to the user's question without any extra information."
    )
    payload = {
        "model": "llama2:13b",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "stream": False
    }
    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json().get('message', {}).get('content', "No response")
    else:
        return f"Error: {response.status_code}"

def main():
    # Load and process documents
    directory_path = 'files'
    chunks = process_directory(directory_path, chunk_size=500)
    embeddings = embed_chunks(chunks)
    vector_store = create_vector_store(np.array(embeddings))
    print("Vector store created with", vector_store.ntotal, "vectors.")

    # Initialize the embedding model
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Chatbot loop
    print("Welcome to the T3K Admin Chatbot! Type 'exit' to quit.")
    while True:
        query = input("You: ")
        if query.lower() == 'exit':
            break

        # Embed the query
        query_embedding = model.encode([query])

        # Calculate similarity scores
        similarity_scores = cosine_similarity(query_embedding, embeddings)

        # Find the most relevant chunk
        most_relevant_index = np.argmax(similarity_scores)
        most_relevant_chunk = chunks[most_relevant_index]

        # Generate response using Olla
        response = generate_chat_completion_with_olla(query, most_relevant_chunk)
        print("Bot:", response)

if __name__ == "__main__":
    main()