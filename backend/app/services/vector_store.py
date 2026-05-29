from app.core.config import settings
from app.core.database import SessionLocal
from app.models import KnowledgeVector


def store_knowledge_vector(source_type: str, source_id: str, content: str, embedding: list[float], meta_info: str | None = None):
    db = SessionLocal()
    try:
        kv = KnowledgeVector(
            source_type=source_type,
            source_id=source_id,
            content=content,
            embedding=embedding,
            meta_info=meta_info,
        )
        db.add(kv)
        db.commit()
        return kv
    finally:
        db.close()


def semantic_search(query_embedding: list[float], top_k: int = 5) -> list[KnowledgeVector]:
    db = SessionLocal()
    try:
        results = (
            db.query(KnowledgeVector)
            .order_by(KnowledgeVector.embedding.cosine_distance(query_embedding))
            .limit(top_k)
            .all()
        )
        return results
    finally:
        db.close()
