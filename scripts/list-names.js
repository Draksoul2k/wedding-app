const fs = require('fs');
const content = fs.readFileSync('src/constants/templates.ts', 'utf8');

const regex = /"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)"/g;
let m;
let i = 1;
while ((m = regex.exec(content)) !== null) {
  console.log(`${i++}. [${m[1]}] -> ${m[2]}`);
}
