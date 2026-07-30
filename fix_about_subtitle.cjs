const fs = require('fs');

let dataTs = fs.readFileSync('src/data.ts', 'utf8');
const en = `
    'comp.about.sub': 'Integrated excellence in engineering and fit‑out',
`;
const fr = `
    'comp.about.sub': 'Excellence intégrée en ingénierie et aménagement',
`;
dataTs = dataTs.replace(/'portal\.loginbtn': 'Access Portal',/, en + `\n    'portal.loginbtn': 'Access Portal',`);
dataTs = dataTs.replace(/'portal\.loginbtn': 'Accéder au portail',/, fr + `\n    'portal.loginbtn': 'Accéder au portail',`);
fs.writeFileSync('src/data.ts', dataTs);

let dataAbout = fs.readFileSync('src/components/About.tsx', 'utf8');
dataAbout = dataAbout.replace(/Integrated excellence in engineering and fit‑out/, `{t('comp.about.sub')}`);
fs.writeFileSync('src/components/About.tsx', dataAbout);
