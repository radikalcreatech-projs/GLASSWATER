const fs = require('fs');
let data = fs.readFileSync('src/index.css', 'utf8');

data = data.replace(/\.dark \{[\s\S]*?\}/, '');
data = data.replace(/\.dark \.shadow-custom \{[\s\S]*?\}/, '');

fs.writeFileSync('src/index.css', data);
