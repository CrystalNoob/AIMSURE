import os
import textwrap
import uvicorn
from typing import TypedDict, Union, Any
from dotenv import load_dotenv
from fastapi import FastAPI
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.prompt_values import PromptValue
from langchain_core.vectorstores import InMemoryVectorStore, VectorStoreRetriever
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langgraph.graph import START
from langgraph.graph.state import CompiledStateGraph, StateGraph
from pydantic import BaseModel

_ = load_dotenv()

if not os.environ.get("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY environment variable not set!")

try:
    llm: ChatGoogleGenerativeAI = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
    embeddings: GoogleGenerativeAIEmbeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001"
    )
except Exception as e:
    print(e)
    exit(1)  #  this counts as abnormal exit, right?


# TODO: replace this with firebase DB
# TODO : wait ahaha besok jumat last ak selesain ngurusinnnya, tutorial nya mayan panjang juga wkwkkw
web_links: list[str] = [
    "https://www.bca.co.id/id/bisnis/produk/pinjaman-bisnis/Kredit-Usaha-Rakyat",
    "https://salamdigital.bankbsi.co.id/produk/bsi-usaha-mikro-rp-25-juta-rp-50-juta",
    "https://eform.bni.co.id/BNI_eForm/disclaimerPenawaran",
]

loader: WebBaseLoader = WebBaseLoader(web_paths=web_links)
docs: list[Document] = loader.load()

text_splitter: RecursiveCharacterTextSplitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    add_start_index=True,
)
all_splits: list[Document] = text_splitter.split_documents(docs)

vector_store: InMemoryVectorStore = InMemoryVectorStore(embedding=embeddings)
_ = vector_store.add_documents(documents=all_splits)
retriever: VectorStoreRetriever = vector_store.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 6,
        "lambda_mult": 0.25,
    },
)


template: str = textwrap.dedent(
    """Anda adalah asisten yang bertugas untuk membantu pemilik UMKM untuk membuat sebuah proposal pinjaman/kredit usaha kepada Bank.
    Gunakan parameter berikut untuk membuat proposal.
    Jika nama Bank tidak ada di `context`, katakan Bank tidak ada di basis data dan berhenti."""
)

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


def retrieve(state: State) -> dict[str, list[Document]]:
    """
    Retrieve contexts from the vector store
    """
    print(f"Retrieving documents for question: {state['question']}")
    retrieved_docs: list[Document] = retriever.invoke(state["question"])
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


graph_builder: StateGraph[State] = StateGraph(State)
_ = graph_builder.add_node("retrieve", retrieve)
_ = graph_builder.add_node("generate", generate)
_ = graph_builder.add_edge(START, "retrieve")
_ = graph_builder.add_edge("retrieve", "generate")
# TODO: add memory
graph: CompiledStateGraph = graph_builder.compile()

app: FastAPI = FastAPI(
    title="AIMSURE RAG API",
)


class QueryRequest(BaseModel):
    language: str = "Bahasa Indonesia"
    question: str
    history: list[list[str]] | None = None


class QueryResponse(BaseModel):
    answer: str


@app.post("/invoke", response_model=QueryResponse)
async def invoke_chain(request: QueryRequest) -> dict[str, Any]:
    hist: list[BaseMessage] = []
    if request.history:
        for sender, text in request.history:
            if sender == "user":
                hist.append(HumanMessage(content=text))
            elif sender == "bot":
                hist.append(AIMessage(content=text))

    initial_state: State = {
        "language": request.language,
        "question": request.question,
        "history": hist,
        "context": [],
        "answer": "",
    }

    result: dict[str, Any] | Any = graph.invoke(initial_state)
    return {"answer": result.get("answer", "Sorry, I couldn't find an answer.")}


if __name__ == "__main__":
    host: str = "0.0.0.0"
    port: int = 8000
    uvicorn.run(app, host=host, port=port)
