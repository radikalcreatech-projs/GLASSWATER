const fs = require('fs');
let data = fs.readFileSync('src/pages/PortalPage.tsx', 'utf8');

const additionalText = `
          {/* Online Tracking Instructions for PDF */}
          <div className="mt-12 pt-6 border-t border-dashed border-light-gray">
            <h4 className="text-[10px] font-bold text-navy uppercase tracking-widest mb-2">View Online</h4>
            <p className="text-sm text-text-secondary">
              You can access this document online at any time via our Client Portal.
            </p>
            <p className="text-sm text-navy font-semibold mt-1">
              Visit: <span className="text-gold">{window.location.origin}</span>
            </p>
            <p className="text-sm text-navy font-semibold">
              Reference Code: <span className="text-gold">{retrievedDoc.code}</span>
            </p>
          </div>
        </div>
`;

data = data.replace(/<\/div>\n\s*<\/div>\n\s*<div className="mt-8 text-center bg-light-gray\/40 border border-light-gray rounded-xl p-6 print:hidden">/, additionalText + `\n        <div className="mt-8 text-center bg-light-gray/40 border border-light-gray rounded-xl p-6 print:hidden">`);

fs.writeFileSync('src/pages/PortalPage.tsx', data);
