import re
from app.core.config import settings
from app.core.database import SessionLocal
from app.models import ADRRecord
from app.memory.ingestion_service import _mock_embedding
from datetime import datetime
import json


async def check_predictive_drift(user_input: str, active_domain: str) -> list[dict]:
    db = SessionLocal()
    try:
        deprecated_adrs = (
            db.query(ADRRecord)
            .filter(ADRRecord.status == "Deprecated")
            .all()
        )

        if not deprecated_adrs:
            return []

        input_lower = user_input.lower()
        warnings = []

        for adr in deprecated_adrs:
            title_lower = (adr.title or "").lower()
            context_lower = (adr.context or "").lower()
            decision_lower = (adr.decision or "").lower()

            keywords = _extract_keywords(title_lower + " " + context_lower + " " + decision_lower)

            match_count = sum(1 for kw in keywords if kw in input_lower)
            keyword_score = match_count / max(len(keywords), 1)

            semantic_score = 0.0
            query_emb = _mock_embedding(user_input)
            adr_emb = _mock_embedding(f"{adr.title} {adr.context} {adr.decision}")
            semantic_score = _cosine_similarity(query_emb, adr_emb)

            combined_score = max(semantic_score, keyword_score * 1.2)

            if combined_score >= settings.PREDICTIVE_DRIFT_SIMILARITY_THRESHOLD:
                warnings.append({
                    "id": f"predictive-{adr.id}",
                    "type": "Predictive Drift",
                    "text": (
                        f"PREDICTIVE WARNING: Your discussion is heading toward a solution "
                        f"that was deprecated: '{adr.title}' (similarity: {combined_score:.0%}). "
                        f"Reason: {adr.deprecation_reason or 'No reason provided'}"
                    ),
                    "level": "Warning",
                    "deprecated_adr_id": str(adr.id),
                    "deprecated_adr_title": adr.title,
                    "deprecation_reason": adr.deprecation_reason,
                    "similarity_score": round(combined_score, 3),
                })

        return warnings
    finally:
        db.close()


def _extract_keywords(text: str) -> list[str]:
    stopwords = {"for", "the", "and", "our", "use", "with", "was", "has", "its", "can", "not", "are", "that", "this", "from", "have", "been"}
    words = re.findall(r"\b[a-z]{3,}\b", text)
    return [w for w in words if w not in stopwords and len(w) > 2]


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = sum(x * x for x in a) ** 0.5
    norm_b = sum(x * x for x in b) ** 0.5
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def run_predictive_scan(session_id: str, user_input: str, active_domain: str):
    try:
        from app.core.redis import get_redis_sync
        r = get_redis_sync()
        task = {
            "type": "predictive_scan",
            "session_id": session_id,
            "user_input": user_input,
            "active_domain": active_domain,
            "timestamp": datetime.utcnow().isoformat(),
        }
        r.lpush("cognitive:tasks:predictive_scan", json.dumps(task))
    except Exception:
        pass
