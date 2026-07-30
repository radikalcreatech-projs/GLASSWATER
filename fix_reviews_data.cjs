const fs = require('fs');
let dataTs = fs.readFileSync('src/data.ts', 'utf8');

// Replace defaultReviews array
dataTs = dataTs.replace(/export const defaultReviews = \[[\s\S]*?\];/m, 
`export const defaultReviews = [
  {
    name: 'Kofi Mensah',
    location: 'Airport Residential Area, Accra',
    rating: 5,
    text: 'Glasswater completed the fit‑out for our new corporate office ahead of schedule. The craftsmanship in the glass partitioning and finishing is pristine. Highly recommended!',
    date: 1717843200000
  },
  {
    name: 'Naa Adjeley',
    location: 'East Legon, Accra',
    rating: 5,
    text: 'We had persistent dampness and roof leaks in our warehouse for years. Glasswater applied their multi‑layer liquid waterproofing system, and we have been bone dry ever since.',
    date: 1718016000000
  },
  {
    name: 'Ekow Benson',
    location: 'Tema Community 6',
    rating: 4,
    text: 'Superb project management and structural engineering. Their pool construction division is also state‑of‑the‑art. Communication was excellent throughout the project.',
    date: 1718275200000
  }
];

export const defaultReviewsFR = [
  {
    name: 'Kofi Mensah',
    location: 'Airport Residential Area, Accra',
    rating: 5,
    text: 'Glasswater a terminé l\\'aménagement de notre nouveau siège social avant la date prévue. Le savoir-faire dans les cloisons vitrées et les finitions est impeccable. Fortement recommandé !',
    date: 1717843200000
  },
  {
    name: 'Naa Adjeley',
    location: 'East Legon, Accra',
    rating: 5,
    text: 'Nous avions une humidité persistante et des fuites de toit dans notre entrepôt depuis des années. Glasswater a appliqué son système d\\'étanchéité liquide multicouche et nous sommes au sec depuis.',
    date: 1718016000000
  },
  {
    name: 'Ekow Benson',
    location: 'Tema Community 6',
    rating: 4,
    text: 'Superbe gestion de projet et ingénierie structurelle. Leur division de construction de piscines est également à la pointe de la technologie. La communication a été excellente tout au long du projet.',
    date: 1718275200000
  }
];

export function getReviews(lang) {
  return lang === 'fr' ? defaultReviewsFR : defaultReviews;
}
`);
fs.writeFileSync('src/data.ts', dataTs);
