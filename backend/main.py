import os
import textwrap
import uvicorn
from typing import TypedDict, Any, cast
from dotenv import load_dotenv
from fastapi import FastAPI

# from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

# from langgraph.graph import START
from langgraph.graph.state import StateGraph
from pathlib import Path

# * new stuffs for chat history
from ai.history import get_session_history
from google.cloud.firestore_v1.vector import Vector
from langchain_core.documents import Document
from google.cloud import firestore
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure
from fastapi.middleware.cors import CORSMiddleware

# from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

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


# template: str = textwrap.dedent(
#     """Anda adalah asisten yang bertugas untuk membantu pemilik UMKM untuk membuat sebuah proposal pinjaman/kredit usaha kepada Bank.
#     Gunakan parameter berikut untuk membuat proposal.
#     Jika nama Bank tidak ada di `context`, katakan Bank tidak ada di basis data dan berhenti."""
# )

template: str = textwrap.dedent(
    """
    **Persona:**
    You are "AIMSURE," a professional, friendly, and highly competent financial assistant for Indonesian Micro, Small, and Medium Enterprises (UMKM). Your tone is encouraging and you always use clear, easy-to-understand language, avoiding technical jargon unless you explain it simply.

    **Primary Goal:**
    Your main goal is to help a user get the best possible bank loan recommendation by guiding them through a conversation to build their business profile.

    **Process:**
    1.  **Greeting & Profiling:** Start by greeting the user and asking open-ended questions to understand their business (name, industry, revenue, specific needs).
    2.  **Information Gathering:** Continue asking targeted questions one by one until you have enough information to make a recommendation.
    3.  **Recommendation:** Once you have sufficient information and have retrieved relevant bank products from your context, provide a recommendation.

    **Constraints:**
    -   **Be Bilingual:** Your primary language is Bahasa Indonesia, but you are fluent in English. **Always respond in the same language the user is using.**
    -   **Base your final recommendation *only* on the information provided in the `context`.** Do not invent or use outside knowledge for bank product details.
    -   If the `context` is empty or does not contain a suitable bank, state that you couldn't find a specific match and provide a general list of all available banks as a helpful guide. Do not apologize excessively.
    -   Keep your answers concise and focused on the current step of the process.

    **Examples of Interaction:**
    -   **User (in Indonesian):** "Hi, saya punya warung kopi dan butuh 50jt."
    -   **You (respond in Indonesian):** "Tentu, saya bisa bantu. Boleh tahu berapa rata-rata pendapatan bulanan warung Anda?"
    -   **User (in English):** "Hi, I run a small IT service company."
    -   **You (respond in English):** "Great! I can help with that. To start, what is your average monthly revenue?"
    """
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


class CompleteMSMEProfile(BaseModel):
    business_name: str | None = None
    monthly_revenue: int | None = None
    industry: str | None = None
    has_nik: bool | None = None
    has_npwp: bool | None = None


class BankCard(BaseModel):
    bankName: str
    productName: str
    logoUrl: str
    details: list[str]


class BankResults(BaseModel):
    intro: str
    cards: list[BankCard]


class State(TypedDict):
    language: str
    question: str
    history: list[BaseMessage]
    context: list[Document]
    # answer: str
    answer: Any
    profile: CompleteMSMEProfile


def retrieve(state: State) -> dict[str, list[Document]]:
    """
    Retrieve contexts from the Firestore vector store.
    """
    print(f"Retrieving documents for question: {state['question']}")
    query = state["question"]

    query_vector = embeddings.embed_query(query)

    # collection_ref = db.collection("bank_products_vectors") # ! use this one for real submission
    collection_ref = db.collection("bank_products_vectors_test_3")

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


def generate(state: State) -> dict[str, Any]:
    """
    Generate a structured answer based on the retrieved context.
    """
    print("---NODE: GENERATE FINAL RESPONSE---")

    # context = state.get("context", [])
    context = state["context"]

    if not context:
        print("---INFO: No context found, using fallback response.---")
        fallback_prompt = ChatPromptTemplate.from_template(
            "You are a helpful financial assistant. Your current task is to inform the user that no specific bank recommendations could be found for their request. "
            "First, write a brief, friendly message explaining this. "
            "Then, as a helpful alternative, provide a simple list of the banks you have general information about. "
            "The banks are: BCA, BNI, BRI, BSI, and BTN."
        )
        generation_chain = fallback_prompt | llm
        response = generation_chain.invoke({})
        return {"answer": {"role": "ai", "type": "text", "content": response.content}}

    structured_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a helpful assistant. Based on the provided context, generate a friendly introductory sentence and a list of bank recommendation cards.",
            ),
            ("human", "Context:\n{context}\n\nUser Question: {question}"),
        ]
    )

    generation_chain = structured_prompt | llm.with_structured_output(BankResults)

    response_data = generation_chain.invoke(
        {
            "context": "\n\n".join(doc.page_content for doc in state["context"]),
            "question": state["question"],
        }
    )
    structured_response = cast(BankResults, response_data)

    return {
        "answer": {
            "role": "ai",
            "type": "bank_results",
            "content": structured_response.model_dump(),
        }
    }


# ! graph creation start


def update_profile(state: State) -> dict[str, CompleteMSMEProfile]:
    """Node to check the history and update the MSME profile."""
    print("---NODE: UPDATING PROFILE---")

    # profile_extractor_prompt = ChatPromptTemplate.from_messages(
    #     [
    #         (
    #             "system",
    #             "Based on the conversation history, extract or update the user's business profile information. Only fill in fields that are explicitly mentioned.",
    #         ),
    #         ("human", "Conversation History:\n{history}"),
    #     ]
    # )
    profile_extractor_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Based on the latest user message in the conversation history, extract or update the user's business profile information. Only fill in fields that are explicitly mentioned in the last message.",
            ),
            ("human", "Conversation History:\n{history}"),
        ]
    )

    extractor_chain = profile_extractor_prompt | llm.with_structured_output(
        CompleteMSMEProfile
    )

    # current_profile = state.get("profile", CompleteMSMEProfile())
    current_profile = state["profile"]
    # history = state.get("history", [])
    history = state["history"]

    updated_profile_data = extractor_chain.invoke({"history": history})
    structured_update = cast(CompleteMSMEProfile, updated_profile_data)
    merged_profile = current_profile.model_copy(
        update=structured_update.model_dump(exclude_unset=True)
    )

    return {"profile": merged_profile}


def ask_question(state: State) -> dict[str, Any]:
    """Node to generate the next question to ask the user."""
    print("---NODE: ASKING NEXT QUESTION---")

    question_generator_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a friendly AI assistant. Based on the user's profile, figure out the most important piece of missing information and ask a single, clear question to get it. If the profile is complete, just say 'Thanks, I have all the information I need!'",
            ),
            ("human", "Current Profile: {profile}\n\nHistory: {history}"),
        ]
    )
    question_chain = question_generator_prompt | llm

    response = question_chain.invoke(
        {"profile": state["profile"], "history": state["history"]}
    )
    return {
        "answer": {
            "role": "ai",
            "type": "text",
            "content": response.content,
        }
    }


# ? condiitonal edge
def route_after_profile_update(state: State) -> str:
    """Router to decide where to go after updating the profile."""
    print("---ROUTER: DECIDING NEXT STEP---")
    # profile = state.get("profile", CompleteMSMEProfile())
    profile = state["profile"]

    if (
        profile.business_name
        and profile.industry
        and profile.monthly_revenue is not None
    ):
        print("---DECISION: Profile is complete. Retrieving documents.---")
        return "retrieve"
    else:
        print("---DECISION: Profile is incomplete. Asking another question.---")
        return "ask_question"  # Go back to ask another question


graph_builder = StateGraph(State)

graph_builder.add_node("update_profile", update_profile)
graph_builder.add_node("ask_question", ask_question)
graph_builder.add_node("retrieve", retrieve)
graph_builder.add_node("generate", generate)

graph_builder.set_entry_point("update_profile")

graph_builder.add_conditional_edges(
    "update_profile",
    route_after_profile_update,
    {"retrieve": "retrieve", "ask_question": "ask_question"},
)

graph_builder.add_edge("ask_question", "__end__")
graph_builder.add_edge("retrieve", "generate")
graph_builder.add_edge("generate", "__end__")

graph = graph_builder.compile()


# ! graph creation stopped

app: FastAPI = FastAPI(
    title="AIMSURE RAG API",
)

origins = [
    "http://localhost:3000",  # ? next js url
    # ? add later pas deploy,
    "https://aimsure.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    language: str = "Bahasa Indonesia"
    question: str


class QueryResponse(BaseModel):
    answer: str


@app.post("/invoke/{session_id}")
async def invoke_chain(session_id: str, request: QueryRequest) -> Any:
    history_manager = get_session_history(session_id)
    initial_state: State = {
        "language": request.language,
        "question": request.question,
        "history": history_manager.messages,
        "profile": CompleteMSMEProfile(),
        "context": [],
        "answer": "",
    }

    result = graph.invoke(initial_state)
    final_message_object = result.get("answer")

    if not final_message_object:
        final_message_object = {
            "role": "ai",
            "type": "text",
            "content": "Sorry, an error occurred.",
        }

    new_messages = [
        HumanMessage(content=request.question),
        AIMessage(content=str(final_message_object.get("content", ""))),
    ]
    history_manager.add_messages(new_messages)

    return final_message_object


# ? dummy document stuffs for now


class BusinessProfile(BaseModel):
    """A concise overview of the business."""

    business_name: str = Field(description="The official name of the business.")
    background: str = Field(
        description="A brief history and background of the business."
    )
    industry: str = Field(description="The industry the business operates in.")
    key_activities: str = Field(description="The main products or services offered.")


class ChecklistItem(BaseModel):
    document_name: str
    is_required: bool
    notes: str


class SupportingDocumentChecklist(BaseModel):
    """A checklist of supporting documents for a bank loan application."""

    bank_name: str
    items: list[ChecklistItem]


class DocumentCustom(BaseModel):
    name: str
    structuredContent: dict


class DocumentResponse(BaseModel):
    documents: list[DocumentCustom]


def save_generated_documents_to_firestore(session_id: str, documents: list[dict]):
    """
    Save the generated documents to Firestore, hopefully anyway
    """
    collection_ref = db.collection("user_document_results")

    for doc in documents:
        try:
            document_data = {
                "session_id": session_id,
                "name": doc["name"],
                "content": doc["content"],
            }
            _ = collection_ref.add(document_data)

        except Exception as e:
            raise e


@app.post("/generate-documents/{session_id}", response_model=DocumentResponse)
async def generate_documents(session_id: str) -> dict[str, list[dict]]:
    print(f"Generating final documents for session: {session_id}")
    history_manager = get_session_history(session_id)
    full_history = history_manager.messages

    # ? (still testing) prompt that asks the LLM
    generation_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert financial assistant. Based on the entire provided conversation history, generate three documents: a Cash Flow Statement, a Profit & Loss Statement, and a simple Business Loan Proposal. Format the output as a JSON object with a single key 'documents', which is a list of objects. Each object should have 'name' and 'content' keys.",
            ),
            ("human", "Here is the conversation history: {history}"),
        ]
    )

    final_doc_chain = generation_prompt | llm.with_structured_output(BusinessProfile)
    response_data = await final_doc_chain.ainvoke({"history": full_history})
    structured_response = cast(BusinessProfile, response_data)

    return {
        "documents": [
            {
                "name": "Business Profile",
                "structuredContent": structured_response.model_dump(),
            }
        ]
    }


if __name__ == "__main__":
    host: str = "0.0.0.0"
    port: int = 8000
    uvicorn.run(app, host=host, port=port)
