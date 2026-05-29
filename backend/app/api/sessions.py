from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models import User, Session as UserSession
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/v1/sessions", tags=["Sessions"])


class SessionCreate(BaseModel):
    title: str


class SessionUpdate(BaseModel):
    title: str


@router.post("/")
async def create_session(
    payload: SessionCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = UserSession(
        id=uuid.uuid4(),
        user_id=user.id,
        title=payload.title,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "id": str(session.id),
        "title": session.title,
        "created_at": session.created_at.isoformat(),
    }


@router.get("/")
async def list_sessions(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sessions = (
        db.query(UserSession)
        .filter(UserSession.user_id == user.id)
        .order_by(UserSession.updated_at.desc())
        .all()
    )

    return [
        {
            "id": str(s.id),
            "title": s.title,
            "created_at": s.created_at.isoformat(),
            "updated_at": s.updated_at.isoformat(),
        }
        for s in sessions
    ]


@router.get("/{session_id}")
async def get_session(
    session_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = (
        db.query(UserSession)
        .filter(UserSession.id == session_id, UserSession.user_id == user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return {
        "id": str(session.id),
        "title": session.title,
        "created_at": session.created_at.isoformat(),
        "updated_at": session.updated_at.isoformat(),
    }


@router.put("/{session_id}")
async def update_session(
    session_id: str,
    payload: SessionUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = (
        db.query(UserSession)
        .filter(UserSession.id == session_id, UserSession.user_id == user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.title = payload.title
    session.updated_at = datetime.utcnow()
    db.commit()

    return {"id": str(session.id), "title": session.title}


@router.delete("/{session_id}")
async def delete_session(
    session_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = (
        db.query(UserSession)
        .filter(UserSession.id == session_id, UserSession.user_id == user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    db.delete(session)
    db.commit()

    return {"status": "deleted"}
