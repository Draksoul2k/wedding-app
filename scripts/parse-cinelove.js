const fs = require('fs');

const content = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/9a0134c6-2465-4df9-bb85-e20cccae71b8/.system_generated/steps/977/content.md', 'utf8');

const nextDataMatch = content.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
if (nextDataMatch) {
  try {
    const data = JSON.parse(nextDataMatch[1]);
    console.log('Page Props keys:', Object.keys(data.props?.pageProps || {}));
    fs.writeFileSync('scripts/cinelove-data.json', JSON.stringify(data.props?.pageProps, null, 2));
    console.log('Saved cinelove-data.json');
  } catch (e) {
    console.error('JSON parse error:', e.message);
  }
} else {
  console.log('No NEXT_DATA script');
}
