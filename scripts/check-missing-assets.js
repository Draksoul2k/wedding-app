const fs = require('fs');

const content = fs.readFileSync('src/constants/templates.ts', 'utf8');

const regex = /"?frameAsset"?:\s*['"]([^'"]+)['"]/g;
let m;
const missing = [];
const all = [];

while ((m = regex.exec(content)) !== null) {
  const url = m[1];
  all.push(url);
  if (url.startsWith('/')) {
    const local = 'public' + url;
    if (!fs.existsSync(local)) {
      missing.push({ url, local });
    }
  }
}

console.log(`Checked ${all.length} frameAsset references. Found ${missing.length} missing files:`);
missing.forEach(item => {
  console.log(`- ${item.url}`);
});
