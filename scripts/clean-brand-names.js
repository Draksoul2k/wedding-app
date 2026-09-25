const fs = require('fs');

let content = fs.readFileSync('src/constants/templates.ts', 'utf8');

// Clean all remaining CineLove and ZenLove in descriptions
content = content.replace(/CineLove\s*-\s*/g, '');
content = content.replace(/ZenLove\s*-\s*/g, '');
content = content.replace(/từ CineLove/g, 'phong cách điện ảnh');
content = content.replace(/từ ZenLove/g, 'phong cách tối giản');
content = content.replace(/CineLove/g, 'Điện Ảnh');
content = content.replace(/ZenLove/g, 'Tối Giản Mộc');

fs.writeFileSync('src/constants/templates.ts', content, 'utf8');

// Verify
const countCine = (content.match(/CineLove/gi) || []).length;
const countZen = (content.match(/ZenLove/gi) || []).length;
const countMot = (content.match(/Một Đời/gi) || []).length;
console.log('Verification:');
console.log('CineLove:', countCine);
console.log('ZenLove:', countZen);
console.log('Một Đời:', countMot);
