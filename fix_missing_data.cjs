const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

data = data.replace(/'footer\.contact': 'Contact',/g, 
`'footer.slogan': 'Precision built. Dependably delivered.',
    'footer.rights': 'All rights reserved.',
    'footer.contact': 'Contact',`);

fs.writeFileSync('src/data.ts', data);
