from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chatbot

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

app.include_router(chatbot.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 또는 ["http://127.0.0.1:5500"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# uvicorn app.main:app --reload
