const fs = require('fs');
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');

footer = footer.replace(/import \{ MessageCircle \}/, 'import { MessageCircle, Facebook, Instagram, Linkedin, Music2 }');
footer = footer.replace(
  /<a href=\{settings\.facebook\} target="_blank" rel="noreferrer" className="text-light-gray\/70 hover:text-gold transition-colors uppercase tracking-widest text-\[0\.65rem\]">\{t\('social\.facebook'\)\}<\/a>/,
  `<a href={settings.facebook} target="_blank" rel="noreferrer" className="text-light-gray/70 hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-[0.65rem]"><Facebook size={14} /> {t('social.facebook')}</a>`
);
footer = footer.replace(
  /<a href=\{settings\.instagram\} target="_blank" rel="noreferrer" className="text-light-gray\/70 hover:text-gold transition-colors uppercase tracking-widest text-\[0\.65rem\]">\{t\('social\.instagram'\)\}<\/a>/,
  `<a href={settings.instagram} target="_blank" rel="noreferrer" className="text-light-gray/70 hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-[0.65rem]"><Instagram size={14} /> {t('social.instagram')}</a>`
);
footer = footer.replace(
  /<a href=\{settings\.linkedin\} target="_blank" rel="noreferrer" className="text-light-gray\/70 hover:text-gold transition-colors uppercase tracking-widest text-\[0\.65rem\]">\{t\('social\.linkedin'\)\}<\/a>/,
  `<a href={settings.linkedin} target="_blank" rel="noreferrer" className="text-light-gray/70 hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-[0.65rem]"><Linkedin size={14} /> {t('social.linkedin')}</a>
            {settings.tiktok && (
              <a href={settings.tiktok} target="_blank" rel="noreferrer" className="text-light-gray/70 hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-[0.65rem]"><Music2 size={14} /> {t('social.tiktok')}</a>
            )}`
);

fs.writeFileSync('src/components/Footer.tsx', footer);
