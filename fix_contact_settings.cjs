const fs = require('fs');

let dataContact = fs.readFileSync('src/components/Contact.tsx', 'utf8');
dataContact = dataContact.replace(/<span className="text-charcoal">\+233 30 123 4567<\/span>/, `<span className="text-charcoal">{settings.phone}</span>`);
dataContact = dataContact.replace(/<span className="text-charcoal">\+233 50 123 4567<\/span>/, `<span className="text-charcoal">{settings.whatsapp}</span>`);
dataContact = dataContact.replace(/<span className="text-charcoal">info@glasswater\.com<\/span>/, `<span className="text-charcoal">{settings.email}</span>`);
dataContact = dataContact.replace(/<span className="text-charcoal">12 Independence Avenue, Accra, Ghana<\/span>/, `<span className="text-charcoal whitespace-pre-line">{settings.address}</span>`);

// Ensure useSettings is imported and used
if (!dataContact.includes('useSettings')) {
  dataContact = "import { useSettings } from '../context/SettingsContext';\n" + dataContact;
  dataContact = dataContact.replace(/const \{ t \} = useI18n\(\);/, "const { t } = useI18n();\n  const { settings } = useSettings();");
}

fs.writeFileSync('src/components/Contact.tsx', dataContact);
