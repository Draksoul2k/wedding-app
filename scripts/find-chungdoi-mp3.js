const fs = require('fs');
const findFiles = (dir) => {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const res = dir + '/' + d.name;
    return d.isDirectory() ? findFiles(res) : res;
  });
};
const logs = findFiles('C:/Users/Admin/.gemini/antigravity/brain/9a0134c6-2465-4df9-bb85-e20cccae71b8/.system_generated/steps');
let found = new Set();
logs.forEach(f => {
  if (f.endsWith('.md') || f.endsWith('.txt')) {
    const txt = fs.readFileSync(f, 'utf8');
    const m = txt.match(/https?:\/\/[^\s"'<>]+\.(?:mp3|m4a|aac)/gi);
    if (m) m.forEach(url => found.add(url));
  }
});
console.log('All audio URLs found:', [...found]);
