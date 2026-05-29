from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import ADRRecord, CognitiveCheckpoint
from app.memory.ingestion_service import ingest_approved_adr
from app.memory.context_retrieval import retrieve_historical_context
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/v1/governance", tags=["Governance"])


class ADRCreate(BaseModel):
    project_id: str
    title: str
    context: str = ""
    decision: str = ""
    consequences: str = ""


class ADRApprove(BaseModel):
    approved_by: str


class ADRDeprecate(BaseModel):
    successor_title: str = ""
    successor_context: str = ""
    successor_decision: str = ""
    successor_consequences: str = ""
    deprecation_reason: str = ""


class CheckpointCreate(BaseModel):
    project_id: str
    label: str
    snapshot: dict


@router.get("/adr")
async def list_adrs(project_id: str | None = None, db: Session = Depends(get_db)):
    query = db.query(ADRRecord)
    if project_id:
        query = query.filter(ADRRecord.project_id == project_id)
    adrs = query.order_by(ADRRecord.created_at.desc()).all()

    return [
        {
            "id": str(a.id),
            "project_id": str(a.project_id),
            "title": a.title,
            "context": a.context,
            "decision": a.decision,
            "consequences": a.consequences,
            "status": a.status,
            "approved_by": a.approved_by,
            "predecessor_id": str(a.predecessor_id) if a.predecessor_id else None,
            "deprecated_at": a.deprecated_at.isoformat() if a.deprecated_at else None,
            "deprecation_reason": a.deprecation_reason,
            "created_at": a.created_at.isoformat(),
            "updated_at": a.updated_at.isoformat(),
        }
        for a in adrs
    ]


@router.post("/adr")
async def create_adr(payload: ADRCreate, db: Session = Depends(get_db)):
    adr = ADRRecord(
        id=uuid.uuid4(),
        project_id=uuid.UUID(payload.project_id),
        title=payload.title,
        context=payload.context,
        decision=payload.decision,
        consequences=payload.consequences,
        status="Draft",
    )
    db.add(adr)
    db.commit()
    db.refresh(adr)

    return {
        "id": str(adr.id),
        "title": adr.title,
        "status": adr.status,
        "created_at": adr.created_at.isoformat(),
    }


@router.post("/adr/{adr_id}/approve")
async def approve_adr(adr_id: str, payload: ADRApprove, db: Session = Depends(get_db)):
    adr = db.query(ADRRecord).filter(ADRRecord.id == adr_id).first()
    if not adr:
        raise HTTPException(status_code=404, detail="ADR not found")

    adr.status = "Approved"
    adr.approved_by = payload.approved_by
    adr.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(adr)

    await ingest_approved_adr(
        adr_id=str(adr.id),
        title=adr.title,
        context=adr.context or "",
        decision=adr.decision or "",
        consequences=adr.consequences or "",
        approved_by=payload.approved_by,
    )

    return {
        "id": str(adr.id),
        "title": adr.title,
        "status": adr.status,
        "approved_by": adr.approved_by,
        "ingested_to_memory": True,
    }


@router.put("/adr/{adr_id}/deprecate")
async def deprecate_adr(adr_id: str, payload: ADRDeprecate, db: Session = Depends(get_db)):
    adr = db.query(ADRRecord).filter(ADRRecord.id == adr_id).first()
    if not adr:
        raise HTTPException(status_code=404, detail="ADR not found")

    if adr.status == "Deprecated":
        raise HTTPException(status_code=400, detail="ADR is already deprecated")

    old_id = adr.id
    old_title = adr.title

    adr.status = "Deprecated"
    adr.deprecated_at = datetime.utcnow()
    adr.deprecation_reason = payload.deprecation_reason
    adr.updated_at = datetime.utcnow()

    if payload.successor_title:
        successor = ADRRecord(
            id=uuid.uuid4(),
            project_id=adr.project_id,
            title=payload.successor_title,
            context=payload.successor_context,
            decision=payload.successor_decision,
            consequences=payload.successor_consequences,
            status="Draft",
            predecessor_id=old_id,
        )
        db.add(successor)

    db.commit()

    return {
        "deprecated": {
            "id": str(old_id),
            "title": old_title,
            "status": "Deprecated",
            "deprecated_at": adr.deprecated_at.isoformat(),
            "deprecation_reason": adr.deprecation_reason,
        },
        "successor": {
            "id": str(successor.id) if payload.successor_title else None,
            "title": payload.successor_title,
            "status": "Draft",
        } if payload.successor_title else None,
        "message": "No-overwrite rule applied: old record deprecated, new record created.",
    }


@router.get("/adr/{adr_id}/lineage")
async def get_adr_lineage(adr_id: str, db: Session = Depends(get_db)):
    adr = db.query(ADRRecord).filter(ADRRecord.id == adr_id).first()
    if not adr:
        raise HTTPException(status_code=404, detail="ADR not found")

    nodes = []
    edges = []

    def traverse_upstream(current: ADRRecord, depth: int = 0):
        nodes.append({
            "id": str(current.id),
            "title": current.title,
            "status": current.status,
            "depth": depth,
        })
        if current.predecessor_id:
            pred = db.query(ADRRecord).filter(ADRRecord.id == current.predecessor_id).first()
            if pred:
                edges.append({
                    "id": f"{pred.id}->{current.id}",
                    "source": str(pred.id),
                    "target": str(current.id),
                    "label": "replaces",
                })
                traverse_upstream(pred, depth - 1)

    def traverse_downstream(current: ADRRecord, depth: int = 0):
        successors = db.query(ADRRecord).filter(ADRRecord.predecessor_id == current.id).all()
        for succ in successors:
            nodes.append({
                "id": str(succ.id),
                "title": succ.title,
                "status": succ.status,
                "depth": depth + 1,
            })
            edges.append({
                "id": f"{current.id}->{succ.id}",
                "source": str(current.id),
                "target": str(succ.id),
                "label": "replaces",
            })
            traverse_downstream(succ, depth + 1)

    nodes.append({"id": str(adr.id), "title": adr.title, "status": adr.status, "depth": 0})
    traverse_upstream(adr, -1)
    traverse_downstream(adr, 0)

    return {"nodes": nodes, "edges": edges}


@router.get("/timeline")
async def get_governance_timeline(project_id: str | None = None, db: Session = Depends(get_db)):
    query = db.query(ADRRecord)
    if project_id:
        query = query.filter(ADRRecord.project_id == project_id)
    adrs = query.order_by(ADRRecord.created_at.asc()).all()

    timeline = []
    for a in adrs:
        timeline.append({
            "id": str(a.id),
            "date": a.created_at.isoformat(),
            "title": a.title,
            "status": a.status,
            "type": "ADR",
            "approved_by": a.approved_by,
            "predecessor_id": str(a.predecessor_id) if a.predecessor_id else None,
            "deprecated_at": a.deprecated_at.isoformat() if a.deprecated_at else None,
        })

    return timeline


@router.get("/lineage-graph")
async def get_lineage_graph(project_id: str | None = None, db: Session = Depends(get_db)):
    query = db.query(ADRRecord)
    if project_id:
        query = query.filter(ADRRecord.project_id == project_id)
    adrs = query.all()

    nodes = []
    edges = []

    for adr in adrs:
        nodes.append({
            "id": str(adr.id),
            "data": {
                "label": adr.title,
                "status": adr.status,
                "approved_by": adr.approved_by,
            },
            "position": {"x": 0, "y": 0},
        })
        if adr.predecessor_id:
            edges.append({
                "id": f"{adr.predecessor_id}->{adr.id}",
                "source": str(adr.predecessor_id),
                "target": str(adr.id),
                "label": "replaces",
            })

    return {"nodes": nodes, "edges": edges}


@router.get("/checkpoint")
async def list_checkpoints(project_id: str | None = None, db: Session = Depends(get_db)):
    query = db.query(CognitiveCheckpoint)
    if project_id:
        query = query.filter(CognitiveCheckpoint.project_id == project_id)
    checkpoints = query.order_by(CognitiveCheckpoint.created_at.desc()).all()

    return [
        {
            "id": str(c.id),
            "project_id": str(c.project_id),
            "label": c.label,
            "created_at": c.created_at.isoformat(),
        }
        for c in checkpoints
    ]


@router.post("/checkpoint")
async def create_checkpoint(payload: CheckpointCreate, db: Session = Depends(get_db)):
    checkpoint = CognitiveCheckpoint(
        id=uuid.uuid4(),
        project_id=uuid.UUID(payload.project_id),
        label=payload.label,
        snapshot=payload.snapshot,
    )
    db.add(checkpoint)
    db.commit()
    db.refresh(checkpoint)

    return {
        "id": str(checkpoint.id),
        "label": checkpoint.label,
        "created_at": checkpoint.created_at.isoformat(),
    }


@router.get("/checkpoint/{checkpoint_id}")
async def get_checkpoint(checkpoint_id: str, db: Session = Depends(get_db)):
    checkpoint = db.query(CognitiveCheckpoint).filter(CognitiveCheckpoint.id == checkpoint_id).first()
    if not checkpoint:
        raise HTTPException(status_code=404, detail="Checkpoint not found")

    return {
        "id": str(checkpoint.id),
        "project_id": str(checkpoint.project_id),
        "label": checkpoint.label,
        "snapshot": checkpoint.snapshot,
        "created_at": checkpoint.created_at.isoformat(),
    }


@router.get("/context/search")
async def search_historical_context(q: str, top_k: int = 5):
    results = await retrieve_historical_context(q, top_k=top_k)
    return {"query": q, "results": results}
