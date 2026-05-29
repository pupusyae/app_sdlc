from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.extract import router as extract_router
from app.api.governance import router as governance_router
from app.api.telemetry import router as telemetry_router
from app.api.execution import router as execution_router
from app.api.auth import router as auth_router
from app.api.sessions import router as sessions_router
from app.constitution.context_assembler import build_cognitive_context, assemble_system_prompt

app = FastAPI(
    title="Cognitive SDLC Workspace API",
    description="Backend API for the Governance-Centered AI Engineering Environment",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(sessions_router)
app.include_router(extract_router)
app.include_router(governance_router)
app.include_router(telemetry_router)
app.include_router(execution_router)


@app.get("/api/health")
async def health_check():
    try:
        cognitive_context = build_cognitive_context()
        context_ready = cognitive_context.token_count > 0
    except Exception:
        context_ready = False

    return {
        "status": "healthy" if context_ready else "degraded",
        "message": "Cognitive Governance Infrastructure is online",
        "epistemic_health": "stable",
        "constitutional_context_loaded": context_ready,
        "context_token_count": cognitive_context.token_count if context_ready else 0,
    }


@app.get("/api/health/epistemic")
async def epistemic_health(session_id: str | None = None):
    from app.services.telemetry import get_latest_telemetry
    return get_latest_telemetry()


@app.get("/api/constitution/context")
async def get_constitutional_context():
    context = build_cognitive_context()
    return {
        "token_count": context.token_count,
        "forbidden_action_count": len(context.forbidden_actions),
        "philosophy_loaded": bool(context.system_philosophy),
        "governance_rules_loaded": bool(context.governance_rules),
        "terminology_loaded": bool(context.terminology),
    }
