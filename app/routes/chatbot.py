from fastapi import APIRouter, Request
from app.services.gpt_service import get_travel_plan

router = APIRouter()

@router.post("/chat")
async def chat_with_gpt(request: Request):
    data = await request.json()
    message = data.get("message")
    reply = await get_travel_plan(message)
    return {"response": reply}
