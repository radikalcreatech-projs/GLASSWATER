const fs = require('fs');

let portal = fs.readFileSync('src/pages/PortalPage.tsx', 'utf8');

portal = portal.replace(
  /html2canvas:\s*\{ scale: 2, useCORS: true \},/g,
  `html2canvas:  { scale: 2, useCORS: true, windowWidth: 1024 },`
);

fs.writeFileSync('src/pages/PortalPage.tsx', portal);
