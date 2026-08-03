import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WebsiteSettings {
  companyName: string;
  logoUrl: string;
  contactImageUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok?: string;
  paymentDetails: string;
  adminPassword?: string;
  termsAndConditions?: string;
  siteUrl: string;
}

export interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ClientDocument {
  code: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  title: string;
  type: 'Estimate' | 'Waybill' | 'Invoice' | 'Receipt';
  status: 'Draft' | 'Sent' | 'Approved' | 'Delivered' | 'Paid' | 'Cancelled';
  date: string;
  dueDate?: string;
  items: DocumentItem[];
  notes?: string;
  totalAmount: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  includePaymentDetails?: boolean;
  fileUrl?: string;
  includeTerms?: boolean;
}

// ── Crypto helpers ─────────────────────────────────────────────

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Returns true when `candidate` looks like a SHA-256 hex digest (64 hex chars). */
function isHashed(value: string | undefined): boolean {
  return typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value);
}

async function hashPassword(plain: string): Promise<string> {
  return sha256(plain);
}

async function verifyPassword(plain: string, storedHash: string): Promise<boolean> {
  const candidate = await sha256(plain);
  // Constant-time-ish: compare every char rather than short-circuiting
  if (candidate.length !== storedHash.length) return false;
  let mismatch = 0;
  for (let i = 0; i < candidate.length; i++) {
    mismatch |= candidate.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return mismatch === 0;
}

// ── Defaults ───────────────────────────────────────────────────

const DEFAULT_SETTINGS: WebsiteSettings = {
  companyName: "Glasswater Fit-Outs 0026 Co. Ltd.",
  logoUrl: 'https://lh3.googleusercontent.com/d/17P2w-kaeNW06Xb5OTU1UK-sRLSV4RUsy',
  contactImageUrl: 'https://lh3.googleusercontent.com/d/1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6c',
  phone: '0248284384',
  whatsapp: 'https://wa.me/2330248284384',
  email: 'glasswaterfits@gmail.com',
  address: 'Agbogba Junction, Abokobi,\nAccra, Ghana',
  facebook: 'https://facebook.com/glasswater',
  instagram: 'https://instagram.com/glasswater',
  linkedin: 'https://linkedin.com/company/glasswater',
  paymentDetails: 'Bank: Example Bank\nAccount Name: Glasswater Fit-Outs\nAccount Number: 1234567890\nMomo: 0248284384',
  siteUrl: window.location.origin || 'https://glasswater.com',
  // adminPassword is now managed server-side via Vercel Edge Function (api/auth.ts)
};

const DEFAULT_DOCUMENTS: ClientDocument[] = [
  {
    code: 'GW-DEMO',
    clientName: 'Kofi Mensah',
    clientEmail: 'kofi.mensah@example.com',
    clientPhone: '0244123456',
    title: 'Water Treatment System & Piping Fit-Out',
    type: 'Estimate',
    status: 'Approved',
    date: '2026-07-09',
    dueDate: '2026-08-09',
    items: [
      { id: '1', description: 'Heavy-Duty Reverse Osmosis Filtration Unit', quantity: 1, unitPrice: 4500, total: 4500 },
      { id: '2', description: 'Copper piping & fitting joints', quantity: 12, unitPrice: 150, total: 1800 },
      { id: '3', description: 'Installation, testing & water quality analysis labor', quantity: 1, unitPrice: 1200, total: 1200 },
    ],
    totalAmount: 7500,
    notes: 'This estimate is valid for 30 days. Includes a 12-month full warranty on filtration machinery.',
  }
];

interface SettingsContextType {
  settings: WebsiteSettings;
  updateSettings: (newSettings: WebsiteSettings) => void;
  documents: ClientDocument[];
  addDocument: (doc: ClientDocument) => void;
  updateDocument: (doc: ClientDocument) => void;
  deleteDocument: (code: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [documents, setDocuments] = useState<ClientDocument[]>(DEFAULT_DOCUMENTS);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('glasswater_settings');
    if (savedSettings) {
      try {
        let parsed = JSON.parse(savedSettings);
        if (parsed.contactImageUrl?.includes('1eOKbap3UVyhpSfsQyZoZXUd1LGjgLn72')) {
          parsed.contactImageUrl = 'https://lh3.googleusercontent.com/d/1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6c';
        }
        // Migrate plain-text admin passwords to SHA-256 hashes on load
        if (parsed.adminPassword && !isHashed(parsed.adminPassword)) {
          sha256(parsed.adminPassword).then(hash => {
            parsed.adminPassword = hash;
            localStorage.setItem('glasswater_settings', JSON.stringify(parsed));
            setSettings(parsed);
          }).catch(e => {
            console.error('Failed to hash admin password on migration:', e);
            setSettings(parsed); // keep the plain-text password as-is
          });
        } else {
          setSettings(parsed);
        }
      } catch (e) {
        console.error('Error loading settings', e);
      }
    }

    // Load documents from localStorage
    const savedDocs = localStorage.getItem('glasswater_documents');
    if (savedDocs) {
      try {
        setDocuments(JSON.parse(savedDocs));
      } catch (e) {
        console.error('Error loading documents', e);
      }
    } else {
      localStorage.setItem('glasswater_documents', JSON.stringify(DEFAULT_DOCUMENTS));
    }
  }, []);

  const updateSettings = (newSettings: WebsiteSettings) => {
    // Hash admin password if it's plain text
    if (newSettings.adminPassword && !isHashed(newSettings.adminPassword)) {
      sha256(newSettings.adminPassword).then(hash => {
        const hashedSettings = { ...newSettings, adminPassword: hash };
        setSettings(hashedSettings);
        localStorage.setItem('glasswater_settings', JSON.stringify(hashedSettings));
      }).catch(e => {
        console.error('Failed to hash admin password on save:', e);
        // Fall back to storing as-is if hashing fails
        setSettings(newSettings);
        localStorage.setItem('glasswater_settings', JSON.stringify(newSettings));
      });
    } else {
      setSettings(newSettings);
      localStorage.setItem('glasswater_settings', JSON.stringify(newSettings));
    }
  };

  const addDocument = (doc: ClientDocument) => {
    const updatedDocs = [doc, ...documents];
    setDocuments(updatedDocs);
    localStorage.setItem('glasswater_documents', JSON.stringify(updatedDocs));
  };

  const updateDocument = (doc: ClientDocument) => {
    const updatedDocs = documents.map(d => d.code === doc.code ? doc : d);
    setDocuments(updatedDocs);
    localStorage.setItem('glasswater_documents', JSON.stringify(updatedDocs));
  };

  const deleteDocument = (code: string) => {
    const updatedDocs = documents.filter(d => d.code !== code);
    setDocuments(updatedDocs);
    localStorage.setItem('glasswater_documents', JSON.stringify(updatedDocs));
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      documents,
      addDocument,
      updateDocument,
      deleteDocument
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}