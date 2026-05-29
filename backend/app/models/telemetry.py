import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Float, Text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class FatigueEvent(Base):
    __tablename__ = "fatigue_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(255), nullable=False, index=True)
    domain = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)
    fatigue_level = Column(Integer, default=0)
    warning_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class TelemetrySnapshot(Base):
    __tablename__ = "telemetry_snapshots"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float, nullable=False)
    meta_info = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
