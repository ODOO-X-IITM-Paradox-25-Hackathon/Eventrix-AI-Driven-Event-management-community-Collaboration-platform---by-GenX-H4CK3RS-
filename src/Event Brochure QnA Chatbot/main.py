import os
from dotenv import load_dotenv
from pdf_processor import process_pdf
from vector_store import get_or_create_vector_store, get_vector_store
from chatbot import init_chatbot, chat


def main():
    load_dotenv()

    # Uncomment the following lines to upload a new PDF file
    pdf_path = os.getenv("PDF_PATH")
    if not pdf_path:
        raise ValueError("Please set the PDF_PATH environment variable.")

    texts = process_pdf(pdf_path)
    vectorstore = get_or_create_vector_store(texts)

    # vector_store = get_vector_store()

    chain = init_chatbot(vectorstore)

    chat(chain)


if __name__ == "__main__":
    main()