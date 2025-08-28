# AIMSURE - AI-Powered Financial Assistant for MSMEs

**AIMSURE is an AI-powered platform designed to make Indonesian Micro, Small, and Medium Enterprises (MSMEs) "bankable" by simplifying and automating their financial documentation.**

## About The Project

Many MSMEs in Indonesia struggle to secure bank loans due to a lack of formal, standardized financial records. AIMSURE bridges this gap by providing a conversational AI assistant that guides users through the process of creating professional, bank-ready documents.

Whether an MSME has scattered handwritten notes or no records at all, our intelligent agent can analyze existing information or generate new financial statements from scratch through a simple, guided conversation. The final output is a complete business profile, a "Bankability Score," and direct connections to suitable financial products.

This repository contains the full codebase for the AIMSURE application, built for a hackathon.

-----

## Key Features

  * **Conversational AI Agent:** A smart, multilingual assistant powered by Google Gemini that asks clarifying questions to gather financial data.
  * **Intelligent RAG Pipeline:** Uses a Firestore Vector Store to provide accurate, context-aware bank product recommendations.
  * **Structured Document Generation:** Automatically creates professional documents like a Business Profile from the conversation.
  * **Dynamic Frontend:** An interactive, responsive interface built with Next.js and Tailwind CSS.
  * **Robust Backend:** A scalable API built with Python and FastAPI.

-----

## Tech Stack

This project is a full-stack application utilizing a modern, AI-native technology stack.

  * **Frontend:**
      * [Next.js](https://nextjs.org/)
      * [React](https://react.dev/)
      * [Tailwind CSS](https://tailwindcss.com/)
      * [Shadcn/ui](https://ui.shadcn.com/)
  * **Backend:**
      * [Python](https://www.python.org/)
      * [FastAPI](https://fastapi.tiangolo.com/)
  * **AI & Orchestration:**
      * [Google Gemini](https://ai.google.dev/) (via `gemini-2.5-flash`)
      * [LangChain](https://www.langchain.com/) (specifically LangGraph for agentic workflows)
  * **Database:**
      * [Google Firestore](https://firebase.google.com/docs/firestore) (for chat history and persistent Vector Search)

-----

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js & npm
  * Python 3.9+
  * Google Cloud Project with Firebase and Vertex AI APIs enabled.

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/your-username/aimsure.git
    ```
2.  **Backend Setup:**
    ```sh
    cd aimsure/backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env # Add your API keys here
    uvicorn main:app --reload
    ```
3.  **Frontend Setup:**
    ```sh
    cd aimsure/frontend
    npm install
    cp .env.local.example .env.local
    npm run dev
    ```
