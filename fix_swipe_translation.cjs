const fs = require('fs');

let dataTs = fs.readFileSync('src/data.ts', 'utf8');

const enMissing = `
    'home.swipe': 'Swipe to explore',
`;

const frMissing = `
    'home.swipe': 'Glisser pour explorer',
`;

dataTs = dataTs.replace(/'nav\.portal': 'Code',/, enMissing + `    'nav.portal': 'Code',`);
dataTs = dataTs.replace(/'nav\.portal': 'Code',/, frMissing + `    'nav.portal': 'Code',`);
fs.writeFileSync('src/data.ts', dataTs);

let home = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
home = home.replace(/Swipe to explore/g, "{t('home.swipe')}");
fs.writeFileSync('src/pages/HomePage.tsx', home);
