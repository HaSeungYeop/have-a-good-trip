import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def get_travel_plan(user_message: str):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "당신은 여행 일정 플래너 AI입니다."},
            {"role": "user", "content": user_message}
        ]
    )
    return response.choices[0].message.content
