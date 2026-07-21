const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

data = data.replace(
`'footer.slogan': 'Precision built. Dependably delivered.',
    'footer.rights': 'All rights reserved.',
    'footer.contact': 'Contact',
    'footer.links': 'Liens rapides',`, 
`'footer.slogan': 'Construit avec précision. Livré avec fiabilité.',
    'footer.rights': 'Tous droits réservés.',
    'footer.contact': 'Contact',
    'footer.links': 'Liens rapides',`);

data = data.replace(
`'portal.title': 'Client Portal',`, 
`'portal.title': 'View Estimate',`);

data = data.replace(
`'nav.portal': 'Portal',`, 
`'nav.portal': 'View Estimate',`);

data = data.replace(
`'portal.title': 'Portail Client',`, 
`'portal.title': 'Voir le devis',`);

data = data.replace(
`'nav.portal': 'Portail',`, 
`'nav.portal': 'Voir Devis',`);

fs.writeFileSync('src/data.ts', data);
