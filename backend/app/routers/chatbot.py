import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai

load_dotenv()

router = APIRouter(prefix="/ai", tags=["AI Chat"])

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat_with_ai(data: ChatRequest):
    try:
        response = client.models.generate_content(
            model="gemini-3-flash",
            contents=f"""
You are CropGuard AI assistant.

Your role:
- Help farmers in simple language.
- Answer about crop disease detection, treatments, confidence, severity, shops, and app usage.
- Keep answers clear, practical, and short.
- If user asks app navigation questions, guide them clearly.
- If exact shop/treatment data is not available, say so honestly.

User message:
{data.message}
"""
        )

        return {
            "reply": response.text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))