from fastapi import APIRouter, Form
from app.services.gpt_service import get_travel_plan

router = APIRouter()

@router.post("/chat")
async def chat_with_gpt(message: str = Form(...)):
    reply = await get_travel_plan(message)
    return {"response": reply}
