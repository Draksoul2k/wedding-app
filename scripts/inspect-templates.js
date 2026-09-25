const fs = require('fs');
const content = fs.readFileSync('src/constants/templates.ts', 'utf8');

const regex = /\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",[\s\S]*?"source":\s*"([^"]+)"/g;
let m;
const list = [];
while ((m = regex.exec(content)) !== null) {
  list.push({ id: m[1], name: m[2], source: m[3] });
}
console.log(`Total master templates: ${list.length}`);
list.forEach((t, i) => console.log(`${i+1}. [${t.source}] ${t.id} - ${t.name}`));
