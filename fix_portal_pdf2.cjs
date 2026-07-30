const fs = require('fs');
let data = fs.readFileSync('src/pages/PortalPage.tsx', 'utf8');

data = data.replace(
/You can access this document online at any time via our Client Portal\./g,
`{t('portal.online_instructions')}`
);
data = data.replace(
/<h4 className="text-\[10px\] font-bold text-navy uppercase tracking-widest mb-2">View Online<\/h4>/g,
`<h4 className="text-[10px] font-bold text-navy uppercase tracking-widest mb-2">{t('portal.view_online')}</h4>`
);
data = data.replace(
/Visit:/g,
`{t('portal.visit')}:`
);
data = data.replace(
/Reference Code:/g,
`{t('portal.ref_code_label')}:`
);

fs.writeFileSync('src/pages/PortalPage.tsx', data);

let dataTs = fs.readFileSync('src/data.ts', 'utf8');

const en = `
    'portal.online_instructions': 'You can access this document online at any time via our Client Portal.',
    'portal.view_online': 'View Online',
    'portal.visit': 'Visit',
    'portal.ref_code_label': 'Reference Code',
`;
const fr = `
    'portal.online_instructions': 'Vous pouvez accéder à ce document en ligne à tout moment via notre Portail Client.',
    'portal.view_online': 'Voir en ligne',
    'portal.visit': 'Visitez',
    'portal.ref_code_label': 'Code de référence',
`;

dataTs = dataTs.replace(/'portal\.loginbtn': 'Access Portal',/, en + `\n    'portal.loginbtn': 'Access Portal',`);
dataTs = dataTs.replace(/'portal\.loginbtn': 'Accéder au portail',/, fr + `\n    'portal.loginbtn': 'Accéder au portail',`);

fs.writeFileSync('src/data.ts', dataTs);
