const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

const en = `
    'contact.service': 'Service Interest',
    'contact.opt_eng': 'Engineering',
    'contact.opt_const': 'Construction',
    'contact.opt_int': 'Interior Fit-Out',
    'contact.opt_fin': 'Finishing Works',
    'contact.opt_water': 'Waterproofing',
    'contact.opt_pool': 'Swimming Pool Engineering',
    'contact.opt_fm': 'Facilities Management',
    'contact.opt_other': 'Other',
    'reviews.feedback': 'Feedback',
    'reviews.rating': 'Rating',
    'reviews.empty': 'No reviews yet. Be the first to share your experience!',
    'post.not_found': 'Article not found.',
    'post.editorial': 'GlassWater Editorial',
    'home.stats.proj': 'Projects',
    'home.stats.comm': 'Commercial',
    'home.stats.sat': 'Satisfaction',
    'home.about_label': 'About Us',
    'home.feat_work': 'Featured Work',
    'home.prem_proj': 'Premium Projects',
    'home.testi': 'Testimonials',
    'home.client_feed': 'Client Feedback',
    'home.know_centre': 'Knowledge Centre',
    'about.label': 'About Us',
    'projects.label': 'Portfolio',
    'projects.value': 'Value',
    'projects.duration': 'Duration',`;

const fr = `
    'contact.service': 'Service d\\'intérêt',
    'contact.opt_eng': 'Ingénierie',
    'contact.opt_const': 'Construction',
    'contact.opt_int': 'Aménagement intérieur',
    'contact.opt_fin': 'Travaux de finition',
    'contact.opt_water': 'Étanchéité',
    'contact.opt_pool': 'Ingénierie des piscines',
    'contact.opt_fm': 'Gestion des installations',
    'contact.opt_other': 'Autre',
    'reviews.feedback': 'Retours',
    'reviews.rating': 'Note',
    'reviews.empty': 'Aucun avis pour le moment. Soyez le premier à partager votre expérience !',
    'post.not_found': 'Article non trouvé.',
    'post.editorial': 'Rédaction GlassWater',
    'home.stats.proj': 'Projets',
    'home.stats.comm': 'Commercial',
    'home.stats.sat': 'Satisfaction',
    'home.about_label': 'À propos',
    'home.feat_work': 'Projets en vedette',
    'home.prem_proj': 'Projets Premium',
    'home.testi': 'Témoignages',
    'home.client_feed': 'Retours clients',
    'home.know_centre': 'Centre de connaissances',
    'about.label': 'À propos de nous',
    'projects.label': 'Portfolio',
    'projects.value': 'Valeur',
    'projects.duration': 'Durée',`;

data = data.replace(/'contact\.info': 'Get in touch',/, en + `\n    'contact.info': 'Get in touch',`);
data = data.replace(/'contact\.info': 'Contactez‑nous',/, fr + `\n    'contact.info': 'Contactez‑nous',`);

fs.writeFileSync('src/data.ts', data);
