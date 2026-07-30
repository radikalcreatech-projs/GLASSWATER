const fs = require('fs');
let dataContact = fs.readFileSync('src/components/Contact.tsx', 'utf8');

dataContact = dataContact.replace(/<a href="#" className="w-11 h-11 bg-light-gray rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all">\s*<Facebook size=\{20\} \/>\s*<\/a>/, `<a href={settings.facebook} target="_blank" rel="noreferrer" className="w-11 h-11 bg-light-gray rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all">\n                <Facebook size={20} />\n              </a>`);
dataContact = dataContact.replace(/<a href="#" className="w-11 h-11 bg-light-gray rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all">\s*<Linkedin size=\{20\} \/>\s*<\/a>/, `<a href={settings.linkedin} target="_blank" rel="noreferrer" className="w-11 h-11 bg-light-gray rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all">\n                <Linkedin size={20} />\n              </a>`);
dataContact = dataContact.replace(/<a href="#" className="w-11 h-11 bg-light-gray rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all">\s*<Instagram size=\{20\} \/>\s*<\/a>/, `<a href={settings.instagram} target="_blank" rel="noreferrer" className="w-11 h-11 bg-light-gray rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all">\n                <Instagram size={20} />\n              </a>`);
// YouTube isn't in settings by default, I'll just remove the YouTube button or keep it as #
// Wait, Youtube is there, let's just leave it as # if it is, or remove it.
dataContact = dataContact.replace(/<a href="#" className="w-11 h-11 bg-light-gray rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all">\s*<Youtube size=\{20\} \/>\s*<\/a>/, ``);

fs.writeFileSync('src/components/Contact.tsx', dataContact);
