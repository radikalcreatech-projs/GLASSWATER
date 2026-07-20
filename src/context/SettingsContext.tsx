import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WebsiteSettings {
  logoUrl: string;
  contactImageUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  paymentDetails: string;
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
}

const DEFAULT_SETTINGS: WebsiteSettings = {
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
          localStorage.setItem('glasswater_settings', JSON.stringify(parsed));
        }
        setSettings(parsed);
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
    setSettings(newSettings);
    localStorage.setItem('glasswater_settings', JSON.stringify(newSettings));
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
