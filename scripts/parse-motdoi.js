const fs = require('fs');

const content = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/9a0134c6-2465-4df9-bb85-e20cccae71b8/.system_generated/steps/1050/content.md', 'utf8');

console.log('MotDoi length:', content.length);
const nextDataMatch = content.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
if (nextDataMatch) {
  try {
    const data = JSON.parse(nextDataMatch[1]);
    console.log('MotDoi NEXT_DATA pageProps keys:', Object.keys(data.props?.pageProps || {}));
    fs.writeFileSync('scripts/motdoi-data.json', JSON.stringify(data.props?.pageProps, null, 2));
    console.log('Saved motdoi-data.json');
  } catch (e) {
    console.error('JSON error:', e.message);
  }
} else {
  console.log('No NEXT_DATA. Looking for templates in markdown / html...');
  const imgs = [...new Set([...content.matchAll(/(https?:\/\/[^\s"'<>]+\.(?:webp|png|jpg|jpeg))/gi)].map(m => m[1]))];
  console.log('Found images:', imgs);
}
