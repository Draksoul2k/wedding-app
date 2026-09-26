import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'weddings.json');

// Helper to ensure data directory and file exist
function getStore(): Record<string, any> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf-8');
      return {};
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content || '{}');
  } catch (e) {
    console.error('Error reading weddings data:', e);
    return {};
  }
}

function saveStore(store: Record<string, any>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving weddings data:', e);
  }
}

// In-memory fallback cache for serverless environments (Vercel)
const memoryCache: Record<string, any> = {};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  // Check in-memory cache first, then file store
  let wedding = memoryCache[slug];
  if (!wedding) {
    const store = getStore();
    wedding = store[slug];
  }

  if (!wedding) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  return NextResponse.json({ found: true, data: wedding }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, data } = body;

    if (!slug || !data) {
      return NextResponse.json({ error: 'Missing slug or data' }, { status: 400 });
    }

    // Save in memory cache
    memoryCache[slug] = data;

    // Save in file store if possible
    try {
      const store = getStore();
      store[slug] = data;
      saveStore(store);
    } catch (e) {
      console.warn('Could not write to file system (serverless):', e);
    }

    return NextResponse.json({ success: true, slug }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
