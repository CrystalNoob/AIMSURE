from dotenv import load_dotenv
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from google.cloud import firestore
import firebase_admin
from pathlib import Path

# ! RUN THIS FILE IF NEEDED . IDEALLY every time ada update aja
print("Starting data ingestion...")

# env_path = Path(__file__).resolve().parent.parent / ".env" # TODO,debug why running this file in ai folder has the wrong aimsure json path
env_path = Path(__file__).resolve().parent / ".env"  # ? run this if in backend folder
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

cred = firebase_admin.credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
db = firestore.Client()

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

web_links = [
    "https://www.bca.co.id/id/bisnis/produk/pinjaman-bisnis/Kredit-Usaha-Rakyat",
    "https://salamdigital.bankbsi.co.id/produk/bsi-usaha-mikro-rp-25-juta-rp-50-juta",
    "https://eform.bni.co.id/BNI_eForm/disclaimerPenawaran",
]
loader = WebBaseLoader(web_paths=web_links)
docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
all_splits = text_splitter.split_documents(docs)
print(f"Loaded and split {len(all_splits)} document chunks.")

collection_name = "bank_products_vectors_test"
batch = db.batch()
count = 0

for doc in all_splits:
    content = doc.page_content
    metadata = doc.metadata

    try:
        embedding_vector = embeddings.embed_query(content)

        firestore_doc = {
            "content": content,
            "metadata": metadata,
            "embedding": embedding_vector,
        }

        doc_ref = db.collection(collection_name).document()
        batch.set(doc_ref, firestore_doc)
        count += 1

        # ? commit the batch every 500 documents
        if count % 500 == 0:
            print(f"Committing batch of {count} documents...")
            batch.commit()
            batch = db.batch()  # Start a new batch

    except Exception as e:
        print(f"Could not generate embedding for a chunk. Error: {e}")

# ? if any remaining docs in last batch
if count > 0:
    print("Committing final batch...")
    batch.commit()

print(
    f"Successfully ingested {count} documents into Firestore collection '{collection_name}'."
)
