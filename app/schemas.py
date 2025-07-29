from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    class Config:
        extra = "forbid"
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        extra = "forbid"
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

    class Config:
        extra = "forbid"
