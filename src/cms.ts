/**
 * CMS Content Layer
 * 
 * All editable website content lives here with localStorage persistence.
 * Each content type has: TypeScript types, bilingual defaults (en/fr),
 * and getter/setter functions that read/write localStorage.
 * 
 * Pattern: Every getter reads localStorage first, falls back to defaults.
 */

// ── Types ────────────────────────────────────────────────────────

export interface HomeHeroContent {
  headingHtml: string;      // e.g. 'Precision Built.<br><i>Dependably Delivered.</i>'
  subheading: string;
  cta1Text: string;          // "Request a Consultation"
  cta2Text: string;          // "View Our Work"
  statsProjects: string;     // "150+"
  statsProjectsLabel: string;
  statsCommercial: string;   // "50+"
  statsCommercialLabel: string;
  statsSatisfaction: string; // "90%"
  statsSatisfactionLabel: string;
}

export interface HomeAboutContent {
  heading: string;           // e.g. "Building the Future with Precision"
  description: string;
  readMoreLabel: string;
}

export interface AboutPageContent {
  title: string;
  description: string;
  values: string[];
  visionTitle: string;
  visionText: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQContent {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

export interface ServiceItem {
  iconName: string;  // Lucide icon name e.g. 'Settings', 'HardHat', 'Sofa'
  title: string;
  description: string;
}

export interface ServicesContent {
  title: string;
  subtitle: string;
  items: ServiceItem[];
}

export interface JobVacancy {
  id: string;
  title: string;
  description: string;
  isOpen: boolean;
}

export interface CareersContent {
  title: string;
  noVacanciesTitle: string;
  noVacanciesText: string;
  cvEmailText: string;       // HTML with <strong> email
  vacancies: JobVacancy[];
}

// Optional: content block for any page (key-value pairs for flexible use)
export interface PageBlock {
  key: string;
  content: string;           // Can be HTML
}

// ── Bilingual Defaults ───────────────────────────────────────────

const HOME_HERO_DEFAULTS: Record<string, HomeHeroContent> = {
  en: {
    headingHtml: 'Precision Built.<br><i class="font-normal text-steel-blue">Dependably Delivered.</i>',
    subheading: 'Engineering, construction, interior fit‑out and facilities management across West Africa.',
    cta1Text: 'Request a Consultation',
    cta2Text: 'View Our Work',
    statsProjects: '150+',
    statsProjectsLabel: 'Projects',
    statsCommercial: '50+',
    statsCommercialLabel: 'Commercial',
    statsSatisfaction: '90%',
    statsSatisfactionLabel: 'Satisfaction',
  },
  fr: {
    headingHtml: 'Construit avec précision.<br><i class="font-normal text-steel-blue">Livré avec fiabilité.</i>',
    subheading: 'Ingénierie, construction, aménagement intérieur et gestion des installations en Afrique de l\'Ouest.',
    cta1Text: 'Demander un devis',
    cta2Text: 'Voir nos projets',
    statsProjects: '150+',
    statsProjectsLabel: 'Projets',
    statsCommercial: '50+',
    statsCommercialLabel: 'Commercial',
    statsSatisfaction: '90%',
    statsSatisfactionLabel: 'Satisfaction',
  },
};

const HOME_ABOUT_DEFAULTS: Record<string, HomeAboutContent> = {
  en: {
    heading: 'Building the Future with Precision',
    description: 'We are an integrated construction, engineering, interior fit‑out and facilities management company delivering commercial, industrial, hospitality, institutional and residential projects across West Africa.',
    readMoreLabel: 'Read more',
  },
  fr: {
    heading: 'Construire l\'avenir avec précision',
    description: 'Nous sommes une entreprise intégrée de construction, d\'ingénierie, d\'aménagement intérieur et de gestion des installations, réalisant des projets commerciaux, industriels, hôteliers, institutionnels et résidentiels en Afrique de l\'Ouest.',
    readMoreLabel: 'En savoir plus',
  },
};

const ABOUT_PAGE_DEFAULTS: Record<string, AboutPageContent> = {
  en: {
    title: 'About Glasswater',
    description: 'We are an integrated construction, engineering, interior fit‑out and facilities management company delivering commercial, industrial, hospitality, institutional and residential projects across West Africa.',
    values: ['Precision', 'Integrity', 'Safety', 'Innovation', 'Quality', 'Professionalism', 'Accountability', 'Reliability'],
    visionTitle: 'Our Vision',
    visionText: 'To become West Africa\'s most trusted fit‑out, engineering and building solutions company known for precision, innovation and dependable project delivery.',
  },
  fr: {
    title: 'À propos de Glasswater',
    description: 'Nous sommes une entreprise intégrée de construction, d\'ingénierie, d\'aménagement intérieur et de gestion des installations, réalisant des projets commerciaux, industriels, hôteliers, institutionnels et résidentiels en Afrique de l\'Ouest.',
    values: ['Précision', 'Intégrité', 'Sécurité', 'Innovation', 'Qualité', 'Professionnalisme', 'Responsabilité', 'Fiabilité'],
    visionTitle: 'Notre Vision',
    visionText: 'Devenir la société de construction, d\'aménagement et de solutions de bâtiment la plus fiable en Afrique de l\'Ouest, reconnue pour sa précision, son innovation et sa fiabilité.',
  },
};

const FAQ_DEFAULTS: Record<string, FAQContent> = {
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers to common questions',
    items: [
      { q: 'What areas do you serve?', a: 'We operate across Ghana and West Africa, with a focus on Accra, Kumasi, and Tema.' },
      { q: 'How long does a typical fit‑out take?', a: 'Depending on the scope, most projects range from 4 to 12 weeks.' },
      { q: 'Do you provide warranties?', a: 'Yes, we offer a standard 1‑year warranty on all workmanship and materials.' },
      { q: 'What is your payment structure?', a: 'We typically require a 30% deposit, with progress payments tied to milestones.' },
      { q: 'Can you handle large commercial projects?', a: 'Absolutely. We have extensive experience with office towers, hotels, and industrial complexes.' },
    ],
  },
  fr: {
    title: 'Questions Fréquentes',
    subtitle: 'Réponses rapides aux questions courantes',
    items: [
      { q: 'Quelles zones desservez-vous ?', a: 'Nous opérons à travers le Ghana et l\'Afrique de l\'Ouest, avec un accent sur Accra, Kumasi et Tema.' },
      { q: 'Combien de temps dure un aménagement typique ?', a: 'En fonction de la portée, la plupart des projets durent de 4 à 12 semaines.' },
      { q: 'Offrez-vous des garanties ?', a: 'Oui, nous offrons une garantie standard d\'un an sur toute la main-d\'œuvre et les matériaux.' },
      { q: 'Quelle est votre structure de paiement ?', a: 'Nous exigeons généralement un acompte de 30 %, avec des paiements d\'étape liés aux jalons.' },
      { q: 'Pouvez-vous gérer de grands projets commerciaux ?', a: 'Absolument. Nous avons une vaste expérience avec les tours de bureaux, les hôtels et les complexes industriels.' },
    ],
  },
};

const SERVICES_DEFAULTS: Record<string, ServicesContent> = {
  en: {
    title: 'Our Solutions',
    subtitle: 'Comprehensive services across the project lifecycle',
    items: [
      { iconName: 'Settings', title: 'Engineering Services', description: 'Structural, MEP, and project management.' },
      { iconName: 'HardHat', title: 'Construction Services', description: 'New builds, renovations, and site management.' },
      { iconName: 'Sofa', title: 'Interior Fit‑Out', description: 'Office, hospitality, and residential interiors.' },
      { iconName: 'Paintbrush', title: 'Finishing Works', description: 'Painting, flooring, carpentry, and more.' },
      { iconName: 'Droplets', title: 'Waterproofing & Protection', description: 'Roof, basement, and damp‑proofing solutions.' },
      { iconName: 'Waves', title: 'Swimming Pool Engineering', description: 'Design, build, filtration, and maintenance.' },
      { iconName: 'Building2', title: 'Facilities Management', description: 'Maintenance, asset, and energy management.' },
    ],
  },
  fr: {
    title: 'Nos Solutions',
    subtitle: 'Services complets pour tout le cycle de vie du projet',
    items: [
      { iconName: 'Settings', title: 'Ingénierie', description: 'Structure, CVC, et gestion de projet.' },
      { iconName: 'HardHat', title: 'Construction', description: 'Nouveaux bâtiments, rénovations et supervision de chantier.' },
      { iconName: 'Sofa', title: 'Aménagement intérieur', description: 'Bureaux, hôtellerie et intérieurs résidentiels.' },
      { iconName: 'Paintbrush', title: 'Travaux de finition', description: 'Peinture, revêtements de sol, menuiserie, etc.' },
      { iconName: 'Droplets', title: 'Étanchéité et protection', description: 'Solutions pour toits, sous‑sols et remontées capillaires.' },
      { iconName: 'Waves', title: 'Ingénierie des piscines', description: 'Conception, construction, filtration et entretien.' },
      { iconName: 'Building2', title: 'Gestion des installations', description: 'Maintenance, gestion d\'actifs et d\'énergie.' },
    ],
  },
};

const CAREERS_DEFAULTS: Record<string, CareersContent> = {
  en: {
    title: 'Careers',
    noVacanciesTitle: 'No Open Vacancies',
    noVacanciesText: 'We currently do not have any open positions. Please check back later or we will update you when opportunities arise.',
    cvEmailText: 'You can still send your CV to <strong>glasswaterfits@gmail.com</strong> for future consideration.',
    vacancies: [],
  },
  fr: {
    title: 'Carrières',
    noVacanciesTitle: 'Aucun Poste Vacant',
    noVacanciesText: 'Nous n\'avons actuellement aucun poste ouvert. Veuillez revenir plus tard ou nous vous tiendrons informé des opportunités.',
    cvEmailText: 'Vous pouvez toujours envoyer votre CV à <strong>glasswaterfits@gmail.com</strong> pour une future considération.',
    vacancies: [],
  },
};

// ── Generic localStorage helpers ─────────────────────────────────

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch (e) {
    console.error(`CMS: Failed to load ${key}`, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`CMS: Failed to save ${key}`, e);
  }
}

// ── Getters (consume CMS data) ───────────────────────────────────

function getBilingual<T>(storageKey: string, defaults: Record<string, T>, lang: string): T {
  const data = loadFromStorage<Record<string, T> | null>(storageKey, null);
  if (data && data[lang]) {
    return { ...defaults[lang] || defaults.en, ...data[lang] };
  }
  return defaults[lang] || defaults.en;
}

function setBilingual<T>(storageKey: string, lang: string, value: T): void {
  const existing = loadFromStorage<Record<string, T>>(storageKey, {} as Record<string, T>);
  existing[lang] = value;
  saveToStorage(storageKey, existing);
}

// Home Hero
export function getHomeHero(lang: string): HomeHeroContent {
  return getBilingual('glasswater_cms_home_hero', HOME_HERO_DEFAULTS, lang);
}
export function saveHomeHero(lang: string, data: HomeHeroContent): void {
  setBilingual('glasswater_cms_home_hero', lang, data);
}

// Home About
export function getHomeAbout(lang: string): HomeAboutContent {
  return getBilingual('glasswater_cms_home_about', HOME_ABOUT_DEFAULTS, lang);
}
export function saveHomeAbout(lang: string, data: HomeAboutContent): void {
  setBilingual('glasswater_cms_home_about', lang, data);
}

// About Page
export function getAboutPage(lang: string): AboutPageContent {
  return getBilingual('glasswater_cms_about_page', ABOUT_PAGE_DEFAULTS, lang);
}
export function saveAboutPage(lang: string, data: AboutPageContent): void {
  setBilingual('glasswater_cms_about_page', lang, data);
}

// FAQ
export function getFAQ(lang: string): FAQContent {
  return getBilingual('glasswater_cms_faq', FAQ_DEFAULTS, lang);
}
export function saveFAQ(lang: string, data: FAQContent): void {
  setBilingual('glasswater_cms_faq', lang, data);
}

// Services
export function getServices(lang: string): ServicesContent {
  return getBilingual('glasswater_cms_services', SERVICES_DEFAULTS, lang);
}
export function saveServices(lang: string, data: ServicesContent): void {
  setBilingual('glasswater_cms_services', lang, data);
}

// Careers
export function getCareers(lang: string): CareersContent {
  return getBilingual('glasswater_cms_careers', CAREERS_DEFAULTS, lang);
}
export function saveCareers(lang: string, data: CareersContent): void {
  setBilingual('glasswater_cms_careers', lang, data);
}

// ── Utility: Get all CMS data as downloadable JSON ───────────────

export function exportAllCMSData(): Record<string, unknown> {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('glasswater_cms_')) {
      keys.push(k);
    }
  }
  const data: Record<string, unknown> = {};
  for (const key of keys) {
    try {
      data[key] = JSON.parse(localStorage.getItem(key) || '');
    } catch {}
  }
  // Also include settings, projects, posts, reviews, documents, enquiries
  for (const k of ['glasswater_settings', 'glasswater_projects', 'glasswater_posts', 'glasswater_reviews', 'glasswater_documents', 'glasswater_enquiries']) {
    try {
      const val = localStorage.getItem(k);
      if (val) data[k] = JSON.parse(val);
    } catch {}
  }
  return data;
}

export function importAllCMSData(data: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(data)) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }
}