import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { resolveCraftTemplateSlug } from '@/constants/craft-templates/manifest';

const CRAFT_DIR = path.join(process.cwd(), 'src', 'constants', 'craft-templates');

// In-memory cache on the server
const CACHE = new Map<string, any>();

function findTemplateFile(slugOrId: string): string | null {
  // 1. Direct manifest lookup
  const resolved = resolveCraftTemplateSlug(slugOrId);
  if (resolved) {
    const candidate = `${resolved}.json`;
    if (fs.existsSync(path.join(CRAFT_DIR, candidate))) {
      return candidate;
    }
  }

  // 2. Direct filename match
  const key = slugOrId.toLowerCase().trim().replace(/^cine-/, '');
  if (fs.existsSync(path.join(CRAFT_DIR, `${key}.json`))) {
    return `${key}.json`;
  }

  // 3. Fallback scan directory
  if (!fs.existsSync(CRAFT_DIR)) return null;
  const files = fs.readdirSync(CRAFT_DIR).filter(f => f.endsWith('.json'));

  for (const f of files) {
    const base = f.replace('.json', '').toLowerCase();
    if (base === key) return f;
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
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);
    CACHE.set(slug, parsed);
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Error reading craft template:', err);
    return NextResponse.json({ error: 'Failed to read template' }, { status: 500 });
  }
}
