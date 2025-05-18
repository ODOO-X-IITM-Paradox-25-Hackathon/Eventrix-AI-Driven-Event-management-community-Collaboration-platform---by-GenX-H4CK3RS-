import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain


def init_chatbot(vectorstore):
    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model_name="llama-3.1-70b-versatile"
    )
    retriever = vectorstore.as_retriever()

    contextualize_q_system_prompt = (
        "Given the chat history and the latest user question about medical issues or health-related topics, "
        "reformulate the question to make it standalone and clear. "
        "Do NOT answer the question, just reformulate it. "
        "If it's already clear, return it as is."
    )
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),  # The user's latest input
        ]
    )

    # Create a history-aware retriever that will use LLM to contextualize queries
    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )

    # System prompt for answering the user's question based on retrieved documents
    qa_system_prompt = (
        "You are a knowledgeable and concise medical assistant. "
        "Use the provided medical context to answer the health-related question accurately. "
        "If you are unsure or do not know the answer, say that you don't know. "
        "Provide a concise, evidence-based response in no more than three sentences, "
        "and avoid offering medical advice without sufficient context."
        "\n\n"
        "{context}"
    )

    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),  # Optional chat history
            ("human", "{input}"),  # User's query
        ]
    )

    # Combine documents and generate an answer using the LLM
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    return rag_chain


def chat(rag_chain):
    chat_history = []
    while True:
        query = input("You: ")
        if query.lower() in ["exit", "quit", "bye"]:
            break
        # Process the user's query through the retrieval chain
        result = rag_chain.invoke({"input": query, "chat_history": chat_history})
        # Display the AI's response
        print(f"AI: {result['answer']}")
        # Update the chat history
        chat_history.append(HumanMessage(content=query))
        chat_history.append(AIMessage(content=result["answer"]))
