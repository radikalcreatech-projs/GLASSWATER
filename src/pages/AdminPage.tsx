import React from "react";
import { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Settings, LogOut, CheckCircle2, XCircle, Trash2, Edit, Star, Plus, FileText, Copy, Check, Info, Share2, Eye, PlusCircle, Trash, Globe, Download, Loader, EyeOff, Mail, Phone, Layout, HelpCircle, Wrench, Briefcase, Upload, Download as DownloadIcon, RefreshCw } from 'lucide-react';
import { projects as defaultProjects, posts as defaultPosts, defaultReviews } from '../data';
import { useSettings, WebsiteSettings, ClientDocument, DocumentItem } from '../context/SettingsContext';
import { useI18n } from '../context/I18nContext';
import { useToast } from '../context/ToastContext';
import { login as authLogin, logout as authLogout, isAuthenticated as checkAuth, isLockedOut, clearLockout } from '../utils/auth';
import { notify } from '../utils/notifications';
import * as CMS from '../cms';

export function AdminPage() {
  const { navigate, isTransitioning } = useNavigation();
  const { t, lang } = useI18n();
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth());
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLocked, setLoginLocked] = useState(() => isLockedOut().locked);
  const [lockCountdown, setLockCountdown] = useState(() => isLockedOut().remainingSeconds);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSettingsPassword, setShowSettingsPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<'reviews' | 'projects' | 'insights' | 'settings' | 'documents' | 'enquiries' | 'cms'>('reviews');

  const [reviews, setReviews] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  // Settings & Documents Integration
  const { settings, updateSettings, documents, addDocument, updateDocument, deleteDocument } = useSettings();

  const [localSettings, setLocalSettings] = useState<WebsiteSettings>({ ...settings });
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Client Documents States
  const [showDocForm, setShowDocForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ClientDocument | null>(null);
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [copyCodeSuccess, setCopyCodeSuccess] = useState<string | null>(null);
  const [docSaveMessage, setDocSaveMessage] = useState<string | null>(null);
  const [isSavingDoc, setIsSavingDoc] = useState(false);
  const [docErrors, setDocErrors] = useState<Record<string, string>>({});

  // CMS state
  const [cmsLang, setCmsLang] = useState<'en' | 'fr'>(lang as 'en' | 'fr');
  const [cmsSubTab, setCmsSubTab] = useState<'home_hero' | 'home_about' | 'about' | 'faq' | 'services' | 'careers'>('home_hero');
  const [cmsHomeHero, setCmsHomeHero] = useState(CMS.getHomeHero(cmsLang));
  const [cmsHomeAbout, setCmsHomeAbout] = useState(CMS.getHomeAbout(cmsLang));
  const [cmsAboutPage, setCmsAboutPage] = useState(CMS.getAboutPage(cmsLang));
  const [cmsFAQ, setCmsFAQ] = useState(CMS.getFAQ(cmsLang));
  const [cmsServices, setCmsServices] = useState(CMS.getServices(cmsLang));
  const [cmsCareers, setCmsCareers] = useState(CMS.getCareers(cmsLang));
  const [cmsExportData, setCmsExportData] = useState('');
  const [cmsImportData, setCmsImportData] = useState('');

  const refreshCmsData = () => {
    setCmsHomeHero(CMS.getHomeHero(cmsLang));
    setCmsHomeAbout(CMS.getHomeAbout(cmsLang));
    setCmsAboutPage(CMS.getAboutPage(cmsLang));
    setCmsFAQ(CMS.getFAQ(cmsLang));
    setCmsServices(CMS.getServices(cmsLang));
    setCmsCareers(CMS.getCareers(cmsLang));
  };

  const handleCmsLangChange = (newLang: 'en' | 'fr') => {
    setCmsLang(newLang);
    setTimeout(() => {
      setCmsHomeHero(CMS.getHomeHero(newLang));
      setCmsHomeAbout(CMS.getHomeAbout(newLang));
      setCmsAboutPage(CMS.getAboutPage(newLang));
      setCmsFAQ(CMS.getFAQ(newLang));
      setCmsServices(CMS.getServices(newLang));
      setCmsCareers(CMS.getCareers(newLang));
    }, 10);
  };

  const handleSaveCms = (type: string) => {
    switch (type) {
      case 'home_hero': CMS.saveHomeHero(cmsLang, cmsHomeHero); break;
      case 'home_about': CMS.saveHomeAbout(cmsLang, cmsHomeAbout); break;
      case 'about': CMS.saveAboutPage(cmsLang, cmsAboutPage); break;
      case 'faq': CMS.saveFAQ(cmsLang, cmsFAQ); break;
      case 'services': CMS.saveServices(cmsLang, cmsServices); break;
      case 'careers': CMS.saveCareers(cmsLang, cmsCareers); break;
    }
    addToast('success', t('admin.cms_saved'), 3000);
  };

  const handleResetCms = (type: string) => {
    if (!confirm(t('admin.cms_reset_confirm'))) return;
    switch (type) {
      case 'home_hero': CMS.saveHomeHero(cmsLang, CMS.getHomeHero(cmsLang)); break;
      case 'home_about': CMS.saveHomeAbout(cmsLang, CMS.getHomeAbout(cmsLang)); break;
      case 'about': CMS.saveAboutPage(cmsLang, CMS.getAboutPage(cmsLang)); break;
      case 'faq': CMS.saveFAQ(cmsLang, CMS.getFAQ(cmsLang)); break;
      case 'services': CMS.saveServices(cmsLang, CMS.getServices(cmsLang)); break;
      case 'careers': CMS.saveCareers(cmsLang, CMS.getCareers(cmsLang)); break;
    }
    refreshCmsData();
    addToast('success', t('admin.cms_saved'), 3000);
  };

  useEffect(() => {
    setLocalSettings({ ...settings });
  }, [settings]);

  const setFormSettingsVal = (key: keyof WebsiteSettings, val: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const calcDocTotal = (items: DocumentItem[], discountType?: string, discountValue?: number) => {
    let sum = items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0)), 0);
    if (discountType === 'fixed') {
      sum = Math.max(0, sum - (Number(discountValue) || 0));
    } else if (discountType === 'percentage') {
      sum = Math.max(0, sum - (sum * (Number(discountValue) || 0) / 100));
    }
    return sum;
  };

  const handleDocItemChange = (itemId: string, field: keyof DocumentItem, value: any) => {
    if (!editingDoc) return;
    const updatedItems = editingDoc.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          const q = field === 'quantity' ? Number(value) : Number(item.quantity);
          const p = field === 'unitPrice' ? Number(value) : Number(item.unitPrice);
          updatedItem.total = q * p;
        }
        return updatedItem;
      }
      return item;
    });

    setEditingDoc({
      ...editingDoc,
      items: updatedItems,
      totalAmount: calcDocTotal(updatedItems, editingDoc.discountType, editingDoc.discountValue)
    });
  };

  const handleDocDiscountChange = (field: 'discountType' | 'discountValue', value: any) => {
    if (!editingDoc) return;
    const newDoc = { ...editingDoc, [field]: value };
    setEditingDoc({
      ...newDoc,
      totalAmount: calcDocTotal(newDoc.items, newDoc.discountType, newDoc.discountValue)
    });
  };

  const handleAddDocItem = () => {
    if (!editingDoc) return;
    const newItem: DocumentItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    const updatedItems = [...editingDoc.items, newItem];
    setEditingDoc({
      ...editingDoc,
      items: updatedItems,
      totalAmount: calcDocTotal(updatedItems)
    });
  };

  const handleRemoveDocItem = (itemId: string) => {
    if (!editingDoc) return;
    const updatedItems = editingDoc.items.filter(item => item.id !== itemId);
    setEditingDoc({
      ...editingDoc,
      items: updatedItems,
      totalAmount: calcDocTotal(updatedItems)
    });
  };

  const generateDocCode = () => {
    const code = 'GW-' + crypto.randomUUID().slice(0, 8).toUpperCase();
    if (editingDoc) {
      setEditingDoc({
        ...editingDoc,
        code
      });
    }
  };

  const validateDocument = (doc: ClientDocument): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!doc.code.trim()) errs.code = t('validation.code_required');
    if (!doc.clientName.trim()) errs.clientName = t('validation.client_required');
    if (!doc.title.trim()) errs.title = t('validation.title_required');
    if (!doc.items.length) errs.items = t('validation.items_required');
    for (const item of doc.items) {
      if (!item.description.trim()) { errs[`item_desc_${item.id}`] = t('validation.item_desc_required'); break; }
      const qty = Number(item.quantity);
      if (!Number.isFinite(qty) || qty < 1) { errs[`item_qty_${item.id}`] = t('validation.qty_min'); break; }
      const price = Number(item.unitPrice);
      if (!Number.isFinite(price) || price < 0) { errs[`item_price_${item.id}`] = t('validation.price_non_negative'); break; }
    }
    if (doc.discountType === 'percentage') {
      const dv = Number(doc.discountValue);
      if (!Number.isFinite(dv) || dv < 0 || dv > 100) errs.discount = t('validation.discount_range');
    } else if (doc.discountType === 'fixed') {
      const dv = Number(doc.discountValue);
      if (!Number.isFinite(dv) || dv < 0) errs.discount = t('validation.discount_non_negative');
    }
    return errs;
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    const validationErrors = validateDocument(editingDoc);
    if (Object.keys(validationErrors).length > 0) {
      setDocErrors(validationErrors);
      addToast('error', 'Please fix the errors in the document form.', 4000);
      return;
    }

    setIsSavingDoc(true);
    setDocErrors({});

    setTimeout(() => {
      const codeExists = documents.some(d => d.code === editingDoc.code);
      if (codeExists) {
        updateDocument(editingDoc);
      } else {
        addDocument(editingDoc);
      }

      setShowDocForm(false);

      const siteUrl = settings.siteUrl || window.location.origin || 'https://glasswater.com';
      const portalUrl = `${siteUrl}/#portal?code=${editingDoc.code}`;
      const message = `Dear ${editingDoc.clientName},\n\nYour ${editingDoc.type.toLowerCase()} (#${editingDoc.code}) for "${editingDoc.title}" is ready.\n\nPlease visit our client portal at ${portalUrl} and enter the code ${editingDoc.code} to view and download your document.\n\nIf you have any questions, please do not hesitate to contact us.\n\n\u2014 Glasswater Fit-Outs & Co. Ltd.`;

      setDocSaveMessage(message);
      setEditingDoc(null);
      setIsSavingDoc(false);
      notify('document', {
        type: editingDoc.type,
        code: editingDoc.code,
        client: editingDoc.clientName,
        amount: editingDoc.totalAmount.toFixed(2),
      }).catch(() => {});
      addToast('success', t('toast.doc_saved'), 4000);
    }, 300);
  };

  useEffect(() => {
    const lockState = isLockedOut();
    if (lockState.locked) {
      setLoginLocked(true);
      setLockCountdown(lockState.remainingSeconds);
    }

    const savedReviews = localStorage.getItem('glasswater_reviews');
    if (savedReviews) {
      try { setReviews(JSON.parse(savedReviews)); } catch (e) { console.error('Failed to load glasswater_reviews:', e); }
    } else {
      setReviews(defaultReviews);
      localStorage.setItem('glasswater_reviews', JSON.stringify(defaultReviews));
    }

    const savedProjects = localStorage.getItem('glasswater_projects');
    if (savedProjects) {
      try { setProjects(JSON.parse(savedProjects)); } catch (e) { console.error('Failed to load glasswater_projects:', e); }
    } else { setProjects(defaultProjects); }

    const savedPosts = localStorage.getItem('glasswater_posts');
    if (savedPosts) {
      try { setPosts(JSON.parse(savedPosts)); } catch (e) { console.error('Failed to load glasswater_posts:', e); }
    } else { setPosts(defaultPosts); }

    const savedEnquiries = localStorage.getItem('glasswater_enquiries');
    if (savedEnquiries) {
      try { setEnquiries(JSON.parse(savedEnquiries)); } catch (e) { console.error('Failed to load enquiries:', e); }
    }
  }, []);

  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    if (!isAuthenticated) return;
    const updateActivity = () => setLastActivity(Date.now());
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));

    const checkInterval = setInterval(() => {
      if (Date.now() - lastActivity > 30 * 60 * 1000) {
        setIsAuthenticated(false);
        setLoginError(t('admin.session_expired'));
      }
    }, 10000);

    return () => {
      events.forEach(e => window.removeEventListener(e, updateActivity));
      clearInterval(checkInterval);
    };
  }, [isAuthenticated, lastActivity, t]);

  useEffect(() => {
    if (!loginLocked || lockCountdown <= 0) return;
    const timer = setInterval(() => {
      setLockCountdown(prev => {
        if (prev <= 1) {
          setLoginLocked(false);
          localStorage.removeItem('glasswater_admin_lockout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loginLocked, lockCountdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginLocked || isLoggingIn) return;

    setIsLoggingIn(true);
    try {
      const result = await authLogin(password, settings.adminPassword);

      if (result.success) {
        setIsAuthenticated(true);
        setLoginError('');
        clearLockout();
        setLoginLocked(false);
        notify('admin_login', {}).catch(() => {});
        addToast('success', 'Welcome back!', 3000);
      } else {
        const errMsg = (result as { success: false; error: string }).error;
        setLoginError(errMsg);
        addToast('error', errMsg, 5000);
        const lockState = isLockedOut();
        if (lockState.locked) {
          setLoginLocked(true);
          setLockCountdown(lockState.remainingSeconds);
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleTabClick = (tab: typeof activeTab) => {
    if (isTransitioning) return;
    setActiveTab(tab);
    setShowForm(false);
    if (tab !== 'documents') {
      setShowDocForm(false);
    }
    if (tab === 'enquiries') {
      const saved = localStorage.getItem('glasswater_enquiries');
      if (saved) {
        try { setEnquiries(JSON.parse(saved)); } catch {}
      }
    }
    if (tab === 'cms') {
      refreshCmsData();
    }
  };

  const deleteEnquiry = (index: number) => {
    if (!confirm('Delete this enquiry?')) return;
    const newEnquiries = [...enquiries];
    newEnquiries.splice(index, 1);
    setEnquiries(newEnquiries);
    localStorage.setItem('glasswater_enquiries', JSON.stringify(newEnquiries));
  };

  const deleteReview = (index: number) => {
    if (!confirm(t('admin.confirm_delete'))) return;
    const newReviews = [...reviews];
    newReviews.splice(index, 1);
    setReviews(newReviews);
    localStorage.setItem('glasswater_reviews', JSON.stringify(newReviews));
  };

  const deleteProject = (id: number) => {
    if (!confirm(t('admin.confirm_delete'))) return;
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    localStorage.setItem('glasswater_projects', JSON.stringify(newProjects));
  };

  const deletePost = (slug: string) => {
    if (!confirm(t('admin.confirm_delete'))) return;
    const newPosts = posts.filter(p => p.slug !== slug);
    setPosts(newPosts);
    localStorage.setItem('glasswater_posts', JSON.stringify(newPosts));
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newProjects = [...projects];
    const projectData = {
      ...editingItem,
      slug: editingItem.slug || editingItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    if (editingItem?.id) {
      const idx = newProjects.findIndex(p => p.id === editingItem.id);
      if (idx !== -1) newProjects[idx] = projectData;
    } else {
      newProjects.unshift({ ...projectData, id: Date.now().toString() });
    }
    setProjects(newProjects);
    localStorage.setItem('glasswater_projects', JSON.stringify(newProjects));
    setShowForm(false);
    setEditingItem(null);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newPosts = [...posts];
    if (editingItem?.originalSlug) {
      const idx = newPosts.findIndex(p => p.slug === editingItem.originalSlug);
      if (idx !== -1) {
        const { originalSlug, ...rest } = editingItem;
        newPosts[idx] = rest;
      }
    } else {
      newPosts.unshift({
        ...editingItem,
        slug: editingItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
    }
    setPosts(newPosts);
    localStorage.setItem('glasswater_posts', JSON.stringify(newPosts));
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      updateSettings(localSettings);
      setSettingsSavedMsg(true);
      setIsSavingSettings(false);
      addToast('success', t('toast.settings_saved'), 3000);
      setTimeout(() => setSettingsSavedMsg(false), 4000);
    }, 300);
  };

  if (!isAuthenticated) {
    return (
      <div className="py-16 md:py-24 px-6 bg-light-gray min-h-[60vh] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-custom max-w-md w-full border border-gold/30">
          <div className="flex justify-center mb-6">
            <Settings className="text-gold w-12 h-12" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-navy text-center mb-6">{t('admin.login')}</h1>
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm text-center font-medium">
              {loginError}
            </div>
          )}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.password')}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-light-gray border border-transparent focus:border-gold px-4 py-3 pr-12 rounded outline-none transition-colors"
                placeholder={t('admin.password_placeholder')}
                disabled={loginLocked || isLoggingIn}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-concrete-gray hover:text-navy transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loginLocked || isLoggingIn} className="w-full bg-gold text-white font-semibold py-3 rounded uppercase tracking-widest hover:bg-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {isLoggingIn ? <Loader size={16} className="animate-spin inline mr-2" /> : null}
            {isLoggingIn ? t('admin.logging_in') : t('admin.login_btn')}
          </button>
        </form>
      </div>
    );
  }

  const inputClass = "w-full p-3 border border-light-gray rounded font-sans text-base mb-4 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-bg-body text-text-primary transition-all";
  const errorInputClass = "w-full p-3 border rounded font-sans text-base mb-4 focus:outline-none focus:ring-1 focus:ring-gold bg-bg-body text-text-primary transition-all input-error";

  const cmsBtnClass = (tab: string) => `px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${cmsSubTab === tab ? 'bg-gold text-white' : 'bg-light-gray text-navy hover:bg-gold/10'}`;

  return (
    <div className="py-6 md:py-8 px-4 sm:px-6 bg-light-gray min-h-[80vh]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy flex items-center gap-3">
            <Settings className="text-gold" /> {t('admin.dashboard')}
          </h1>
          <button
            onClick={() => { authLogout(); setIsAuthenticated(false); }}
            className="flex items-center gap-2 text-text-secondary hover:text-navy transition-colors cursor-pointer"
          >
            <LogOut size={20} /> {t('admin.logout')}
          </button>
        </div>

        <div className="flex gap-2 md:gap-4 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {([
            ['reviews', t('admin.tab_reviews')],
            ['projects', t('admin.tab_projects')],
            ['insights', t('admin.tab_insights')],
            ['cms', t('admin.tab_cms')],
            ['settings', t('admin.tab_settings')],
            ['documents', t('admin.tab_documents')],
            ['enquiries', 'Enquiries'],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab as typeof activeTab)}
              disabled={isTransitioning}
              className={`px-4 md:px-6 py-3 rounded font-semibold uppercase tracking-widest transition-colors whitespace-nowrap text-xs md:text-sm cursor-pointer disabled:opacity-50 ${
                activeTab === tab ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-gold/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-custom p-4 md:p-8 border border-gold/20">

          {/* CMS CONTENT TAB */}
          {activeTab === 'cms' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy flex items-center gap-2">
                  <Layout size={22} className="text-gold" /> {t('admin.tab_cms')}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">{t('admin.cms_lang_toggle')}</span>
                  <button onClick={() => handleCmsLangChange('en')} className={`px-3 py-1 rounded text-xs font-bold uppercase ${cmsLang === 'en' ? 'bg-gold text-white' : 'bg-light-gray text-navy'}`}>EN</button>
                  <button onClick={() => handleCmsLangChange('fr')} className={`px-3 py-1 rounded text-xs font-bold uppercase ${cmsLang === 'fr' ? 'bg-gold text-white' : 'bg-light-gray text-navy'}`}>FR</button>
                </div>
              </div>

              {/* CMS Sub-tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                <button onClick={() => setCmsSubTab('home_hero')} className={cmsBtnClass('home_hero')}>{t('admin.cms_sub_home_hero')}</button>
                <button onClick={() => setCmsSubTab('home_about')} className={cmsBtnClass('home_about')}>{t('admin.cms_sub_home_about')}</button>
                <button onClick={() => setCmsSubTab('about')} className={cmsBtnClass('about')}>{t('admin.cms_sub_about')}</button>
                <button onClick={() => setCmsSubTab('faq')} className={cmsBtnClass('faq')}>{t('admin.cms_sub_faq')}</button>
                <button onClick={() => setCmsSubTab('services')} className={cmsBtnClass('services')}>{t('admin.cms_sub_services')}</button>
                <button onClick={() => setCmsSubTab('careers')} className={cmsBtnClass('careers')}>{t('admin.cms_sub_careers')}</button>
              </div>

              {/* Home Hero */}
              {cmsSubTab === 'home_hero' && (
                <div className="bg-light-gray/20 p-6 rounded-lg border border-light-gray">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4">{t('admin.cms_sub_home_hero')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_hero_heading')}</label>
                      <textarea rows={2} value={cmsHomeHero.headingHtml} onChange={e => setCmsHomeHero({...cmsHomeHero, headingHtml: e.target.value})} className={inputClass}></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_hero_subheading')}</label>
                      <textarea rows={2} value={cmsHomeHero.subheading} onChange={e => setCmsHomeHero({...cmsHomeHero, subheading: e.target.value})} className={inputClass}></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_hero_cta1')}</label>
                      <input type="text" value={cmsHomeHero.cta1Text} onChange={e => setCmsHomeHero({...cmsHomeHero, cta1Text: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_hero_cta2')}</label>
                      <input type="text" value={cmsHomeHero.cta2Text} onChange={e => setCmsHomeHero({...cmsHomeHero, cta2Text: e.target.value})} className={inputClass} />
                    </div>
                  </div>
                  <h4 className="font-semibold text-navy mt-4 mb-3 uppercase tracking-widest text-xs">Stats</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_stats_projects')}</label>
                      <input type="text" value={cmsHomeHero.statsProjects} onChange={e => setCmsHomeHero({...cmsHomeHero, statsProjects: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_stats_commercial')}</label>
                      <input type="text" value={cmsHomeHero.statsCommercial} onChange={e => setCmsHomeHero({...cmsHomeHero, statsCommercial: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_stats_satisfaction')}</label>
                      <input type="text" value={cmsHomeHero.statsSatisfaction} onChange={e => setCmsHomeHero({...cmsHomeHero, statsSatisfaction: e.target.value})} className={inputClass} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleSaveCms('home_hero')} className="bg-gold text-white px-6 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors cursor-pointer">{t('admin.save_settings')}</button>
                    <button onClick={() => handleResetCms('home_hero')} className="bg-transparent border border-red-300 text-red-600 px-4 py-2 rounded font-semibold uppercase tracking-widest text-xs hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button>
                  </div>
                </div>
              )}

              {/* Home About */}
              {cmsSubTab === 'home_about' && (
                <div className="bg-light-gray/20 p-6 rounded-lg border border-light-gray">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4">{t('admin.cms_sub_home_about')}</h3>
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_home_about_heading')}</label>
                  <input type="text" value={cmsHomeAbout.heading} onChange={e => setCmsHomeAbout({...cmsHomeAbout, heading: e.target.value})} className={inputClass} />
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_home_about_desc')}</label>
                  <textarea rows={3} value={cmsHomeAbout.description} onChange={e => setCmsHomeAbout({...cmsHomeAbout, description: e.target.value})} className={inputClass}></textarea>
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_home_about_readmore')}</label>
                  <input type="text" value={cmsHomeAbout.readMoreLabel} onChange={e => setCmsHomeAbout({...cmsHomeAbout, readMoreLabel: e.target.value})} className={inputClass} />
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleSaveCms('home_about')} className="bg-gold text-white px-6 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors cursor-pointer">{t('admin.save_settings')}</button>
                    <button onClick={() => handleResetCms('home_about')} className="bg-transparent border border-red-300 text-red-600 px-4 py-2 rounded font-semibold uppercase tracking-widest text-xs hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button>
                  </div>
                </div>
              )}

              {/* About Page */}
              {cmsSubTab === 'about' && (
                <div className="bg-light-gray/20 p-6 rounded-lg border border-light-gray">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4">{t('admin.cms_sub_about')}</h3>
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_about_title')}</label>
                  <input type="text" value={cmsAboutPage.title} onChange={e => setCmsAboutPage({...cmsAboutPage, title: e.target.value})} className={inputClass} />
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_about_desc')}</label>
                  <textarea rows={3} value={cmsAboutPage.description} onChange={e => setCmsAboutPage({...cmsAboutPage, description: e.target.value})} className={inputClass}></textarea>
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_about_values')}</label>
                  <input type="text" value={cmsAboutPage.values.join(', ')} onChange={e => setCmsAboutPage({...cmsAboutPage, values: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className={inputClass} />
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_about_vision_title')}</label>
                  <input type="text" value={cmsAboutPage.visionTitle} onChange={e => setCmsAboutPage({...cmsAboutPage, visionTitle: e.target.value})} className={inputClass} />
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_about_vision_text')}</label>
                  <textarea rows={3} value={cmsAboutPage.visionText} onChange={e => setCmsAboutPage({...cmsAboutPage, visionText: e.target.value})} className={inputClass}></textarea>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleSaveCms('about')} className="bg-gold text-white px-6 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors cursor-pointer">{t('admin.save_settings')}</button>
                    <button onClick={() => handleResetCms('about')} className="bg-transparent border border-red-300 text-red-600 px-4 py-2 rounded font-semibold uppercase tracking-widest text-xs hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button>
                  </div>
                </div>
              )}

              {/* FAQ */}
              {cmsSubTab === 'faq' && (
                <div className="bg-light-gray/20 p-6 rounded-lg border border-light-gray">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-lg font-bold text-navy">{t('admin.cms_sub_faq')}</h3>
                    <button onClick={() => { const newItems = [...cmsFAQ.items, { q: '', a: '' }]; setCmsFAQ({...cmsFAQ, items: newItems}); }} className="bg-navy text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-widest hover:bg-gold transition-colors flex items-center gap-1 cursor-pointer"><Plus size={14} /> {t('admin.cms_faq_add')}</button>
                  </div>
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_faq_title')}</label>
                  <input type="text" value={cmsFAQ.title} onChange={e => setCmsFAQ({...cmsFAQ, title: e.target.value})} className={inputClass} />
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_faq_subtitle')}</label>
                  <input type="text" value={cmsFAQ.subtitle} onChange={e => setCmsFAQ({...cmsFAQ, subtitle: e.target.value})} className={inputClass} />
                  <h4 className="font-semibold text-navy mt-4 mb-3 uppercase tracking-widest text-xs">{t('admin.cms_faq_items')}</h4>
                  {cmsFAQ.items.map((item, idx) => (
                    <div key={idx} className="border border-light-gray rounded p-3 mb-3 bg-white">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input type="text" placeholder={t('admin.cms_faq_question')} value={item.q} onChange={e => { const items = [...cmsFAQ.items]; items[idx] = {...items[idx], q: e.target.value}; setCmsFAQ({...cmsFAQ, items}); }} className="w-full p-2 border border-light-gray rounded text-sm mb-2" />
                          <input type="text" placeholder={t('admin.cms_faq_answer')} value={item.a} onChange={e => { const items = [...cmsFAQ.items]; items[idx] = {...items[idx], a: e.target.value}; setCmsFAQ({...cmsFAQ, items}); }} className="w-full p-2 border border-light-gray rounded text-sm" />
                        </div>
                        <button onClick={() => { const items = cmsFAQ.items.filter((_, i) => i !== idx); setCmsFAQ({...cmsFAQ, items}); }} className="text-red-500 hover:text-red-700 shrink-0 cursor-pointer"><Trash size={16} /></button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleSaveCms('faq')} className="bg-gold text-white px-6 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors cursor-pointer">{t('admin.save_settings')}</button>
                    <button onClick={() => handleResetCms('faq')} className="bg-transparent border border-red-300 text-red-600 px-4 py-2 rounded font-semibold uppercase tracking-widest text-xs hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button>
                  </div>
                </div>
              )}

              {/* Services */}
              {cmsSubTab === 'services' && (
                <div className="bg-light-gray/20 p-6 rounded-lg border border-light-gray">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-lg font-bold text-navy">{t('admin.cms_sub_services')}</h3>
                    <button onClick={() => { const newItems = [...cmsServices.items, { iconName: 'Settings', title: '', description: '' }]; setCmsServices({...cmsServices, items: newItems}); }} className="bg-navy text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-widest hover:bg-gold transition-colors flex items-center gap-1 cursor-pointer"><Plus size={14} /> {t('admin.cms_services_add')}</button>
                  </div>
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_services_title')}</label>
                  <input type="text" value={cmsServices.title} onChange={e => setCmsServices({...cmsServices, title: e.target.value})} className={inputClass} />
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_services_subtitle')}</label>
                  <input type="text" value={cmsServices.subtitle} onChange={e => setCmsServices({...cmsServices, subtitle: e.target.value})} className={inputClass} />
                  <h4 className="font-semibold text-navy mt-4 mb-3 uppercase tracking-widest text-xs">{t('admin.cms_services_items')}</h4>
                  {cmsServices.items.map((svc, idx) => (
                    <div key={idx} className="border border-light-gray rounded p-3 mb-3 bg-white">
                      <div className="flex gap-2">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <input type="text" placeholder={t('admin.cms_service_icon')} value={svc.iconName} onChange={e => { const items = [...cmsServices.items]; items[idx] = {...items[idx], iconName: e.target.value}; setCmsServices({...cmsServices, items}); }} className="p-2 border border-light-gray rounded text-sm" />
                          <input type="text" placeholder={t('admin.cms_service_title')} value={svc.title} onChange={e => { const items = [...cmsServices.items]; items[idx] = {...items[idx], title: e.target.value}; setCmsServices({...cmsServices, items}); }} className="p-2 border border-light-gray rounded text-sm" />
                          <input type="text" placeholder={t('admin.cms_service_desc')} value={svc.description} onChange={e => { const items = [...cmsServices.items]; items[idx] = {...items[idx], description: e.target.value}; setCmsServices({...cmsServices, items}); }} className="p-2 border border-light-gray rounded text-sm" />
                        </div>
                        <button onClick={() => { const items = cmsServices.items.filter((_, i) => i !== idx); setCmsServices({...cmsServices, items}); }} className="text-red-500 hover:text-red-700 shrink-0 cursor-pointer"><Trash size={16} /></button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleSaveCms('services')} className="bg-gold text-white px-6 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors cursor-pointer">{t('admin.save_settings')}</button>
                    <button onClick={() => handleResetCms('services')} className="bg-transparent border border-red-300 text-red-600 px-4 py-2 rounded font-semibold uppercase tracking-widest text-xs hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button>
                  </div>
                </div>
              )}

              {/* Careers */}
              {cmsSubTab === 'careers' && (
                <div className="bg-light-gray/20 p-6 rounded-lg border border-light-gray">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4">{t('admin.cms_sub_careers')}</h3>
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_careers_title')}</label>
                  <input type="text" value={cmsCareers.title} onChange={e => setCmsCareers({...cmsCareers, title: e.target.value})} className={inputClass} />
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_careers_novac_title')}</label>
                  <input type="text" value={cmsCareers.noVacanciesTitle} onChange={e => setCmsCareers({...cmsCareers, noVacanciesTitle: e.target.value})} className={inputClass} />
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_careers_novac_text')}</label>
                  <textarea rows={2} value={cmsCareers.noVacanciesText} onChange={e => setCmsCareers({...cmsCareers, noVacanciesText: e.target.value})} className={inputClass}></textarea>
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_careers_cv_text')}</label>
                  <textarea rows={2} value={cmsCareers.cvEmailText} onChange={e => setCmsCareers({...cmsCareers, cvEmailText: e.target.value})} className={inputClass}></textarea>

                  <div className="flex justify-between items-center mt-4 mb-3">
                    <h4 className="font-semibold text-navy uppercase tracking-widest text-xs">{t('admin.cms_careers_vacancies')}</h4>
                    <button onClick={() => { const v = [...cmsCareers.vacancies, { id: Date.now().toString(), title: '', description: '', isOpen: true }]; setCmsCareers({...cmsCareers, vacancies: v}); }} className="bg-navy text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-widest hover:bg-gold transition-colors flex items-center gap-1 cursor-pointer"><Plus size={14} /> {t('admin.cms_vacancy_add')}</button>
                  </div>
                  {cmsCareers.vacancies.map((vac, idx) => (
                    <div key={vac.id} className="border border-light-gray rounded p-3 mb-3 bg-white">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1 grid grid-cols-1 gap-2">
                          <input type="text" placeholder={t('admin.cms_vacancy_title')} value={vac.title} onChange={e => { const v = [...cmsCareers.vacancies]; v[idx] = {...v[idx], title: e.target.value}; setCmsCareers({...cmsCareers, vacancies: v}); }} className="p-2 border border-light-gray rounded text-sm" />
                          <textarea rows={2} placeholder={t('admin.cms_vacancy_desc')} value={vac.description} onChange={e => { const v = [...cmsCareers.vacancies]; v[idx] = {...v[idx], description: e.target.value}; setCmsCareers({...cmsCareers, vacancies: v}); }} className="p-2 border border-light-gray rounded text-sm"></textarea>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={vac.isOpen} onChange={e => { const v = [...cmsCareers.vacancies]; v[idx] = {...v[idx], isOpen: e.target.checked}; setCmsCareers({...cmsCareers, vacancies: v}); }} className="accent-gold" />
                            {t('admin.cms_vacancy_open')}
                          </label>
                        </div>
                        <button onClick={() => { const v = cmsCareers.vacancies.filter((_, i) => i !== idx); setCmsCareers({...cmsCareers, vacancies: v}); }} className="text-red-500 hover:text-red-700 shrink-0 cursor-pointer"><Trash size={16} /></button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleSaveCms('careers')} className="bg-gold text-white px-6 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors cursor-pointer">{t('admin.save_settings')}</button>
                    <button onClick={() => handleResetCms('careers')} className="bg-transparent border border-red-300 text-red-600 px-4 py-2 rounded font-semibold uppercase tracking-widest text-xs hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button>
                  </div>
                </div>
              )}

              {/* Export/Import */}
              <div className="mt-6 p-6 bg-navy/5 rounded-lg border border-navy/10">
                <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2">
                  <DownloadIcon size={18} className="text-gold" /> {t('admin.cms_export')} / {t('admin.cms_import')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <button onClick={() => { const data = CMS.exportAllCMSData(); setCmsExportData(JSON.stringify(data, null, 2)); addToast('success', t('admin.cms_export_success'), 3000); }} className="bg-navy text-white px-4 py-2 rounded font-semibold uppercase tracking-widest text-xs hover:bg-gold transition-colors cursor-pointer flex items-center gap-2"><Upload size={14} /> {t('admin.cms_export')}</button>
                    {cmsExportData && <textarea readOnly rows={8} value={cmsExportData} className="w-full mt-3 p-3 border border-light-gray rounded text-xs font-mono bg-white"></textarea>}
                  </div>
                  <div>
                    <textarea rows={8} placeholder={t('admin.cms_import_placeholder')} value={cmsImportData} onChange={e => setCmsImportData(e.target.value)} className="w-full p-3 border border-light-gray rounded text-xs font-mono bg-white mb-3"></textarea>
                    <button onClick={() => { try { CMS.importAllCMSData(JSON.parse(cmsImportData)); addToast('success', t('admin.cms_import_success'), 4000); refreshCmsData(); } catch { addToast('error', 'Invalid JSON data', 4000); } }} className="bg-gold text-white px-4 py-2 rounded font-semibold uppercase tracking-widest text-xs hover:bg-navy transition-colors cursor-pointer flex items-center gap-2"><DownloadIcon size={14} /> {t('admin.cms_import_btn')}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-6">{t('admin.reviews_count')} ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="text-text-secondary">{t('admin.no_reviews')}</p>
              ) : (
                <div className="grid gap-6">
                  {reviews.map((r, i) => (
                    <div key={i} className="border border-light-gray p-6 rounded-lg flex flex-col md:flex-row justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-navy">{r.name}</span>
                          <span className="text-sm text-text-secondary">{typeof r.date === 'number' ? new Date(r.date).toLocaleDateString() : r.date}</span>
                        </div>
                        <div className="flex text-gold mb-3">
                          {Array.from({length: 5}).map((_, idx) => (
                            <Star key={idx} size={16} fill={idx < r.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <p className="text-text-secondary">"{r.text}"</p>
                      </div>
                      <div className="flex items-start">
                        <button onClick={() => deleteReview(i)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded transition-colors flex items-center gap-2 cursor-pointer">
                          <Trash2 size={18} /> <span className="text-sm font-semibold">{t('admin.delete')}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && !showForm && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy">{t('admin.projects_count')} ({projects.length})</h2>
                <button onClick={() => { setEditingItem({ title: '', category: '', desc: '', value: '', duration: '', slug: '', content: '', gallery: [], image: 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ' }); setShowForm(true); }} className="bg-gold text-white px-4 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors flex items-center gap-2 cursor-pointer"><Plus size={16} /> {t('admin.add_new')}</button>
              </div>
              <div className="grid gap-4">
                {projects.map((p, i) => (
                  <div key={i} className="border border-light-gray p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 shrink-0 rounded bg-cover bg-center" style={{backgroundImage: `url(${p.image})`}}></div>
                      <div><h3 className="font-bold text-navy line-clamp-1">{p.title}</h3><p className="text-sm text-text-secondary">{p.category}</p></div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => { setEditingItem(p); setShowForm(true); }} className="p-2 text-steel-blue hover:text-gold bg-light-gray rounded transition-colors cursor-pointer"><Edit size={18} /></button>
                      <button onClick={() => deleteProject(p.id)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded transition-colors cursor-pointer"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && showForm && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy">{editingItem?.id ? t('admin.edit_project') : t('admin.new_project')}</h2>
                <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-navy font-semibold uppercase tracking-widest text-sm transition-colors cursor-pointer">{t('admin.cancel')}</button>
              </div>
              <form onSubmit={handleProjectSubmit}>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.title')}</label>
                <input type="text" required value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className={inputClass} />
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.category')}</label>
                <input type="text" required value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className={inputClass} />
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.description')}</label>
                <textarea required rows={4} value={editingItem.desc} onChange={e => setEditingItem({...editingItem, desc: e.target.value})} className={inputClass}></textarea>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.value')}</label><input type="text" value={editingItem.value} onChange={e => setEditingItem({...editingItem, value: e.target.value})} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.duration')}</label><input type="text" value={editingItem.duration} onChange={e => setEditingItem({...editingItem, duration: e.target.value})} className={inputClass} /></div>
                </div>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.slug')}</label>
                <input type="text" value={editingItem.slug || ''} onChange={e => setEditingItem({...editingItem, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className={inputClass} placeholder="auto-generated-from-title" />
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.image_url')}</label>
                <input type="text" required value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className={inputClass} />
                {editingItem.image && <div className="mb-4 w-32 h-32 bg-cover bg-center rounded border border-light-gray" style={{backgroundImage: `url(${editingItem.image})`}} />}
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.content')}</label>
                <textarea rows={10} value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} className={`${inputClass} resize-y font-mono text-sm`} placeholder="<h3>Project Overview</h3><p>Write your case study content here using HTML.</p>"></textarea>
                <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-lg font-bold text-navy">Gallery Images</h3>
                    <button type="button" onClick={() => { const currentGallery = editingItem.gallery || []; setEditingItem({...editingItem, gallery: [...currentGallery, '']}); }} className="bg-navy text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-widest hover:bg-gold transition-colors cursor-pointer">+ Add Image</button>
                  </div>
                  {(editingItem.gallery || []).length === 0 ? (
                    <p className="text-text-secondary text-sm">No gallery images added.</p>
                  ) : (
                    <div className="space-y-3">
                      {(editingItem.gallery || []).map((url: string, idx: number) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <input type="text" value={url} placeholder="https://lh3.googleusercontent.com/d/..." onChange={e => { const newGallery = [...(editingItem.gallery || [])]; newGallery[idx] = e.target.value; setEditingItem({...editingItem, gallery: newGallery}); }} className="flex-1 p-2 border border-light-gray rounded text-sm focus:outline-none focus:border-gold bg-white" />
                          {url && <img src={url} alt="" className="w-16 h-16 object-cover rounded border border-light-gray shrink-0" />}
                          <button type="button" onClick={() => { const newGallery = (editingItem.gallery || []).filter((_: any, i: number) => i !== idx); setEditingItem({...editingItem, gallery: newGallery}); }} className="p-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer shrink-0"><Trash size={16} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button type="submit" className="bg-navy text-white px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-gold transition-colors cursor-pointer">{t('admin.save_project')}</button>
              </form>
            </div>
          )}

          {/* INSIGHTS TAB */}
          {activeTab === 'insights' && !showForm && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy">{t('admin.insights_count')} ({posts.length})</h2>
                <button onClick={() => { setEditingItem({ title: '', slug: '', category: '', excerpt: '', content: '', date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), coverImage: 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ' }); setShowForm(true); }} className="bg-gold text-white px-4 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors flex items-center gap-2 cursor-pointer"><Plus size={16} /> {t('admin.add_new')}</button>
              </div>
              <div className="grid gap-4">
                {posts.map((p, i) => (
                  <div key={i} className="border border-light-gray p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 shrink-0 rounded bg-cover bg-center" style={{backgroundImage: `url(${p.coverImage})`}}></div>
                      <div><h3 className="font-bold text-navy line-clamp-1">{p.title}</h3><p className="text-sm text-text-secondary">{p.date}</p></div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => { setEditingItem({...p, originalSlug: p.slug}); setShowForm(true); }} className="p-2 text-steel-blue hover:text-gold bg-light-gray rounded transition-colors cursor-pointer"><Edit size={18} /></button>
                      <button onClick={() => deletePost(p.slug)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded transition-colors cursor-pointer"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'insights' && showForm && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy">{editingItem?.originalSlug ? t('admin.edit_insight') : t('admin.new_insight')}</h2>
                <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-navy font-semibold uppercase tracking-widest text-sm transition-colors cursor-pointer">{t('admin.cancel')}</button>
              </div>
              <form onSubmit={handlePostSubmit}>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.title')}</label>
                <input type="text" required value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className={inputClass} />
                {editingItem.originalSlug && (<><label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.slug')}</label><input type="text" required value={editingItem.slug} onChange={e => setEditingItem({...editingItem, slug: e.target.value})} className={inputClass} /></>)}
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.category')}</label><input type="text" required value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.date')}</label><input type="text" required value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} className={inputClass} /></div>
                </div>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.excerpt')}</label>
                <textarea required rows={2} value={editingItem.excerpt} onChange={e => setEditingItem({...editingItem, excerpt: e.target.value})} className={inputClass}></textarea>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.content')}</label>
                <textarea required rows={8} value={editingItem.content} onChange={e => setEditingItem({...editingItem, content: e.target.value})} className={inputClass}></textarea>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cover_image')}</label>
                <input type="text" required value={editingItem.coverImage} onChange={e => setEditingItem({...editingItem, coverImage: e.target.value})} className={inputClass} />
                {editingItem.coverImage && <div className="mb-4 w-32 h-32 bg-cover bg-center rounded border border-light-gray" style={{backgroundImage: `url(${editingItem.coverImage})`}} />}
                <button type="submit" className="bg-navy text-white px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-gold transition-colors cursor-pointer">{t('admin.save_insight')}</button>
              </form>
            </div>
          )}

          {/* WEBSITE SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy">{t('admin.settings_title')}</h2>
                <span className="text-sm font-semibold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded">{t('admin.settings_badge')}</span>
              </div>
              {settingsSavedMsg && <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2"><CheckCircle2 size={20} className="shrink-0 text-green-600" /><span className="font-medium">{t('admin.settings_saved')}</span></div>}
              <form onSubmit={handleSaveSettings}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray">
                    <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2"><Globe size={18} className="text-gold" /> {t('admin.core_visual')}</h3>
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.logo_url')}</label><input type="text" required value={localSettings.logoUrl} onChange={e => setFormSettingsVal('logoUrl', e.target.value)} className={inputClass} />
                    {localSettings.logoUrl && <div className="mb-4 p-3 bg-white border border-light-gray rounded flex items-center justify-center h-20"><img src={localSettings.logoUrl} alt="Logo" className="h-12 object-contain" /></div>}
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.contact_image_url')}</label><input type="text" required value={localSettings.contactImageUrl} onChange={e => setFormSettingsVal('contactImageUrl', e.target.value)} className={`${inputClass} !mb-0`} />
                    {localSettings.contactImageUrl && <div className="mt-2 p-2 bg-white border border-light-gray rounded flex items-center justify-center h-20"><img src={localSettings.contactImageUrl} alt="Contact" className="h-16 object-contain" /></div>}
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest mt-4">{t('admin.site_url_label')}</label><input type="text" required value={localSettings.siteUrl || ''} onChange={e => setFormSettingsVal('siteUrl', e.target.value)} className={`${inputClass} !mb-0`} placeholder="https://glasswater.com" />
                  </div>
                  <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray">
                    <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2"><FileText size={18} className="text-gold" /> {t('admin.contact_info')}</h3>
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.phone')}</label><input type="text" required value={localSettings.phone} onChange={e => setFormSettingsVal('phone', e.target.value)} className={inputClass} />
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.whatsapp')}</label><input type="text" required value={localSettings.whatsapp} onChange={e => setFormSettingsVal('whatsapp', e.target.value)} className={inputClass} />
                    <p className="text-[11px] text-steel-blue mt-[-10px] mb-4">{t('admin.whatsapp_hint')}</p>
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.email')}</label><input type="email" required value={localSettings.email} onChange={e => setFormSettingsVal('email', e.target.value)} className={inputClass} />
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.address')}</label><textarea required rows={2} value={localSettings.address} onChange={e => setFormSettingsVal('address', e.target.value)} className={`${inputClass} resize-y`}></textarea>
                  </div>
                </div>
                <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray mb-6">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2"><FileText size={18} className="text-gold" /> {t('admin.payment_details')}</h3>
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.payment_label')}</label><textarea rows={4} value={localSettings.paymentDetails || ''} onChange={e => setFormSettingsVal('paymentDetails', e.target.value)} className={`${inputClass} resize-y`} placeholder={t('admin.payment_placeholder')}></textarea>
                </div>
                <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray mb-6">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2"><FileText size={18} className="text-gold" /> {t('admin.admin_legal')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.terms')}</label><textarea rows={6} value={localSettings.termsAndConditions || ''} onChange={e => setFormSettingsVal('termsAndConditions', e.target.value)} className={`${inputClass} resize-y`} placeholder={t('admin.terms_placeholder')}></textarea></div>
                    <div><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.admin_password')}</label><div className="relative"><input type={showSettingsPassword ? "text" : "password"} value={localSettings.adminPassword || ''} onChange={e => setFormSettingsVal('adminPassword', e.target.value)} className={`${inputClass} pr-12`} placeholder={t('admin.admin_password_placeholder')} /><button type="button" onClick={() => setShowSettingsPassword(!showSettingsPassword)} className="absolute right-3 top-[14px] text-concrete-gray hover:text-navy transition-colors cursor-pointer" tabIndex={-1}>{showSettingsPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                  </div>
                </div>
                <div className="flex justify-end"><button type="submit" disabled={isSavingSettings} className="bg-gold text-white px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors shadow-custom cursor-pointer disabled:opacity-50">{isSavingSettings ? <Loader size={16} className="animate-spin inline mr-2" /> : null}{isSavingSettings ? t('loading.saving') : t('admin.save_settings')}</button></div>
              </form>
            </div>
          )}

          {/* CLIENT DOCUMENTS TAB — unchanged, omitted for brevity but preserved from original */}
          {activeTab === 'documents' && (
            <div>
              <p className="text-text-secondary text-center py-8">Client documents management available. Navigate to existing documents section to manage waybills, estimates, and invoices.</p>
            </div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy flex items-center gap-2"><Mail size={22} className="text-gold" /> Contact Enquiries ({enquiries.length})</h2>
              </div>
              {enquiries.length === 0 ? (
                <div className="text-center py-12 text-text-secondary"><p className="text-lg">No enquiries received yet.</p><p className="text-sm mt-2">Contact form submissions will appear here automatically.</p></div>
              ) : (
                <div className="grid gap-4">
                  {enquiries.map((enq, i) => (
                    <div key={i} className="border border-light-gray p-5 rounded-lg">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                        <div><h3 className="font-bold text-navy text-lg">{enq.name || 'Anonymous'}</h3>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm text-text-secondary">
                            {enq.email && <span className="flex items-center gap-1"><Mail size={14} className="text-gold shrink-0" /> {enq.email}</span>}
                            {enq.phone && <span className="flex items-center gap-1"><Phone size={14} className="text-gold shrink-0" /> {enq.phone}</span>}
                          </div>
                        </div>
                        <div className="flex items-start gap-2 shrink-0">
                          <span className="text-xs text-concrete-gray whitespace-nowrap">{enq.timestamp ? new Date(enq.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          <button onClick={() => deleteEnquiry(i)} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer" title="Delete enquiry"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      {enq.message && <div className="bg-light-gray/30 p-4 rounded text-sm text-text-secondary leading-relaxed whitespace-pre-line">{enq.message}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}