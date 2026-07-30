const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

header = header.replace(
  /<button \n            className="flex items-center justify-center text-text-primary/g,
  `{currentPage !== 'admin' && (<button \n            className="flex items-center justify-center text-text-primary`
);
header = header.replace(
  /\{lang === 'en' \? 'FR' : 'EN'\}\n          <\/button>\n          <button/g,
  `{lang === 'en' ? 'FR' : 'EN'}\n          </button>)}\n          <button`
);

fs.writeFileSync('src/components/Header.tsx', header);
