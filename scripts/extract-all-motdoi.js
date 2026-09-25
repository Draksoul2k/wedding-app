const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const content = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/9a0134c6-2465-4df9-bb85-e20cccae71b8/.system_generated/steps/1064/content.md', 'utf8');

// Regex for card matching
const cardRegex = /<a[^>]+href="\/mau-thiep\/([^"]+)"[\s\S]*?<\/a>/gi;
const templates = [];

let cardMatch;
while ((cardMatch = cardRegex.exec(content)) !== null) {
  const cardHtml = cardMatch[0];
  const slugMatch = cardHtml.match(/href="\/mau-thiep\/([^"]+)"/);
  const imgMatch = cardHtml.match(/<img[^>]+src="([^">]+)"/);
  const tagMatch = cardHtml.match(/<span class="truncate">([^<]+)<\/span>/);
  const nameMatch = cardHtml.match(/<p class="line-clamp-2[^>]*>([^<]+)<\/p>/);
  const descMatch = cardHtml.match(/<p class="mt-1 line-clamp-2[^>]*>([^<]+)<\/p>/);

  if (slugMatch && imgMatch && nameMatch) {
    const slug = slugMatch[1];
    // avoid duplicates if any
    if (!templates.find(t => t.slug === slug)) {
      templates.push({
        slug,
        img: imgMatch[1],
        tag: tagMatch ? tagMatch[1].trim() : '',
        name: nameMatch[1].trim(),
        description: descMatch ? descMatch[1].trim() : ''
      });
    }
  }
}

console.log(`Found ${templates.length} distinct templates on MotDoi:`);
templates.forEach((t, i) => {
  console.log(`${i+1}. [${t.slug}] ${t.name} (${t.tag}): ${t.img}`);
});

fs.writeFileSync('scripts/motdoi-extracted.json', JSON.stringify(templates, null, 2));
