import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from app.core.database import Base
from app.core.config import settings


class KnowledgeVector(Base):
    __tablename__ = "knowledge_vectors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_type = Column(String(100), nullable=False)
    source_id = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(settings.EMBEDDING_DIMENSIONS), nullable=False)
    meta_info = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
