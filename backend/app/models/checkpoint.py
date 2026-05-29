import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base


class CognitiveCheckpoint(Base):
    __tablename__ = "cognitive_checkpoints"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    label = Column(String(255), nullable=False)
    snapshot = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    project = relationship("Project", backref="checkpoints")
