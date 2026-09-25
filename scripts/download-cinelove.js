const fs = require('fs');
const path = require('path');
const https = require('https');

const cineloveData = JSON.parse(fs.readFileSync('scripts/cinelove-data.json', 'utf8'));
const destDir = path.join(__dirname, '..', 'public', 'templates', 'cinelove');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve(dest);
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return reject(new Error(`Failed with HTTP ${response.statusCode} for ${url}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function run() {
  console.log(`Starting download for ${cineloveData.templates.length} CineLove templates...`);
  const results = [];

  for (let i = 0; i < cineloveData.templates.length; i++) {
    const tmpl = cineloveData.templates[i];
    const longPath = tmpl.longThumbnail;
    const thumbPath = tmpl.thumbnail;
    
    // Choose primary asset
    const assetRel = longPath || thumbPath;
    if (!assetRel) continue;

    const ext = path.extname(assetRel) || '.webp';
    const filename = `cinelove_${tmpl.slug}${ext}`;
    const destPath = path.join(destDir, filename);
    const cdnUrl = `https://assets.cinelove.me/${assetRel}`;

    try {
      await downloadFile(cdnUrl, destPath);
      console.log(`✓ [${i+1}/${cineloveData.templates.length}] Downloaded ${filename}`);
      results.push({
        id: `cine-${tmpl.slug}`,
        name: `CineLove - ${tmpl.templateName}`,
        slug: tmpl.slug,
        type: tmpl.templateType || 'basic',
        localAsset: `/templates/cinelove/${filename}`,
        viewCount: tmpl.viewCount,
        usageCount: tmpl.usageCount
      });
    } catch (err) {
      console.error(`✗ Error downloading ${tmpl.slug}:`, err.message);
    }
  }

  fs.writeFileSync('scripts/cinelove-downloaded.json', JSON.stringify(results, null, 2));
  console.log(`Finished! Successfully saved ${results.length} templates.`);
}

run();
