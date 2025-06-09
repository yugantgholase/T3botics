import faiss
import numpy as np

def create_vector_store(embeddings):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    return index

def query_vector_store(query, vector_store, model, k=5):
    query_embedding = model.encode([query])
    distances, indices = vector_store.search(query_embedding, k=k)
    return indices[0]  # Return array of top-k indices