import os
from app.core.schemas import CognitiveContext

DOCS_BASE = os.environ.get(
    "DOCS_PATH",
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "docs"),
)


def _read_doc(relative_path: str) -> str:
    full_path = os.path.join(DOCS_BASE, relative_path)
    if os.path.exists(full_path):
        with open(full_path, "r") as f:
            return f.read()
    return ""


L1_CONSTITUTIONAL_SOURCES = [
    "core/SYSTEM_PHILOSOPHY.md",
    "governance/GOVERNANCE_RULES.md",
    "knowledge/TERMINOLOGY_SYSTEM.md",
]

L2_CONTEXTUAL_SOURCES = [
    "architecture/ARCHITECTURE.md",
    "core/PROJECT_VISION.md",
    "governance/COGNITIVE_SECURITY_MODEL.md",
]


FORBIDDEN_ACTIONS = [
    "AI must not assume authority or grant final approval.",
    "AI must not bypass governance review.",
    "AI must not use forbidden synonyms: 'OKAY' for 'APPROVE', 'PUBLISH' for 'APPROVE', 'CONFIRM' for 'APPROVE'.",
    "AI must not modify architecture boundaries without explicit human authorization.",
    "AI must not perform hard-delete without confirming semantic intent.",
    "AI output is always a proposal, never final truth.",
]


def build_cognitive_context(domain_id: str | None = None, max_tokens: int = 4000) -> CognitiveContext:
    l1_texts = []
    for src in L1_CONSTITUTIONAL_SOURCES:
        content = _read_doc(src)
        if content:
            l1_texts.append(content)

    l1_combined = "\n\n---\n\n".join(l1_texts)

    if domain_id:
        for src in L2_CONTEXTUAL_SOURCES:
            content = _read_doc(src)
            if content:
                l1_texts.append(content)

    token_estimate = len(l1_combined.split()) + len(" ".join(FORBIDDEN_ACTIONS).split())

    if token_estimate > max_tokens:
        truncate_point = int(len(l1_combined) * (max_tokens / token_estimate))
        l1_combined = l1_combined[:truncate_point] + "\n\n[TRUNCATED: Context exceeded token limit]"

    return CognitiveContext(
        system_philosophy=_read_doc("core/SYSTEM_PHILOSOPHY.md"),
        governance_rules=_read_doc("governance/GOVERNANCE_RULES.md"),
        terminology=_read_doc("knowledge/TERMINOLOGY_SYSTEM.md"),
        forbidden_actions=FORBIDDEN_ACTIONS,
        token_count=token_estimate,
    )


def assemble_system_prompt(context: CognitiveContext) -> str:
    return f"""You are the Constitutional System Analyst operating within the Cognitive Governance Infrastructure.

## SYSTEM PHILOSOPHY
{context.system_philosophy}

## GOVERNANCE RULES
{context.governance_rules}

## TERMINOLOGY SYSTEM
{context.terminology}

## FORBIDDEN ACTIONS
{chr(10).join(f"- {a}" for a in context.forbidden_actions)}

## YOUR ROLE
You are a Governance-Aware Analyst. Your duties:
1. Extract and validate governance concerns from user input.
2. Detect semantic drift and ambiguity.
3. Never assume authority — all outputs are proposals requiring human approval.
4. Maintain cognitive transparency — explain your reasoning.
5. Flag governance violations at appropriate severity levels (Critical, Warning, Suggestion).

Respond ONLY in valid JSON matching the GovernanceAnalysisResult schema.
"""
