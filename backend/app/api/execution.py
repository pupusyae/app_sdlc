from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import PlainTextResponse, JSONResponse
from app.services.blueprint_generator import generate_blueprint
from app.services.ticket_exporter import generate_ticket
from app.services.linter_exporter import (
    generate_eslint_rules,
    generate_ruff_rules,
    generate_forbidden_actions_ruleset,
)
from pydantic import BaseModel
import json

router = APIRouter(prefix="/api/v1/execution", tags=["Execution"])


class TicketExportRequest(BaseModel):
    adr_id: str
    platform: str = "github"


@router.get("/blueprint/{adr_id}")
async def get_blueprint(adr_id: str):
    result = generate_blueprint(adr_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.get("/blueprint/{adr_id}/download")
async def download_blueprint(adr_id: str):
    result = generate_blueprint(adr_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    files = result.get("files", [])
    tar_content = _build_tarball_json(files)

    return JSONResponse(
        content=tar_content,
        headers={
            "Content-Disposition": f"attachment; filename=blueprint-{adr_id[:8]}.json",
        },
    )


@router.post("/ticket/export")
async def export_ticket(payload: TicketExportRequest):
    result = generate_ticket(payload.adr_id, payload.platform)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.get("/linter/eslint")
async def get_eslint_rules():
    rules = generate_eslint_rules()
    return rules


@router.get("/linter/eslint/download")
async def download_eslint_rules():
    rules = generate_eslint_rules()
    return JSONResponse(
        content=rules,
        headers={
            "Content-Disposition": "attachment; filename=cognitive-governance-eslint.json",
        },
    )


@router.get("/linter/ruff")
async def get_ruff_rules():
    rules = generate_ruff_rules()
    return rules


@router.get("/linter/ruff/download")
async def download_ruff_rules():
    rules = generate_ruff_rules()

    toml_lines = ["[tool.ruff.lint]", f"select = {json.dumps(rules['select'])}", ""]
    for r in rules["rules"]:
        toml_lines.append(f"# {r['code']}: {r['message']}")

    toml_content = "\n".join(toml_lines)

    return PlainTextResponse(
        content=toml_content,
        headers={
            "Content-Disposition": "attachment; filename=cognitive-governance-ruff.toml",
        },
    )


@router.get("/linter/forbidden-actions")
async def get_forbidden_actions():
    rules = generate_forbidden_actions_ruleset()
    return {"rules": rules}


@router.get("/linter/forbidden-actions/download")
async def download_forbidden_actions():
    rules = generate_forbidden_actions_ruleset()
    return JSONResponse(
        content={"forbidden_actions": rules},
        headers={
            "Content-Disposition": "attachment; filename=cognitive-forbidden-actions.json",
        },
    )


def _build_tarball_json(files: list[dict]) -> dict:
    result = {
        "blueprint": {
            "type": "nextjs",
            "generated_at": "",
        },
        "files": [],
    }

    for f in files:
        result["files"].append({
            "path": f["path"],
            "content": f["content"],
            "language": f.get("language", "txt"),
            "description": f.get("description", ""),
        })

    return result
