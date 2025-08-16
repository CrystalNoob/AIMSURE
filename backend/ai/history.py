from langchain_google_firestore import FirestoreChatMessageHistory

# * made it more or less from here : https://python.langchain.com/docs/integrations/memory/google_firestore/


# ? "factory" function --> provides history object for a given session ID.
def get_session_history(session_id: str) -> FirestoreChatMessageHistory:
    """
    Retrieves a chat history object connected to Firestore for the given session ID.
    """
    # ? collection name in firestore will be "chat_histories"
    # ? document ID will be the session_id
    return FirestoreChatMessageHistory(
        collection="chat_histories", session_id=session_id
    )
