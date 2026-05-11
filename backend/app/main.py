from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

app = FastAPI(title="ToDo RPG API")

# CORS (Allow all for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "ToDo RPG Backend is running"}

from .routers import goals, tasks
from dotenv import load_dotenv

load_dotenv()

app.include_router(goals.router)
app.include_router(tasks.router)

# TODO: Add routes for tasks, etc.

# Serve static files (Web Frontend)
# Resolving path relative to this file
# backend/app/main.py -> ../../web (relative to main.py's location)
web_path = Path(__file__).parent.parent.parent / "web"

if web_path.exists():
    app.mount("/", StaticFiles(directory=str(web_path), html=True), name="static")
