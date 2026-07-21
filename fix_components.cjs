const fs = require('fs');

const en = `
    'hero.title1': 'Precision Built.',
    'hero.title2': 'Dependably Delivered.',
    'hero.desc': 'Engineering, construction, interior fit‑out and facilities management across West Africa.',
    'hero.btn1': 'Request a Consultation',
    'hero.btn2': 'View Our Work',
    'hero.badge': 'Project Showcase',
    
    'comp.careers.title': 'Careers',
    'comp.careers.sub': 'Join our team of precision professionals',
    'comp.industries.title': 'Industries We Serve',
    'comp.industries.sub': 'Tailored solutions for diverse sectors',
    'comp.projects.title': 'Project Portfolio',
    'comp.projects.sub': 'Excellence in every delivery',
    'comp.services.title': 'Our Solutions',
    'comp.services.sub': 'Comprehensive services across the project lifecycle',
    'comp.insights.title': 'Knowledge Centre',
    'comp.insights.sub': 'Expert insights for your projects',
    
    'search.no_results': 'No results found.',
    
    'comp.contact.title': 'Contact Us',
    'comp.contact.sub': 'Start your project with a conversation',
    'comp.contact.success': 'Thank you for your enquiry. Our team will respond within 24 hours.',
    'comp.contact.touch': 'Get in touch',
    'comp.contact.resp': 'We respond to all enquiries within 24 hours.',
    
    'comp.about.title': 'About Glasswater',
    'comp.about.vals1': 'Precision, Integrity, Safety, Innovation',
    'comp.about.vals2': 'Quality, Professionalism, Accountability, Reliability',
`;

const fr = `
    'hero.title1': 'Construit avec précision.',
    'hero.title2': 'Livré avec fiabilité.',
    'hero.desc': 'Ingénierie, construction, aménagement intérieur et gestion des installations à travers l\\'Afrique de l\\'Ouest.',
    'hero.btn1': 'Demander une consultation',
    'hero.btn2': 'Voir notre travail',
    'hero.badge': 'Vitrine de projets',
    
    'comp.careers.title': 'Carrières',
    'comp.careers.sub': 'Rejoignez notre équipe de professionnels',
    'comp.industries.title': 'Industries desservies',
    'comp.industries.sub': 'Des solutions sur mesure pour divers secteurs',
    'comp.projects.title': 'Portfolio de projets',
    'comp.projects.sub': 'L\\'excellence à chaque livraison',
    'comp.services.title': 'Nos Solutions',
    'comp.services.sub': 'Des services complets tout au long du cycle de vie du projet',
    'comp.insights.title': 'Centre de connaissances',
    'comp.insights.sub': 'Conseils d\\'experts pour vos projets',
    
    'search.no_results': 'Aucun résultat trouvé.',
    
    'comp.contact.title': 'Contactez-nous',
    'comp.contact.sub': 'Commencez votre projet par une conversation',
    'comp.contact.success': 'Merci pour votre demande. Notre équipe vous répondra sous 24 heures.',
    'comp.contact.touch': 'Contactez-nous',
    'comp.contact.resp': 'Nous répondons à toutes les demandes sous 24 heures.',
    
    'comp.about.title': 'À propos de Glasswater',
    'comp.about.vals1': 'Précision, Intégrité, Sécurité, Innovation',
    'comp.about.vals2': 'Qualité, Professionnalisme, Responsabilité, Fiabilité',
`;

let dataFile = fs.readFileSync('src/data.ts', 'utf8');
dataFile = dataFile.replace(/'hero\.dependably': 'Dependably Delivered\.',/, en + `\n    'hero.dependably': 'Dependably Delivered.',`);
// if the above fails, it means we don't have hero.dependably. Let's just append to the beginning of the object.
dataFile = dataFile.replace(/export const translations: Record<string, Record<string, string>> = \{\n  en: \{/, "export const translations: Record<string, Record<string, string>> = {\n  en: {\n" + en);
dataFile = dataFile.replace(/\n  fr: \{/, "\n  fr: {\n" + fr);
fs.writeFileSync('src/data.ts', dataFile);

function fixComp(file, replacements) {
    let data = fs.readFileSync(file, 'utf8');
    // Add import if not exists
    if (!data.includes('useI18n')) {
        data = `import { useI18n } from '../context/I18nContext';\n` + data;
        // Inject hook
        data = data.replace(/export function [A-Za-z]+\([^)]*\) {/, (match) => match + `\n  const { t } = useI18n();`);
    }
    for (const r of replacements) {
        data = data.replace(r[0], r[1]);
    }
    fs.writeFileSync(file, data);
}

fixComp('src/components/Hero.tsx', [
    [/>\s*Precision Built\./g, `>{t('hero.title1')}`],
    [/>Dependably Delivered\.</g, `>{t('hero.title2')}<`],
    [/>\s*Engineering, construction, interior fit‑out and facilities management across West Africa\.\s*</g, `>{t('hero.desc')}<`],
    [/>\s*Request a Consultation\s*</g, `>{t('hero.btn1')}<`],
    [/>\s*View Our Work\s*</g, `>{t('hero.btn2')}<`],
    [/>\s*Project Showcase\s*</g, `>{t('hero.badge')}<`]
]);

fixComp('src/components/Careers.tsx', [
    [/>Careers</g, `>{t('comp.careers.title')}<`],
    [/>Join our team of precision professionals</g, `>{t('comp.careers.sub')}<`]
]);

fixComp('src/components/Industries.tsx', [
    [/>Industries We Serve</g, `>{t('comp.industries.title')}<`],
    [/>Tailored solutions for diverse sectors</g, `>{t('comp.industries.sub')}<`]
]);

fixComp('src/components/Projects.tsx', [
    [/>Project Portfolio</g, `>{t('comp.projects.title')}<`],
    [/>Excellence in every delivery</g, `>{t('comp.projects.sub')}<`]
]);

fixComp('src/components/Services.tsx', [
    [/>Our Solutions</g, `>{t('comp.services.title')}<`],
    [/>Comprehensive services across the project lifecycle</g, `>{t('comp.services.sub')}<`]
]);

fixComp('src/components/Insights.tsx', [
    [/>Knowledge Centre</g, `>{t('comp.insights.title')}<`],
    [/>Expert insights for your projects</g, `>{t('comp.insights.sub')}<`]
]);

fixComp('src/components/SearchModal.tsx', [
    [/>No results found\.</g, `>{t('search.no_results')}<`]
]);

fixComp('src/components/Contact.tsx', [
    [/>Contact Us</g, `>{t('comp.contact.title')}<`],
    [/>Start your project with a conversation</g, `>{t('comp.contact.sub')}<`],
    [/>Thank you for your enquiry\. Our team will respond within 24 hours\.</g, `>{t('comp.contact.success')}<`],
    [/>Get in touch</g, `>{t('comp.contact.touch')}<`],
    [/>We respond to all enquiries within 24 hours\.</g, `>{t('comp.contact.resp')}<`]
]);

fixComp('src/components/About.tsx', [
    [/>About Glasswater</g, `>{t('comp.about.title')}<`],
    [/>Precision, Integrity, Safety, Innovation</g, `>{t('comp.about.vals1')}<`],
    [/>Quality, Professionalism, Accountability, Reliability</g, `>{t('comp.about.vals2')}<`]
]);
