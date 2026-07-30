const fs = require('fs');

let data = fs.readFileSync('src/context/SettingsContext.tsx', 'utf8');
data = data.replace(/fileUrl\?: string;/g, 'fileUrl?: string;\n  includeTerms?: boolean;');
fs.writeFileSync('src/context/SettingsContext.tsx', data);
