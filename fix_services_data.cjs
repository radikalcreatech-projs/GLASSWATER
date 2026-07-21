const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

data = data.replace(/'services\.title': 'Our Solutions',/, `'services.caps': 'Capabilities',\n    'services.title': 'Our Solutions',`);
data = data.replace(/'services\.title': 'Nos Solutions',/, `'services.caps': 'Capacités',\n    'services.title': 'Nos Solutions',`);

fs.writeFileSync('src/data.ts', data);
