from sentence_transformers import SentenceTransformer

def embed_chunks(chunks):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    contents = [chunk['content'] for chunk in chunks]
    embeddings = model.encode(contents)
    return embeddings