from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_jwt, encrypt_api_key, decrypt_api_key
from app.core.auth import get_current_user
from app.models import User, Session as UserSession
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ApiKeyUpdate(BaseModel):
    api_key: str
    provider: str = "openai"


@router.post("/register")
async def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        id=uuid.uuid4(),
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_jwt(str(user.id))
    return {"token": token, "user": {"id": str(user.id), "email": user.email}}


@router.post("/login")
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_jwt(str(user.id))
    return {
        "token": token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "has_api_key": bool(user.encrypted_api_key),
        },
    }


@router.get("/me")
async def get_me(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "email": user.email,
        "has_api_key": bool(user.encrypted_api_key),
        "created_at": user.created_at.isoformat(),
    }


@router.put("/me/api-key")
async def update_api_key(payload: ApiKeyUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    encrypted = encrypt_api_key(payload.api_key)
    user.encrypted_api_key = encrypted
    db.commit()
    return {"status": "ok", "message": "API key updated and encrypted"}


@router.get("/me/api-key/decrypted")
async def get_decrypted_api_key(user: User = Depends(get_current_user)):
    if not user.encrypted_api_key:
        return {"api_key": ""}
    return {"api_key": decrypt_api_key(user.encrypted_api_key)}
