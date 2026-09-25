const fs = require('fs');

const content = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/9a0134c6-2465-4df9-bb85-e20cccae71b8/.system_generated/steps/1064/content.md', 'utf8');

console.log('MotDoi mau-thiep content length:', content.length);

// Find all template links
const templateMatches = [...content.matchAll(/href=["'](\/tao-thiep\?template=[^"']+|\/thiep-moi\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log('Found template links count:', templateMatches.length);

const items = [];
const imgMatches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/gi)];
imgMatches.forEach(m => {
  if (m[1].includes('motdoi') || m[1].includes('b-cdn')) {
    items.push({ src: m[1], alt: m[2] });
  }
});

console.log('MotDoi template images and titles:');
items.forEach((it, i) => console.log(`${i+1}. [${it.alt}] => ${it.src}`));
fs.writeFileSync('scripts/motdoi-templates.json', JSON.stringify(items, null, 2));
