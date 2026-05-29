import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class ADRRecord(Base):
    __tablename__ = "adr_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    title = Column(String(500), nullable=False)
    context = Column(Text, nullable=True)
    decision = Column(Text, nullable=True)
    consequences = Column(Text, nullable=True)
    status = Column(String(50), default="Draft", nullable=False)
    approved_by = Column(String(255), nullable=True)
    predecessor_id = Column(UUID(as_uuid=True), ForeignKey("adr_records.id"), nullable=True)
    deprecated_at = Column(DateTime, nullable=True)
    deprecation_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    project = relationship("Project", backref="adr_records")
    predecessor = relationship("ADRRecord", remote_side=[id], backref="successors")
