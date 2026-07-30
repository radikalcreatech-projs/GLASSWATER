const fs = require('fs');
let data = fs.readFileSync('src/pages/PortalPage.tsx', 'utf8');

data = data.replace(
/const html2pdf = \(await import\('html2pdf\.js'\)\)\.default;/g,
`const html2pdfModule = await import('html2pdf.js');\n      const html2pdf = html2pdfModule.default || html2pdfModule;`
);

fs.writeFileSync('src/pages/PortalPage.tsx', data);
