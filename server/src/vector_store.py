import faiss
import numpy as np

def create_vector_store(embeddings):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)  # L2 distance
    index.add(embeddings)
    return index

def query_vector_store(query, vector_store, model):
    query_embedding = model.encode([query])
    distances, indices = vector_store.search(query_embedding, k=5)  # Retrieve top 5 matches
    return indices