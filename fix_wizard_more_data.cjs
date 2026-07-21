const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

const en = `
    'wizard.area': 'Floor area (sqm)',
    'wizard.floors': 'Number of floors',
    'wizard.age': 'Property age (years)',
    'wizard.start': 'Desired start date',`;

const fr = `
    'wizard.area': 'Superficie (m²)',
    'wizard.floors': 'Nombre d\\'étages',
    'wizard.age': 'Âge de la propriété (années)',
    'wizard.start': 'Date de début souhaitée',`;

data = data.replace(/'wizard\.address': 'Address',/, en + `\n    'wizard.address': 'Address',`);
data = data.replace(/'wizard\.address': 'Adresse',/, fr + `\n    'wizard.address': 'Adresse',`);

fs.writeFileSync('src/data.ts', data);
