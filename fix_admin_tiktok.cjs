const fs = require('fs');

let admin = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

admin = admin.replace(
  /<div>\n\s*<label className="block text-sm font-semibold text-charcoal mb-2">LinkedIn URL<\/label>\n\s*<input type="text" value=\{localSettings\.linkedin \|\| ''\} onChange=\{e => setFormSettingsVal\('linkedin', e\.target\.value\)\} className=\{inputClass\} \/>\n\s*<\/div>/,
  `<div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">LinkedIn URL</label>
                    <input type="text" value={localSettings.linkedin || ''} onChange={e => setFormSettingsVal('linkedin', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">TikTok URL</label>
                    <input type="text" value={localSettings.tiktok || ''} onChange={e => setFormSettingsVal('tiktok', e.target.value)} className={inputClass} />
                  </div>`
);

fs.writeFileSync('src/pages/AdminPage.tsx', admin);
