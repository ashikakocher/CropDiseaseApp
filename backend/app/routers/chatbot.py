import os
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from google import genai

load_dotenv(dotenv_path=".env")

api_key = os.getenv("GEMINI_API_KEY")
print("GEMINI_API_KEY loaded:", "YES" if api_key else "NO")

router = APIRouter(prefix="/ai", tags=["AI Chat"])
client = genai.Client(api_key=api_key)


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat_with_ai(data: ChatRequest):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"""
You are CropGuard AI assistant.
Help farmers in simple language.
Be practical and short.

User message:
{data.message}
"""
        )

        reply = response.text if getattr(response, "text", None) else "Sorry, I could not generate a response."
        return {"reply": reply}

    except Exception as e:
        error_text = str(e)
        print("AI CHAT ERROR:", repr(e))

        if "429" in error_text or "RESOURCE_EXHAUSTED" in error_text:
            return {
                "reply": "AI service is temporarily busy or quota is exhausted. Please try again after a minute."
            }

        return {
            "reply": "Sorry, AI is unavailable right now. Please try again later."
        }