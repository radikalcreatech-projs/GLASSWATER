import React from "react";
import { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Settings, LogOut, CheckCircle2, XCircle, Trash2, Edit, Star, Plus, FileText, Copy, Check, Info, Share2, Eye, PlusCircle, Trash, Globe, Download, Loader, EyeOff, Mail } from 'lucide-react';
import { projects as defaultProjects, posts as defaultPosts, defaultReviews } from '../data';
import { useSettings, WebsiteSettings, ClientDocument, DocumentItem } from '../context/SettingsContext';
import { useI18n } from '../context/I18nContext';
import { useToast } from '../context/ToastContext';
import { login as authLogin, logout as authLogout, isAuthenticated as checkAuth, isLockedOut, clearLockout } from '../utils/auth';
import { notify } from '../utils/notifications';

export function AdminPage() {
  const { navigate, isTransitioning } = useNavigation();
  const { t } = useI18n();
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth());
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLocked, setLoginLocked] = useState(() => isLockedOut().locked);
  const [lockCountdown, setLockCountdown] = useState(() => isLockedOut().remainingSeconds);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSettingsPassword, setShowSettingsPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<'reviews' | 'projects' | 'insights' | 'settings' | 'documents' | 'enquiries'>('reviews');

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

  // Validate document before saving — returns errors object or empty
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

    // Small delay for UX
    setTimeout(() => {
      const codeExists = documents.some(d => d.code === editingDoc.code);
      if (codeExists) {
        updateDocument(editingDoc);
      } else {
        addDocument(editingDoc);
      }

      setShowDocForm(false);

      // Prepare auto-message with actual website URL
      const siteUrl = settings.siteUrl || window.location.origin || 'https://glasswater.com';
      const portalUrl = `${siteUrl}/#portal?code=${editingDoc.code}`;
      const message = `Dear ${editingDoc.clientName},

Your ${editingDoc.type.toLowerCase()} (#${editingDoc.code}) for "${editingDoc.title}" is ready.

Please visit our client portal at ${portalUrl} and enter the code ${editingDoc.code} to view and download your document.

If you have any questions, please do not hesitate to contact us.

— Glasswater Fit-Outs & Co. Ltd.`;

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

  // Session inactivity timeout (30 minutes)
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

  // Brute-force lockout countdown timer
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
    // Refresh enquiries when tab is clicked
    if (tab === 'enquiries') {
      const saved = localStorage.getItem('glasswater_enquiries');
      if (saved) {
        try { setEnquiries(JSON.parse(saved)); } catch {}
      }
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
            ['settings', t('admin.tab_settings')],
            ['documents', t('admin.tab_documents')],
            ['enquiries', 'Enquiries'],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
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
                          <span className="text-sm text-text-secondary">{r.date}</span>
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
                <button
                  onClick={() => {
                    setEditingItem({ title: '', category: '', desc: '', value: '', duration: '', slug: '', content: '', gallery: [], image: 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ' });
                    setShowForm(true);
                  }}
                  className="bg-gold text-white px-4 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} /> {t('admin.add_new')}
                </button>
              </div>
              <div className="grid gap-4">
                {projects.map((p, i) => (
                  <div key={i} className="border border-light-gray p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 shrink-0 rounded bg-cover bg-center" style={{backgroundImage: `url(${p.image})`}}></div>
                      <div>
                        <h3 className="font-bold text-navy line-clamp-1">{p.title}</h3>
                        <p className="text-sm text-text-secondary">{p.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => { setEditingItem(p); setShowForm(true); }} className="p-2 text-steel-blue hover:text-gold bg-light-gray rounded transition-colors cursor-pointer">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteProject(p.id)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded transition-colors cursor-pointer">
                        <Trash2 size={18} />
                      </button>
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
                <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-navy font-semibold uppercase tracking-widest text-sm transition-colors cursor-pointer">
                  {t('admin.cancel')}
                </button>
              </div>
              <form onSubmit={handleProjectSubmit}>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.title')}</label>
                <input type="text" required value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className={inputClass} />

                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.category')}</label>
                <input type="text" required value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className={inputClass} />

                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.description')}</label>
                <textarea required rows={4} value={editingItem.desc} onChange={e => setEditingItem({...editingItem, desc: e.target.value})} className={inputClass}></textarea>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.value')}</label>
                    <input type="text" value={editingItem.value} onChange={e => setEditingItem({...editingItem, value: e.target.value})} className={inputClass} placeholder={t('admin.budget')} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.duration')}</label>
                    <input type="text" value={editingItem.duration} onChange={e => setEditingItem({...editingItem, duration: e.target.value})} className={inputClass} />
                  </div>
                </div>

                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.slug')}</label>
                <input
                  type="text"
                  value={editingItem.slug || ''}
                  onChange={e => setEditingItem({...editingItem, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
                  className={inputClass}
                  placeholder="auto-generated-from-title"
                />

                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.image_url')}</label>
                <input type="text" required value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className={inputClass} />
                {editingItem.image && (
                  <div className="mb-4 w-32 h-32 bg-cover bg-center rounded border border-light-gray" style={{backgroundImage: `url(${editingItem.image})`}} />
                )}

                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.content')}</label>
                <textarea
                  rows={10}
                  value={editingItem.content || ''}
                  onChange={e => setEditingItem({...editingItem, content: e.target.value})}
                  className={`${inputClass} resize-y font-mono text-sm`}
                  placeholder="<h3>Project Overview</h3><p>Write your case study content here using HTML. Use <h3> for section headers and <p> for paragraphs.</p>"
                ></textarea>

                <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-lg font-bold text-navy">Gallery Images</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const currentGallery = editingItem.gallery || [];
                        setEditingItem({...editingItem, gallery: [...currentGallery, '']});
                      }}
                      className="bg-navy text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-widest hover:bg-gold transition-colors cursor-pointer"
                    >
                      + Add Image
                    </button>
                  </div>
                  {(editingItem.gallery || []).length === 0 ? (
                    <p className="text-text-secondary text-sm">No gallery images added. Add photos from Google Drive to showcase this project.</p>
                  ) : (
                    <div className="space-y-3">
                      {(editingItem.gallery || []).map((url: string, idx: number) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <input
                            type="text"
                            value={url}
                            placeholder="https://lh3.googleusercontent.com/d/..."
                            onChange={e => {
                              const newGallery = [...(editingItem.gallery || [])];
                              newGallery[idx] = e.target.value;
                              setEditingItem({...editingItem, gallery: newGallery});
                            }}
                            className="flex-1 p-2 border border-light-gray rounded text-sm focus:outline-none focus:border-gold bg-white"
                          />
                          {url && (
                            <img src={url} alt="" className="w-16 h-16 object-cover rounded border border-light-gray shrink-0" />
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const newGallery = (editingItem.gallery || []).filter((_: any, i: number) => i !== idx);
                              setEditingItem({...editingItem, gallery: newGallery});
                            }}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="bg-navy text-white px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-gold transition-colors cursor-pointer">
                  {t('admin.save_project')}
                </button>
              </form>
            </div>
          )}

          {/* INSIGHTS TAB */}
          {activeTab === 'insights' && !showForm && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy">{t('admin.insights_count')} ({posts.length})</h2>
                <button
                  onClick={() => {
                    setEditingItem({ title: '', slug: '', category: '', excerpt: '', content: '', date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), coverImage: 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ' });
                    setShowForm(true);
                  }}
                  className="bg-gold text-white px-4 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} /> {t('admin.add_new')}
                </button>
              </div>
              <div className="grid gap-4">
                {posts.map((p, i) => (
                  <div key={i} className="border border-light-gray p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 shrink-0 rounded bg-cover bg-center" style={{backgroundImage: `url(${p.coverImage})`}}></div>
                      <div>
                        <h3 className="font-bold text-navy line-clamp-1">{p.title}</h3>
                        <p className="text-sm text-text-secondary">{p.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => { setEditingItem({...p, originalSlug: p.slug}); setShowForm(true); }} className="p-2 text-steel-blue hover:text-gold bg-light-gray rounded transition-colors cursor-pointer">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deletePost(p.slug)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded transition-colors cursor-pointer">
                        <Trash2 size={18} />
                      </button>
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
                <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-navy font-semibold uppercase tracking-widest text-sm transition-colors cursor-pointer">
                  {t('admin.cancel')}
                </button>
              </div>
              <form onSubmit={handlePostSubmit}>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.title')}</label>
                <input type="text" required value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className={inputClass} />

                {editingItem.originalSlug && (
                  <>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.slug')}</label>
                    <input type="text" required value={editingItem.slug} onChange={e => setEditingItem({...editingItem, slug: e.target.value})} className={inputClass} />
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.category')}</label>
                    <input type="text" required value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.date')}</label>
                    <input type="text" required value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} className={inputClass} />
                  </div>
                </div>

                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.excerpt')}</label>
                <textarea required rows={2} value={editingItem.excerpt} onChange={e => setEditingItem({...editingItem, excerpt: e.target.value})} className={inputClass}></textarea>

                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.content')}</label>
                <textarea required rows={8} value={editingItem.content} onChange={e => setEditingItem({...editingItem, content: e.target.value})} className={inputClass}></textarea>

                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cover_image')}</label>
                <input type="text" required value={editingItem.coverImage} onChange={e => setEditingItem({...editingItem, coverImage: e.target.value})} className={inputClass} />
                {editingItem.coverImage && (
                  <div className="mb-4 w-32 h-32 bg-cover bg-center rounded border border-light-gray" style={{backgroundImage: `url(${editingItem.coverImage})`}} />
                )}

                <button type="submit" className="bg-navy text-white px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-gold transition-colors cursor-pointer">
                  {t('admin.save_insight')}
                </button>
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

              {settingsSavedMsg && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={20} className="shrink-0 text-green-600" />
                  <span className="font-medium">{t('admin.settings_saved')}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray">
                    <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2">
                      <Globe size={18} className="text-gold" /> {t('admin.core_visual')}
                    </h3>
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.logo_url')}</label>
                    <input type="text" required value={localSettings.logoUrl} onChange={e => setFormSettingsVal('logoUrl', e.target.value)} className={inputClass} />
                    {localSettings.logoUrl && (
                      <div className="mb-4 p-3 bg-white border border-light-gray rounded flex items-center justify-center h-20">
                        <img src={localSettings.logoUrl} alt="Logo" className="h-12 object-contain" />
                      </div>
                    )}
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.contact_image_url')}</label>
                    <input type="text" required value={localSettings.contactImageUrl} onChange={e => setFormSettingsVal('contactImageUrl', e.target.value)} className={`${inputClass} !mb-0`} />
                    {localSettings.contactImageUrl && (
                      <div className="mt-2 p-2 bg-white border border-light-gray rounded flex items-center justify-center h-20">
                        <img src={localSettings.contactImageUrl} alt="Contact" className="h-16 object-contain" />
                      </div>
                    )}
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest mt-4">{t('admin.site_url_label')}</label>
                    <input type="text" required value={localSettings.siteUrl || ''} onChange={e => setFormSettingsVal('siteUrl', e.target.value)} className={`${inputClass} !mb-0`} placeholder="https://glasswater.com" />
                  </div>

                  <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray">
                    <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2">
                      <FileText size={18} className="text-gold" /> {t('admin.contact_info')}
                    </h3>
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.phone')}</label>
                    <input type="text" required value={localSettings.phone} onChange={e => setFormSettingsVal('phone', e.target.value)} className={inputClass} />
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.whatsapp')}</label>
                    <input type="text" required value={localSettings.whatsapp} onChange={e => setFormSettingsVal('whatsapp', e.target.value)} className={inputClass} />
                    <p className="text-[11px] text-steel-blue mt-[-10px] mb-4">{t('admin.whatsapp_hint')}</p>
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.email')}</label>
                    <input type="email" required value={localSettings.email} onChange={e => setFormSettingsVal('email', e.target.value)} className={inputClass} />
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.address')}</label>
                    <textarea required rows={2} value={localSettings.address} onChange={e => setFormSettingsVal('address', e.target.value)} className={`${inputClass} resize-y`}></textarea>
                  </div>
                </div>

                <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray mb-6">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2">
                    <FileText size={18} className="text-gold" /> {t('admin.payment_details')}
                  </h3>
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.payment_label')}</label>
                  <textarea rows={4} value={localSettings.paymentDetails || ''} onChange={e => setFormSettingsVal('paymentDetails', e.target.value)} className={`${inputClass} resize-y`} placeholder={t('admin.payment_placeholder')}></textarea>
                </div>

                <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray mb-6">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2">
                    <FileText size={18} className="text-gold" /> {t('admin.social_channels')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.facebook')}</label>
                      <input type="text" required value={localSettings.facebook} onChange={e => setFormSettingsVal('facebook', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.instagram')}</label>
                      <input type="text" required value={localSettings.instagram} onChange={e => setFormSettingsVal('instagram', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.linkedin')}</label>
                      <input type="text" required value={localSettings.linkedin} onChange={e => setFormSettingsVal('linkedin', e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>

                <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray mb-6">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2">
                    <FileText size={18} className="text-gold" /> {t('admin.admin_legal')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.terms')}</label>
                      <textarea rows={6} value={localSettings.termsAndConditions || ''} onChange={e => setFormSettingsVal('termsAndConditions', e.target.value)} className={`${inputClass} resize-y`} placeholder={t('admin.terms_placeholder')}></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.admin_password')}</label>
                      <div className="relative">
                        <input
                          type={showSettingsPassword ? "text" : "password"}
                          value={localSettings.adminPassword || ''}
                          onChange={e => setFormSettingsVal('adminPassword', e.target.value)}
                          className={`${inputClass} pr-12`}
                          placeholder={t('admin.admin_password_placeholder')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSettingsPassword(!showSettingsPassword)}
                          className="absolute right-3 top-[14px] text-concrete-gray hover:text-navy transition-colors cursor-pointer"
                          tabIndex={-1}
                        >
                          {showSettingsPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={isSavingSettings} className="bg-gold text-white px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors shadow-custom cursor-pointer disabled:opacity-50">
                    {isSavingSettings ? <Loader size={16} className="animate-spin inline mr-2" /> : null}
                    {isSavingSettings ? t('loading.saving') : t('admin.save_settings')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CLIENT DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <div>
              {showDocForm && editingDoc ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-2xl font-bold text-navy">
                      {documents.some(d => d.code === editingDoc.code) ? t('admin.edit_doc') : t('admin.create_doc')}
                    </h2>
                    <button
                      type="button"
                      onClick={() => { setShowDocForm(false); setEditingDoc(null); setDocErrors({}); }}
                      className="text-text-secondary hover:text-navy font-semibold uppercase tracking-widest text-sm transition-colors cursor-pointer"
                    >
                      {t('admin.cancel')}
                    </button>
                  </div>

                  <form onSubmit={handleDocSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.ref_code_label')}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            disabled={documents.some(d => d.code === editingDoc.code)}
                            placeholder="Enter Code"
                            value={editingDoc.code}
                            onChange={e => setEditingDoc({ ...editingDoc, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                            className={docErrors.code ? errorInputClass : `${inputClass} !mb-0 disabled:opacity-50 disabled:bg-gray-100`}
                          />
                          {!documents.some(d => d.code === editingDoc.code) && (
                            <button type="button" onClick={generateDocCode} className="bg-gold/10 text-gold border border-gold px-3 rounded font-semibold text-xs uppercase tracking-wider hover:bg-gold hover:text-white transition-colors cursor-pointer">
                              {t('admin.generate')}
                            </button>
                          )}
                        </div>
                        {docErrors.code && <p className="text-xs text-red-600 mt-1">{docErrors.code}</p>}
                        <p className="text-[10px] text-steel-blue mt-1">{t('admin.code_hint')}</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.doc_type')}</label>
                        <select value={editingDoc.type} onChange={e => setEditingDoc({ ...editingDoc, type: e.target.value as any })} className={inputClass}>
                          <option value="Estimate">{t('admin.estimate')}</option>
                          <option value="Waybill">{t('admin.waybill')}</option>
                          <option value="Invoice">{t('admin.invoice')}</option>
                          <option value="Receipt">{t('admin.receipt')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.status')}</label>
                        <select value={editingDoc.status} onChange={e => setEditingDoc({ ...editingDoc, status: e.target.value as any })} className={inputClass}>
                          <option value="Draft">{t('admin.draft')}</option>
                          <option value="Sent">{t('admin.sent')}</option>
                          <option value="Approved">{t('admin.approved')}</option>
                          <option value="Delivered">{t('admin.delivered')}</option>
                          <option value="Paid">{t('admin.paid')}</option>
                          <option value="Cancelled">{t('admin.cancelled')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.client_full_name')}</label>
                        <input type="text" value={editingDoc.clientName} onChange={e => { setEditingDoc({ ...editingDoc, clientName: e.target.value }); setDocErrors({}); }} className={docErrors.clientName ? errorInputClass : inputClass} />
                        {docErrors.clientName && <p className="text-xs text-red-600 mt-[-10px]">{docErrors.clientName}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.client_email_opt')}</label>
                        <input type="email" value={editingDoc.clientEmail || ''} onChange={e => setEditingDoc({ ...editingDoc, clientEmail: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.client_phone_opt')}</label>
                        <input type="text" value={editingDoc.clientPhone || ''} onChange={e => setEditingDoc({ ...editingDoc, clientPhone: e.target.value })} className={inputClass} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.project_title')}</label>
                        <input type="text" placeholder="Enter Project Title" value={editingDoc.title} onChange={e => { setEditingDoc({ ...editingDoc, title: e.target.value }); setDocErrors({}); }} className={docErrors.title ? errorInputClass : inputClass} />
                        {docErrors.title && <p className="text-xs text-red-600 mt-[-10px]">{docErrors.title}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.issue_date')}</label>
                        <input type="date" value={editingDoc.date} onChange={e => setEditingDoc({ ...editingDoc, date: e.target.value })} className={inputClass} />
                      </div>
                    </div>

                    <div className="bg-light-gray/20 p-6 rounded-lg border border-light-gray">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                          <PlusCircle size={18} className="text-gold" /> {t('admin.line_items')}
                        </h3>
                        <button type="button" onClick={handleAddDocItem} className="bg-navy text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-widest hover:bg-gold transition-colors flex items-center gap-1 cursor-pointer">
                          <Plus size={14} /> {t('admin.add_line_item')}
                        </button>
                      </div>

                      {docErrors.items && <p className="text-xs text-red-600 mb-3">{docErrors.items}</p>}

                      {editingDoc.items.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded border border-dashed border-light-gray text-text-secondary text-sm">
                          {t('admin.no_line_items')}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse bg-white rounded shadow-sm min-w-[600px]">
                            <thead>
                              <tr className="bg-navy text-white text-[11px] uppercase tracking-widest">
                                <th className="p-3">{t('admin.description_scope')}</th>
                                <th className="p-3 w-20 text-center">{t('admin.qty')}</th>
                                <th className="p-3 w-32">{t('admin.unit_price_ghs')}</th>
                                <th className="p-3 w-32 text-right">{t('admin.total_ghs')}</th>
                                <th className="p-3 w-16 text-center"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-light-gray text-sm">
                              {editingDoc.items.map((item) => (
                                <tr key={item.id}>
                                  <td className="p-3">
                                    <input type="text" placeholder="Description" value={item.description} onChange={e => handleDocItemChange(item.id, 'description', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-gold outline-none py-1 min-w-[120px]" />
                                  </td>
                                  <td className="p-3">
                                    <input type="number" min="1" value={item.quantity} onChange={e => handleDocItemChange(item.id, 'quantity', e.target.value)} className="w-full text-center bg-transparent border-b border-transparent focus:border-gold outline-none py-1 min-w-[50px]" />
                                  </td>
                                  <td className="p-3">
                                    <input type="number" min="0" step="0.01" placeholder="0.00" value={item.unitPrice || ''} onChange={e => handleDocItemChange(item.id, 'unitPrice', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-gold outline-none py-1 min-w-[80px]" />
                                  </td>
                                  <td className="p-3 text-right font-semibold text-navy">
                                    GHS {Number(item.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>
                                  <td className="p-3 text-center">
                                    <button type="button" onClick={() => handleRemoveDocItem(item.id)} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer" title="Remove item">
                                      <Trash size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-light-gray/30 font-bold text-navy text-base">
                                <td colSpan={3} className="p-4 text-right">{t('admin.estimated_total')}</td>
                                <td className="p-4 text-right text-gold">
                                  GHS {Number(editingDoc.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.discount_type')}</label>
                        <select value={editingDoc.discountType || ''} onChange={e => handleDocDiscountChange('discountType', e.target.value)} className={inputClass}>
                          <option value="">{t('admin.none')}</option>
                          <option value="fixed">{t('admin.fixed_amount')}</option>
                          <option value="percentage">{t('admin.percentage')}</option>
                        </select>
                        {docErrors.discount && <p className="text-xs text-red-600 mt-[-10px]">{docErrors.discount}</p>}
                      </div>

                      {editingDoc.discountType && (
                        <div>
                          <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.discount_value')}</label>
                          <input type="number" min="0" step="0.01" value={editingDoc.discountValue || ''} onChange={e => handleDocDiscountChange('discountValue', e.target.value)} className={inputClass} placeholder={editingDoc.discountType === 'percentage' ? "10" : "500"} />
                        </div>
                      )}

                      <div className="flex items-center">
                        <label className="flex items-center gap-3 cursor-pointer md:mt-4">
                          <input type="checkbox" checked={!!editingDoc.includePaymentDetails} onChange={e => setEditingDoc({ ...editingDoc, includePaymentDetails: e.target.checked })} className="w-5 h-5 accent-gold cursor-pointer" />
                          <span className="text-sm font-semibold text-navy uppercase tracking-widest">{t('admin.attach_payment')}</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.notes_label')}</label>
                        <textarea rows={3} placeholder={t('admin.notes_placeholder')} value={editingDoc.notes || ''} onChange={e => setEditingDoc({ ...editingDoc, notes: e.target.value })} className={`${inputClass} resize-y`}></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.file_link')}</label>
                        <input type="text" placeholder={t('admin.file_placeholder')} value={editingDoc.fileUrl || ''} onChange={e => setEditingDoc({ ...editingDoc, fileUrl: e.target.value })} className={inputClass} />
                        <div className="p-3 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs flex gap-2">
                          <Info size={16} className="shrink-0 mt-0.5" />
                          <span>{t('admin.file_hint')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 border-t border-light-gray pt-6">
                      <button type="button" onClick={() => { setShowDocForm(false); setEditingDoc(null); setDocErrors({}); }} className="bg-transparent border border-light-gray text-text-secondary px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-gray-100 transition-colors cursor-pointer">
                        {t('admin.cancel')}
                      </button>
                      <button type="submit" disabled={isSavingDoc} className="bg-gold text-white px-10 py-3 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors shadow-custom cursor-pointer disabled:opacity-50">
                        {isSavingDoc ? <Loader size={16} className="animate-spin inline mr-2" /> : null}
                        {isSavingDoc ? t('loading.saving') : t('admin.save_doc')}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h2 className="font-serif text-2xl font-bold text-navy flex items-center gap-2">
                      <FileText size={22} className="text-gold" /> {t('admin.documents_title')} ({documents.length})
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDoc({
                          code: '', clientName: '', clientEmail: '', clientPhone: '',
                          title: '', type: 'Estimate', status: 'Draft',
                          date: new Date().toISOString().split('T')[0],
                          items: [], notes: '', totalAmount: 0
                        });
                        setShowDocForm(true);
                        setDocErrors({});
                      }}
                      className="bg-gold text-white px-6 py-3 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                    >
                      <Plus size={18} /> {t('admin.new_document')}
                    </button>
                  </div>

                  {docSaveMessage && (
                    <div className="mb-6 p-5 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Check className="text-green-600" size={18} />
                        <span className="font-semibold text-green-800 text-sm uppercase tracking-wider">{t('admin.doc_saved')}</span>
                      </div>
                      <div className="bg-white border border-green-100 rounded p-4 text-sm text-navy whitespace-pre-line font-sans leading-relaxed mb-3">
                        {docSaveMessage}
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(docSaveMessage);
                            addToast('success', t('toast.message_copied'), 3000);
                          }}
                          className="bg-navy text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider hover:bg-gold transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Copy size={14} /> {t('admin.copy_message')}
                        </button>
                        <button type="button" onClick={() => setDocSaveMessage(null)} className="border border-light-gray text-text-secondary px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors cursor-pointer">
                          {t('admin.dismiss')}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder={t('admin.search_docs')}
                      value={searchDocQuery}
                      onChange={e => setSearchDocQuery(e.target.value)}
                      className="w-full max-w-xl p-3 border border-light-gray rounded font-sans text-base focus:outline-none focus:border-gold bg-bg-body text-text-primary transition-all"
                    />
                  </div>

                  {documents.filter(doc =>
                    doc.code.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
                    doc.clientName.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
                    doc.title.toLowerCase().includes(searchDocQuery.toLowerCase())
                  ).length === 0 ? (
                    <div className="text-center py-12 text-text-secondary">{t('admin.no_docs')}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="bg-light-gray text-navy text-[11px] uppercase tracking-widest font-bold">
                            <th className="p-4">{t('admin.ref_code')}</th>
                            <th className="p-4">{t('admin.client_name')}</th>
                            <th className="p-4">{t('admin.doc_title')}</th>
                            <th className="p-4 text-center">{t('admin.type')}</th>
                            <th className="p-4 text-center">{t('admin.status')}</th>
                            <th className="p-4 text-right">{t('admin.total_amount')}</th>
                            <th className="p-4 text-center">{t('admin.actions')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-light-gray text-sm text-text-primary">
                          {documents.filter(doc =>
                            doc.code.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
                            doc.clientName.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
                            doc.title.toLowerCase().includes(searchDocQuery.toLowerCase())
                          ).map((doc) => (
                            <tr key={doc.code} className="hover:bg-light-gray/30 transition-colors">
                              <td className="p-4 font-mono font-bold text-navy">
                                <span className="bg-navy/5 px-2.5 py-1.5 rounded text-navy border border-navy/10">{doc.code}</span>
                              </td>
                              <td className="p-4 font-semibold">
                                <div>{doc.clientName}</div>
                                <div className="text-xs text-text-secondary font-normal">{doc.clientPhone || doc.clientEmail || t('admin.no_contact')}</div>
                              </td>
                              <td className="p-4 max-w-xs truncate" title={doc.title}>
                                {doc.title}
                                <div className="text-[11px] text-text-secondary font-normal mt-0.5">{t('admin.issued')} {doc.date}</div>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  doc.type === 'Estimate' ? 'bg-yellow-100 text-yellow-800' :
                                  doc.type === 'Waybill' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }`}>{doc.type}</span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  doc.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                  doc.status === 'Approved' ? 'bg-sky-100 text-sky-800' :
                                  doc.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                  doc.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>{doc.status}</span>
                              </td>
                              <td className="p-4 text-right font-bold text-navy">
                                GHS {doc.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(doc.code);
                                      setCopyCodeSuccess(doc.code);
                                      addToast('success', t('toast.code_copied'), 2000);
                                      setTimeout(() => setCopyCodeSuccess(null), 2000);
                                    }}
                                    className="p-1.5 hover:bg-gold/10 rounded text-gold transition-all relative flex items-center gap-1 cursor-pointer"
                                    title="Copy reference code"
                                  >
                                    {copyCodeSuccess === doc.code ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                    <span className="text-[10px] font-semibold uppercase tracking-wider hidden sm:inline">{t('admin.code')}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Navigate to portal with code, preserving the hash format
                                      const codeUrl = `#portal?code=${doc.code}`;
                                      window.location.hash = codeUrl;
                                    }}
                                    className="p-1.5 hover:bg-navy/10 rounded text-navy transition-all cursor-pointer"
                                    title="View & Download"
                                  >
                                    <Eye size={16} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingDoc({ ...doc });
                                      setShowDocForm(true);
                                      setDocErrors({});
                                    }}
                                    className="p-1.5 hover:bg-navy/10 rounded text-navy transition-all cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit size={16} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`${t('admin.delete_doc_confirm')} ${doc.code}?`)) {
                                        deleteDocument(doc.code);
                                        addToast('success', t('toast.doc_deleted'), 3000);
                                      }
                                    }}
                                    className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition-all cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy flex items-center gap-2">
                  <Mail size={22} className="text-gold" /> Contact Enquiries ({enquiries.length})
                </h2>
              </div>
              {enquiries.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                  <p className="text-lg">No enquiries received yet.</p>
                  <p className="text-sm mt-2">Contact form submissions will appear here automatically.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {enquiries.map((enq, i) => (
                    <div key={i} className="border border-light-gray p-5 rounded-lg">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-bold text-navy text-lg">{enq.name || 'Anonymous'}</h3>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm text-text-secondary">
                            {enq.email && <span className="flex items-center gap-1"><Mail size={14} className="text-gold shrink-0" /> {enq.email}</span>}
                            {enq.phone && <span className="flex items-center gap-1"><Phone size={14} className="text-gold shrink-0" /> {enq.phone}</span>}
                            {enq.service && (
                              <span className="bg-gold/10 text-gold px-2 py-0.5 rounded text-xs font-semibold">
                                {enq.service}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start gap-2 shrink-0">
                          <span className="text-xs text-concrete-gray whitespace-nowrap">
                            {enq.timestamp ? new Date(enq.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                          <button
                            onClick={() => deleteEnquiry(i)}
                            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete enquiry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {enq.message && (
                        <div className="bg-light-gray/30 p-4 rounded text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                          {enq.message}
                        </div>
                      )}
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
