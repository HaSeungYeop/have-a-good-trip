from fastapi import APIRouter, Request
from app.services.gpt_service import get_travel_plan

router = APIRouter()

@router.post("/chat")
async def chat_with_gpt(request: Request):
    data = await request.json()
    message = data.get("message")
    session_id = data.get("session_id", "default")  # 세션 ID가 없으면 default

    reply = await get_travel_plan(message, session_id)
    return {"response": reply}
