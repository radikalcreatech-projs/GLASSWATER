const fs = require('fs');

let dataTs = fs.readFileSync('src/data.ts', 'utf8');

const lines = dataTs.split('\n');
const seenEn = new Set();
const seenFr = new Set();
let currentLang = '';
let finalLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('en: {')) {
    currentLang = 'en';
    finalLines.push(line);
    continue;
  }
  if (line.includes('fr: {')) {
    currentLang = 'fr';
    finalLines.push(line);
    continue;
  }
  
  if (currentLang && line.includes(':')) {
    const match = line.match(/^\s*'([^']+)'\s*:/);
    if (match) {
      const key = match[1];
      if (currentLang === 'en') {
        if (seenEn.has(key)) {
          // duplicate
          continue;
        }
        seenEn.add(key);
      } else if (currentLang === 'fr') {
        if (seenFr.has(key)) {
          continue;
        }
        seenFr.add(key);
      }
    }
  }
  finalLines.push(line);
}

fs.writeFileSync('src/data.ts', finalLines.join('\n'));
