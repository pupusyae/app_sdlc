import re
from pydantic import BaseModel


class SecurityScanResult(BaseModel):
    blocked: bool = False
    reason: str | None = None
    severity: str = "Safe"
    detected_patterns: list[str] = []


AUTHORITY_SIMULATION_PATTERNS = [
    r"(?i)(sebagai|as\s+an?)\s+(admin|administrator|system|super\s*user|root|owner)",
    r"(?i)(abaikan|ignore|bypass|skip|lewati)\s+(?:semua|all|aturan|rules?|konstitusi|constitution)",
    r"(?i)(override|overrule)\s+(?:governance|authority|approval)",
    r"(?i)(i\s*am|saya\s*adalah)\s+(?:the\s+)?(admin|administrator|super\s*user|root)",
    r"(?i)(grant|beri(?:kan)?)\s+(?:me|saya)\s+(admin|full|all|semua)\s+(?:access|privilege|hak\s*akses)",
    r"(?i)(pretend|berpura.?pura|act\s+as)\s+(?:you\s+are|anda\s+adalah)\s+(admin|administrator)",
    r"(?i)(forget|lupakan)\s+(?:your|semua|all)\s+(?:instructions?|aturan|rules?|konstitusi)",
    r"(?i)(ignore\s+previous|abaikan\s+sebelumnya)",
    r"(?i)(you\s+have\s+full|anda\s+punya\s+penuh)\s+(?:authority|otoritas|access|akses)",
    r"(?i)(disable|non.?aktifkan)\s+(?:governance|security|tata\s*Kelola)",
    r"(?i)(do\s+not\s+ask|jangan\s+tanya)\s+(?:for\s+approval|persetujuan)",
    r"(?i)(final\s+decision|keputusan\s+final)\s+(?:is\s+made|dibuat)\s+by\s+(?:you|ai)",
    r"(?i)(execute|jalankan)\s+(?:directly|langsung)\s+(?:without|tanpa)\s+(?:approval|otorisasi)",
]


def scan_input(content: str) -> SecurityScanResult:
    detected = []

    for pattern in AUTHORITY_SIMULATION_PATTERNS:
        matches = re.findall(pattern, content)
        if matches:
            detected.append(pattern)

    if detected:
        return SecurityScanResult(
            blocked=True,
            reason=f"Cognitive Security: Authority simulation / prompt injection detected. Input blocked per Governance Rules.",
            severity="Critical",
            detected_patterns=detected,
        )

    return SecurityScanResult(
        blocked=False,
        severity="Safe",
        detected_patterns=[],
    )
