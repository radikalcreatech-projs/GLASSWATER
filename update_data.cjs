const fs = require('fs');

let dataTs = fs.readFileSync('src/data.ts', 'utf8');

// We will add the translated versions of projects, posts, and faqs to data.ts
dataTs = dataTs.replace(/export const projects = \[\s*\{[\s\S]*?\}\s*\];/g, `
export const projectsEn = [
  { id: '1', title: 'Accra Financial Hub', category: 'Commercial', description: 'Full interior fit‑out and MEP works for a 15‑storey office tower.', image: 'https://lh3.googleusercontent.com/d/17OEVNBh2mvO3MNCzogUGhSgTuTHh2BQk' },
  { id: '2', title: 'Labadi Beach Resort', category: 'Hospitality', description: 'Complete renovation and swimming pool engineering.', image: 'https://lh3.googleusercontent.com/d/16rYbGyUo4aXCqVO3fsKTyL4NI7Ww8rnI' },
  { id: '3', title: 'Tema Industrial Park', category: 'Industrial', description: 'Construction, waterproofing and finishing for a warehouse complex.', image: 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ' }
];
export const projectsFr = [
  { id: '1', title: 'Centre Financier d\\'Accra', category: 'Commercial', description: 'Aménagement intérieur complet et travaux MEP pour une tour de bureaux de 15 étages.', image: 'https://lh3.googleusercontent.com/d/17OEVNBh2mvO3MNCzogUGhSgTuTHh2BQk' },
  { id: '2', title: 'Complexe Balnéaire de Labadi', category: 'Hospitalité', description: 'Rénovation complète et ingénierie de piscine.', image: 'https://lh3.googleusercontent.com/d/16rYbGyUo4aXCqVO3fsKTyL4NI7Ww8rnI' },
  { id: '3', title: 'Parc Industriel de Tema', category: 'Industriel', description: 'Construction, imperméabilisation et finition pour un complexe d\\'entrepôts.', image: 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ' }
];
export const getProjects = (lang: string) => lang === 'fr' ? projectsFr : projectsEn;
export const projects = projectsEn; // fallback for admin
`);

dataTs = dataTs.replace(/export const posts = \[\s*\{[\s\S]*?\}\s*\];/g, `
export const postsEn = [
  {
    slug: 'waterproofing-tips',
    title: 'Temporary Fixes for Leaky Roofs',
    date: '2026-07-09',
    excerpt: 'Quick, safe measures to protect your property until help arrives.',
    category: 'DIY Tips',
    coverImage: 'https://lh3.googleusercontent.com/d/17OEVNBh2mvO3MNCzogUGhSgTuTHh2BQk',
    content: \`<p>First, identify the source of the leak. Look for water stains on ceilings or walls.</p>
              <p>Use a waterproof tarp to cover the affected area on the roof. Secure the edges with heavy objects or nails (if safe).</p>
              <p>While DIY fixes buy you time, <strong>Glasswater</strong> provides permanent waterproofing solutions. Contact us for a full assessment.</p>\`
  },
  {
    slug: 'maintenance-tips',
    title: 'Preventive Maintenance for Facility Managers',
    date: '2026-07-08',
    excerpt: 'Extend the life of your building systems with our proven checklist.',
    category: 'Maintenance',
    coverImage: 'https://lh3.googleusercontent.com/d/16rYbGyUo4aXCqVO3fsKTyL4NI7Ww8rnI',
    content: \`<p>Regular inspections can save up to 30% on repair costs. Schedule quarterly HVAC checks, monthly plumbing inspections, and annual structural reviews.</p>
              <p>Our facilities management team can handle all of this for you. <a href="#contact" data-page="contact">Get in touch</a> to learn more.</p>\`
  },
  {
    slug: 'waterproofing-best-practices',
    title: 'Waterproofing Best Practices',
    date: '2026-07-07',
    excerpt: 'Ensure durability in West Africa\\'s climate with modern techniques.',
    category: 'Construction',
    coverImage: 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ',
    content: \`<p>In tropical climates, waterproofing is non‑negotiable. Use liquid‑applied membranes for roofs and crystalline admixtures for concrete foundations.</p>
              <p>Always hire certified professionals – Glasswater\\'s team is trained in the latest waterproofing technologies.</p>\`
  }
];

export const postsFr = [
  {
    slug: 'waterproofing-tips',
    title: 'Solutions temporaires pour les toits qui fuient',
    date: '2026-07-09',
    excerpt: 'Mesures rapides et sûres pour protéger votre propriété en attendant de l\\'aide.',
    category: 'Astuces de bricolage',
    coverImage: 'https://lh3.googleusercontent.com/d/17OEVNBh2mvO3MNCzogUGhSgTuTHh2BQk',
    content: \`<p>Tout d'abord, identifiez la source de la fuite. Recherchez des taches d'eau sur les plafonds ou les murs.</p>
              <p>Utilisez une bâche imperméable pour couvrir la zone affectée sur le toit. Fixez les bords avec des objets lourds ou des clous (si c'est sûr).</p>
              <p>Bien que les réparations de bricolage vous fassent gagner du temps, <strong>Glasswater</strong> fournit des solutions d'imperméabilisation permanentes. Contactez-nous pour une évaluation complète.</p>\`
  },
  {
    slug: 'maintenance-tips',
    title: 'Maintenance préventive pour les gestionnaires d\\'installations',
    date: '2026-07-08',
    excerpt: 'Prolongez la durée de vie des systèmes de votre bâtiment avec notre liste de contrôle éprouvée.',
    category: 'Entretien',
    coverImage: 'https://lh3.googleusercontent.com/d/16rYbGyUo4aXCqVO3fsKTyL4NI7Ww8rnI',
    content: \`<p>Des inspections régulières peuvent économiser jusqu'à 30 % sur les coûts de réparation. Planifiez des contrôles trimestriels de CVC, des inspections mensuelles de plomberie et des examens structurels annuels.</p>
              <p>Notre équipe de gestion des installations peut s'occuper de tout cela pour vous. <a href="#contact" data-page="contact">Contactez-nous</a> pour en savoir plus.</p>\`
  },
  {
    slug: 'waterproofing-best-practices',
    title: 'Meilleures pratiques d\\'imperméabilisation',
    date: '2026-07-07',
    excerpt: 'Assurez la durabilité dans le climat de l\\'Afrique de l\\'Ouest avec des techniques modernes.',
    category: 'Construction',
    coverImage: 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ',
    content: \`<p>Dans les climats tropicaux, l'imperméabilisation n'est pas négociable. Utilisez des membranes appliquées sous forme liquide pour les toits et des adjuvants cristallins pour les fondations en béton.</p>
              <p>Faites toujours appel à des professionnels certifiés - l'équipe de Glasswater est formée aux dernières technologies d'imperméabilisation.</p>\`
  }
];
export const getPosts = (lang: string) => lang === 'fr' ? postsFr : postsEn;
export const posts = postsEn; // fallback for admin
`);

dataTs = dataTs.replace(/export const faqs = \[\s*\{[\s\S]*?\}\s*\];/g, `
export const faqsEn = [
  { q: 'What areas do you serve?', a: 'We operate across Ghana and West Africa, with a focus on Accra, Kumasi, and Tema.' },
  { q: 'How long does a typical fit‑out take?', a: 'Depending on the scope, most projects range from 4 to 12 weeks.' },
  { q: 'Do you provide warranties?', a: 'Yes, we offer a standard 1‑year warranty on all workmanship and materials.' },
  { q: 'What is your payment structure?', a: 'We typically require a 30% deposit, with progress payments tied to milestones.' },
  { q: 'Can you handle large commercial projects?', a: 'Absolutely. We have extensive experience with office towers, hotels, and industrial complexes.' }
];
export const faqsFr = [
  { q: 'Quelles zones desservez-vous ?', a: 'Nous opérons à travers le Ghana et l\\'Afrique de l\\'Ouest, avec un accent sur Accra, Kumasi et Tema.' },
  { q: 'Combien de temps dure un aménagement typique ?', a: 'En fonction de la portée, la plupart des projets durent de 4 à 12 semaines.' },
  { q: 'Offrez-vous des garanties ?', a: 'Oui, nous offrons une garantie standard d\\'un an sur toute la main-d\\'œuvre et les matériaux.' },
  { q: 'Quelle est votre structure de paiement ?', a: 'Nous exigeons généralement un acompte de 30 %, avec des paiements d\\'étape liés aux jalons.' },
  { q: 'Pouvez-vous gérer de grands projets commerciaux ?', a: 'Absolument. Nous avons une vaste expérience avec les tours de bureaux, les hôtels et les complexes industriels.' }
];
export const getFaqs = (lang: string) => lang === 'fr' ? faqsFr : faqsEn;
export const faqs = faqsEn;
`);

fs.writeFileSync('src/data.ts', dataTs);
