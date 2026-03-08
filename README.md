# 🔮 Lorekeeper Terminal

A full-stack, locally-hosted LLM application designed to act as an intelligent, secure world-building database for authors and world-builders. 

Built for Hack Club Flavortown.

## 🚀 The Architecture

This project is a decoupled monorepo utilizing a modern web stack:

* **Frontend:** React (Vite) + Tailwind CSS + Framer Motion
* **Backend:** Python + FastAPI + SQLAlchemy
* **Database:** SQLite
* **AI Engine:** Ollama running Microsoft's Phi-3 (Mini) locally

## ✨ Features

* **Arcane Terminal UI:** A custom-built, highly interactive React interface featuring typing animations, loading states, and full Markdown rendering.
* **Local AI Processing:** Uses a local Phi-3 model via Ollama to ensure complete privacy for creative writing prompts. 
* **RESTful Database API:** A fully functional SQLAlchemy SQLite integration to inject, save, and retrieve character files, locations, and magic systems.
* **Dynamic Routing:** Seamless tab switching between the active LLM neural link and encrypted database records.

## 🛠️ Installation & Setup

### 1. Start the AI Core
Ensure Ollama is installed and running on your machine.
```bash
ollama run phi3

```

### 2. Boot the Backend (FastAPI)

Navigate to the backend directory, activate your environment, and start the Uvicorn server.

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install fastapi uvicorn sqlalchemy ollama
uvicorn main:app --reload

```

### 3. Launch the Frontend (React)

Open a new terminal, navigate to the frontend directory, install dependencies, and start Vite.

```bash
cd frontend
npm install
npm run dev

```

Navigate to http://localhost:5173 to access the terminal.

```