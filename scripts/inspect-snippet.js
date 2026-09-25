const fs = require('fs');

const content = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/9a0134c6-2465-4df9-bb85-e20cccae71b8/.system_generated/steps/1064/content.md', 'utf8');

const pos = content.indexOf('63f585cc-9725-4b2a-a0f3-2d232e283701.png');
console.log(content.substring(pos, pos + 800));
