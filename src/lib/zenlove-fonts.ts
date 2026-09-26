import zenLoveFontsData from '@/constants/zenlove-fonts.json';

export interface ZenLoveFontItem {
  id: string;
  name: string;
  rawName: string;
  idCat: string;
  fontType: string;
  thumbnailKey: string;
  cssKey: string;
  cssUrl: string;
  woffKey?: string;
  woff2Key?: string;
  isActive: boolean;
}

export const ZENLOVE_FONTS: ZenLoveFontItem[] = zenLoveFontsData as ZenLoveFontItem[];

const FONT_MAP = new Map<string, ZenLoveFontItem>();

for (const font of ZENLOVE_FONTS) {
  if (font.name) FONT_MAP.set(font.name.toLowerCase().trim(), font);
  if (font.rawName) FONT_MAP.set(font.rawName.toLowerCase().trim(), font);
  if (font.id) FONT_MAP.set(font.id.toLowerCase().trim(), font);
}

/**
 * Find the ZenLove font metadata by name or id
 */
export function findZenLoveFont(fontNameOrId?: string): ZenLoveFontItem | undefined {
  if (!fontNameOrId) return undefined;
  const key = fontNameOrId.toLowerCase().trim();
  return FONT_MAP.get(key);
}

/**
 * Return the CDN CSS url for a given font name
 */
export function getFontCssUrl(fontNameOrId: string): string | null {
  const font = findZenLoveFont(fontNameOrId);
  if (font && font.cssUrl) return font.cssUrl;

  // Fallback to direct webfont convention on ZenLove CDN
  const slug = fontNameOrId.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `https://cdn-resource.zenlove.me/fonts/webfonts/${slug}/font.css`;
}

/**
 * Popular / Curated Wedding Fonts from ZenLove & Cinelove for Quick Selection
 */
export const POPULAR_WEDDING_FONTS = [
  { id: 'the-nautigal', name: 'The Nautigal', label: 'The Nautigal (Thư pháp bay bổng)', category: 'script' },
  { id: 'viaoda-libre', name: 'Viaoda Libre', label: 'Viaoda Libre (Cổ điển cung đình)', category: 'serif' },
  { id: 'alisheia', name: 'Alisheia', label: 'Alisheia (Thanh tao hiện đại)', category: 'script' },
  { id: 'flavinda', name: 'Flavinda', label: 'Flavinda (Chữ hoa nghệ thuật)', category: 'serif' },
  { id: 'beyond-perfection', name: 'Beyond Perfection', label: 'Beyond Perfection (Lãng mạn)', category: 'script' },
  { id: 'cormorant-garamond-gnosis', name: 'Cormorant Garamond Gnosis', label: 'Cormorant Garamond (Quý tộc)', category: 'serif' },
  { id: 'arcittya-begatri', name: 'Arcittya Begatri', label: 'Arcittya Begatri (Chữ viết tay)', category: 'script' },
  { id: 'baskervillebook', name: 'BaskervilleBook', label: 'Baskerville (Trang trọng tinh tế)', category: 'serif' },
  { id: 'lora-regular', name: 'Lora Regular', label: 'Lora (Vogue thanh lịch)', category: 'serif' },
  { id: 'hoatay1', name: 'HoaTay1', label: 'HoaTay 1 (Bút lông mềm mại)', category: 'script' },
  { id: 'fourhand', name: 'fourHand', label: 'fourHand (Nét nghiêng tình yêu)', category: 'script' },
  { id: '1ftv-vip-chetta-vissto', name: '1FTV VIP Chetta Vissto', label: 'Chetta Vissto (Sang trọng VIP)', category: 'sans' },
  { id: 'hastegi', name: 'Hastegi', label: 'Hastegi (Cổ điển hoài niệm)', category: 'serif' },
  { id: 'alexandria-signature-400', name: 'Alexandria Signature 400', label: 'Alexandria Signature (Chữ ký)', category: 'script' },
  { id: 'times-new-normal', name: 'Times New Normal', label: 'Times New Normal (Tiêu chuẩn)', category: 'serif' },
  { id: 'monsieur-la-doulaise', name: 'Monsieur La Doulaise', label: 'Monsieur La Doulaise (Cực nghệ thuật)', category: 'script' },
];

/**
 * Dynamically inject a font stylesheet into document head
 */
export function loadZenLoveFont(fontNameOrId: string) {
  if (typeof document === 'undefined' || !fontNameOrId) return;
  const cssUrl = getFontCssUrl(fontNameOrId);
  if (!cssUrl) return;
  const existing = document.querySelector(`link[href="${cssUrl}"]`);
  if (!existing) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    document.head.appendChild(link);
  }
}
