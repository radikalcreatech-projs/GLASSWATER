const fs = require('fs');
let data = fs.readFileSync('src/pages/PortalPage.tsx', 'utf8');

data = data.replace(
/<div className="font-serif text-2xl font-bold text-navy tracking-tight">GLASSWATER<span className="text-gold">\.<\/span><\/div>/g, 
`<div className="font-serif text-2xl font-bold text-navy tracking-tight">{settings.companyName ? settings.companyName.split(' ')[0] : 'GLASSWATER'}</div>`);

data = data.replace(
/<div className="font-sans text-\[9px\] font-normal text-steel-blue tracking-widest mt-1 uppercase">Fit-Outs &amp; Co\. Ltd\.<\/div>/g, 
`<div className="font-sans text-[9px] font-normal text-steel-blue tracking-widest mt-1 uppercase">{settings.companyName ? settings.companyName.substring(settings.companyName.indexOf(' ') + 1) : 'Fit-Outs & Co. Ltd.'}</div>`);

data = data.replace(
/<div className="font-semibold text-navy text-base">Glasswater Fit‑Outs &amp; Co\. Ltd\.<\/div>/g, 
`<div className="font-semibold text-navy text-base">{settings.companyName || 'Glasswater Fit-Outs & Co. Ltd.'}</div>`);

fs.writeFileSync('src/pages/PortalPage.tsx', data);
