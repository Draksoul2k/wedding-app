const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'constants', 'templates.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Ensure botanical_garden is in TemplateLayoutType
if (!content.includes("'botanical_garden'")) {
  content = content.replace(
    "  | 'chungdoi_magazine'",
    "  | 'chungdoi_magazine'\n  | 'botanical_garden'"
  );
}

// Add dressCode to DEFAULT_WEDDING_DATA
const oldEnd = `  enableRSVP: true,\r\n  thankYouMessage: 'Sự hiện diện và lời chúc phúc của Quý Khách là niềm vinh hạnh to lớn cho gia đình chúng tôi!'\r\n};`;
const oldEndLF = `  enableRSVP: true,\n  thankYouMessage: 'Sự hiện diện và lời chúc phúc của Quý Khách là niềm vinh hạnh to lớn cho gia đình chúng tôi!'\n};`;

const newDressCode = `  enableRSVP: true,
  thankYouMessage: 'Sự hiện diện và lời chúc phúc của Quý Khách là niềm vinh hạnh to lớn cho gia đình chúng tôi!',

  dressCode: {
    enabled: true,
    title: 'Dress Code & Gợi Ý Trang Phục',
    description: 'Để buổi tiệc thêm phần trang trọng và những bức hình kỷ niệm thật hài hòa, kính mong Quý Khách ưu tiên trang phục theo các gam màu gợi ý dưới đây:',
    colors: [
      { name: 'Trắng Sữa', hex: '#FAF9F6' },
      { name: 'Be / Pastel', hex: '#EAD7C5' },
      { name: 'Nâu Đất', hex: '#C27D56' },
      { name: 'Xanh Sage', hex: '#8FA392' },
      { name: 'Vàng Cát', hex: '#D1AC00' }
    ]
  }
};`;

if (content.includes(oldEnd)) {
  content = content.replace(oldEnd, newDressCode);
  console.log('Replaced CRLF DEFAULT_WEDDING_DATA');
} else if (content.includes(oldEndLF)) {
  content = content.replace(oldEndLF, newDressCode);
  console.log('Replaced LF DEFAULT_WEDDING_DATA');
}

// Now let's distribute templates across the layouts!
// For floral templates (hoa_la): use 'botanical_garden'
// For editorial/modern: use 'chungdoi_magazine' or 'cinelove_movie'
// For zenlove templates: use 'zenlove_minimal' and 'botanical_garden'
// For cinelove templates: use 'cinelove_movie', 'full_long_card', and 'chungdoi_magazine'
// For truyen_thong: use 'chungdoi_traditional'
let parsedJson = null;
// Parse TEMPLATES array by regex
content = content.replace(/("category":\s*"hoa_la"[^}]+?"layoutType":\s*")([^"]+)(")/g, '$1botanical_garden$3');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated templates.ts!');
