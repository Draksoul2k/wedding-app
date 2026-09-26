import hongPhongData from './hong-phong.json';
import thiepCuoi130PreData from './thiep-cuoi-130-pre.json';
import senNgayHyData from './sen-ngay-hy.json';
import henUocData from './hen-uoc.json';
import mocAmData from './moc-am.json';
import thiepCuoi2Data from './thiep-cuoi-2.json';
import thiepCuoi39Data from './thiep-cuoi-39-pre.json';

export interface CraftNode {
  type: {
    resolvedName: string;
  };
  isCanvas?: boolean;
  props: Record<string, any>;
  parent?: string;
  nodes?: string[];
  custom?: Record<string, any>;
}

export type CraftTree = Record<string, CraftNode>;

// Pre-cached popular templates in client memory
const CRAFT_CACHE = new Map<string, CraftTree>([
  ['hong-phong', hongPhongData as unknown as CraftTree],
  ['sen-ngay-hy', senNgayHyData as unknown as CraftTree],
  ['hen-uoc', henUocData as unknown as CraftTree],
  ['moc-am', mocAmData as unknown as CraftTree],
  ['thiep-cuoi-130-pre', thiepCuoi130PreData as unknown as CraftTree],
  ['thiep-cuoi-130', thiepCuoi130PreData as unknown as CraftTree],
  ['thiep-cuoi-2', thiepCuoi2Data as unknown as CraftTree],
  ['thiep-cuoi-39-pre', thiepCuoi39Data as unknown as CraftTree],
  ['thiep-cuoi-39', thiepCuoi39Data as unknown as CraftTree],
]);

/**
 * Synchronous getter from client memory
 */
export function getCraftTemplate(slugOrId?: string | null): CraftTree | null {
  if (!slugOrId) return null;
  const key = slugOrId.toLowerCase().trim().replace(/^cine-/, '');

  if (CRAFT_CACHE.has(key)) return CRAFT_CACHE.get(key)!;

  // Match numbers (e.g. "thiep-cuoi-130" matching "thiep-cuoi-130-pre")
  const numMatch = key.match(/\d+/);
  if (numMatch) {
    const num = numMatch[0];
    const regex = new RegExp(`(?:^|-)${num}(?:-|$)`);
    for (const [slug, tree] of CRAFT_CACHE.entries()) {
      if (regex.test(slug)) {
        return tree;
      }
    }
  }

  // Try matching partial
  for (const [slug, tree] of CRAFT_CACHE.entries()) {
    if (key.includes(slug) || slug.includes(key)) {
      return tree;
    }
  }

  return null;
}

/**
 * Async fetcher with caching that loads any of the 143 templates from API
 */
export async function fetchCraftTemplate(slugOrId: string): Promise<CraftTree | null> {
  const cached = getCraftTemplate(slugOrId);
  if (cached) return cached;

  const key = slugOrId.toLowerCase().trim().replace(/^cine-/, '');
  try {
    const res = await fetch(`/api/craft-template?slug=${encodeURIComponent(key)}`);
    if (!res.ok) return null;
    const tree: CraftTree = await res.json();
    CRAFT_CACHE.set(key, tree);
    return tree;
  } catch (e) {
    console.error('Failed to fetch craft template:', e);
    return null;
  }
}
