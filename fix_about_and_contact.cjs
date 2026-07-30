const fs = require('fs');

let dataTs = fs.readFileSync('src/data.ts', 'utf8');
const en = `
    'comp.about.desc': 'We are an integrated construction, engineering, interior fit‑out and facilities management company delivering commercial, industrial, hospitality, institutional and residential projects across West Africa.',
    'comp.about.vision': 'Vision: West Africa’s most trusted fit‑out and building solutions company',
    'comp.about.learn': 'Learn More',
    'comp.contact.name': 'Full Name',
    'comp.contact.email': 'Email Address',
    'comp.contact.phone': 'Phone Number',
    'comp.contact.service': 'Service Interest',
    'comp.contact.msg': 'Tell us about your project...',
    'comp.contact.btn': 'Send Message',
`;
const fr = `
    'comp.about.desc': 'Nous sommes une entreprise intégrée de construction, d\\'ingénierie, d\\'aménagement intérieur et de gestion des installations réalisant des projets commerciaux, industriels, hôteliers, institutionnels et résidentiels à travers l\\'Afrique de l\\'Ouest.',
    'comp.about.vision': 'Vision : L\\'entreprise d\\'aménagement et de solutions de construction la plus fiable d\\'Afrique de l\\'Ouest',
    'comp.about.learn': 'En savoir plus',
    'comp.contact.name': 'Nom complet',
    'comp.contact.email': 'Adresse e-mail',
    'comp.contact.phone': 'Numéro de téléphone',
    'comp.contact.service': 'Service souhaité',
    'comp.contact.msg': 'Parlez-nous de votre projet...',
    'comp.contact.btn': 'Envoyer le message',
`;

dataTs = dataTs.replace(/'portal\.loginbtn': 'Access Portal',/, en + `\n    'portal.loginbtn': 'Access Portal',`);
dataTs = dataTs.replace(/'portal\.loginbtn': 'Accéder au portail',/, fr + `\n    'portal.loginbtn': 'Accéder au portail',`);
fs.writeFileSync('src/data.ts', dataTs);

let dataAbout = fs.readFileSync('src/components/About.tsx', 'utf8');
dataAbout = dataAbout.replace(/We are an integrated construction, engineering, interior fit‑out and facilities management company delivering commercial, industrial, hospitality, institutional and residential projects across West Africa\./, `{t('comp.about.desc')}`);
dataAbout = dataAbout.replace(/Vision: West Africa’s most trusted fit‑out and building solutions company/, `{t('comp.about.vision')}`);
dataAbout = dataAbout.replace(/Learn More/, `{t('comp.about.learn')}`);
fs.writeFileSync('src/components/About.tsx', dataAbout);

let dataContact = fs.readFileSync('src/components/Contact.tsx', 'utf8');
dataContact = dataContact.replace(/placeholder="Full Name"/, `placeholder={t('comp.contact.name')}`);
dataContact = dataContact.replace(/placeholder="Email Address"/, `placeholder={t('comp.contact.email')}`);
dataContact = dataContact.replace(/placeholder="Phone Number"/, `placeholder={t('comp.contact.phone')}`);
dataContact = dataContact.replace(/<option value="">Service Interest<\/option>/, `<option value="">{t('comp.contact.service')}</option>`);
dataContact = dataContact.replace(/placeholder="Tell us about your project\.\.\."/, `placeholder={t('comp.contact.msg')}`);
dataContact = dataContact.replace(/Send Message/, `{t('comp.contact.btn')}`);
fs.writeFileSync('src/components/Contact.tsx', dataContact);
