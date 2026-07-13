from fastapi import FastAPI, Request, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import time
import secrets

# Load environment variables
load_dotenv()

app = FastAPI(title="StadiumIQ 2026", description="GenAI copilot for FIFA World Cup 2026")

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ops Rate Limiting State
failed_attempts = {} # ip -> {"count": int, "lockout_until": float}
active_ops_sessions = {} # token -> expiry_timestamp

# API routes
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

from pydantic import BaseModel

class VerifyRequest(BaseModel):
    passcode: str

@app.post("/api/ops/verify")
async def verify_ops(request: Request, body: VerifyRequest):
    client_ip = request.client.host
    now = time.time()
    
    # Check rate limit
    if client_ip in failed_attempts:
        state = failed_attempts[client_ip]
        if state["lockout_until"] and now < state["lockout_until"]:
            raise HTTPException(status_code=429, detail="Too many attempts. Try again later.")
        elif state["lockout_until"] and now >= state["lockout_until"]:
            failed_attempts[client_ip] = {"count": 0, "lockout_until": None}
            
    expected_passcode = os.environ.get("OPS_PASSCODE", "ops2026")
    
    if body.passcode != expected_passcode:
        state = failed_attempts.get(client_ip, {"count": 0, "lockout_until": None})
        state["count"] += 1
        if state["count"] >= 5:
            state["lockout_until"] = now + 300 # 5 minutes lockout
        failed_attempts[client_ip] = state
        
        raise HTTPException(status_code=401, detail="Invalid passcode")
        
    failed_attempts.pop(client_ip, None)
    
    token = secrets.token_hex(32)
    active_ops_sessions[token] = now + 3600 # 60 minutes expiry
    
    return {"token": token}

from tools import get_match_info
from pydantic import BaseModel

@app.get("/api/match/{venue_id}")
async def match_info(venue_id: str):
    return get_match_info(venue_id)

from orchestrator import process_chat, resolve_match_context
from typing import Optional, Dict, Any

@app.get("/api/match_context/{venue_id}")
async def match_context(venue_id: str):
    return resolve_match_context(venue_id)

class ChatRequest(BaseModel):
    message: str
    mode: str
    venue_id: str
    language: str = 'en'
    accessible: bool = False
    match_context: Optional[Dict[str, Any]] = None

class TranslateRequest(BaseModel):
    text: str
    target_language: str

@app.post("/api/translate")
async def translate(request: TranslateRequest):
    from orchestrator import translate_text
    return translate_text(request.text, request.target_language)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    return process_chat(
        message=request.message,
        mode=request.mode,
        venue_id=request.venue_id,
        language=request.language,
        accessible=request.accessible,
        match_context=request.match_context
    )

# Mount the static files for the frontend
app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
