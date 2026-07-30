const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
header = header.replace(/<header className="fixed top-0 w-full bg-white\/95/, '<header className="print:hidden fixed top-0 w-full bg-white/95');
fs.writeFileSync('src/components/Header.tsx', header);

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/<footer className="bg-navy pt-16 pb-8 border-t-4 border-gold">/, '<footer className="print:hidden bg-navy pt-16 pb-8 border-t-4 border-gold">');
fs.writeFileSync('src/components/Footer.tsx', footer);

