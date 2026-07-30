const fs = require('fs');
let data = fs.readFileSync('src/context/SettingsContext.tsx', 'utf8');

data = data.replace(/linkedin: string;/g, 'linkedin: string;\n  tiktok?: string;');
data = data.replace(/linkedin: '#',/g, "linkedin: '#',\n    tiktok: '#',");
fs.writeFileSync('src/context/SettingsContext.tsx', data);
