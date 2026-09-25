const fs = require('fs');
const https = require('https');
const path = require('path');

const repos = [
  { repo: 'vinitshahdeo/Wedding-Invitation', branch: 'master' },
  { repo: 'heejin-hwang/mobile-wedding-invitation', branch: 'main' },
  { repo: 'LeeKyuHyuk/wedding-invitation', branch: 'master' },
  { repo: 'juhonamnam/wedding-invitation', branch: 'main' },
  { repo: 'kimyoon21/wedding', branch: 'main' },
  { repo: 'zouyaoji/wedding-invitation', branch: 'master' },
  { repo: 'salmanagustian/wedding-digital-invitation', branch: 'master' },
  { repo: 'sdprdh/wedding-invitation', branch: 'main' },
  { repo: 'S-jooyoung/WEDDING_INVITATION', branch: 'main' },
  { repo: 'JaminQ/wedding-invitation', branch: 'master' },
  { repo: 'danixsofyan/wedding-invitation', branch: 'main' },
  { repo: 'archakNath/wedding-invitation-website', branch: 'main' },
  { repo: 'jw-koo/wedding-invitation', branch: 'main' },
  { repo: 'wzulfikar/nextjs-wedding-invite', branch: 'master' },
  { repo: 'sakeenah-wedding/template', branch: 'main' }
];

function getTree(r) {
  return new Promise((resolve) => {
    https.get(`https://api.github.com/repos/${r.repo}/git/trees/${r.branch}?recursive=1`, {
      headers: { 'User-Agent': 'WeddingApp' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const audios = (json.tree || []).filter(f => f.path.match(/\.(mp3|m4a|wav)$/i));
          resolve(audios.map(a => ({
            repo: r.repo,
            branch: r.branch,
            path: a.path,
            url: `https://raw.githubusercontent.com/${r.repo}/${r.branch}/${a.path}`,
            size: a.size
          })));
        } catch(e) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

(async () => {
  const allAudios = [];
  for (const r of repos) {
    const list = await getTree(r);
    allAudios.push(...list);
  }
  console.log(`Found ${allAudios.length} audio files in wedding repos:`);
  allAudios.forEach(a => console.log(a.path, a.size, 'bytes ->', a.url));
  fs.writeFileSync('scripts/wedding-audios.json', JSON.stringify(allAudios, null, 2));
})();
