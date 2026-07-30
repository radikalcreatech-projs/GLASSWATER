const fs = require('fs');

let dataTs = fs.readFileSync('src/data.ts', 'utf8');
const en = `
    'social.facebook': 'Facebook',
    'social.instagram': 'Instagram',
    'social.linkedin': 'LinkedIn',
    'social.whatsapp': 'WhatsApp',
`;
const fr = `
    'social.facebook': 'Facebook',
    'social.instagram': 'Instagram',
    'social.linkedin': 'LinkedIn',
    'social.whatsapp': 'WhatsApp',
`;
dataTs = dataTs.replace(/'portal\.loginbtn': 'Access Portal',/, en + `\n    'portal.loginbtn': 'Access Portal',`);
dataTs = dataTs.replace(/'portal\.loginbtn': 'Accéder au portail',/, fr + `\n    'portal.loginbtn': 'Accéder au portail',`);
fs.writeFileSync('src/data.ts', dataTs);

let dataFooter = fs.readFileSync('src/components/Footer.tsx', 'utf8');
dataFooter = dataFooter.replace(/>Facebook<\/a>/g, `>{t('social.facebook')}</a>`);
dataFooter = dataFooter.replace(/>Instagram<\/a>/g, `>{t('social.instagram')}</a>`);
dataFooter = dataFooter.replace(/>LinkedIn<\/a>/g, `>{t('social.linkedin')}</a>`);
dataFooter = dataFooter.replace(/WhatsApp\n/g, `{t('social.whatsapp')}\n`);
fs.writeFileSync('src/components/Footer.tsx', dataFooter);
