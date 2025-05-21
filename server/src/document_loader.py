import os
import pdfplumber
import pandas as pd

def read_file(file_path):
    _, file_extension = os.path.splitext(file_path)
    if file_extension.lower() == '.pdf':
        return read_pdf(file_path)
    elif file_extension.lower() == '.txt':
        return read_txt(file_path)
    elif file_extension.lower() in ['.xls', '.xlsx']:
        return read_excel(file_path)
    else:
        raise ValueError(f"Unsupported file format: {file_extension}")

def read_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def read_txt(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def read_excel(file_path):
    df = pd.read_excel(file_path)
    return df.to_string()

def chunk_text_by_characters(text, chunk_size=500):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def process_directory(directory_path, chunk_size=500):
    all_chunks = []
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)
        if os.path.isfile(file_path):
            text = read_file(file_path)
            chunks = chunk_text_by_characters(text, chunk_size)
            all_chunks.extend(chunks)
    return all_chunks