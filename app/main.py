import logging
import traceback
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from app.routes import chatbot, auth
from app.db import engine, Base

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI()
# 예외처리 미들웨어 (오류 터미널에 자세히 찍기)
@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        logging.error(f"Unhandled error: {e}", exc_info=True)
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

# 정적 파일, 템플릿 설정
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(chatbot.router)
app.include_router(auth.router)

# uvicorn app.main:app --reload
