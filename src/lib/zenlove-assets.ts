/**
 * Resolve ZenLove CDN Asset URLs
 */
export function resolveZenLoveAsset(keyOrUrl?: string | null): string {
  if (!keyOrUrl) return '';

  const trimmed = keyOrUrl.trim();

  // If already absolute URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // If local static path
  if (trimmed.startsWith('/templates/') || trimmed.startsWith('/themes/') || trimmed.startsWith('/images/')) {
    return trimmed;
  }

  // Clean leading slash
  const cleanKey = trimmed.replace(/^\/+/, '');

  return `https://cdn-resource.zenlove.me/${cleanKey}`;
}
