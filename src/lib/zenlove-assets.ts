/**
 * Resolve ZenLove CDN Asset URLs
 * Handles stickers, background textures, characters, envelopes, frames, and template images.
 * Provides aspect-ratio-matched, unwatermarked clean wedding photos.
 */

export const CLEAN_PHOTOS_VERTICAL = [
  'https://cdn-resource.zenlove.me/templates/9efa3cd1-7346-4ec6-b1c2-0a8da3d1d09d/images/Ny0yMDI0MDIwODEyMjE1OS1odGZncF8xNzY1NDc0MDU2Xzc3cg.jpg',
  'https://cdn-resource.zenlove.me/templates/9efa3cd1-7346-4ec6-b1c2-0a8da3d1d09d/images/OC0yMDI0MDIwODEyMjE1OS1ib3F0bi0xXzE3NjU0NzUyNzNfMTEw.jpg',
  'https://cdn-resource.zenlove.me/templates/9efa3cd1-7346-4ec6-b1c2-0a8da3d1d09d/images/NC0yMDI0MDIwODEyMjE1OS1kbG1pMV8xNzY1NDc2MjI3X2J1aA.jpg',
  'https://cdn-resource.zenlove.me/templates/9efa3cd1-7346-4ec6-b1c2-0a8da3d1d09d/images/NS0yMDI0MDIwODEyMjE1OS10Z25yal8xNzY1NDc2MjI3XzVkYg.jpg',
  'https://cdn-resource.zenlove.me/templates/9efa3cd1-7346-4ec6-b1c2-0a8da3d1d09d/images/MTAtMjAyNDAyMDgxMjIxNTktZGhrY18xNzY1NDc2MjI3X2Q2Yg.jpg',
  'https://cdn-resource.zenlove.me/templates/0b732303-c263-4d95-bedf-65eee7f416dd/images/image_1761825944_6hw.jpeg',
];

export const CLEAN_PHOTOS_HORIZONTAL = [
  'https://cdn-resource.zenlove.me/templates/0b732303-c263-4d95-bedf-65eee7f416dd/images/image_1761825945_4bv.jpeg',
  'https://cdn-resource.zenlove.me/templates/0b732303-c263-4d95-bedf-65eee7f416dd/images/image_1761892389_jiw.jpeg',
  'https://cdn-resource.zenlove.me/templates/9efa3cd1-7346-4ec6-b1c2-0a8da3d1d09d/images/NC0yMDI0MDIwODEyMjE1OS1kbG1pMV8xNzY1NDc2MjI3X2J1aA.jpg',
];

export const CLEAN_PHOTOS_SQUARE = [
  'https://cdn-resource.zenlove.me/templates/0b732303-c263-4d95-bedf-65eee7f416dd/images/image_1761825944_6hw.jpeg',
  'https://cdn-resource.zenlove.me/templates/9efa3cd1-7346-4ec6-b1c2-0a8da3d1d09d/images/OC0yMDI0MDIwODEyMjE1OS1ib3F0bi0xXzE3NjU0NzUyNzNfMTEw.jpg',
  'https://cdn-resource.zenlove.me/templates/9efa3cd1-7346-4ec6-b1c2-0a8da3d1d09d/images/NS0yMDI0MDIwODEyMjE1OS10Z25yal8xNzY1NDc2MjI3XzVkYg.jpg',
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
