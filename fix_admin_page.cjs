const fs = require('fs');

let admin = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

admin = admin.replace(
  /<textarea rows={4} value={localSettings\.paymentDetails \|\| ''} onChange=\{e => setFormSettingsVal\('paymentDetails', e\.target\.value\)\} className=\{\`\$\{inputClass\} resize-y\`\} placeholder="Bank: Example Bank&#10;Account Name: Glasswater Fit-Outs&#10;Account Number: 1234567890&#10;Momo: 0248284384"><\/textarea>/g,
  `<textarea rows={4} value={localSettings.paymentDetails || ''} onChange={e => setFormSettingsVal('paymentDetails', e.target.value)} className={\`\${inputClass} resize-y\`} placeholder="Bank: Example Bank&#10;Account Name: Glasswater Fit-Outs&#10;Account Number: 1234567890&#10;Momo: 0248284384"></textarea>
                </div>

                {/* Admin & Legal Section */}
                <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray mb-8">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2">
                    <FileText size={18} className="text-gold" /> Admin & Legal
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Global Terms and Conditions</label>
                      <textarea rows={6} value={localSettings.termsAndConditions || ''} onChange={e => setFormSettingsVal('termsAndConditions', e.target.value)} className={\`\${inputClass} resize-y\`} placeholder="Enter terms and conditions to append to generated estimates/invoices..."></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Admin Login Password</label>
                      <input type="text" value={localSettings.adminPassword || ''} onChange={e => setFormSettingsVal('adminPassword', e.target.value)} className={inputClass} placeholder="Leave empty for default (GWADMIN)" />
                    </div>
                  </div>`
);

fs.writeFileSync('src/pages/AdminPage.tsx', admin);
