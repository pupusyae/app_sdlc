import json
import asyncio
from app.core.config import settings
from app.core.schemas import GovernanceAnalysisResult
from app.constitution.context_assembler import build_cognitive_context, assemble_system_prompt


async def call_llm(user_input: str, constitutional_context: str) -> GovernanceAnalysisResult:
    if not settings.LLM_API_KEY:
        return _mock_reasoning(user_input)

    try:
        if settings.LLM_PROVIDER == "openai":
            return await _call_openai(user_input, constitutional_context)
        elif settings.LLM_PROVIDER == "anthropic":
            return await _call_anthropic(user_input, constitutional_context)
        else:
            return _mock_reasoning(user_input)
    except Exception:
        return _mock_reasoning(user_input)


async def _call_openai(user_input: str, constitutional_context: str) -> GovernanceAnalysisResult:
    import httpx

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.LLM_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.LLM_MODEL,
                "messages": [
                    {"role": "system", "content": constitutional_context},
                    {"role": "user", "content": f"Analyze this input for governance concerns:\n\n{user_input}\n\nReturn a JSON object with keys: severity, category, message, source, confidence, requires_human_approval."},
                ],
                "temperature": 0.3,
                "max_tokens": 1000,
            },
            timeout=30.0,
        )
        data = response.json()
        content = data["choices"][0]["message"]["content"]

        try:
            result = json.loads(content)
            return GovernanceAnalysisResult(**result)
        except (json.JSONDecodeError, TypeError):
            return GovernanceAnalysisResult(
                severity="Warning",
                category="Governance Analysis",
                message=content[:500],
                source="LLM Engine",
                confidence=0.6,
                requires_human_approval=True,
            )


async def _call_anthropic(user_input: str, constitutional_context: str) -> GovernanceAnalysisResult:
    import httpx

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": settings.LLM_API_KEY,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.LLM_MODEL,
                "max_tokens": 1000,
                "system": constitutional_context,
                "messages": [
                    {"role": "user", "content": f"Analyze this input for governance concerns:\n\n{user_input}\n\nReturn a JSON object with keys: severity, category, message, source, confidence, requires_human_approval."},
                ],
            },
            timeout=30.0,
        )
        data = response.json()
        content = data["content"][0]["text"]

        try:
            result = json.loads(content)
            return GovernanceAnalysisResult(**result)
        except (json.JSONDecodeError, TypeError):
            return GovernanceAnalysisResult(
                severity="Warning",
                category="Governance Analysis",
                message=content[:500],
                source="LLM Engine",
                confidence=0.6,
                requires_human_approval=True,
            )


def _mock_reasoning(user_input: str) -> GovernanceAnalysisResult:
    lower = user_input.lower()

    if any(phrase in lower for phrase in ["abaikan", "ignore", "bypass", "override", "sebagai admin", "as admin"]):
        return GovernanceAnalysisResult(
            severity="Critical",
            category="Cognitive Security",
            message="Potential authority simulation detected. Input blocked.",
            source="Mock Reasoner",
            confidence=0.95,
            requires_human_approval=True,
        )

    if any(word in lower for word in ["okay", "confirm", "publish"]):
        return GovernanceAnalysisResult(
            severity="Warning",
            category="Semantic Drift",
            message="Potentially forbidden synonym detected. Use 'APPROVE' instead of casual confirmation terms.",
            source="Mock Reasoner",
            confidence=0.85,
            requires_human_approval=True,
        )

    if any(word in lower for word in ["hapus", "delete", "remove", "archive"]):
        return GovernanceAnalysisResult(
            severity="Critical",
            category="Ambiguous Operation",
            message="Destructive action detected. Clarify: Hard-Delete or Soft-Delete per TERMINOLOGY_SYSTEM.",
            source="Mock Reasoner",
            confidence=0.9,
            requires_human_approval=True,
        )

    return GovernanceAnalysisResult(
        severity="Suggestion",
        category="Governance Analysis",
        message="Input received. No critical governance violations detected. Proceeding as proposal.",
        source="Mock Reasoner",
        confidence=0.7,
        requires_human_approval=True,
    )
