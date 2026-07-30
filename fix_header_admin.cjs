const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Hide lang switcher if admin page
header = header.replace(
  /<button\s+onClick=\{\(\) => setLang\(lang === 'en' \? 'fr' : 'en'\)\}/,
  `{currentPage !== 'admin' && (\n          <button \n            onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}`
);
header = header.replace(
  /<\/button>\s*<button\s+onClick=\{onOpenSearch\}/,
  `</button>\n          )}\n          <button onClick={onOpenSearch}`
);

// If mobile also has lang switcher, handle it
// Look for Mobile Nav lang switcher
header = header.replace(
  /<button\s+onClick=\{\(\) => \{\s*setLang\(lang === 'en' \? 'fr' : 'en'\);\s*setIsOpen\(false\);\s*\}\}\s*className="bg-light-gray\/50 text-charcoal/g,
  `{currentPage !== 'admin' && (<button \n              onClick={() => { \n                setLang(lang === 'en' ? 'fr' : 'en');\n                setIsOpen(false);\n              }}\n              className="bg-light-gray/50 text-charcoal`
);
header = header.replace(
  /\{t\('lang\.switch'\)\}\s*<\/button>\s*<button\s+onClick=\{\(\) => \{\s*navigate\('portal'\);/g,
  `{t('lang.switch')}\n            </button>)}\n            <button\n              onClick={() => {\n                navigate('portal');`
);

fs.writeFileSync('src/components/Header.tsx', header);
