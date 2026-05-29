from pydantic import BaseModel


class GovernanceAnalysisResult(BaseModel):
    severity: str
    category: str
    message: str
    source: str
    confidence: float
    requires_human_approval: bool = True


class ExtractionResult(BaseModel):
    critical: list[dict] = []
    warnings: list[dict] = []
    suggestions: list[dict] = []
    glossary_candidates: list[str] = []
    severity_level: str = "Suggestion"


class CognitiveContext(BaseModel):
    system_philosophy: str = ""
    governance_rules: str = ""
    terminology: str = ""
    forbidden_actions: list[str] = []
    token_count: int = 0
