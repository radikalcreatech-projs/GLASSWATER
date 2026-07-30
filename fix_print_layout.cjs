const fs = require('fs');

let portal = fs.readFileSync('src/pages/PortalPage.tsx', 'utf8');

portal = portal.replace(
  /className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-light-gray pb-8 mb-8 gap-6"/g,
  'className="flex flex-col sm:flex-row print:flex-row justify-between items-start sm:items-center print:items-center border-b border-light-gray pb-8 mb-8 gap-6"'
);

portal = portal.replace(
  /className="text-left sm:text-right"/g,
  'className="text-left sm:text-right print:text-right"'
);

portal = portal.replace(
  /className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"/g,
  'className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-8 mb-8"'
);

portal = portal.replace(
  /className="hidden sm:table-cell text-right p-3"/g,
  'className="hidden sm:table-cell print:table-cell text-right p-3"'
);

portal = portal.replace(
  /className="text-right p-3 font-semibold text-navy"/g,
  'className="text-right p-3 font-semibold text-navy w-24"' // Fix width of amount column
);

portal = portal.replace(
  /className="col-span-2 hidden sm:table-cell"/g,
  'className="col-span-2 hidden sm:table-cell print:table-cell"'
);

fs.writeFileSync('src/pages/PortalPage.tsx', portal);
