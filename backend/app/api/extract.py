from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio
from app.security.cognitive_firewall import scan_input
from app.governance.semantic_validator import light_extract
from app.constitution.context_assembler import build_cognitive_context, assemble_system_prompt
from app.reasoning.engine_core import call_llm
from app.memory.context_retrieval import retrieve_historical_context, format_historical_context
from app.governance.predictive_drift import run_predictive_scan, check_predictive_drift
from app.governance.fatigue_tracker import record_warning, should_suppress_minor_warnings, get_fatigue_status
from app.core.redis import get_redis
import json

router = APIRouter(prefix="/api/v1/extract", tags=["Extraction"])


class ChatInput(BaseModel):
    block: str
    content: str
    stage: str = "deep"
    session_id: str = "default"


class DeepExtractionRequest(BaseModel):
    block: str
    content: str
    user_input: str
    semantic_block: str = "Business Objective"
    session_id: str = "default"


@router.post("/")
async def extract_cognition(input: ChatInput):
    session_id = input.session_id
    security_result = scan_input(input.content)
    if security_result.blocked:
        raise HTTPException(status_code=403, detail=security_result.dict())

    if input.stage == "light":
        result = light_extract(input.content)
        return {
            "status": "success",
            "stage": "light",
            "extraction": result.dict(),
            "security_scan": security_result.dict(),
        }

    historical_items = await retrieve_historical_context(input.content, top_k=3)
    historical_text = format_historical_context(historical_items)

    cognitive_context = build_cognitive_context()
    system_prompt = assemble_system_prompt(cognitive_context)

    if historical_text:
        system_prompt += f"\n\n{historical_text}\n\nYou may cite these historical ADRs when relevant."

    governance_result = await call_llm(input.content, system_prompt)

    await asyncio.sleep(0.1)

    fatigue_status = get_fatigue_status(session_id)
    suppress_minor = fatigue_status["fatigue_level"] >= 3

    if governance_result.severity in ("Critical", "Warning"):
        record_warning(session_id, input.block, governance_result.severity)

    critical = []
    warnings = []
    suggestions = []

    if governance_result.severity == "Critical":
        critical.append({
            "id": 1,
            "type": governance_result.category,
            "text": governance_result.message,
        })
    elif governance_result.severity == "Warning":
        if not suppress_minor:
            warnings.append({
                "id": 1,
                "type": governance_result.category,
                "text": governance_result.message,
            })
        else:
            suggestions.append({
                "id": 1,
                "type": "Suppressed Warning",
                "text": f"[Fatigue Mode] Minor warning suppressed: {governance_result.message[:100]}...",
            })
    else:
        suggestions.append({
            "id": 1,
            "type": governance_result.category,
            "text": governance_result.message,
        })

    light_result = light_extract(input.content)

    predictive_warnings = await check_predictive_drift(input.content, input.block)

    run_predictive_scan(session_id, input.content, input.block)

    for pw in predictive_warnings:
        if pw.get("level") == "Warning":
            warnings.append({
                "id": pw["id"],
                "type": pw["type"],
                "text": pw["text"],
            })
        elif pw.get("level") == "Critical":
            critical.append({
                "id": pw["id"],
                "type": pw["type"],
                "text": pw["text"],
            })

    light_warnings = light_result.warnings
    if suppress_minor and light_warnings:
        light_warnings = []

    return {
        "status": "success",
        "stage": "deep",
        "extraction": {
            "critical": critical,
            "warnings": warnings,
            "suggestions": suggestions,
            "glossary_candidates": light_result.glossary_candidates,
            "severity_level": governance_result.severity,
        },
        "governance_analysis": governance_result.dict(),
        "security_scan": security_result.dict(),
        "requires_human_approval": governance_result.requires_human_approval,
        "historical_context": {
            "items_retrieved": len(historical_items),
            "results": historical_items,
        },
        "fatigue": {
            "level": fatigue_status["fatigue_level"],
            "total_warnings": fatigue_status["total_warnings"],
            "suppression_active": suppress_minor,
        },
        "predictive_scan_queued": True,
    }
