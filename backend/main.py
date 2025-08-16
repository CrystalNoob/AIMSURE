import os
import textwrap
import uvicorn
from typing import TypedDict, Union, Any
from dotenv import load_dotenv
from fastapi import FastAPI

# from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.prompt_values import PromptValue
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langgraph.graph import START
from langgraph.graph.state import CompiledStateGraph, StateGraph
from pydantic import BaseModel
from pathlib import Path

# * new stuffs for chat history
from ai.history import get_session_history
from google.cloud.firestore_v1.vector import Vector
from langchain_core.documents import Document
from google.cloud import firestore
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure
from langchain_core.runnables import Runnable

# ? hardcoded path, supaya ga ke overwritten sama variable dari environment os wkwk. harusny skrng .env pake google api key service account
env_path = Path(__file__).resolve().parent / ".env"
try:
    if env_path.exists():
        loaded = load_dotenv(dotenv_path=str(env_path))
        print(f"Loaded .env from {env_path}")
        if not loaded:
            print(f"Warning: .env found at {env_path} but load_dotenv returned False.")
    else:
        print(
            f".env not found at {env_path}, attempting default load from current working directory."
        )
        loaded = load_dotenv()
        if not loaded:
            print("Warning: no .env loaded from current working directory.")
except Exception as e:
    print(f"Error loading .env: {e}")

if not os.environ.get("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY environment variable not set!")

try:
    llm: ChatGoogleGenerativeAI = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    db = firestore.Client()

except Exception as e:
    print(e)
    exit(1)  #  this counts as abnormal exit, right?


template: str = textwrap.dedent(
    """Anda adalah asisten yang bertugas untuk membantu pemilik UMKM untuk membuat sebuah proposal pinjaman/kredit usaha kepada Bank.
    Gunakan parameter berikut untuk membuat proposal.
    Jika nama Bank tidak ada di `context`, katakan Bank tidak ada di basis data dan berhenti."""
)


# REPHRASE_TEMPLATE = """Berdasarkan riwayat percakapan berikut dan pertanyaan terakhir, formulasikan sebuah search query yang berdiri sendiri.
# Search query ini harus bisa dipahami tanpa melihat riwayat percakapan.
# Jangan menjawab pertanyaan, hanya formulasikan ulang menjadi search query yang lebih baik.

# Chat History:
# {history}

# Follow Up Input: {question}
# Standalone Search Query:"""

# REPHRASE_PROMPT_TEMPLATE: ChatPromptTemplate = ChatPromptTemplate.from_messages(
#     [
#         (
#             "system",
#             REPHRASE_TEMPLATE,
#         ),
#         MessagesPlaceholder(variable_name="history"),
#         (
#             "human",
#             "Language: {language}\nQuestion: {question}\nHistory: {history}\nContext: {context}",
#         ),
#     ]
# )
prompt_template: ChatPromptTemplate = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            template,
        ),
        MessagesPlaceholder(variable_name="history"),
        (
            "human",
            "Language: {language}\nQuestion: {question}\nHistory: {history}\nContext: {context}",
        ),
    ]
)


class State(TypedDict):
    language: str
    question: str
    history: list[BaseMessage]
    context: list[Document]
    answer: str


# def transform_query(state: State) -> dict[str, Any]:

#     print("Transforming query...")
#     query_transformer: Runnable = REPHRASE_PROMPT_TEMPLATE | llm
#     context_str = "".join(doc.page_content for doc in state.get("context", []))

#     better_query_message = query_transformer.invoke(
#         {
#             "history": state["history"],
#             "question": state["question"],
#             "language": state["language"],
#             "context": context_str,
#         }
#     )

#     return {"question": better_query_message.content}


def retrieve(state: State) -> dict[str, list[Document]]:
    """
    Retrieve contexts from the Firestore vector store.
    """
    print(f"Retrieving documents for question: {state['question']}")
    query = state["question"]

    query_vector = embeddings.embed_query(query)

    # collection_ref = db.collection("bank_products_vectors") # ! use this one for real submission
    collection_ref = db.collection("bank_products_vectors_test")

    firestore_query = collection_ref.find_nearest(
        vector_field="embedding",
        query_vector=Vector(query_vector),
        distance_measure=DistanceMeasure.EUCLIDEAN,
        limit=5,  # ? how many documents to retrieve
    )

    firestore_docs = firestore_query.get()
    print("DOCS RETRIEVED FROM FIRESTORE:")
    # ? convert the firestore documents back into dangchain document objects
    retrieved_docs = []
    for doc in firestore_docs:
        doc_dict = doc.to_dict()
        if doc_dict:
            print(f"-> Source: {doc_dict.get('metadata', {}).get('source')}")
            retrieved_docs.append(
                Document(
                    page_content=doc_dict.get("content", ""),
                    metadata=doc_dict.get("metadata", {}),
                )
            )
    return {"context": retrieved_docs}


def generate(state: State) -> dict[str, Union[str, list[Union[str, dict]]]]:
    """
    Generate answer based on the retreived context
    """
    docs_content: str = "".join(doc.page_content for doc in state["context"])
    prompt: PromptValue = prompt_template.invoke(
        {
            "language": state["language"],
            "question": state["question"],
            "context": docs_content,
            "history": state["history"],
        }
    )
    response: BaseMessage = llm.invoke(prompt)
    content: Union[str, list[Union[str, dict]]] = response.content
    return {"answer": content}


# def generate(state: State) -> dict[str, Union[str, list[Union[str, dict]]]]:
#     """
#     Generate answer based on the retreived context
#     """
#     docs_content: str = "".join(doc.page_content for doc in state["context"])
#     prompt: PromptValue = REPHRASE_PROMPT_TEMPLATE.invoke(
#         {
#             "language": state["language"],
#             "question": state["question"],
#             "context": docs_content,
#             "history": state["history"],
#         }
#     )
#     response: BaseMessage = llm.invoke(prompt)
#     content: Union[str, list[Union[str, dict]]] = response.content
#     return {"answer": content}


graph_builder: StateGraph[State] = StateGraph(State)
_ = graph_builder.add_node("retrieve", retrieve)
_ = graph_builder.add_node("generate", generate)
_ = graph_builder.add_edge(START, "retrieve")
_ = graph_builder.add_edge("retrieve", "generate")

# graph_builder: StateGraph[State] = StateGraph(State)
# graph_builder.add_node("transform_query", transform_query)
# graph_builder.add_node("retrieve", retrieve)
# graph_builder.add_node("generate", generate)
# graph_builder.add_edge(START, "transform_query")
# graph_builder.add_edge("transform_query", "retrieve")
# graph_builder.add_edge("retrieve", "generate")

graph: CompiledStateGraph = graph_builder.compile()


# TODO: add memory
graph: CompiledStateGraph = graph_builder.compile()

app: FastAPI = FastAPI(
    title="AIMSURE RAG API",
)


class QueryRequest(BaseModel):
    language: str = "Bahasa Indonesia"
    question: str
    # history: list[list[str]] | None = None  # ? removed, as we have our own history management now


class QueryResponse(BaseModel):
    answer: str


@app.post("/invoke/{session_id}", response_model=QueryResponse)  # ? <-- new session_id
# ?  new  arguments and logic also
async def invoke_chain(session_id: str, request: QueryRequest) -> dict[str, Any]:
    history_manager = get_session_history(session_id)
    previous_messages = history_manager.messages
    initial_state: State = {
        "language": request.language,
        "question": request.question,
        "history": previous_messages,  # ? new hehe
        "context": [],
        "answer": "",
    }

    result: dict[str, Any] | Any = graph.invoke(initial_state)
    final_answer = result.get("answer", "Sorry I couldn't find an answer")

    new_messages = [
        HumanMessage(content=request.question),
        AIMessage(content=final_answer),
    ]
    history_manager.add_messages(new_messages)

    return {"answer": final_answer}


if __name__ == "__main__":
    host: str = "0.0.0.0"
    port: int = 8000
    uvicorn.run(app, host=host, port=port)
