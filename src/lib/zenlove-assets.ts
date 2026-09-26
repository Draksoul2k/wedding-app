/**
 * Resolve ZenLove CDN Asset URLs
 * Handles stickers, background textures, characters, envelopes, frames, and template images.
 * Provides aspect-ratio-matched, unwatermarked clean wedding photos.
 */

export const CLEAN_PHOTOS_VERTICAL = [
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&h=1200&q=85',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&h=1200&q=85',
  'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&h=1200&q=85',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&h=1200&q=85',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&h=1200&q=85',
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&h=1200&q=85',
];

export const CLEAN_PHOTOS_HORIZONTAL = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&h=800&q=85',
  'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&h=800&q=85',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&h=800&q=85',
  'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=1200&h=800&q=85',
];

export const CLEAN_PHOTOS_SQUARE = [
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&h=800&q=85',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&h=800&q=85',
  'https://images.unsplash.com/photo-1520333789090-1bc00e051c5f?auto=format&fit=crop&w=800&h=800&q=85',
];

export function isWatermarkedAsset(keyOrUrl?: string | null): boolean {
  if (!keyOrUrl) return false;
  if (/watermark/i.test(keyOrUrl)) {
    return true;
  }
  try {
    const clean = keyOrUrl.split('?')[0];
    const filename = clean.split('/').pop() || '';
    const b64 = filename.replace(/^[a-f0-9]+-/, '').split('.')[0];
    if (typeof atob !== 'undefined') {
      const decoded = atob(b64);
      if (/watermark/i.test(decoded)) return true;
    } else if (typeof Buffer !== 'undefined') {
      const decoded = Buffer.from(b64, 'base64').toString('utf8');
      if (/watermark/i.test(decoded)) return true;
    }
  } catch {}
  return false;
}

export function isDecorativeAsset(keyOrUrl?: string | null): boolean {
  if (!keyOrUrl) return false;
  const str = keyOrUrl.toLowerCase();
  return (
    str.includes('.svg') ||
    str.includes('flowerelements') ||
    str.includes('stickers') ||
    str.includes('/icons/') ||
    str.includes('/vector/') ||
    str.includes('assets/') ||
    str.includes('asset-')
  );
}

export function getCleanWeddingPhoto(
  seedKey?: string,
  width: number = 500,
  height: number = 700
): string {
  const aspect = width / (height || 1);
  const isHorizontal = aspect > 1.15;
  const isVertical = aspect < 0.85;

  let pool: string[];
  if (isHorizontal) {
    pool = CLEAN_PHOTOS_HORIZONTAL;
  } else if (isVertical) {
    pool = CLEAN_PHOTOS_VERTICAL;
  } else {
    pool = CLEAN_PHOTOS_SQUARE;
  }

  let hash = 0;
  if (seedKey) {
    for (let i = 0; i < seedKey.length; i++) {
      hash = (hash << 5) - hash + seedKey.charCodeAt(i);
      hash |= 0;
    }
  }
  const idx = Math.abs(hash) % pool.length;
  return pool[idx];
}

export function resolveZenLoveAsset(keyOrUrl?: string | null): string {
  if (!keyOrUrl) return '';

  const trimmed = keyOrUrl.trim();

  // If already absolute URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Only genuinely local static assets from public folder stay local
  if (
    trimmed.startsWith('/audio/') ||
    trimmed.startsWith('/icons/') ||
    trimmed.startsWith('/logo') ||
    trimmed.startsWith('/favicon') ||
    trimmed.startsWith('/templates/cinelove/')
  ) {
    return trimmed;
  }

  // Clean leading slash
  const cleanKey = trimmed.replace(/^\/+/, '');

  return `https://cdn-resource.zenlove.me/${cleanKey}`;
}
