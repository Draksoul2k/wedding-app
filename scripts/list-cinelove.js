const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scripts/cinelove-data.json', 'utf8'));

console.log('Total templates on CineLove:', data.templates.length);
data.templates.forEach((t, i) => {
  console.log((i + 1) + '. [' + t.slug + '] ' + t.templateName + ' (' + t.templateType + ')');
  console.log('   thumb: ' + t.thumbnail);
  console.log('   long:  ' + t.longThumbnail);
});
