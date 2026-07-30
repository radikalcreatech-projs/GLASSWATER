const fs = require('fs');

let admin = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

// 1. Password placeholder
admin = admin.replace(/placeholder="Enter admin password \(admin123\)"/, 'placeholder="Enter Admin Password"');

// 2. Add terms and conditions to settings tab
// In settings tab we have:
// paymentDetails
admin = admin.replace(
  /<\/div>\s*<div className="pt-4 border-t border-light-gray flex justify-end">/g,
  `</div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Terms and Conditions</label>
                  <textarea rows={4} value={localSettings.termsAndConditions || ''} onChange={e => setFormSettingsVal('termsAndConditions', e.target.value)} className={\`\${inputClass} resize-y\`} placeholder="Enter terms and conditions..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Admin Login Password</label>
                  <input type="text" value={localSettings.adminPassword || 'GWADMIN'} onChange={e => setFormSettingsVal('adminPassword', e.target.value)} className={inputClass} placeholder="New Password" />
                </div>
                <div className="pt-4 border-t border-light-gray flex justify-end">`
);

// 3. Document placeholders
admin = admin.replace(/placeholder="e.g\. GW-2024"/g, 'placeholder="Enter Code"');
admin = admin.replace(/placeholder="e.g\. Commercial Interior Finishing and Partitioning Works"/g, 'placeholder="Enter Project Title"');
admin = admin.replace(/placeholder="e.g\. Copper conduit wiring installations"/g, 'placeholder="Description"');
admin = admin.replace(/placeholder={editingDoc\.discountType === 'percentage' \? "e.g\. 10" : "e.g\. 500"}/g, 'placeholder={editingDoc.discountType === \'percentage\' ? "10" : "500"}');

// 4. In Document form, add includeTerms checkbox
admin = admin.replace(
  /<\/textarea>\n\s*<\/div>\n\s*<div>\n\s*<label className="block text-xs font-semibold text-charcoal mb-1">Attached File URL \(Optional\)<\/label>/,
  `</textarea>
                        </div>
                        <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                          <input type="checkbox" id="includeTerms" checked={editingDoc.includeTerms !== false} onChange={e => setEditingDoc({ ...editingDoc, includeTerms: e.target.checked })} className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold" />
                          <label htmlFor="includeTerms" className="text-sm font-semibold text-charcoal">Include Company Terms and Conditions</label>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-charcoal mb-1">Attached File URL (Optional)</label>`
);

// 5. Auth logic: check against settings.adminPassword instead of 'admin123'
admin = admin.replace(/if \(password === 'admin123'\)/g, "if (password === (settings.adminPassword || 'GWADMIN'))");

fs.writeFileSync('src/pages/AdminPage.tsx', admin);
