from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from google.cloud.firestore_v1.vector import Vector
from google.cloud import firestore
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure

load_dotenv()
db = firestore.Client()
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# test_query = "Kredit Usaha Rakyat BCA"
test_query = "Jelaskan BNI eForm KUR Mikro Disclaimer"


print(f"Testing with query: '{test_query}'")

query_vector = embeddings.embed_query(test_query)
print(f"Generated a vector with {len(query_vector)} dimensions.")

collection_ref = db.collection("bank_products_vectors_test")
firestore_query = collection_ref.find_nearest(
    vector_field="embedding",
    query_vector=Vector(query_vector),
    distance_measure=DistanceMeasure.EUCLIDEAN,
    limit=3,
)
results = firestore_query.get()
print(f"RESULTS: {results}")

found_docs = list(results)
if not found_docs:
    print("FAILURE: The query returned 0 documents.")
else:
    print(f"SUCCESS: The query returned {len(found_docs)} documents.")
    for doc in found_docs:
        if not doc:
            continue
        doc_dict = doc.to_dict() or {}
        content = doc_dict.get("content")
        if content is None:
            print("Warning: document has no 'content' field or it is None")
        else:
            print(f"Found content: {content[:100]}...")
