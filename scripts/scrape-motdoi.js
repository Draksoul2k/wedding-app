const fs = require('fs');

const content = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/9a0134c6-2465-4df9-bb85-e20cccae71b8/.system_generated/steps/1050/content.md', 'utf8');

// Find all links on motdoi.com.vn
const links = [...content.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Unique links on MotDoi:');
const uniqueLinks = [...new Set(links)];
uniqueLinks.filter(l => !l.startsWith('#') && !l.startsWith('tel:') && !l.startsWith('mailto:')).forEach(l => console.log(' - ', l));
