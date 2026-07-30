const fs = require('fs');
let data = fs.readFileSync('src/pages/PortalPage.tsx', 'utf8');

data = data.replace(
/<div id="printable-document" className="bg-white rounded-xl shadow-custom border border-gold\/20 p-8 md:p-12 print:border-none print:shadow-none print:p-0">/,
`<div id="printable-document" className="bg-white rounded-xl shadow-custom border border-gold/20 p-4 sm:p-6 md:p-12 print:border-none print:shadow-none print:p-0 text-sm">`
);

// Reduce some text sizes for mobile in PortalPage
data = data.replace(/<div className="text-2xl font-mono font-bold text-navy">/g, `<div className="text-xl md:text-2xl font-mono font-bold text-navy break-all">`);
data = data.replace(/<div className="font-serif text-2xl font-bold text-navy tracking-tight">/g, `<div className="font-serif text-xl md:text-2xl font-bold text-navy tracking-tight">`);
data = data.replace(/<div className="text-3xl font-mono font-bold text-navy mt-1">/g, `<div className="text-2xl md:text-3xl font-mono font-bold text-navy mt-1 break-all">`);
data = data.replace(/min-w-\[600px\]/g, 'min-w-full');

fs.writeFileSync('src/pages/PortalPage.tsx', data);
