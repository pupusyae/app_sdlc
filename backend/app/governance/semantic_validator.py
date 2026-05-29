import re
import os
from app.core.schemas import ExtractionResult

DOCS_BASE = os.path.join(os.path.dirname(__file__), "..", "..", "..", "docs")

_GLOSSARY_ENTRIES: dict[str, dict] = {}


def _load_terminology():
    global _GLOSSARY_ENTRIES
    if _GLOSSARY_ENTRIES:
        return _GLOSSARY_ENTRIES

    term_path = os.path.join(DOCS_BASE, "knowledge", "TERMINOLOGY_SYSTEM.md")
    if not os.path.exists(term_path):
        return _GLOSSARY_ENTRIES

    with open(term_path, "r") as f:
        content = f.read()

    entries = {
        "APPROVE": {
            "definition": "Tindakan memberikan otoritas final untuk melanjutkan proses.",
            "forbidden_synonyms": ["PUBLISH", "CONFIRM", "OKAY"],
            "authority_required": "Manager / Architect",
            "audit_required": True,
        },
        "VERIFY": {
            "definition": "Tindakan memeriksa kebenaran, belum memberikan otorisasi.",
            "forbidden_synonyms": [],
            "authority_required": "Developer / QA",
            "audit_required": False,
        },
        "HARD-DELETE": {
            "definition": "Pemusnahan permanen data dari sistem.",
            "forbidden_synonyms": ["HAPUS", "DELETE", "REMOVE"],
            "authority_required": "Architect / DBA",
            "audit_required": True,
        },
        "SOFT-DELETE": {
            "definition": "Pencabutan akses tanpa pemusnahan data.",
            "forbidden_synonyms": [],
            "authority_required": "Manager",
            "audit_required": True,
        },
        "ARCHIVE": {
            "definition": "Data historis statis yang dipindahkan ke penyimpanan jangka panjang.",
            "forbidden_synonyms": ["BACKUP", "CADANGAN"],
            "authority_required": "Architect",
            "audit_required": True,
        },
        "DEACTIVATE": {
            "definition": "Menonaktifkan entitas tanpa menghapus.",
            "forbidden_synonyms": ["SUSPEND", "DISABLE"],
            "authority_required": "Manager",
            "audit_required": True,
        },
    }

    _GLOSSARY_ENTRIES = entries
    return entries


LIGHT_EXTRACTION_PATTERNS = [
    (r"(?i)\b(ledger|event.?sourcing|cqrs|microservice)\b", "architecture"),
    (r"(?i)\b(cache|latency|timeout|throughput|performa)\b", "operational"),
    (r"(?i)\b(auth|otorisasi|persetujuan|approval|role)\b", "authority"),
    (r"(?i)\b(audit|log|trace|immutable|tidak.berubah)\b", "audit"),
    (r"(?i)\b(api|endpoint|route|request|response)\b", "interface"),
    (r"(?i)\b(database|sql|nosql|schema|migration)\b", "data"),
]


def light_extract(content: str) -> ExtractionResult:
    glossary = _load_terminology()
    result = ExtractionResult()
    found_terms = set()

    for pattern, category in LIGHT_EXTRACTION_PATTERNS:
        matches = re.findall(pattern, content, re.IGNORECASE)
        for match in matches:
            found_terms.add(match.lower())

    if found_terms:
        result.glossary_candidates = list(found_terms)
        result.severity_level = "Suggestion"
        result.suggestions = [
            {"id": idx + 1, "type": "Glossary Signal", "text": f"Detected term: '{term}'"}
            for idx, term in enumerate(found_terms)
        ]

    warnings = check_semantic_drift(content)
    if warnings:
        result.warnings = warnings
        result.severity_level = "Warning"

    return result


def check_semantic_drift(content: str) -> list[dict]:
    glossary = _load_terminology()
    warnings = []
    wid = 0

    for term, entry in glossary.items():
        for synonym in entry.get("forbidden_synonyms", []):
            pattern = re.compile(rf"\b{re.escape(synonym)}\b", re.IGNORECASE)
            if pattern.search(content):
                wid += 1
                warnings.append({
                    "id": wid,
                    "type": "Semantic Drift",
                    "text": f"Forbidden synonym '{synonym}' detected. Use '{term}' instead per TERMINOLOGY_SYSTEM.",
                })

    if re.search(r"\b(?:hapus|delete|remove)\b", content, re.IGNORECASE):
        wid += 1
        warnings.append({
            "id": wid,
            "type": "Ambiguous Operation",
            "text": "Ambiguous destructive term detected. Clarify: HARD-DELETE or SOFT-DELETE per TERMINOLOGY_SYSTEM.",
        })

    return warnings


def deep_extract(content: str, constitutional_context: str) -> ExtractionResult:
    result = light_extract(content)
    return result
