const fs = require('fs');
let data = fs.readFileSync('src/components/Header.tsx', 'utf8');

data = data.replace(
/\{t\('lang\.switch'\)\}\n          <\/button>/g,
`{lang === 'en' ? 'FR' : 'EN'}\n          </button>`
);
data = data.replace(
/Request Quote/g,
`{t('nav.quote')}`
);

fs.writeFileSync('src/components/Header.tsx', data);

let dataTs = fs.readFileSync('src/data.ts', 'utf8');
const en = `
    'nav.quote': 'Request Quote',
`;
const fr = `
    'nav.quote': 'Demander un devis',
`;
dataTs = dataTs.replace(/'portal\.loginbtn': 'Access Portal',/, en + `\n    'portal.loginbtn': 'Access Portal',`);
dataTs = dataTs.replace(/'portal\.loginbtn': 'Accéder au portail',/, fr + `\n    'portal.loginbtn': 'Accéder au portail',`);
fs.writeFileSync('src/data.ts', dataTs);
