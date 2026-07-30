const fs = require('fs');
let data = fs.readFileSync('src/components/Header.tsx', 'utf8');

data = data.replace(
/<nav className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl px-5 py-5 flex flex-col gap-4 border-t border-gray-100">/,
`<nav className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl px-5 py-5 flex flex-col gap-4 border-t border-gray-100 max-h-[80vh] overflow-y-auto">`
);

fs.writeFileSync('src/components/Header.tsx', data);
