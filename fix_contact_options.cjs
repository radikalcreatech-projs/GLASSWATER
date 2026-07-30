const fs = require('fs');

let dataTs = fs.readFileSync('src/data.ts', 'utf8');
const en = `
    'comp.contact.opt1': 'Engineering',
    'comp.contact.opt2': 'Construction',
    'comp.contact.opt3': 'Interior Fit‑Out',
    'comp.contact.opt4': 'Finishing Works',
    'comp.contact.opt5': 'Waterproofing',
    'comp.contact.opt6': 'Swimming Pool Engineering',
    'comp.contact.opt7': 'Facilities Management',
`;
const fr = `
    'comp.contact.opt1': 'Ingénierie',
    'comp.contact.opt2': 'Construction',
    'comp.contact.opt3': 'Aménagement intérieur',
    'comp.contact.opt4': 'Travaux de finition',
    'comp.contact.opt5': 'Imperméabilisation',
    'comp.contact.opt6': 'Ingénierie de piscine',
    'comp.contact.opt7': 'Gestion des installations',
`;
dataTs = dataTs.replace(/'portal\.loginbtn': 'Access Portal',/, en + `\n    'portal.loginbtn': 'Access Portal',`);
dataTs = dataTs.replace(/'portal\.loginbtn': 'Accéder au portail',/, fr + `\n    'portal.loginbtn': 'Accéder au portail',`);
fs.writeFileSync('src/data.ts', dataTs);

let dataContact = fs.readFileSync('src/components/Contact.tsx', 'utf8');
dataContact = dataContact.replace(/<option>Engineering<\/option>/, `<option>{t('comp.contact.opt1')}</option>`);
dataContact = dataContact.replace(/<option>Construction<\/option>/, `<option>{t('comp.contact.opt2')}</option>`);
dataContact = dataContact.replace(/<option>Interior Fit‑Out<\/option>/, `<option>{t('comp.contact.opt3')}</option>`);
dataContact = dataContact.replace(/<option>Finishing Works<\/option>/, `<option>{t('comp.contact.opt4')}</option>`);
dataContact = dataContact.replace(/<option>Waterproofing<\/option>/, `<option>{t('comp.contact.opt5')}</option>`);
dataContact = dataContact.replace(/<option>Swimming Pool Engineering<\/option>/, `<option>{t('comp.contact.opt6')}</option>`);
dataContact = dataContact.replace(/<option>Facilities Management<\/option>/, `<option>{t('comp.contact.opt7')}</option>`);
fs.writeFileSync('src/components/Contact.tsx', dataContact);
