const fs = require('fs');

const path1064 = 'C:/Users/Admin/.gemini/antigravity/brain/9a0134c6-2465-4df9-bb85-e20cccae71b8/.system_generated/steps/1064/content.md';
if (fs.existsSync(path1064)) {
  const c = fs.readFileSync(path1064, 'utf8');
  const matches = c.match(/https?:\/\/[^\s"'<>]+\.(?:mp3|m4a|aac|wav|ogg)/gi) || [];
  console.log('Matches in 1064:', matches);
}

const path1050 = 'C:/Users/Admin/.gemini/antigravity/brain/9a0134c6-2465-4df9-bb85-e20cccae71b8/.system_generated/steps/1050/content.md';
if (fs.existsSync(path1050)) {
  const c = fs.readFileSync(path1050, 'utf8');
  const matches = c.match(/https?:\/\/[^\s"'<>]+\.(?:mp3|m4a|aac|wav|ogg)/gi) || [];
  console.log('Matches in 1050:', matches);
}
