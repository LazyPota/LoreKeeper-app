# 🔮 Lorekeeper Terminal

A private, locally-hosted AI writing assistant and database designed specifically for novelists and world-builders. It's essentially a miniature LLM project using a local Phi-3 LLM (via Ollama). It allows users to brainstorm complex character arcs and magic systems with an AI that acts as a dedicated "Lorekeeper," and then instantly inject those generated ideas into a database to keep story bibles organized.

## 🚀 The Architecture

This project is a decoupled monorepo fused into a standalone executable:
* **Frontend:** React (Vite) + Tailwind CSS + Framer Motion (Compiled to static files)
* **Backend:** Python + FastAPI + SQLAlchemy
* **Database:** SQLite
* **AI Engine:** Ollama running Microsoft's Phi-3 (Mini) locally
* **Packaging:** PyInstaller

## 🎮 How to Run (For Hack Club Reviewers/Voters)

Because this application guarantees total data privacy by running a machine learning model directly on your local hardware, it requires the Ollama engine to function.

1. **Install Ollama:** Ensure [Ollama](https://ollama.com/) is installed on your machine.
2. **Pull the AI Model:** Open your terminal and run:
   `ollama run phi3`
3. **Download the App:** Go to the **Releases** tab on this GitHub repository and download the latest `Lorekeeper.zip`.
4. **Launch:** Extract the folder and double-click `Lorekeeper.exe`. The server will automatically boot and open the terminal interface in your default web browser.

## 🛠️ How to Run from Source (For Developers)

If you wish to clone this repository and run the development servers manually:

### 1. Start the AI Core
Ensure Ollama is running in the background.
```bash
ollama run phi3
```

### 2. Build the Frontend

Navigate to the frontend directory, install dependencies, and build the static files.

```bash
cd frontend

npm install

npm run build

cp -r dist ../backend/static
```

### 3. Boot the Backend Server

Navigate to the backend directory, activate your environment, and start the auto-runner.
```bash
cd backend

python -m venv venvsource venv/Scripts/activate

pip install fastapi uvicorn sqlalchemy ollama

python run.py
```
✨ Features

Arcane Terminal UI: A custom-built, highly interactive React interface featuring typing animations, loading states, and full Markdown rendering.

Local AI Processing: Uses a local Phi-3 model via Ollama to ensure complete privacy for creative writing prompts.

RESTful Database API: A fully functional SQLAlchemy SQLite integration to inject, save, and retrieve character files, locations, and magic systems.

