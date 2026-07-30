const fs = require('fs');

let portal = fs.readFileSync('src/pages/PortalPage.tsx', 'utf8');

portal = portal.replace(/import \{ useSettings \} from '\.\.\/context\/SettingsContext';/, "import { useSettings } from '../context/SettingsContext';\nimport html2pdf from 'html2pdf.js';");

portal = portal.replace(/const html2pdfModule = await import\('html2pdf\.js'\);\s*const html2pdf = html2pdfModule\.default \|\| html2pdfModule;/g, "");

// Make sure the button is clearly clickable and z-index is fine
portal = portal.replace(/className="bg-navy\/5 border border-navy\/20 hover:bg-navy\/10 text-navy px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"/g, 'className="bg-navy/5 border border-navy/20 hover:bg-navy/10 text-navy px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer relative z-10"');

portal = portal.replace(/className="bg-gold hover:bg-navy text-white px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"/g, 'className="bg-gold hover:bg-navy text-white px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer relative z-10"');

fs.writeFileSync('src/pages/PortalPage.tsx', portal);
