const fs = require('fs');

const content = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/9a0134c6-2465-4df9-bb85-e20cccae71b8/.system_generated/steps/1064/content.md', 'utf8');

// Search for __NEXT_DATA__
const nextDataMatch = content.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
if (nextDataMatch) {
  console.log('Found NEXT_DATA in mau-thiep!');
  const data = JSON.parse(nextDataMatch[1]);
  fs.writeFileSync('scripts/motdoi-pageprops.json', JSON.stringify(data.props?.pageProps, null, 2));
  console.log('PageProps keys:', Object.keys(data.props?.pageProps || {}));
} else {
  console.log('No NEXT_DATA. Let us search for strings in HTML:');
  const matches = [...content.matchAll(/(\/tao-thiep\?template=[^"'\s>]+)/g)].map(m => m[1]);
  console.log('Template URLs:', [...new Set(matches)]);

  const imgUrls = [...content.matchAll(/(https:\/\/[^"'\s>]+\.(?:png|jpg|jpeg|webp))/gi)].map(m => m[1]);
  console.log('Images count:', imgUrls.length);
  const cdnImgs = [...new Set(imgUrls.filter(u => u.includes('motdoi') || u.includes('b-cdn')))];
  console.log('MotDoi CDN images:', cdnImgs);
}
