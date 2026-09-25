const fs = require('fs');

const motdoiTemplates = [
  {
    "id": "motdoi-duyen-dang-01",
    "name": "Một Đời - Duyên Dáng 01",
    "category": "toi_gian",
    "source": "motdoi",
    "layoutType": "zenlove_minimal",
    "primaryColor": "#991b1b",
    "accentColor": "#d4af37",
    "bgTexture": "#fafaf9",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-red-900 to-rose-950",
    "sealSymbol": "💌",
    "frameAsset": "/templates/motdoi/graceful-01.png",
    "description": "Nền trắng tinh tế, tông đỏ son trầm sang trọng. Mở phong bì lãng mạn để khám phá thiệp — đơn giản, cổ điển và đầy cảm xúc.",
    "tag": "Tối giản",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-duyen-dang-04",
    "name": "Một Đời - Duyên Dáng 04 Album",
    "category": "hien_dai",
    "source": "motdoi",
    "layoutType": "chungdoi_magazine",
    "primaryColor": "#78350f",
    "accentColor": "#fbbf24",
    "bgTexture": "#fdfbf7",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-amber-800 to-amber-950",
    "sealSymbol": "📖",
    "frameAsset": "/templates/motdoi/graceful-04.jpg",
    "description": "Duyên dáng 04 mang tinh thần của một cuốn album cưới được lưu giữ qua năm tháng, kết hợp nền giấy kem, sắc vàng champagne và những khung ảnh nghiêng tự nhiên.",
    "tag": "Sang trọng",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-truyen-thong-01",
    "name": "Một Đời - Truyền Thống 01",
    "category": "truyen_thong",
    "source": "motdoi",
    "layoutType": "chungdoi_traditional",
    "primaryColor": "#b91c1c",
    "accentColor": "#f59e0b",
    "bgTexture": "#fef2f2",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-red-800 to-rose-900",
    "sealSymbol": "囍",
    "frameAsset": "/templates/motdoi/traditional-01.png",
    "description": "Sang trọng, cổ điển — nền kem thanh lịch, sắc đỏ thẫm và chữ Hỷ truyền thống, mang đậm nét văn hóa Á Đông.",
    "tag": "Truyền thống",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-hoa-dau-biec",
    "name": "Một Đời - Hoa Đậu Biếc",
    "category": "hoa_la",
    "source": "motdoi",
    "layoutType": "botanical_garden",
    "primaryColor": "#1e40af",
    "accentColor": "#93c5fd",
    "bgTexture": "#eff6ff",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-blue-800 to-indigo-950",
    "sealSymbol": "🌸",
    "frameAsset": "/templates/motdoi/hoa-dau-biec.jpg",
    "description": "Hoa Đậu Biếc mang sắc xanh thanh lịch, họa tiết hoa mềm mại và vẻ lãng mạn đầy tinh tế.",
    "tag": "Hoa lá",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-duyen-dang-02",
    "name": "Một Đời - Duyên Dáng 02 Sáp Niêm",
    "category": "hien_dai",
    "source": "motdoi",
    "layoutType": "full_long_card",
    "primaryColor": "#831843",
    "accentColor": "#f472b6",
    "bgTexture": "#fdf2f8",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-rose-900 to-pink-950",
    "sealSymbol": "💍",
    "frameAsset": "/templates/motdoi/graceful-02.png",
    "description": "Mẫu thiệp cổ điển với phong bì niêm phong sáp, tông màu rượu vang sâu, tinh tế và sang trọng.",
    "tag": "Sang trọng",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-duyen-dang-pastel",
    "name": "Một Đời - Duyên Dáng Pastel",
    "category": "hoa_la",
    "source": "motdoi",
    "layoutType": "botanical_garden",
    "primaryColor": "#db2777",
    "accentColor": "#fbcfe8",
    "bgTexture": "#fff1f2",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-pink-600 to-rose-700",
    "sealSymbol": "🎀",
    "frameAsset": "/templates/motdoi/graceful-pastel.jpg",
    "description": "Mẫu thiệp cưới hồng pastel thanh lịch với hiệu ứng mở cánh, chất liệu giấy mềm, phong bì ảnh và album kỷ niệm lãng mạn.",
    "tag": "Pastel",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-thien-nhien-01",
    "name": "Một Đời - Thiên Nhiên 01",
    "category": "hoa_la",
    "source": "motdoi",
    "layoutType": "botanical_garden",
    "primaryColor": "#15803d",
    "accentColor": "#86efac",
    "bgTexture": "#f0fdf4",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-green-800 to-emerald-950",
    "sealSymbol": "🌿",
    "frameAsset": "/templates/motdoi/nature-01.png",
    "description": "Hơi thở thiên nhiên thuần khiết — xanh mát, ấm áp và lãng mạn như những khoảnh khắc tình yêu được giữ mãi trong tim.",
    "tag": "Thiên nhiên",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-thanh-manh",
    "name": "Một Đời - Thanh Mảnh",
    "category": "toi_gian",
    "source": "motdoi",
    "layoutType": "zenlove_minimal",
    "primaryColor": "#374151",
    "accentColor": "#9ca3af",
    "bgTexture": "#f9fafb",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-gray-700 to-stone-900",
    "sealSymbol": "✒️",
    "frameAsset": "/templates/motdoi/thanh-manh.jpg",
    "description": "Mẫu thiệp cưới thanh lịch với nền trắng kem, điểm nhấn đỏ rượu, chữ viết tay mềm mại và bố cục ảnh thoáng nhẹ.",
    "tag": "Tối giản",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-ho-chieu",
    "name": "Một Đời - Hộ Chiếu Tình Yêu",
    "category": "hien_dai",
    "source": "motdoi",
    "layoutType": "cinelove_movie",
    "primaryColor": "#1e3a8a",
    "accentColor": "#f59e0b",
    "bgTexture": "#eff6ff",
    "cardBg": "#1e3a8a",
    "envelopeGradient": "from-blue-900 to-slate-950",
    "sealSymbol": "✈️",
    "frameAsset": "/templates/motdoi/passport.png",
    "description": "Một tấm thiệp như cuốn hộ chiếu tình yêu, mở ra chuyến bay của hai trái tim đến miền hạnh phúc, nơi lời hẹn ước hóa thành hành trình mãi mãi.",
    "tag": "Hộ Chiếu",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-hoa-be",
    "name": "Một Đời - Hoa Be Ấm Áp",
    "category": "hoa_la",
    "source": "motdoi",
    "layoutType": "botanical_garden",
    "primaryColor": "#78350f",
    "accentColor": "#fde68a",
    "bgTexture": "#fffbeb",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-stone-700 to-amber-950",
    "sealSymbol": "🌼",
    "frameAsset": "/templates/motdoi/hoa-be.jpg",
    "description": "Mẫu thiệp cưới màu be thanh lịch, giữ nguyên bố cục giàu chi tiết của Hoa Đậu Biếc với hoa màu ivory, sắc champagne, nâu mocha và nền giấy ấm.",
    "tag": "Hoa Be",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-duyen-dang-03",
    "name": "Một Đời - Duyên Dáng 03 Sen Hồng",
    "category": "truyen_thong",
    "source": "motdoi",
    "layoutType": "chungdoi_traditional",
    "primaryColor": "#991b1b",
    "accentColor": "#f59e0b",
    "bgTexture": "#fef2f2",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-red-900 to-rose-950",
    "sealSymbol": "🪷",
    "frameAsset": "/templates/motdoi/graceful-03.png",
    "description": "Sắc đỏ trầm, nền kem thanh nhã, hoa sen duyên dáng, gợi không khí cưới truyền thống.",
    "tag": "Hoa Sen",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-chibi",
    "name": "Một Đời - Chibi Hạnh Phúc",
    "category": "hien_dai",
    "source": "motdoi",
    "layoutType": "chungdoi_traditional",
    "primaryColor": "#dc2626",
    "accentColor": "#fde047",
    "bgTexture": "#fef2f2",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-red-600 to-rose-700",
    "sealSymbol": "🥰",
    "frameAsset": "/templates/motdoi/chibi.png",
    "description": "Thiệp cưới chibi đáng yêu, khắc họa cô dâu chú rể sinh động, mang nét vui tươi và dấu ấn riêng.",
    "tag": "Chibi",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-lang-man-gold",
    "name": "Một Đời - Lãng Mạn Gold Champagne",
    "category": "hien_dai",
    "source": "motdoi",
    "layoutType": "full_long_card",
    "primaryColor": "#b45309",
    "accentColor": "#fcd34d",
    "bgTexture": "#fffbeb",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-amber-700 to-yellow-900",
    "sealSymbol": "✨",
    "frameAsset": "/templates/motdoi/romantic-gold.png",
    "description": "Vàng champagne lấp lánh trên nền kem sáng sang trọng — ấm áp, tinh tế, dành cho lễ cưới muốn toát lên vẻ cao quý và đặc biệt.",
    "tag": "Gold",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-suong-mai",
    "name": "Một Đời - Sương Mai Tinh Khôi",
    "category": "toi_gian",
    "source": "motdoi",
    "layoutType": "zenlove_minimal",
    "primaryColor": "#0f766e",
    "accentColor": "#99f6e4",
    "bgTexture": "#f0fdfa",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-teal-800 to-cyan-950",
    "sealSymbol": "💧",
    "frameAsset": "/templates/motdoi/suong-mai.png",
    "description": "Sương Mai mang vẻ tinh khôi của buổi sớm, dịu dàng như lời hẹn đầu ngày, nơi tình yêu nở trong ánh sáng mỏng, yên bình và đầy hy vọng.",
    "tag": "Sương Mai",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-lang-man-hoa-hong",
    "name": "Một Đời - Lãng Mạn Hoa Hồng Đào",
    "category": "hoa_la",
    "source": "motdoi",
    "layoutType": "botanical_garden",
    "primaryColor": "#e11d48",
    "accentColor": "#fecdd3",
    "bgTexture": "#fff1f2",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-rose-600 to-pink-800",
    "sealSymbol": "🌹",
    "frameAsset": "/templates/motdoi/romantic-rose.png",
    "description": "Tông hồng đào ngọt ngào, nền giấy kem sáng với họa tiết cành lá — lãng mạn, nữ tính, phù hợp cho đám cưới phong cách mùa xuân.",
    "tag": "Hoa Hồng",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-song-hy",
    "name": "Một Đời - Song Hỷ Á Đông",
    "category": "truyen_thong",
    "source": "motdoi",
    "layoutType": "chungdoi_traditional",
    "primaryColor": "#b91c1c",
    "accentColor": "#fbbf24",
    "bgTexture": "#fef2f2",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-red-800 to-red-950",
    "sealSymbol": "囍",
    "frameAsset": "/templates/motdoi/song-hy.png",
    "description": "Song Hỷ mang nét đẹp truyền thống Á Đông, sắc đỏ may mắn, họa tiết tinh tế, gửi gắm lời chúc trăm năm hạnh phúc.",
    "tag": "Song Hỷ",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-xanh-thanh-lich",
    "name": "Một Đời - Xanh Thanh Lịch",
    "category": "hoa_la",
    "source": "motdoi",
    "layoutType": "botanical_garden",
    "primaryColor": "#064e3b",
    "accentColor": "#a7f3d0",
    "bgTexture": "#ecfdf5",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-emerald-900 to-teal-950",
    "sealSymbol": "🍃",
    "frameAsset": "/templates/motdoi/elegant-green.png",
    "description": "Xanh rừng thẫm sâu với họa tiết hoa trắng nổi bật — trang nhã, cổ điển, ấn tượng cho đám cưới muốn vẻ đẹp trưởng thành và bí ẩn.",
    "tag": "Xanh Rừng",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-do-thanh-lich",
    "name": "Một Đời - Đỏ Thanh Lịch Quý Phái",
    "category": "truyen_thong",
    "source": "motdoi",
    "layoutType": "full_long_card",
    "primaryColor": "#881337",
    "accentColor": "#fca5a5",
    "bgTexture": "#fff1f2",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-rose-900 to-stone-950",
    "sealSymbol": "👑",
    "frameAsset": "/templates/motdoi/elegant-red.png",
    "description": "Đỏ thẫm đam mê trên nền tối sang trọng, họa tiết hoa tinh xảo — mạnh mẽ, nồng nàn, tạo ấn tượng không thể quên cho ngày trọng đại.",
    "tag": "Đỏ Thẫm",
    "isLongThumbnail": true
  },
  {
    "id": "motdoi-tap-chi",
    "name": "Một Đời - Tạp Chí Ivory Thời Thượng",
    "category": "hien_dai",
    "source": "motdoi",
    "layoutType": "chungdoi_magazine",
    "primaryColor": "#292524",
    "accentColor": "#d97706",
    "bgTexture": "#fafaf9",
    "cardBg": "#ffffff",
    "envelopeGradient": "from-stone-800 to-zinc-950",
    "sealSymbol": "🗞️",
    "frameAsset": "/templates/motdoi/edition-ivory.png",
    "description": "Mẫu thiệp mang phong cách tạp chí thanh lịch, giấy ngà ấm, mực sâu và điểm nhấn đất nung tinh tế.",
    "tag": "Tạp Chí",
    "isLongThumbnail": true
  }
];

let content = fs.readFileSync('src/constants/templates.ts', 'utf8');

// 1. Update source type definition
content = content.replace(
  "source: 'chungdoi' | 'zenlove' | 'cinelove';",
  "source: 'chungdoi' | 'zenlove' | 'cinelove' | 'motdoi';"
);

// 2. Fix broken image paths
content = content.replace('/templates/classic_red.webp', '/templates/dragon_phoenix_red.webp');
content = content.replace('/templates/gold_crest_red.webp', '/templates/baroque_gold.webp');
content = content.replace('/templates/boho_floral_terracotta.webp', '/templates/boho_floral_brown.webp');
content = content.replace('/templates/boho_floral_navy.webp', '/templates/chateau_blue.webp');
content = content.replace(/\/templates\/minimalism_black\.webp/g, '/templates/dragon_phoenix_black.webp');
content = content.replace(/\/templates\/vintage_rose_pink\.webp/g, '/templates/cherry_blossom_pink.webp');
content = content.replace('/templates/vintage_rose_burgundy.webp', '/templates/silk_ribbon_darkred.webp');
content = content.replace(/\/templates\/editorial_classic_black\.webp/g, '/templates/minimalism_darkblue.webp');

content = content.replace(
  '/templates/zen_long_03feb3d1-a100-4972-a64a-879c038d14d4.jpeg',
  '/templates/zen_long_03feb3d1-a100-4972-a64a-879c038d14d4.webp'
);
content = content.replace(
  '/templates/zen_long_0434ff1f-f435-49df-8bca-3fb1dfa524e9.jpeg',
  '/templates/zen_long_1c312850-dfbb-463a-98a7-729d5b8d7df6.webp'
);
content = content.replace(
  '/templates/zen_long_08e1e779-19ec-400f-b44c-3505cf1c83fa.jpeg',
  '/templates/zen_long_1f422dc5-7795-48c4-8e1a-48cc8421dbc3.webp'
);

// Ensure zen templates have isLongThumbnail: true
content = content.replace(
  `"tag": "Zen Mộc"`,
  `"tag": "Zen Mộc",\n    "isLongThumbnail": true`
);
content = content.replace(
  `"tag": "Thảo Dược"`,
  `"tag": "Thảo Dược",\n    "isLongThumbnail": true`
);
content = content.replace(
  `"tag": "Hoàng Hôn"`,
  `"tag": "Hoàng Hôn",\n    "isLongThumbnail": true`
);

// 3. Append MotDoi templates before end of array "];"
const lastItemIdx = content.indexOf(`    "tag": "Hoàng Hôn",\n    "isLongThumbnail": true\n  }\n];`);
if (lastItemIdx !== -1) {
  const motdoiJson = motdoiTemplates.map(t => JSON.stringify(t, null, 4)).join(',\n');
  const replacement = `    "tag": "Hoàng Hôn",\n    "isLongThumbnail": true\n  },\n${motdoiJson}\n];`;
  content = content.replace(`    "tag": "Hoàng Hôn",\n    "isLongThumbnail": true\n  }\n];`, replacement);
} else {
  console.error('Could not find anchor to insert MotDoi templates');
  process.exit(1);
}

fs.writeFileSync('src/constants/templates.ts', content, 'utf8');
console.log('Successfully updated src/constants/templates.ts with fixes and 19 MotDoi templates!');
