/**
 * Resolve ZenLove CDN Asset URLs
 * Handles stickers, background textures, characters, and template images.
 */
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
    trimmed.startsWith('/favicon')
  ) {
    return trimmed;
  }

  // Clean leading slash
  const cleanKey = trimmed.replace(/^\/+/, '');

  return `https://cdn-resource.zenlove.me/${cleanKey}`;
}
