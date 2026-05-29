from app.core.database import SessionLocal
from app.models import ADRRecord
from datetime import datetime
import json


def generate_blueprint(adr_id: str) -> dict:
    db = SessionLocal()
    try:
        adr = db.query(ADRRecord).filter(ADRRecord.id == adr_id).first()
        if not adr:
            return {"error": "ADR not found"}
        if adr.status != "Approved":
            return {"error": "ADR must be approved before generating blueprint"}

        title_slug = _slugify(adr.title)
        files = _generate_nextjs_blueprint(adr, title_slug)

        return {
            "adr_id": adr_id,
            "adr_title": adr.title,
            "blueprint_type": "nextjs",
            "generated_at": datetime.utcnow().isoformat(),
            "files": files,
        }
    finally:
        db.close()


def _slugify(text: str) -> str:
    import re
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text[:60]


def _generate_nextjs_blueprint(adr: ADRRecord, slug: str) -> list[dict]:
    files = []

    component_name = _to_pascal_case(adr.title)

    page_content = f"""// Blueprint generated from {adr.title}
// ADR ID: {adr.id}
// Generated: {datetime.utcnow().isoformat()}
// Status: {adr.status} | Approved by: {adr.approved_by or 'N/A'}

import {{ Metadata }} from 'next';
import {component_name} from '@/components/{component_name}';

export const metadata: Metadata = {{
  title: '{adr.title}',
  description: '{_escape_js(adr.context or "")}',
}};

export default function {component_name}Page() {{
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{adr.title}</h1>
      <p className="text-gray-600 mb-6">{adr.context or 'No context provided.'}</p>
      <{component_name} />
    </main>
  );
}}
"""

    component_content = f"""'use client';
// Blueprint generated from {adr.title}
// ADR: {adr.id}
// Architectural Decision: {adr.decision or 'N/A'}

interface {component_name}Props {{
  // Define props based on ADR context
}}

export default function {component_name}({{}}: {component_name}Props) {{
  return (
    <div className="rounded-lg border border-gray-200 p-6 bg-white">
      <h2 className="text-xl font-semibold mb-3">{adr.title}</h2>
      <div className="prose prose-sm max-w-none">
        <h3>Architectural Decision</h3>
        <p>{adr.decision or 'Decision pending.'}</p>
        <h3>Context</h3>
        <p>{adr.context or 'No context provided.'}</p>
        <h3>Consequences</h3>
        <p>{adr.consequences or 'No consequences documented.'}</p>
      </div>
    </div>
  );
}}
"""

    api_route_content = f"""// API Route generated from {adr.title}
// ADR: {adr.id}
import {{ NextRequest, NextResponse }} from 'next/server';

export async function GET(request: NextRequest) {{
  // Implementation guided by ADR decision: {adr.decision or 'N/A'}
  return NextResponse.json({{
    adr_id: '{adr.id}',
    title: '{adr.title}',
    status: '{adr.status}',
    approved_by: '{adr.approved_by or 'N/A'}',
  }});
}}

export async function POST(request: NextRequest) {{
  const body = await request.json();
  return NextResponse.json({{
    message: 'Operation received',
    data: body,
  }}, {{ status: 201 }});
}}
"""

    type_content = f"""// Types generated from {adr.title}
// ADR: {adr.id}

export interface {component_name}Data {{
  id: string;
  title: string;
  status: 'Draft' | 'Approved' | 'Deprecated';
  createdAt: string;
  updatedAt: string;
}}

export interface {component_name}Config {{
  enabled: boolean;
  // Extend based on ADR context
}}
"""

    files.append({
        "path": f"src/app/{slug}/page.tsx",
        "content": page_content,
        "language": "tsx",
        "description": "Next.js page route",
    })
    files.append({
        "path": f"src/components/{component_name}.tsx",
        "content": component_content,
        "language": "tsx",
        "description": "React component",
    })
    files.append({
        "path": f"src/app/api/{slug}/route.ts",
        "content": api_route_content,
        "language": "ts",
        "description": "API route handler",
    })
    files.append({
        "path": f"src/types/{slug}.ts",
        "content": type_content,
        "language": "ts",
        "description": "TypeScript type definitions",
    })

    return files


def _to_pascal_case(text: str) -> str:
    import re
    words = re.findall(r"[a-zA-Z0-9]+", text)
    if not words:
        return "GeneratedComponent"
    return "".join(w.capitalize() for w in words)


def _escape_js(text: str) -> str:
    return text.replace("'", "\\'").replace("\n", " ")[:200]
