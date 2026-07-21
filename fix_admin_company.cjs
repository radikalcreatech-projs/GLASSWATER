const fs = require('fs');
let data = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

const search = `                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Logo Image URL</label>`;

const replacement = `                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Company Name</label>
                        <input type="text" required value={localSettings.companyName || ''} onChange={e => setFormSettingsVal('companyName', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Logo Image URL</label>`;

data = data.replace(search, replacement);
fs.writeFileSync('src/pages/AdminPage.tsx', data);
