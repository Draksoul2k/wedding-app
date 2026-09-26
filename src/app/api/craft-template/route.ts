import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CRAFT_DIR = path.join(process.cwd(), 'src', 'constants', 'craft-templates');

// Cache in memory on server
const CACHE = new Map<string, any>();

function findTemplateFile(slugOrId: string): string | null {
  const key = slugOrId.toLowerCase().trim().replace(/^cine-/, '');
  if (!fs.existsSync(CRAFT_DIR)) return null;

  const files = fs.readdirSync(CRAFT_DIR).filter(f => f.endsWith('.json'));

  // 1. Exact match
  for (const f of files) {
    const base = f.replace('.json', '').toLowerCase();
    if (base === key) return f;
  }

  // 2. Strict number match (e.g. "thiep-cuoi-39" -> "thiep-cuoi-39-pre.json")
  const numMatch = key.match(/\d+/);
  if (numMatch) {
    const num = numMatch[0];
    const regex = new RegExp(`(?:^|-)${num}(?:-|$)`);
    for (const f of files) {
      const base = f.replace('.json', '').toLowerCase();
      if (regex.test(base)) return f;
    }
  }

  // 3. Partial match
  for (const f of files) {
    const base = f.replace('.json', '').toLowerCase();
    if (base.includes(key) || key.includes(base)) return f;
  }

  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || searchParams.get('id');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  if (CACHE.has(slug)) {
    return NextResponse.json(CACHE.get(slug));
  }

  const filename = findTemplateFile(slug);
  if (!filename) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  try {
    const filePath = path.join(CRAFT_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    CACHE.set(slug, parsed);
    CACHE.set(filename.replace('.json', ''), parsed);
    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
