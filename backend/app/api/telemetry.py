from fastapi import APIRouter, Query
from app.services.telemetry import get_latest_telemetry, compute_and_store_telemetry
from app.governance.fatigue_tracker import get_fatigue_status

router = APIRouter(prefix="/api/v1/telemetry", tags=["Telemetry"])


@router.get("/epistemic-health")
async def epistemic_health():
    metrics = get_latest_telemetry()
    return metrics


@router.post("/epistemic-health/refresh")
async def refresh_epistemic_health():
    metrics = compute_and_store_telemetry()
    return metrics


@router.get("/fatigue/{session_id}")
async def session_fatigue(session_id: str):
    status = get_fatigue_status(session_id)
    return status
