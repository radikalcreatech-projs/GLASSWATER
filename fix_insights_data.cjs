const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

data = data.replace(/'insights\.title': 'Knowledge Centre',/, `'insights.label': 'Insights & News',\n    'insights.title': 'Knowledge Centre',`);
data = data.replace(/'insights\.sub': 'Expert insights for your projects',/, `'insights.sub': 'Industry trends, company updates, and expert perspectives.',`);

data = data.replace(/'insights\.title': 'Centre de Connaissances',/, `'insights.label': 'Actualités & Idées',\n    'insights.title': 'Centre de Connaissances',`);
data = data.replace(/'insights\.sub': 'Conseils d\\'experts pour vos projets',/, `'insights.sub': 'Tendances de l\\'industrie, mises à jour de l\\'entreprise et perspectives d\\'experts.',`);

fs.writeFileSync('src/data.ts', data);
