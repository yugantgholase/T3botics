import os
import pdfplumber
import pandas as pd

def read_file(file_path, chunk_size=2500, overlap=250):
    _, file_extension = os.path.splitext(file_path)
    if file_extension.lower() == '.pdf':
        return read_pdf(file_path, chunk_size, overlap)
    elif file_extension.lower() == '.txt':
        return read_txt(file_path, chunk_size, overlap)
    elif file_extension.lower() in ['.xls', '.xlsx']:
        return read_excel(file_path, chunk_size, overlap)
    else:
        raise ValueError(f"Unsupported file format: {file_extension}")

def read_pdf(file_path, chunk_size=2500, overlap=250):
    chunks_with_meta = []
    with pdfplumber.open(file_path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            chunks = chunk_text_by_characters(text, chunk_size=chunk_size, overlap=overlap)
            for chunk in chunks:
                chunks_with_meta.append({
                    "content": chunk,
                    "file_name": os.path.basename(file_path),
                    "page_number": page_number
                })
    return chunks_with_meta

def read_txt(file_path, chunk_size=2500, overlap=250):
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()
    chunks = chunk_text_by_characters(text, chunk_size=chunk_size, overlap=overlap)
    return [{"content": chunk, "file_name": os.path.basename(file_path), "page_number": None} for chunk in chunks]

def read_excel(file_path, chunk_size=2500, overlap=250):
    df = pd.read_excel(file_path)
    text = df.to_string()
    chunks = chunk_text_by_characters(text, chunk_size=chunk_size, overlap=overlap)
    return [{"content": chunk, "file_name": os.path.basename(file_path), "page_number": None} for chunk in chunks]

def chunk_text_by_characters(text, chunk_size=2500, overlap=250):
    if chunk_size <= overlap:
        raise ValueError("chunk_size must be greater than overlap")

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap  # Move by window with overlap
    return chunks

def process_directory(directory_path, chunk_size=2500, overlap=250):
    all_chunks = []
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)
        if os.path.isfile(file_path):
            file_chunks = read_file(file_path, chunk_size, overlap)
            all_chunks.extend(file_chunks)
    return all_chunks