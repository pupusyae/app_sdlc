from app.services.vector_store import semantic_search
from app.memory.ingestion_service import embed_query


async def retrieve_historical_context(query_text: str, top_k: int = 5) -> list[dict]:
    query_embedding = await embed_query(query_text)

    results = semantic_search(query_embedding, top_k=top_k)

    context_items = []
    for r in results:
        context_items.append({
            "source_type": r.source_type,
            "source_id": r.source_id,
            "content": r.content[:500],
            "meta_info": r.meta_info,
        })

    return context_items


def format_historical_context(context_items: list[dict]) -> str:
    if not context_items:
        return ""

    lines = ["## HISTORICAL CONTEXT (Retrieved from Institutional Memory)"]
    for idx, item in enumerate(context_items, 1):
        source_label = "ADR Record" if item["source_type"] == "adr_record" else "Terminology"
        lines.append(f"\n### {idx}. {source_label} ({item['source_id'][:8]}...)")
        lines.append(item["content"])

    return "\n".join(lines)
