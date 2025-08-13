import os
from dotenv import load_dotenv
from google.ai.generativelanguage import Document
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

_ = load_dotenv()

if not os.environ.get("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY environment variable not set!")

os.environ["LANGSMITH_TRACING"] = (
    "true"  # false if you don't want to trace the model and waste API limit
)

if not os.environ.get("LANGSMITH_API_KEY"):
    print(
        "LANGSMITH_API_KEY not set! If you need to track the model, set it at .env or set shell env"
    )
    _ = os.environ.pop("LANGSMITH_TRACING", default=None)

try:
    llm: ChatGoogleGenerativeAI = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
    embeddings: GoogleGenerativeAIEmbeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001"
    )
except Exception as e:
    print(e)
    exit(1)  #  this counts as abnormal exit, right?

pages: list[Document] = []
