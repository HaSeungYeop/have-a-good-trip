import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ✅ 세션별 대화 기록 저장
conversation_history = {}

async def get_travel_plan(user_message: str, session_id: str = "default"):
    # 해당 세션의 대화 기록 불러오기 (없으면 새로 생성)
    if session_id not in conversation_history:
        conversation_history[session_id] = [
            {"role": "system", "content": "당신은 여행 일정 플래너 AI입니다. 사용자의 질문에 맞춰 친절하고 맥락 있는 답변을 제공합니다."}
        ]

    # 새로운 사용자 메시지 추가
    conversation_history[session_id].append({"role": "user", "content": user_message})

    # GPT 호출 (이전 대화까지 포함)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=conversation_history[session_id]
    )

    bot_reply = response.choices[0].message.content

    # 챗봇 응답도 기록에 추가
    conversation_history[session_id].append({"role": "assistant", "content": bot_reply})

    return bot_reply

# 단계 요약
# 사용자가 메시지를 보냄

# 프론트(chatbot.js)가 **동일한 session_id**를 백엔드로 보냄

# 백엔드(gpt_service.py)가 해당 session_id의 이전 대화 기록을 가져옴

# messages 배열에 system (역할 안내), user의 기존 질문, assistant의 기존 답변, 이번 user 메시지, 모두 포함해서 GPT에 전달

# GPT가 이전 맥락을 참고해서 답변

# 답변도 기록에 추가 → 다음 질문 시 다시 참고