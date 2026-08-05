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
  headingHtml: string;
  subheading: string;
  cta1Text: string;
  cta2Text: string;
  statsProjects: string;
  statsProjectsLabel: string;
  statsCommercial: string;
  statsCommercialLabel: string;
  statsSatisfaction: string;
  statsSatisfactionLabel: string;
}

export interface HomeAboutContent {
  heading: string;
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
  iconName: string;
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
  cvEmailText: string;
  vacancies: JobVacancy[];
}

export interface WizardOption {
  value: string;
  label: string;
}

export interface FormsContent {
  quoteButtonLabel: string;
  wizardStepLabels: string[];
  wizardTypeOptions: WizardOption[];
  wizardScopeChecks: WizardOption[];
  wizardBudgetOptions: WizardOption[];
  wizardUrgencyOptions: WizardOption[];
  wizardFileInstructions: string;
  contactServiceOptions: WizardOption[];
  contactConfirmationText: string;
  contactThankYouTitle: string;
  contactSendAnotherLabel: string;
  contactEmailUsLabel: string;
}

export interface PageBlock {
  key: string;
  content: string;
}

// ── Bilingual Defaults ───────────────────────────────────────────

const HOME_HERO_DEFAULTS: Record<string, HomeHeroContent> = {
  en: {
    headingHtml: 'Precision Built.<br><i class="font-normal text-steel-blue">Dependably Delivered.</i>',
    subheading: 'Engineering, construction, interior fit-out and facilities management across West Africa.',
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
    headingHtml: 'Construit avec precision.<br><i class="font-normal text-steel-blue">Livre avec fiabilite.</i>',
    subheading: 'Ingenierie, construction, amenagement interieur et gestion des installations en Afrique de l\'Ouest.',
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
    description: 'We are an integrated construction, engineering, interior fit-out and facilities management company delivering commercial, industrial, hospitality, institutional and residential projects across West Africa.',
    readMoreLabel: 'Read more',
  },
  fr: {
    heading: 'Construire l\'avenir avec precision',
    description: 'Nous sommes une entreprise integree de construction, d\'ingenierie, d\'amenagement interieur et de gestion des installations, realisant des projets commerciaux, industriels, hoteliers, institutionnels et residentiels en Afrique de l\'Ouest.',
    readMoreLabel: 'En savoir plus',
  },
};

const ABOUT_PAGE_DEFAULTS: Record<string, AboutPageContent> = {
  en: {
    title: 'About Glasswater',
    description: 'We are an integrated construction, engineering, interior fit-out and facilities management company delivering commercial, industrial, hospitality, institutional and residential projects across West Africa.',
    values: ['Precision', 'Integrity', 'Safety', 'Innovation', 'Quality', 'Professionalism', 'Accountability', 'Reliability'],
    visionTitle: 'Our Vision',
    visionText: 'To become West Africa\'s most trusted fit-out, engineering and building solutions company known for precision, innovation and dependable project delivery.',
  },
  fr: {
    title: 'A propos de Glasswater',
    description: 'Nous sommes une entreprise integree de construction, d\'ingenierie, d\'amenagement interieur et de gestion des installations, realisant des projets commerciaux, industriels, hoteliers, institutionnels et residentiels en Afrique de l\'Ouest.',
    values: ['Precision', 'Integrite', 'Securite', 'Innovation', 'Qualite', 'Professionnalisme', 'Responsabilite', 'Fiabilite'],
    visionTitle: 'Notre Vision',
    visionText: 'Devenir la societe de construction, d\'amenagement et de solutions de batiment la plus fiable en Afrique de l\'Ouest, reconnue pour sa precision, son innovation et sa fiabilite.',
  },
};

const FAQ_DEFAULTS: Record<string, FAQContent> = {
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers to common questions',
    items: [
      { q: 'What areas do you serve?', a: 'We operate across Ghana and West Africa, with a focus on Accra, Kumasi, and Tema.' },
      { q: 'How long does a typical fit-out take?', a: 'Depending on the scope, most projects range from 4 to 12 weeks.' },
      { q: 'Do you provide warranties?', a: 'Yes, we offer a standard 1-year warranty on all workmanship and materials.' },
      { q: 'What is your payment structure?', a: 'We typically require a 30% deposit, with progress payments tied to milestones.' },
      { q: 'Can you handle large commercial projects?', a: 'Absolutely. We have extensive experience with office towers, hotels, and industrial complexes.' },
    ],
  },
  fr: {
    title: 'Questions Frequentes',
    subtitle: 'Reponses rapides aux questions courantes',
    items: [
      { q: 'Quelles zones desservez-vous ?', a: 'Nous operons a travers le Ghana et l\'Afrique de l\'Ouest, avec un accent sur Accra, Kumasi et Tema.' },
      { q: 'Combien de temps dure un amenagement typique ?', a: 'En fonction de la portee, la plupart des projets durent de 4 a 12 semaines.' },
      { q: 'Offrez-vous des garanties ?', a: 'Oui, nous offrons une garantie standard d\'un an sur toute la main-d\'oeuvre et les materiaux.' },
      { q: 'Quelle est votre structure de paiement ?', a: 'Nous exigeons generalement un acompte de 30 %, avec des paiements d\'etape lies aux jalons.' },
      { q: 'Pouvez-vous gerer de grands projets commerciaux ?', a: 'Absolument. Nous avons une vaste experience avec les tours de bureaux, les hotels et les complexes industriels.' },
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
      { iconName: 'Sofa', title: 'Interior Fit-Out', description: 'Office, hospitality, and residential interiors.' },
      { iconName: 'Paintbrush', title: 'Finishing Works', description: 'Painting, flooring, carpentry, and more.' },
      { iconName: 'Droplets', title: 'Waterproofing & Protection', description: 'Roof, basement, and damp-proofing solutions.' },
      { iconName: 'Waves', title: 'Swimming Pool Engineering', description: 'Design, build, filtration, and maintenance.' },
      { iconName: 'Building2', title: 'Facilities Management', description: 'Maintenance, asset, and energy management.' },
    ],
  },
  fr: {
    title: 'Nos Solutions',
    subtitle: 'Services complets pour tout le cycle de vie du projet',
    items: [
      { iconName: 'Settings', title: 'Ingenierie', description: 'Structure, CVC, et gestion de projet.' },
      { iconName: 'HardHat', title: 'Construction', description: 'Nouveaux batiments, renovations et supervision de chantier.' },
      { iconName: 'Sofa', title: 'Amenagement interieur', description: 'Bureaux, hotellerie et interieurs residentiels.' },
      { iconName: 'Paintbrush', title: 'Travaux de finition', description: 'Peinture, revetements de sol, menuiserie, etc.' },
      { iconName: 'Droplets', title: 'Etancheite et protection', description: 'Solutions pour toits, sous-sols et remontees capillaires.' },
      { iconName: 'Waves', title: 'Ingenierie des piscines', description: 'Conception, construction, filtration et entretien.' },
      { iconName: 'Building2', title: 'Gestion des installations', description: 'Maintenance, gestion d\'actifs et d\'energie.' },
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
    title: 'Carrieres',
    noVacanciesTitle: 'Aucun Poste Vacant',
    noVacanciesText: 'Nous n\'avons actuellement aucun poste ouvert. Veuillez revenir plus tard ou nous vous tiendrons informe des opportunites.',
    cvEmailText: 'Vous pouvez toujours envoyer votre CV a <strong>glasswaterfits@gmail.com</strong> pour une future consideration.',
    vacancies: [],
  },
};

const FORMS_DEFAULTS: Record<string, FormsContent> = {
  en: {
    quoteButtonLabel: 'Request a Quote',
    wizardStepLabels: ['Type', 'Property', 'Scope', 'Budget', 'Files', 'Contact'],
    wizardTypeOptions: [
      { value: 'new-build', label: 'New Build' },
      { value: 'renovation', label: 'Renovation' },
      { value: 'fit-out', label: 'Fit-Out' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'waterproofing', label: 'Waterproofing' },
    ],
    wizardScopeChecks: [
      { value: 'electrical', label: 'Electrical' },
      { value: 'plumbing', label: 'Plumbing' },
      { value: 'carpentry', label: 'Carpentry' },
      { value: 'painting', label: 'Painting' },
    ],
    wizardBudgetOptions: [
      { value: 'under-10k', label: 'Under GHS 10,000' },
      { value: '10-50k', label: 'GHS 10,000 - 50,000' },
      { value: '50-100k', label: 'GHS 50,000 - 100,000' },
      { value: '100-500k', label: 'GHS 100,000 - 500,000' },
      { value: 'over-500k', label: 'Over GHS 500,000' },
    ],
    wizardUrgencyOptions: [
      { value: 'immediate', label: 'Immediate (within 1 week)' },
      { value: 'soon', label: 'Soon (1-4 weeks)' },
      { value: 'planned', label: 'Planned (1-3 months)' },
    ],
    wizardFileInstructions: '<p>Please email any photos, floor plans, or project documents (PDFs, DWGs, images) to <strong>glasswaterfits@gmail.com</strong> after submitting this request. Reference your name in the subject line so we can match your files to your quote request.</p><p className="text-sm text-text-secondary mt-2">Accepted formats: images, PDFs, AutoCAD DWG files. Max 25MB total per email.</p>',
    contactServiceOptions: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Construction', label: 'Construction' },
      { value: 'Interior Fit-Out', label: 'Interior Fit-Out' },
      { value: 'Finishing Works', label: 'Finishing Works' },
      { value: 'Waterproofing', label: 'Waterproofing' },
      { value: 'Swimming Pool Engineering', label: 'Swimming Pool Engineering' },
      { value: 'Facilities Management', label: 'Facilities Management' },
      { value: 'Other', label: 'Other' },
    ],
    contactConfirmationText: 'Your enquiry has been received! Our team will respond within 24 hours.',
    contactThankYouTitle: 'Thank You!',
    contactSendAnotherLabel: 'Send Another Message',
    contactEmailUsLabel: 'Email Us Directly',
  },
  fr: {
    quoteButtonLabel: 'Demander un devis',
    wizardStepLabels: ['Type', 'Propriete', 'Portee', 'Budget', 'Fichiers', 'Contact'],
    wizardTypeOptions: [
      { value: 'new-build', label: 'Nouvelle construction' },
      { value: 'renovation', label: 'Renovation' },
      { value: 'fit-out', label: 'Amenagement interieur' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'waterproofing', label: 'Etancheite' },
    ],
    wizardScopeChecks: [
      { value: 'electrical', label: 'Electricite' },
      { value: 'plumbing', label: 'Plomberie' },
      { value: 'carpentry', label: 'Menuiserie' },
      { value: 'painting', label: 'Peinture' },
    ],
    wizardBudgetOptions: [
      { value: 'under-10k', label: 'Moins de 10 000 GHS' },
      { value: '10-50k', label: '10 000 GHS - 50 000 GHS' },
      { value: '50-100k', label: '50 000 GHS - 100 000 GHS' },
      { value: '100-500k', label: '100 000 GHS - 500 000 GHS' },
      { value: 'over-500k', label: 'Plus de 500 000 GHS' },
    ],
    wizardUrgencyOptions: [
      { value: 'immediate', label: 'Immediat (sous 1 semaine)' },
      { value: 'soon', label: 'Bientot (1-4 semaines)' },
      { value: 'planned', label: 'Prevu (1-3 mois)' },
    ],
    wizardFileInstructions: '<p>Veuillez envoyer par e-mail les photos, plans d\'etage ou documents de projet (PDF, DWG, images) a <strong>glasswaterfits@gmail.com</strong> apres avoir soumis cette demande. Indiquez votre nom dans l\'objet pour que nous puissions associer vos fichiers a votre demande de devis.</p><p className="text-sm text-text-secondary mt-2">Formats acceptes : images, PDF, fichiers AutoCAD DWG. Max 25 Mo par e-mail.</p>',
    contactServiceOptions: [
      { value: 'Engineering', label: 'Ingenierie' },
      { value: 'Construction', label: 'Construction' },
      { value: 'Interior Fit-Out', label: 'Amenagement interieur' },
      { value: 'Finishing Works', label: 'Travaux de finition' },
      { value: 'Waterproofing', label: 'Etancheite' },
      { value: 'Swimming Pool Engineering', label: 'Ingenierie des piscines' },
      { value: 'Facilities Management', label: 'Gestion des installations' },
      { value: 'Other', label: 'Autre' },
    ],
    contactConfirmationText: 'Votre demande a bien ete recue ! Notre equipe vous repondra dans les 24 heures.',
    contactThankYouTitle: 'Merci !',
    contactSendAnotherLabel: 'Envoyer un autre message',
    contactEmailUsLabel: 'Nous ecrire directement',
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

// Forms & CTAs
export function getForms(lang: string): FormsContent {
  return getBilingual('glasswater_cms_forms', FORMS_DEFAULTS, lang);
}
export function saveForms(lang: string, data: FormsContent): void {
  setBilingual('glasswater_cms_forms', lang, data);
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