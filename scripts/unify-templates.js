const fs = require('fs');
const path = require('path');

const cineloveDownloaded = JSON.parse(fs.readFileSync('scripts/cinelove-downloaded.json', 'utf8'));

// 1. CineLove Templates Mapping
const cineloveTemplates = cineloveDownloaded.map((t, idx) => {
  const titles = {
    'thiep-cuoi-61': { name: 'CineLove - Điện Ảnh Hiện Đại 61', tag: 'Hot Trend', cat: 'hien_dai', layout: 'cinelove_movie', color: '#1c1917', accent: '#eab308' },
    'thiep-cuoi-39': { name: 'CineLove - Art Deco Sang Trọng 39', tag: 'Nổi bật', cat: 'hien_dai', layout: 'cinelove_movie', color: '#0f172a', accent: '#38bdf8' },
    'thiep-cuoi-44': { name: 'CineLove - Hollywood Lãng Mạn 44', tag: 'Đặc sắc', cat: 'hien_dai', layout: 'cinelove_movie', color: '#831843', accent: '#f472b6' },
    'thiep-cuoi-47': { name: 'CineLove - Thảm Đỏ Premiere 47', tag: 'Mới 2026', cat: 'hien_dai', layout: 'cinelove_movie', color: '#991b1b', accent: '#fbbf24' },
    'thiep-cuoi-42': { name: 'CineLove - Thanh Xuân Ngọt Ngào 42', tag: 'Yêu thích', cat: 'toi_gian', layout: 'full_long_card', color: '#431407', accent: '#fb923c' },
    'thiep-cuoi-2': { name: 'CineLove - Lookbook Tạp Chí 02', tag: 'Vogue', cat: 'hien_dai', layout: 'chungdoi_magazine', color: '#18181b', accent: '#e4e4e7' },
    'thiep-cuoi-38': { name: 'CineLove - Cổ Điển Thơ Mộng 38', tag: 'Vintage', cat: 'toi_gian', layout: 'zenlove_minimal', color: '#3f3f46', accent: '#a1a1aa' },
    'thiep-cuoi-46': { name: 'CineLove - Phim Tài Liệu Tình Yêu 46', tag: 'Classic', cat: 'hien_dai', layout: 'cinelove_movie', color: '#172554', accent: '#60a5fa' },
    'thiep-cuoi-1': { name: 'CineLove - Golden Cinema 01', tag: 'VIP', cat: 'hien_dai', layout: 'cinelove_movie', color: '#78350f', accent: '#fbbf24' },
    'thiep-cuoi-36': { name: 'CineLove - Nhật Ký Đôi Ta 36', tag: 'Thanh lịch', cat: 'toi_gian', layout: 'full_long_card', color: '#27272a', accent: '#d4d4d8' },
    'thiep-cuoi-114': { name: 'CineLove - Boarding Pass Độc Đáo 114', tag: 'Độc quyền', cat: 'hien_dai', layout: 'full_long_card', color: '#0c4a6e', accent: '#38bdf8' },
    'thiep-cuoi-40': { name: 'CineLove - Khung Phim 35mm 40', tag: 'Filmstrip', cat: 'hien_dai', layout: 'cinelove_movie', color: '#18181b', accent: '#f59e0b' },
    'thiep-cuoi-16': { name: 'CineLove - Polaroid Kỷ Niệm 16', tag: 'Nhẹ nhàng', cat: 'toi_gian', layout: 'zenlove_minimal', color: '#52525b', accent: '#cbd5e1' },
    'thiep-cuoi-48': { name: 'CineLove - Đêm Gala Trọng Đại 48', tag: 'Sang trọng', cat: 'hien_dai', layout: 'cinelove_movie', color: '#701a75', accent: '#f472b6' },
    'thiep-cuoi-19': { name: 'CineLove - Letterpress Tối Giản 19', tag: 'Mộc mạc', cat: 'toi_gian', layout: 'zenlove_minimal', color: '#44403c', accent: '#d6d3d1' },
    'thiep-cuoi-56': { name: 'CineLove - Indie Love Story 56', tag: 'Phim ngắn', cat: 'hien_dai', layout: 'cinelove_movie', color: '#1c1917', accent: '#a8a29e' },
    'thiep-cuoi-tone-xanh': { name: 'CineLove - Tone Xanh Mint Tươi Mát', tag: 'Tone Mint', cat: 'hoa_la', layout: 'botanical_garden', color: '#065f46', accent: '#34d399' },
    'thiep-cuoi-53': { name: 'CineLove - Sunset Romance 53', tag: 'Hoàng hôn', cat: 'hien_dai', layout: 'full_long_card', color: '#9a3412', accent: '#fdba74' },
    'thiep-cuoi-5': { name: 'CineLove - Movie Ticket Rạp Cưới 05', tag: 'Vé xem phim', cat: 'hien_dai', layout: 'cinelove_movie', color: '#881337', accent: '#fb7185' },
    'thiep-cuoi-23': { name: 'CineLove - Biển Xanh Lãng Mạn 23', tag: 'Biển xanh', cat: 'hoa_la', layout: 'botanical_garden', color: '#0369a1', accent: '#38bdf8' },
    'thiep-cuoi-7': { name: 'CineLove - Retro 90s Vibe 07', tag: 'Retro', cat: 'hien_dai', layout: 'cinelove_movie', color: '#451a03', accent: '#f59e0b' },
    'thiep-cuoi-17': { name: 'CineLove - Trắng Đen Vĩnh Cửu 17', tag: 'Monochrome', cat: 'toi_gian', layout: 'chungdoi_magazine', color: '#09090b', accent: '#71717a' },
    'thiep-cuoi-8': { name: 'CineLove - Giấc Mơ Tình Yêu 08', tag: 'Lãng mạn', cat: 'hien_dai', layout: 'full_long_card', color: '#4c1d95', accent: '#c084fc' },
    'thiep-cuoi-49': { name: 'CineLove - Starlight Wedding 49', tag: 'Ngân hà', cat: 'hien_dai', layout: 'cinelove_movie', color: '#0f172a', accent: '#93c5fd' }
  };

  const meta = titles[t.slug] || {
    name: t.name,
    tag: 'CineLove',
    cat: 'hien_dai',
    layout: 'cinelove_movie',
    color: '#1c1917',
    accent: '#eab308'
  };

  return {
    id: `cine-${t.slug}`,
    name: meta.name,
    category: meta.cat,
    source: 'cinelove',
    layoutType: meta.layout,
    primaryColor: meta.color,
    accentColor: meta.accent,
    bgTexture: '#0f0f10',
    cardBg: '#1c1917',
    envelopeGradient: 'from-stone-900 to-black',
    sealSymbol: '🎬',
    frameAsset: t.localAsset,
    description: `Mẫu thiệp cưới điện ảnh ${meta.name} độc quyền từ CineLove, cuộn dọc sống động và trải nghiệm thảm đỏ sang trọng.`,
    tag: meta.tag,
    isLongThumbnail: true
  };
});

// 2. ChungDoi Master Templates with Color Variants Unified
const chungdoiUnifiedTemplates = [
  {
    id: 'baroque-royal',
    name: 'Baroque Hoàng Gia Quý Tộc',
    category: 'hien_dai',
    source: 'chungdoi',
    layoutType: 'cinelove_movie',
    primaryColor: '#b45309',
    accentColor: '#fbbf24',
    bgTexture: '#faf8f5',
    cardBg: '#ffffff',
    envelopeGradient: 'from-amber-700 to-yellow-800',
    sealSymbol: '👑',
    frameAsset: '/templates/baroque_gold.webp',
    description: 'Thiết kế hoa văn phù điêu Baroque châu Âu cổ điển, dát vàng sang trọng tôn vinh ngày cưới vương giả.',
    tag: 'Hoàng Gia',
    colorVariants: [
      { id: 'baroque-gold', name: 'Vàng Kim Quý Tộc', primaryColor: '#b45309', accentColor: '#fbbf24', frameAsset: '/templates/baroque_gold.webp' },
      { id: 'baroque-v2-darkblue', name: 'Xanh Navy Sứ Trắng', primaryColor: '#1d4ed8', accentColor: '#60a5fa', frameAsset: '/templates/baroque_v2_darkblue.webp' },
      { id: 'baroque-v2-darkgreen', name: 'Xanh Lục Bảo', primaryColor: '#047857', accentColor: '#34d399', frameAsset: '/templates/baroque_v2_darkgreen.webp' }
    ]
  },
  {
    id: 'song-hy-co-dien',
    name: 'Song Hỷ Cổ Điển Á Đông',
    category: 'truyen_thong',
    source: 'chungdoi',
    layoutType: 'chungdoi_traditional',
    primaryColor: '#c2182b',
    accentColor: '#d4af37',
    bgTexture: '#fff5f5',
    cardBg: '#ffffff',
    envelopeGradient: 'from-red-600 to-rose-700',
    sealSymbol: '囍',
    frameAsset: '/templates/song_hy_red.webp',
    description: 'Nét đẹp truyền thống người Việt với ấn triện Song Hỷ, hoa văn triều đình và lịch âm dương cát nhật.',
    tag: 'Song Hỷ',
    colorVariants: [
      { id: 'song-hy-red', name: 'Đỏ Song Hỷ', primaryColor: '#c2182b', accentColor: '#d4af37', frameAsset: '/templates/song_hy_red.webp' },
      { id: 'classic-red', name: 'Đỏ Thắm Trân Châu', primaryColor: '#991b1b', accentColor: '#fbbf24', frameAsset: '/templates/classic_red.webp' },
      { id: 'gold-crest-red', name: 'Vương Triều Dát Vàng', primaryColor: '#881337', accentColor: '#f59e0b', frameAsset: '/templates/gold_crest_red.webp' }
    ]
  },
  {
    id: 'boho-floral-thao-moc',
    name: 'Boho Floral Thảo Mộc',
    category: 'hoa_la',
    source: 'chungdoi',
    layoutType: 'botanical_garden',
    primaryColor: '#15803d',
    accentColor: '#86efac',
    bgTexture: '#f6fbf7',
    cardBg: '#ffffff',
    envelopeGradient: 'from-emerald-700 to-green-800',
    sealSymbol: '🌿',
    frameAsset: '/templates/boho_floral_green.webp',
    description: 'Họa tiết lá khuynh diệp và thảo mộc phong cách Bohemian phóng khoáng, thích hợp cho đám cưới ngoài trời.',
    tag: 'Boho Garden',
    colorVariants: [
      { id: 'boho-floral-green', name: 'Xanh Lá Thảo Mộc', primaryColor: '#15803d', accentColor: '#86efac', frameAsset: '/templates/boho_floral_green.webp' },
      { id: 'boho-floral-terracotta', name: 'Cam Đất Terracotta', primaryColor: '#c2410c', accentColor: '#fdba74', frameAsset: '/templates/boho_floral_terracotta.webp' },
      { id: 'boho-floral-navy', name: 'Xanh Navy Chiều Tà', primaryColor: '#1e3a8a', accentColor: '#93c5fd', frameAsset: '/templates/boho_floral_navy.webp' }
    ]
  },
  {
    id: 'minimalism-tinh-te',
    name: 'Tối Giản Minimalism Hiện Đại',
    category: 'toi_gian',
    source: 'chungdoi',
    layoutType: 'zenlove_minimal',
    primaryColor: '#18181b',
    accentColor: '#71717a',
    bgTexture: '#fafafa',
    cardBg: '#ffffff',
    envelopeGradient: 'from-zinc-700 to-zinc-900',
    sealSymbol: '✨',
    frameAsset: '/templates/minimalism_black.webp',
    description: 'Đỉnh cao của sự tinh gọn: Khoảng trắng thanh lịch, typography sắc sảo và lịch tháng đánh dấu trái tim.',
    tag: 'Minimalism',
    colorVariants: [
      { id: 'minimalism-black', name: 'Đen Trắng Tinh Tế', primaryColor: '#18181b', accentColor: '#71717a', frameAsset: '/templates/minimalism_black.webp' },
      { id: 'minimalism-red', name: 'Đỏ Rượu Vang', primaryColor: '#b91c1c', accentColor: '#fca5a5', frameAsset: '/templates/minimalism_red.webp' },
      { id: 'minimalism-green', name: 'Xanh Rêu Mộc', primaryColor: '#065f46', accentColor: '#6ee7b7', frameAsset: '/templates/minimalism_green.webp' }
    ]
  },
  {
    id: 'vintage-rose-lang-man',
    name: 'Vintage Rose Hồng Lãng Mạn',
    category: 'hoa_la',
    source: 'chungdoi',
    layoutType: 'botanical_garden',
    primaryColor: '#be185d',
    accentColor: '#f9a8d4',
    bgTexture: '#fff5f7',
    cardBg: '#ffffff',
    envelopeGradient: 'from-rose-600 to-pink-700',
    sealSymbol: '🌸',
    frameAsset: '/templates/vintage_rose_pink.webp',
    description: 'Vườn hồng cổ nước Pháp với những cánh hoa nở rộ mềm mại, tượng trưng cho tình yêu ngọt ngào, bền chặt.',
    tag: 'Hoa Hồng Cổ',
    colorVariants: [
      { id: 'vintage-rose-pink', name: 'Hồng Phấn Ngọt Ngào', primaryColor: '#be185d', accentColor: '#f9a8d4', frameAsset: '/templates/vintage_rose_pink.webp' },
      { id: 'vintage-rose-burgundy', name: 'Đỏ Bordeaux Say Đắm', primaryColor: '#831843', accentColor: '#fbcfe8', frameAsset: '/templates/vintage_rose_burgundy.webp' }
    ]
  },
  {
    id: 'editorial-vogue-lookbook',
    name: 'Tạp Chí Thời Trang Vogue Lookbook',
    category: 'hien_dai',
    source: 'chungdoi',
    layoutType: 'chungdoi_magazine',
    primaryColor: '#09090b',
    accentColor: '#d4af37',
    bgTexture: '#f4f4f5',
    cardBg: '#ffffff',
    envelopeGradient: 'from-neutral-800 to-black',
    sealSymbol: '💍',
    frameAsset: '/templates/editorial_classic_black.webp',
    description: 'Bố cục trang bìa tạp chí danh tiếng với font chữ Didot, ảnh Lookbook đôi và câu chuyện tình yêu truyền cảm hứng.',
    tag: 'Vogue Fashion',
    colorVariants: [
      { id: 'editorial-classic-black', name: 'Bìa Đen Haute Couture', primaryColor: '#09090b', accentColor: '#d4af37', frameAsset: '/templates/editorial_classic_black.webp' },
      { id: 'editorial-chic-gold', name: 'Ánh Kim Sang Trọng', primaryColor: '#78350f', accentColor: '#fbbf24', frameAsset: '/templates/baroque_gold.webp' }
    ]
  }
];

// 3. ZenLove Curated Templates
const zenloveCurated = [
  {
    id: 'zen-minimal-polaroid',
    name: 'ZenLove - Thơ Mộng Băng Keo Polaroid',
    category: 'toi_gian',
    source: 'zenlove',
    layoutType: 'zenlove_minimal',
    primaryColor: '#44403c',
    accentColor: '#a8a29e',
    bgTexture: '#fafaf9',
    cardBg: '#ffffff',
    envelopeGradient: 'from-stone-700 to-stone-900',
    sealSymbol: '🕊️',
    frameAsset: '/templates/zen_long_03feb3d1-a100-4972-a64a-879c038d14d4.jpeg',
    description: 'Thiết kế nguyên bản đậm chất Zen: Tấm ảnh dán tape, những dòng thư tình chân thành và giao diện tĩnh lặng.',
    tag: 'Zen Mộc'
  },
  {
    id: 'zen-botanical-watercolor',
    name: 'ZenLove - Thảo Mộc Màu Nước',
    category: 'hoa_la',
    source: 'zenlove',
    layoutType: 'botanical_garden',
    primaryColor: '#047857',
    accentColor: '#6ee7b7',
    bgTexture: '#f0fdf4',
    cardBg: '#ffffff',
    envelopeGradient: 'from-emerald-800 to-green-950',
    sealSymbol: '🍃',
    frameAsset: '/templates/zen_long_0434ff1f-f435-49df-8bca-3fb1dfa524e9.jpeg',
    description: 'Sự hòa quyện giữa tinh thần tĩnh tại của Zen và sắc xanh thảo dược trong trẻo.',
    tag: 'Thảo Dược'
  },
  {
    id: 'zen-calm-sunset',
    name: 'ZenLove - Hoàng Hôn Tĩnh Lặng',
    category: 'toi_gian',
    source: 'zenlove',
    layoutType: 'zenlove_minimal',
    primaryColor: '#9a3412',
    accentColor: '#fdba74',
    bgTexture: '#fff7ed',
    cardBg: '#ffffff',
    envelopeGradient: 'from-amber-800 to-orange-950',
    sealSymbol: '🌅',
    frameAsset: '/templates/zen_long_08e1e779-19ec-400f-b44c-3505cf1c83fa.jpeg',
    description: 'Màu ấm hoàng hôn mang lại cảm giác bình yên và ấm áp cho ngày chung đôi.',
    tag: 'Hoàng Hôn'
  }
];

const ALL_MASTER_TEMPLATES = [
  ...cineloveTemplates,
  ...chungdoiUnifiedTemplates,
  ...zenloveCurated
];

console.log(`Generated ${ALL_MASTER_TEMPLATES.length} master templates without duplicates!`);
console.log(`- CineLove: ${cineloveTemplates.length}`);
console.log(`- ChungDoi Unified: ${chungdoiUnifiedTemplates.length}`);
console.log(`- ZenLove: ${zenloveCurated.length}`);

fs.writeFileSync('scripts/master-templates.json', JSON.stringify(ALL_MASTER_TEMPLATES, null, 2));
console.log('Saved to scripts/master-templates.json');
