const fs = require('fs');

let data = fs.readFileSync('src/context/SettingsContext.tsx', 'utf8');
data = data.replace(/paymentDetails: string;/g, 'paymentDetails: string;\n  adminPassword?: string;\n  termsAndConditions?: string;');
data = data.replace(/paymentDetails: 'Bank: Ecobank\\nAccount Name: Glasswater\\nAccount Number: 1234567890\\nBranch: Osu',/g, "paymentDetails: 'Bank: Ecobank\\nAccount Name: Glasswater\\nAccount Number: 1234567890\\nBranch: Osu',\n    adminPassword: 'GWADMIN',\n    termsAndConditions: 'All goods remain the property of Glasswater until paid in full.',");
fs.writeFileSync('src/context/SettingsContext.tsx', data);
