const fs = require('fs');

let portal = fs.readFileSync('src/pages/PortalPage.tsx', 'utf8');

portal = portal.replace(
  /<div className="mb-8 p-6 bg-light-gray\/30 rounded-xl border border-light-gray">/,
  `<div className="mb-8 p-6 bg-light-gray/30 rounded-xl border border-light-gray">
              {retrievedDoc.includeTerms !== false && settings.termsAndConditions && (
                <div className="mb-6">
                  <h4 className="text-navy font-bold mb-2 uppercase tracking-wider text-xs">{t('portal.terms')}</h4>
                  <p className="text-text-secondary text-xs leading-relaxed whitespace-pre-line">{settings.termsAndConditions}</p>
                </div>
              )}`
);

fs.writeFileSync('src/pages/PortalPage.tsx', portal);
