const fs = require('fs');

const content = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/9a0134c6-2465-4df9-bb85-e20cccae71b8/.system_generated/steps/1064/content.md', 'utf8');

// Find all occurrences of img with their nearby text
const imgUrls = [
  '63f585cc-9725-4b2a-a0f3-2d232e283701.png',
  '4d91e1fe-9226-4c55-b7e6-9c2911dbc7e8.png',
  '1aab809c-434f-4726-8fa7-1b835a2cea8c.png',
  '9cd49fff-f2b4-4826-8837-9f0c8ea79bc9.png',
  '54ee81b2-4763-4250-8c66-939e4f6b35cb.png',
  'a3d4f016-579c-4f09-b875-1919789b082a.png',
  '27a22ba4-7448-45c6-8933-d2137058cc2c.png',
  'c911d9bd-298a-4167-8b7d-31845d2fcad3.png',
  'd5208918-f6cc-4de8-976a-73148c4fad21.png',
  '48fac11a-c227-4306-b965-bc7fde11a9d4.png',
  '2daed70a-1345-4ca4-929d-5707af5cfc1b.png',
  '132adc06-d71b-4971-b2f6-9a8ff26f2417.png',
  '392f3154-1bb7-42fe-960a-242ded1f2adc.png',
  'e5d028f0-399d-41d2-b0f1-4e0f455d9d78.png'
];

imgUrls.forEach(id => {
  const pos = content.indexOf(id);
  if (pos !== -1) {
    const snippet = content.substring(Math.max(0, pos - 150), Math.min(content.length, pos + 300));
    // strip tags
    const clean = snippet.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log(`[${id}]:\n  ${clean}\n`);
  }
});
