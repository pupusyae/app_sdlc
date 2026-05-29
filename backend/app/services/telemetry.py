from app.core.database import SessionLocal
from app.models.telemetry import TelemetrySnapshot
from app.models import ADRRecord
from sqlalchemy import func


def compute_and_store_telemetry():
    db = SessionLocal()
    try:
        total_conversations = 0
        ambiguity_warnings = 0

        total_adrs = db.query(ADRRecord).count()
        approved_adrs = db.query(ADRRecord).filter(ADRRecord.status == "Approved").count()
        deprecated_adrs = db.query(ADRRecord).filter(ADRRecord.status == "Deprecated").count()

        governance_clarity = 100.0
        if total_adrs > 0:
            ambiguity_penalty = (deprecated_adrs / total_adrs) * 30
            governance_clarity = max(0, 100 - ambiguity_penalty)

        semantic_stability = 100.0
        if total_adrs > 0:
            drift_penalty = (deprecated_adrs / max(total_adrs, 1)) * 20
            semantic_stability = max(0, 100 - drift_penalty)

        authority_definition = 64.0
        if total_adrs > 0:
            approved_ratio = approved_adrs / total_adrs
            authority_definition = min(100, 50 + (approved_ratio * 50))

        risk_visibility = 77.0
        if total_adrs > 0:
            risk_visibility = min(100, 60 + (approved_adrs / max(total_adrs, 1)) * 40)

        metrics = {
            "governance_clarity": round(governance_clarity, 1),
            "semantic_stability": round(semantic_stability, 1),
            "authority_definition": round(authority_definition, 1),
            "risk_visibility": round(risk_visibility, 1),
        }

        for name, value in metrics.items():
            snapshot = TelemetrySnapshot(
                metric_name=name,
                metric_value=value,
            )
            db.add(snapshot)

        db.commit()
        return metrics
    finally:
        db.close()


def get_latest_telemetry() -> dict:
    db = SessionLocal()
    try:
        subq = (
            db.query(
                TelemetrySnapshot.metric_name,
                func.max(TelemetrySnapshot.created_at).label("max_ts"),
            )
            .group_by(TelemetrySnapshot.metric_name)
            .subquery()
        )

        results = (
            db.query(TelemetrySnapshot)
            .join(
                subq,
                (TelemetrySnapshot.metric_name == subq.c.metric_name)
                & (TelemetrySnapshot.created_at == subq.c.max_ts),
            )
            .all()
        )

        metrics = {}
        for r in results:
            metrics[r.metric_name] = r.metric_value

        if not metrics:
            return compute_and_store_telemetry()

        return metrics
    finally:
        db.close()
