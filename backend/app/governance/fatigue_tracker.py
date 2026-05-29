from app.core.config import settings
from app.core.database import SessionLocal
from app.models.telemetry import FatigueEvent, TelemetrySnapshot
from datetime import datetime, timedelta
from sqlalchemy import func


def record_warning(session_id: str, domain: str, severity: str):
    db = SessionLocal()
    try:
        window_start = datetime.utcnow() - timedelta(seconds=settings.FATIGUE_WINDOW_SECONDS)

        recent_count = (
            db.query(FatigueEvent)
            .filter(
                FatigueEvent.session_id == session_id,
                FatigueEvent.domain == domain,
                FatigueEvent.severity.in_(["Critical", "Warning"]),
                FatigueEvent.created_at >= window_start,
            )
            .count()
        )

        fatigue_level = 0
        if recent_count >= settings.FATIGUE_THRESHOLD * 2:
            fatigue_level = 3
        elif recent_count >= settings.FATIGUE_THRESHOLD * 1.5:
            fatigue_level = 2
        elif recent_count >= settings.FATIGUE_THRESHOLD:
            fatigue_level = 1

        event = FatigueEvent(
            session_id=session_id,
            domain=domain,
            severity=severity,
            fatigue_level=fatigue_level,
            warning_count=recent_count + 1,
        )
        db.add(event)
        db.commit()

        return fatigue_level
    finally:
        db.close()


def get_fatigue_status(session_id: str) -> dict:
    db = SessionLocal()
    try:
        window_start = datetime.utcnow() - timedelta(seconds=settings.FATIGUE_WINDOW_SECONDS)

        recent = (
            db.query(FatigueEvent)
            .filter(
                FatigueEvent.session_id == session_id,
                FatigueEvent.created_at >= window_start,
            )
            .order_by(FatigueEvent.created_at.desc())
            .all()
        )

        critical_count = sum(1 for e in recent if e.severity == "Critical")
        warning_count = sum(1 for e in recent if e.severity == "Warning")
        total_count = len(recent)

        if total_count >= settings.FATIGUE_THRESHOLD * 2:
            fatigue_level = 3
            suppression_active = True
        elif total_count >= settings.FATIGUE_THRESHOLD * 1.5:
            fatigue_level = 2
            suppression_active = False
        elif total_count >= settings.FATIGUE_THRESHOLD:
            fatigue_level = 1
            suppression_active = False
        else:
            fatigue_level = 0
            suppression_active = False

        return {
            "session_id": session_id,
            "fatigue_level": fatigue_level,
            "total_warnings": total_count,
            "critical_count": critical_count,
            "warning_count": warning_count,
            "suppression_active": suppression_active,
            "threshold": settings.FATIGUE_THRESHOLD,
            "window_seconds": settings.FATIGUE_WINDOW_SECONDS,
        }
    finally:
        db.close()


def should_suppress_minor_warnings(session_id: str) -> bool:
    status = get_fatigue_status(session_id)
    return status["fatigue_level"] >= 3
