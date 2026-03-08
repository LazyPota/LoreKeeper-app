from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import ollama
import sys
import os
from fastapi.staticfiles import StaticFiles

import database 

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Lorekeeper API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ChatRequest(BaseModel):
    user_message: str

class LoreCreate(BaseModel):
    category: str
    name: str
    description: str

SYSTEM_INSTRUCTIONS = """
You are the 'Lorekeeper', an expert creative writing assistant and mystical database. 
Your job is to help the author brainstorm characters, magic systems, and plot points for their novel.
Always answer in a supportive, creative, and slightly mysterious tone. 
Keep your answers concise and beautifully formatted in markdown. Do not break character.
"""

@app.post("/api/chat")
def chat_with_lorekeeper(request: ChatRequest):
    try:
        response = ollama.chat(model='phi3', messages=[
            {'role': 'system', 'content': SYSTEM_INSTRUCTIONS},
            {'role': 'user', 'content': request.user_message}
        ])
        return {"role": "LOREKEEPER", "content": response['message']['content']}
    except Exception as e:
        return {"role": "SYS", "content": f"**[CRITICAL ERROR]:** Failed to connect to LLM Core. Details: {str(e)}"}


@app.post("/api/lore")
def create_lore_entry(entry: LoreCreate, db: Session = Depends(get_db)):
    db_entry = database.LoreEntry(
        category=entry.category, 
        name=entry.name, 
        description=entry.description
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.get("/api/lore/{category}")
def get_lore_by_category(category: str, db: Session = Depends(get_db)):
    entries = db.query(database.LoreEntry).filter(database.LoreEntry.category == category).all()
    return entries

if getattr(sys, 'frozen', False):
    BASE_DIR = sys._MEIPASS
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

STATIC_DIR = os.path.join(BASE_DIR, "static")

app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")