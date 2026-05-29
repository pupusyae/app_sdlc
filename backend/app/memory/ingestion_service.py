import json
import httpx
from app.core.config import settings
from app.services.vector_store import store_knowledge_vector


async def embed_and_store(source_type: str, source_id: str, content: str, meta_info: dict | None = None) -> list[float] | None:
    embedding = None

    if settings.LLM_API_KEY:
        try:
            embedding = await _call_embedding_api(content)
        except Exception:
            embedding = _mock_embedding(content)
    else:
        embedding = _mock_embedding(content)

    if embedding:
        store_knowledge_vector(
            source_type=source_type,
            source_id=source_id,
            content=content,
            embedding=embedding,
            meta_info=json.dumps(meta_info) if meta_info else None,
        )

    return embedding


async def _call_embedding_api(text: str) -> list[float]:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/embeddings",
            headers={
                "Authorization": f"Bearer {settings.LLM_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "text-embedding-ada-002",
                "input": text[:8000],
            },
            timeout=30.0,
        )
        data = response.json()
        return data["data"][0]["embedding"]


def _mock_embedding(text: str) -> list[float]:
    import hashlib
    seed = int(hashlib.md5(text.encode()).hexdigest()[:8], 16)
    import random
    rng = random.Random(seed)
    return [rng.uniform(-1, 1) for _ in range(settings.EMBEDDING_DIMENSIONS)]


async def ingest_approved_adr(adr_id: str, title: str, context: str, decision: str, consequences: str, approved_by: str) -> list[float] | None:
    content = f"ADR: {title}\nContext: {context}\nDecision: {decision}\nConsequences: {consequences}"
    return await embed_and_store(
        source_type="adr_record",
        source_id=adr_id,
        content=content,
        meta_info={"title": title, "approved_by": approved_by, "status": "Approved"},
    )


async def ingest_terminology(term_id: str, term: str, definition: str) -> list[float] | None:
    content = f"Term: {term}\nDefinition: {definition}"
    return await embed_and_store(
        source_type="terminology",
        source_id=term_id,
        content=content,
        meta_info={"term": term},
    )


async def embed_query(query_text: str) -> list[float]:
    if settings.LLM_API_KEY:
        try:
            return await _call_embedding_api(query_text)
        except Exception:
            return _mock_embedding(query_text)
    return _mock_embedding(query_text)
