from app.constitution.context_assembler import _read_doc, FORBIDDEN_ACTIONS
import json


def generate_eslint_rules() -> dict:
    terminology_text = _read_doc("knowledge/TERMINOLOGY_SYSTEM.md")
    forbidden_rules = _parse_forbidden_rules(terminology_text)

    return {
        "format": "eslint",
        "rules": {
            "cognitive-governance/no-forbidden-synonyms": {
                "meta": {
                    "type": "problem",
                    "docs": {
                        "description": "Enforce approved terminology per Cognitive Governance TERMINOLOGY_SYSTEM",
                        "recommended": True,
                    },
                    "schema": [],
                    "messages": {
                        "forbiddenSynonym": "Forbidden synonym '{{synonym}}' detected. Use '{{approved}}' instead per TERMINOLOGY_SYSTEM.",
                    },
                },
                "create": "function(context) { return { Identifier: function(node) { /* check against forbidden list */ } }; }",
            },
        },
        "config": {
            "plugins": ["cognitive-governance"],
            "rules": {
                "cognitive-governance/no-forbidden-synonyms": "error",
            },
        },
        "forbidden_terms": forbidden_rules,
    }


def generate_ruff_rules() -> dict:
    terminology_text = _read_doc("knowledge/TERMINOLOGY_SYSTEM.md")
    forbidden_rules = _parse_forbidden_rules(terminology_text)

    rules = []
    for term in forbidden_rules:
        for syn in term.get("forbidden_synonyms", []):
            rules.append({
                "code": f"CGT{len(rules)+1:03d}",
                "message": f"Forbidden synonym '{syn}'. Use '{term['term']}' instead.",
                "pattern": syn.lower(),
            })

    return {
        "format": "ruff",
        "select": [r["code"] for r in rules],
        "rules": rules,
    }


def generate_forbidden_actions_ruleset() -> list[dict]:
    rules = []
    for idx, action in enumerate(FORBIDDEN_ACTIONS, 1):
        rules.append({
            "id": f"FA{idx:03d}",
            "rule": action,
            "enforcement": "error",
            "scope": "codebase",
        })
    return rules


def _parse_forbidden_rules(terminology_text: str) -> list[dict]:
    rules = []

    entries = {
        "APPROVE": ["PUBLISH", "CONFIRM", "OKAY"],
        "VERIFY": [],
        "HARD-DELETE": ["HAPUS", "DELETE", "REMOVE"],
        "SOFT-DELETE": [],
        "ARCHIVE": ["BACKUP", "CADANGAN"],
        "DEACTIVATE": ["SUSPEND", "DISABLE"],
    }

    for term, synonyms in entries.items():
        if synonyms:
            rules.append({
                "term": term,
                "forbidden_synonyms": synonyms,
            })

    return rules
