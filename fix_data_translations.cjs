const fs = require('fs');
let dataTs = fs.readFileSync('src/data.ts', 'utf8');

const enMissing = `
    'nav.quote': 'Quote',
    'nav.portal': 'Code',
    'portal.date_issued': 'Date Issued',
    'portal.due_date': 'Due Date',
    'portal.statement': 'Estimate',
    'portal.download_pdf': 'Download PDF',
    'portal.view_file': 'View File',
    'social.facebook': 'Facebook',
    'social.instagram': 'Instagram',
    'social.linkedin': 'LinkedIn',
    'social.whatsapp': 'WhatsApp',
    'social.tiktok': 'TikTok',
    'btn.explore_projects': 'Explore Projects',
    'btn.view_project': 'View Project',
    'btn.all_projects': 'All Projects',
`;

const frMissing = `
    'nav.quote': 'Devis',
    'nav.portal': 'Code',
    'portal.date_issued': 'Date d\\'émission',
    'portal.due_date': 'Date d\\'échéance',
    'portal.statement': 'Devis',
    'portal.download_pdf': 'Télécharger PDF',
    'portal.view_file': 'Voir Fichier',
    'social.facebook': 'Facebook',
    'social.instagram': 'Instagram',
    'social.linkedin': 'LinkedIn',
    'social.whatsapp': 'WhatsApp',
    'social.tiktok': 'TikTok',
    'btn.explore_projects': 'Explorer Projets',
    'btn.view_project': 'Voir Projet',
    'btn.all_projects': 'Tous Projets',
`;

dataTs = dataTs.replace(/'nav\.portal': 'View Estimate',/, enMissing);
dataTs = dataTs.replace(/'nav\.portal': 'Voir Devis',/, frMissing);
fs.writeFileSync('src/data.ts', dataTs);
