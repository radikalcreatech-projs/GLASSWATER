import React from "react";
import { useState, useEffect } from 'react';
import { Settings, LogOut, CheckCircle2, Trash2, Edit, Star, Plus, FileText, Eye, Trash, Globe, Download, Loader, EyeOff, Mail, Phone, Layout, Upload, Download as DownloadIcon, PlusCircle, RefreshCw } from 'lucide-react';
import { projects as defaultProjects, posts as defaultPosts, defaultReviews } from '../data';
import { useSettings, WebsiteSettings } from '../context/SettingsContext';
import { useI18n } from '../context/I18nContext';
import { useToast } from '../context/ToastContext';
import { login as authLogin, logout as authLogout, isAuthenticated as checkAuth, isLockedOut, clearLockout } from '../utils/auth';
import { notify } from '../utils/notifications';
import * as CMS from '../cms';

type OptionRow = { value: string; label: string };

// Reusable component for editing option lists (dropdowns/checkboxes)
function OptionEditor({ title, options, setOptions }: { title: string; options: OptionRow[]; setOptions: (o: OptionRow[]) => void }) {
  const add = () => setOptions([...options, { value: '', label: '' }]);
  const remove = (i: number) => setOptions(options.filter((_, j) => j !== i));
  const setVal = (i: number, field: keyof OptionRow, val: string) => {
    const a = [...options];
    a[i] = { ...a[i], [field]: val };
    setOptions(a);
  };
  return (
    <div className="mb-4">
      <h4 className="font-semibold text-navy mb-2 uppercase tracking-widest text-xs flex justify-between items-center">
        {title}
        <button onClick={add} className="text-[10px] bg-navy text-white px-2 py-1 rounded uppercase tracking-wider hover:bg-gold transition-colors cursor-pointer">+ Add</button>
      </h4>
      {options.map((opt, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input type="text" placeholder="Value" value={opt.value} onChange={e => setVal(i, 'value', e.target.value)} className="flex-1 p-2 border border-light-gray rounded text-xs bg-white" />
          <input type="text" placeholder="Label" value={opt.label} onChange={e => setVal(i, 'label', e.target.value)} className="flex-[2] p-2 border border-light-gray rounded text-xs bg-white" />
          <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700 shrink-0 cursor-pointer p-1"><Trash size={14} /></button>
        </div>
      ))}
      {options.length === 0 && <p className="text-xs text-text-secondary italic">No options yet. Click "Add" to create one.</p>}
    </div>
  );
}

export function AdminPage() {
  const { t, lang } = useI18n();
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth());
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLocked, setLoginLocked] = useState(() => isLockedOut().locked);
  const [lockCountdown, setLockCountdown] = useState(() => isLockedOut().remainingSeconds);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<'reviews' | 'projects' | 'insights' | 'cms' | 'settings' | 'enquiries'>('cms');
  const [reviews, setReviews] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);

  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<WebsiteSettings>({ ...settings });
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showSettingsPassword, setShowSettingsPassword] = useState(false);

  // CMS state
  const [cmsLang, setCmsLang] = useState<'en' | 'fr'>(lang as 'en' | 'fr');
  type CmsSubTab = 'home_hero' | 'home_about' | 'about' | 'faq' | 'services' | 'careers' | 'forms';
  const [cmsSubTab, setCmsSubTab] = useState<CmsSubTab>('home_hero');
  const [cmsHomeHero, setCmsHomeHero] = useState(CMS.getHomeHero(cmsLang));
  const [cmsHomeAbout, setCmsHomeAbout] = useState(CMS.getHomeAbout(cmsLang));
  const [cmsAboutPage, setCmsAboutPage] = useState(CMS.getAboutPage(cmsLang));
  const [cmsFAQ, setCmsFAQ] = useState(CMS.getFAQ(cmsLang));
  const [cmsServices, setCmsServices] = useState(CMS.getServices(cmsLang));
  const [cmsCareers, setCmsCareers] = useState(CMS.getCareers(cmsLang));
  const [cmsForms, setCmsForms] = useState(CMS.getForms(cmsLang));
  const [cmsExportData, setCmsExportData] = useState('');
  const [cmsImportData, setCmsImportData] = useState('');

  const refreshCmsData = () => {
    setCmsHomeHero(CMS.getHomeHero(cmsLang)); setCmsHomeAbout(CMS.getHomeAbout(cmsLang));
    setCmsAboutPage(CMS.getAboutPage(cmsLang)); setCmsFAQ(CMS.getFAQ(cmsLang));
    setCmsServices(CMS.getServices(cmsLang)); setCmsCareers(CMS.getCareers(cmsLang));
    setCmsForms(CMS.getForms(cmsLang));
  };
  const handleCmsLangChange = (newLang: 'en' | 'fr') => { setCmsLang(newLang); setTimeout(refreshCmsData, 10); };
  const handleSaveCms = (type: string) => {
    switch (type) {
      case 'home_hero': CMS.saveHomeHero(cmsLang, cmsHomeHero); break;
      case 'home_about': CMS.saveHomeAbout(cmsLang, cmsHomeAbout); break;
      case 'about': CMS.saveAboutPage(cmsLang, cmsAboutPage); break;
      case 'faq': CMS.saveFAQ(cmsLang, cmsFAQ); break;
      case 'services': CMS.saveServices(cmsLang, cmsServices); break;
      case 'careers': CMS.saveCareers(cmsLang, cmsCareers); break;
      case 'forms': CMS.saveForms(cmsLang, cmsForms); break;
    }
    addToast('success', t('admin.cms_saved'), 3000);
  };
  const handleResetCms = (type: string) => { if (!confirm(t('admin.cms_reset_confirm'))) return; refreshCmsData(); addToast('success', t('admin.cms_saved'), 3000); };

  useEffect(() => { setLocalSettings({ ...settings }); }, [settings]);
  useEffect(() => {
    const lockState = isLockedOut();
    if (lockState.locked) { setLoginLocked(true); setLockCountdown(lockState.remainingSeconds); }
    const savedReviews = localStorage.getItem('glasswater_reviews');
    if (savedReviews) { try { setReviews(JSON.parse(savedReviews)); } catch {} } else { setReviews(defaultReviews); localStorage.setItem('glasswater_reviews', JSON.stringify(defaultReviews)); }
    const savedProjects = localStorage.getItem('glasswater_projects');
    if (savedProjects) { try { setProjects(JSON.parse(savedProjects)); } catch {} } else { setProjects(defaultProjects); }
    const savedPosts = localStorage.getItem('glasswater_posts');
    if (savedPosts) { try { setPosts(JSON.parse(savedPosts)); } catch {} } else { setPosts(defaultPosts); }
    const savedEnquiries = localStorage.getItem('glasswater_enquiries');
    if (savedEnquiries) { try { setEnquiries(JSON.parse(savedEnquiries)); } catch {} }
  }, []);

  const [lastActivity, setLastActivity] = useState(Date.now());
  useEffect(() => { if (!isAuthenticated) return; const updateActivity = () => setLastActivity(Date.now()); ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(e => window.addEventListener(e, updateActivity, { passive: true })); const checkInterval = setInterval(() => { if (Date.now() - lastActivity > 30 * 60 * 1000) { setIsAuthenticated(false); setLoginError(t('admin.session_expired')); } }, 10000); return () => { ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(e => window.removeEventListener(e, updateActivity)); clearInterval(checkInterval); }; }, [isAuthenticated, lastActivity, t]);
  useEffect(() => { if (!loginLocked || lockCountdown <= 0) return; const timer = setInterval(() => { setLockCountdown(prev => { if (prev <= 1) { setLoginLocked(false); localStorage.removeItem('glasswater_admin_lockout'); return 0; } return prev - 1; }); }, 1000); return () => clearInterval(timer); }, [loginLocked, lockCountdown]);

  const handleLogin = async (e: React.FormEvent) => { e.preventDefault(); setLoginError(''); if (loginLocked || isLoggingIn) return; setIsLoggingIn(true); try { const result = await authLogin(password, settings.adminPassword); if (result.success) { setIsAuthenticated(true); setLoginError(''); clearLockout(); setLoginLocked(false); } else { setLoginError((result as any).error); const ls = isLockedOut(); if (ls.locked) { setLoginLocked(true); setLockCountdown(ls.remainingSeconds); } } } finally { setIsLoggingIn(false); } };
  const handleTabClick = (tab: typeof activeTab) => { setActiveTab(tab); if (tab === 'enquiries') { const saved = localStorage.getItem('glasswater_enquiries'); if (saved) try { setEnquiries(JSON.parse(saved)); } catch {} } if (tab === 'cms') refreshCmsData(); };
  const deleteReview = (i: number) => { if (!confirm(t('admin.confirm_delete'))) return; const n = [...reviews]; n.splice(i, 1); setReviews(n); localStorage.setItem('glasswater_reviews', JSON.stringify(n)); };
  const deleteEnquiry = (i: number) => { if (!confirm('Delete?')) return; const n = [...enquiries]; n.splice(i, 1); setEnquiries(n); localStorage.setItem('glasswater_enquiries', JSON.stringify(n)); };
  const handleSaveSettings = (e: React.FormEvent) => { e.preventDefault(); setIsSavingSettings(true); setTimeout(() => { updateSettings(localSettings); setSettingsSavedMsg(true); setIsSavingSettings(false); addToast('success', t('toast.settings_saved'), 3000); setTimeout(() => setSettingsSavedMsg(false), 4000); }, 300); };

  if (!isAuthenticated) {
    return (<div className="py-16 px-6 bg-light-gray min-h-[60vh] flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-custom max-w-md w-full border border-gold/30">
        <div className="flex justify-center mb-6"><Settings className="text-gold w-12 h-12" /></div>
        <h1 className="font-serif text-2xl font-bold text-navy text-center mb-6">{t('admin.login')}</h1>
        {loginError && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm text-center font-medium">{loginError}</div>}
        <div className="mb-6"><label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.password')}</label><div className="relative"><input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-light-gray border border-transparent focus:border-gold px-4 py-3 pr-12 rounded outline-none transition-colors" placeholder={t('admin.password_placeholder')} disabled={loginLocked || isLoggingIn} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-concrete-gray hover:text-navy transition-colors cursor-pointer" tabIndex={-1}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
        <button type="submit" disabled={loginLocked || isLoggingIn} className="w-full bg-gold text-white font-semibold py-3 rounded uppercase tracking-widest hover:bg-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">{isLoggingIn ? <Loader size={16} className="animate-spin inline mr-2" /> : null}{isLoggingIn ? t('admin.logging_in') : t('admin.login_btn')}</button>
      </form>
    </div>);
  }

  const inputClass = "w-full p-3 border border-light-gray rounded font-sans text-base mb-4 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-bg-body text-text-primary transition-all";
  const cmsBtn = (tab: string) => `px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${cmsSubTab === tab ? 'bg-gold text-white' : 'bg-light-gray text-navy hover:bg-gold/10'}`;
  const tabs: [string, string][] = [['reviews', t('admin.tab_reviews')], ['projects', t('admin.tab_projects')], ['insights', t('admin.tab_insights')], ['cms', t('admin.tab_cms')], ['settings', t('admin.tab_settings')], ['enquiries', 'Enquiries']];

  return (
    <div className="py-6 md:py-8 px-2 sm:px-4 md:px-6 bg-light-gray min-h-[80vh]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-navy flex items-center gap-2 sm:gap-3"><Settings className="text-gold" /> {t('admin.dashboard')}</h1>
          <button onClick={() => { authLogout(); setIsAuthenticated(false); }} className="flex items-center gap-2 text-text-secondary hover:text-navy transition-colors cursor-pointer text-sm"><LogOut size={18} /> {t('admin.logout')}</button>
        </div>

        <div className="flex gap-1 md:gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map(([tab, label]) => (<button key={tab} onClick={() => handleTabClick(tab as typeof activeTab)} className={`px-3 md:px-5 py-2.5 md:py-3 rounded font-semibold uppercase tracking-widest transition-colors whitespace-nowrap text-[10px] md:text-xs cursor-pointer ${activeTab === tab ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-gold/10'}`}>{label}</button>))}
        </div>

        <div className="bg-white rounded-xl shadow-custom p-3 sm:p-4 md:p-8 border border-gold/20">

          {activeTab === 'cms' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy flex items-center gap-2"><Layout size={20} className="text-gold" /> {t('admin.tab_cms')}</h2>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-text-secondary">{t('admin.cms_lang_toggle')}</span>
                  <button onClick={() => handleCmsLangChange('en')} className={`px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-bold uppercase ${cmsLang === 'en' ? 'bg-gold text-white' : 'bg-light-gray text-navy'}`}>EN</button>
                  <button onClick={() => handleCmsLangChange('fr')} className={`px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-bold uppercase ${cmsLang === 'fr' ? 'bg-gold text-white' : 'bg-light-gray text-navy'}`}>FR</button>
                </div>
              </div>

              <div className="flex gap-1 sm:gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                <button onClick={() => setCmsSubTab('home_hero')} className={cmsBtn('home_hero')}>{t('admin.cms_sub_home_hero')}</button>
                <button onClick={() => setCmsSubTab('home_about')} className={cmsBtn('home_about')}>{t('admin.cms_sub_home_about')}</button>
                <button onClick={() => setCmsSubTab('about')} className={cmsBtn('about')}>{t('admin.cms_sub_about')}</button>
                <button onClick={() => setCmsSubTab('faq')} className={cmsBtn('faq')}>{t('admin.cms_sub_faq')}</button>
                <button onClick={() => setCmsSubTab('services')} className={cmsBtn('services')}>{t('admin.cms_sub_services')}</button>
                <button onClick={() => setCmsSubTab('careers')} className={cmsBtn('careers')}>{t('admin.cms_sub_careers')}</button>
                <button onClick={() => setCmsSubTab('forms')} className={cmsBtn('forms')}>Forms & CTAs</button>
              </div>

              {/* === FORMS & CTAs SUB-TAB === */}
              {cmsSubTab === 'forms' && (
                <div className="bg-light-gray/20 p-4 sm:p-6 rounded-lg border border-light-gray">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4">Forms & CTA Labels</h3>

                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Floating Quote Button Label</label>
                  <input type="text" value={cmsForms.quoteButtonLabel} onChange={e => setCmsForms({...cmsForms, quoteButtonLabel: e.target.value})} className={inputClass} />

                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest mt-4">Wizard Step Labels (comma-separated)</label>
                  <input type="text" value={cmsForms.wizardStepLabels.join(', ')} onChange={e => setCmsForms({...cmsForms, wizardStepLabels: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className={inputClass} />

                  <OptionEditor title="Wizard Project Type Options (Step 1 dropdown)" options={cmsForms.wizardTypeOptions} setOptions={(o) => setCmsForms({...cmsForms, wizardTypeOptions: o})} />
                  <OptionEditor title="Wizard Scope Checkboxes (Step 3)" options={cmsForms.wizardScopeChecks} setOptions={(o) => setCmsForms({...cmsForms, wizardScopeChecks: o})} />
                  <OptionEditor title="Wizard Budget Options (Step 4 dropdown)" options={cmsForms.wizardBudgetOptions} setOptions={(o) => setCmsForms({...cmsForms, wizardBudgetOptions: o})} />
                  <OptionEditor title="Wizard Urgency Options (Step 4 dropdown)" options={cmsForms.wizardUrgencyOptions} setOptions={(o) => setCmsForms({...cmsForms, wizardUrgencyOptions: o})} />
                  <OptionEditor title="Contact Service Dropdown Options" options={cmsForms.contactServiceOptions} setOptions={(o) => setCmsForms({...cmsForms, contactServiceOptions: o})} />

                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest mt-4">Wizard File Upload Instructions (HTML)</label>
                  <textarea rows={4} value={cmsForms.wizardFileInstructions} onChange={e => setCmsForms({...cmsForms, wizardFileInstructions: e.target.value})} className={inputClass} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Contact Thank-You Title</label><input type="text" value={cmsForms.contactThankYouTitle} onChange={e => setCmsForms({...cmsForms, contactThankYouTitle: e.target.value})} className={inputClass} /></div>
                    <div><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">"Send Another" Label</label><input type="text" value={cmsForms.contactSendAnotherLabel} onChange={e => setCmsForms({...cmsForms, contactSendAnotherLabel: e.target.value})} className={inputClass} /></div>
                    <div><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">"Email Us" Label</label><input type="text" value={cmsForms.contactEmailUsLabel} onChange={e => setCmsForms({...cmsForms, contactEmailUsLabel: e.target.value})} className={inputClass} /></div>
                  </div>
                  <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest mt-4">Contact Confirmation Text</label>
                  <textarea rows={2} value={cmsForms.contactConfirmationText} onChange={e => setCmsForms({...cmsForms, contactConfirmationText: e.target.value})} className={inputClass} />

                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleSaveCms('forms')} className="bg-gold text-white px-6 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors cursor-pointer">{t('admin.save_settings')}</button>
                    <button onClick={() => handleResetCms('forms')} className="bg-transparent border border-red-300 text-red-600 px-4 py-2 rounded font-semibold uppercase tracking-widest text-xs hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button>
                  </div>
                </div>
              )}

              {/* Home Hero */}
              {cmsSubTab === 'home_hero' && (
                <div className="bg-light-gray/20 p-4 sm:p-6 rounded-lg border border-light-gray">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4">{t('admin.cms_sub_home_hero')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_hero_heading')}</label><textarea rows={2} value={cmsHomeHero.headingHtml} onChange={e => setCmsHomeHero({...cmsHomeHero, headingHtml: e.target.value})} className={inputClass}></textarea></div>
                    <div><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_hero_subheading')}</label><textarea rows={2} value={cmsHomeHero.subheading} onChange={e => setCmsHomeHero({...cmsHomeHero, subheading: e.target.value})} className={inputClass}></textarea></div>
                    <div><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_hero_cta1')}</label><input type="text" value={cmsHomeHero.cta1Text} onChange={e => setCmsHomeHero({...cmsHomeHero, cta1Text: e.target.value})} className={inputClass} /></div>
                    <div><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_hero_cta2')}</label><input type="text" value={cmsHomeHero.cta2Text} onChange={e => setCmsHomeHero({...cmsHomeHero, cta2Text: e.target.value})} className={inputClass} /></div>
                  </div>
                  <h4 className="font-semibold text-navy mt-4 mb-3 uppercase tracking-widest text-xs">Stats</h4>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_stats_projects')}</label><input type="text" value={cmsHomeHero.statsProjects} onChange={e => setCmsHomeHero({...cmsHomeHero, statsProjects: e.target.value})} className={inputClass} /></div>
                    <div><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_stats_commercial')}</label><input type="text" value={cmsHomeHero.statsCommercial} onChange={e => setCmsHomeHero({...cmsHomeHero, statsCommercial: e.target.value})} className={inputClass} /></div>
                    <div><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_stats_satisfaction')}</label><input type="text" value={cmsHomeHero.statsSatisfaction} onChange={e => setCmsHomeHero({...cmsHomeHero, statsSatisfaction: e.target.value})} className={inputClass} /></div>
                  </div>
                  <div className="flex gap-3 mt-4"><button onClick={() => handleSaveCms('home_hero')} className="bg-gold text-white px-5 py-2 rounded font-semibold uppercase tracking-widest text-xs sm:text-sm hover:bg-navy transition-colors cursor-pointer">{t('admin.save_settings')}</button><button onClick={() => handleResetCms('home_hero')} className="bg-transparent border border-red-300 text-red-600 px-3 py-2 rounded font-semibold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button></div>
                </div>
              )}

              {/* Home About, About Page, FAQ, Services, Careers — same pattern, omitted for brevity but functional */}
              {cmsSubTab === 'home_about' && (<div className="bg-light-gray/20 p-4 sm:p-6 rounded-lg border border-light-gray"><h3 className="font-serif text-lg font-bold text-navy mb-4">{t('admin.cms_sub_home_about')}</h3><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_home_about_heading')}</label><input type="text" value={cmsHomeAbout.heading} onChange={e => setCmsHomeAbout({...cmsHomeAbout, heading: e.target.value})} className={inputClass} /><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_home_about_desc')}</label><textarea rows={3} value={cmsHomeAbout.description} onChange={e => setCmsHomeAbout({...cmsHomeAbout, description: e.target.value})} className={inputClass}></textarea><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_home_about_readmore')}</label><input type="text" value={cmsHomeAbout.readMoreLabel} onChange={e => setCmsHomeAbout({...cmsHomeAbout, readMoreLabel: e.target.value})} className={inputClass} /><div className="flex gap-3 mt-4"><button onClick={() => handleSaveCms('home_about')} className="bg-gold text-white px-5 py-2 rounded font-semibold uppercase tracking-widest text-xs sm:text-sm hover:bg-navy cursor-pointer">{t('admin.save_settings')}</button><button onClick={() => handleResetCms('home_about')} className="bg-transparent border border-red-300 text-red-600 px-3 py-2 rounded font-semibold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-red-50 cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button></div></div>)}
              {cmsSubTab === 'about' && (<div className="bg-light-gray/20 p-4 sm:p-6 rounded-lg border border-light-gray"><h3 className="font-serif text-lg font-bold text-navy mb-4">{t('admin.cms_sub_about')}</h3><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_about_title')}</label><input type="text" value={cmsAboutPage.title} onChange={e => setCmsAboutPage({...cmsAboutPage, title: e.target.value})} className={inputClass} /><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_about_desc')}</label><textarea rows={3} value={cmsAboutPage.description} onChange={e => setCmsAboutPage({...cmsAboutPage, description: e.target.value})} className={inputClass}></textarea><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_about_values')}</label><input type="text" value={cmsAboutPage.values.join(', ')} onChange={e => setCmsAboutPage({...cmsAboutPage, values: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className={inputClass} /><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_about_vision_title')}</label><input type="text" value={cmsAboutPage.visionTitle} onChange={e => setCmsAboutPage({...cmsAboutPage, visionTitle: e.target.value})} className={inputClass} /><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_about_vision_text')}</label><textarea rows={3} value={cmsAboutPage.visionText} onChange={e => setCmsAboutPage({...cmsAboutPage, visionText: e.target.value})} className={inputClass}></textarea><div className="flex gap-3 mt-4"><button onClick={() => handleSaveCms('about')} className="bg-gold text-white px-5 py-2 rounded font-semibold uppercase tracking-widest text-xs sm:text-sm hover:bg-navy cursor-pointer">{t('admin.save_settings')}</button><button onClick={() => handleResetCms('about')} className="bg-transparent border border-red-300 text-red-600 px-3 py-2 rounded font-semibold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-red-50 cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button></div></div>)}
              {cmsSubTab === 'faq' && (<div className="bg-light-gray/20 p-4 sm:p-6 rounded-lg border border-light-gray"><div className="flex justify-between items-center mb-4"><h3 className="font-serif text-lg font-bold text-navy">{t('admin.cms_sub_faq')}</h3><button onClick={() => { const newItems = [...cmsFAQ.items, { q: '', a: '' }]; setCmsFAQ({...cmsFAQ, items: newItems}); }} className="bg-navy text-white text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded uppercase tracking-widest hover:bg-gold transition-colors flex items-center gap-1 cursor-pointer"><Plus size={14} /> {t('admin.cms_faq_add')}</button></div><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_faq_title')}</label><input type="text" value={cmsFAQ.title} onChange={e => setCmsFAQ({...cmsFAQ, title: e.target.value})} className={inputClass} /><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_faq_subtitle')}</label><input type="text" value={cmsFAQ.subtitle} onChange={e => setCmsFAQ({...cmsFAQ, subtitle: e.target.value})} className={inputClass} /><h4 className="font-semibold text-navy mt-4 mb-3 uppercase tracking-widest text-xs">{t('admin.cms_faq_items')}</h4>{cmsFAQ.items.map((item, idx) => (<div key={idx} className="border border-light-gray rounded p-3 mb-3 bg-white"><div className="flex gap-2"><div className="flex-1 space-y-2"><input type="text" placeholder={t('admin.cms_faq_question')} value={item.q} onChange={e => { const items = [...cmsFAQ.items]; items[idx] = {...items[idx], q: e.target.value}; setCmsFAQ({...cmsFAQ, items}); }} className="w-full p-2 border border-light-gray rounded text-xs sm:text-sm" /><input type="text" placeholder={t('admin.cms_faq_answer')} value={item.a} onChange={e => { const items = [...cmsFAQ.items]; items[idx] = {...items[idx], a: e.target.value}; setCmsFAQ({...cmsFAQ, items}); }} className="w-full p-2 border border-light-gray rounded text-xs sm:text-sm" /></div><button onClick={() => { const items = cmsFAQ.items.filter((_, i) => i !== idx); setCmsFAQ({...cmsFAQ, items}); }} className="text-red-500 hover:text-red-700 shrink-0 cursor-pointer"><Trash size={16} /></button></div></div>))}<div className="flex gap-3 mt-4"><button onClick={() => handleSaveCms('faq')} className="bg-gold text-white px-5 py-2 rounded font-semibold uppercase tracking-widest text-xs sm:text-sm hover:bg-navy cursor-pointer">{t('admin.save_settings')}</button><button onClick={() => handleResetCms('faq')} className="bg-transparent border border-red-300 text-red-600 px-3 py-2 rounded font-semibold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-red-50 cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button></div></div>)}
              {cmsSubTab === 'services' && (<div className="bg-light-gray/20 p-4 sm:p-6 rounded-lg border border-light-gray"><div className="flex justify-between items-center mb-4"><h3 className="font-serif text-lg font-bold text-navy">{t('admin.cms_sub_services')}</h3><button onClick={() => { const newItems = [...cmsServices.items, { iconName: 'Settings', title: '', description: '' }]; setCmsServices({...cmsServices, items: newItems}); }} className="bg-navy text-white text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded uppercase tracking-widest hover:bg-gold transition-colors flex items-center gap-1 cursor-pointer"><Plus size={14} /> {t('admin.cms_services_add')}</button></div><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_services_title')}</label><input type="text" value={cmsServices.title} onChange={e => setCmsServices({...cmsServices, title: e.target.value})} className={inputClass} /><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_services_subtitle')}</label><input type="text" value={cmsServices.subtitle} onChange={e => setCmsServices({...cmsServices, subtitle: e.target.value})} className={inputClass} /><h4 className="font-semibold text-navy mt-4 mb-3 uppercase tracking-widest text-xs">{t('admin.cms_services_items')}</h4>{cmsServices.items.map((svc, idx) => (<div key={idx} className="border border-light-gray rounded p-3 mb-3 bg-white"><div className="flex gap-2"><div className="flex-1 grid grid-cols-3 gap-2"><input type="text" placeholder={t('admin.cms_service_icon')} value={svc.iconName} onChange={e => { const items = [...cmsServices.items]; items[idx] = {...items[idx], iconName: e.target.value}; setCmsServices({...cmsServices, items}); }} className="p-1.5 sm:p-2 border border-light-gray rounded text-[10px] sm:text-xs" /><input type="text" placeholder={t('admin.cms_service_title')} value={svc.title} onChange={e => { const items = [...cmsServices.items]; items[idx] = {...items[idx], title: e.target.value}; setCmsServices({...cmsServices, items}); }} className="p-1.5 sm:p-2 border border-light-gray rounded text-[10px] sm:text-xs" /><input type="text" placeholder={t('admin.cms_service_desc')} value={svc.description} onChange={e => { const items = [...cmsServices.items]; items[idx] = {...items[idx], description: e.target.value}; setCmsServices({...cmsServices, items}); }} className="p-1.5 sm:p-2 border border-light-gray rounded text-[10px] sm:text-xs" /></div><button onClick={() => { const items = cmsServices.items.filter((_, i) => i !== idx); setCmsServices({...cmsServices, items}); }} className="text-red-500 hover:text-red-700 shrink-0 cursor-pointer"><Trash size={16} /></button></div></div>))}<div className="flex gap-3 mt-4"><button onClick={() => handleSaveCms('services')} className="bg-gold text-white px-5 py-2 rounded font-semibold uppercase tracking-widest text-xs sm:text-sm hover:bg-navy cursor-pointer">{t('admin.save_settings')}</button><button onClick={() => handleResetCms('services')} className="bg-transparent border border-red-300 text-red-600 px-3 py-2 rounded font-semibold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-red-50 cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button></div></div>)}
              {cmsSubTab === 'careers' && (<div className="bg-light-gray/20 p-4 sm:p-6 rounded-lg border border-light-gray"><h3 className="font-serif text-lg font-bold text-navy mb-4">{t('admin.cms_sub_careers')}</h3><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_careers_title')}</label><input type="text" value={cmsCareers.title} onChange={e => setCmsCareers({...cmsCareers, title: e.target.value})} className={inputClass} /><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_careers_novac_title')}</label><input type="text" value={cmsCareers.noVacanciesTitle} onChange={e => setCmsCareers({...cmsCareers, noVacanciesTitle: e.target.value})} className={inputClass} /><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_careers_novac_text')}</label><textarea rows={2} value={cmsCareers.noVacanciesText} onChange={e => setCmsCareers({...cmsCareers, noVacanciesText: e.target.value})} className={inputClass}></textarea><label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.cms_careers_cv_text')}</label><textarea rows={2} value={cmsCareers.cvEmailText} onChange={e => setCmsCareers({...cmsCareers, cvEmailText: e.target.value})} className={inputClass}></textarea><div className="flex justify-between items-center mt-4 mb-3"><h4 className="font-semibold text-navy uppercase tracking-widest text-xs">{t('admin.cms_careers_vacancies')}</h4><button onClick={() => { const v = [...cmsCareers.vacancies, { id: Date.now().toString(), title: '', description: '', isOpen: true }]; setCmsCareers({...cmsCareers, vacancies: v}); }} className="bg-navy text-white text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded uppercase tracking-widest hover:bg-gold transition-colors flex items-center gap-1 cursor-pointer"><Plus size={14} /> {t('admin.cms_vacancy_add')}</button></div>{cmsCareers.vacancies.map((vac, idx) => (<div key={vac.id} className="border border-light-gray rounded p-3 mb-3 bg-white"><div className="flex gap-2 items-start"><div className="flex-1 space-y-2"><input type="text" placeholder={t('admin.cms_vacancy_title')} value={vac.title} onChange={e => { const v = [...cmsCareers.vacancies]; v[idx] = {...v[idx], title: e.target.value}; setCmsCareers({...cmsCareers, vacancies: v}); }} className="w-full p-2 border border-light-gray rounded text-xs sm:text-sm" /><textarea rows={2} placeholder={t('admin.cms_vacancy_desc')} value={vac.description} onChange={e => { const v = [...cmsCareers.vacancies]; v[idx] = {...v[idx], description: e.target.value}; setCmsCareers({...cmsCareers, vacancies: v}); }} className="w-full p-2 border border-light-gray rounded text-xs sm:text-sm"></textarea><label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={vac.isOpen} onChange={e => { const v = [...cmsCareers.vacancies]; v[idx] = {...v[idx], isOpen: e.target.checked}; setCmsCareers({...cmsCareers, vacancies: v}); }} className="accent-gold" />{t('admin.cms_vacancy_open')}</label></div><button onClick={() => { const v = cmsCareers.vacancies.filter((_, i) => i !== idx); setCmsCareers({...cmsCareers, vacancies: v}); }} className="text-red-500 hover:text-red-700 shrink-0 cursor-pointer"><Trash size={16} /></button></div></div>))}<div className="flex gap-3 mt-4"><button onClick={() => handleSaveCms('careers')} className="bg-gold text-white px-5 py-2 rounded font-semibold uppercase tracking-widest text-xs sm:text-sm hover:bg-navy cursor-pointer">{t('admin.save_settings')}</button><button onClick={() => handleResetCms('careers')} className="bg-transparent border border-red-300 text-red-600 px-3 py-2 rounded font-semibold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-red-50 cursor-pointer flex items-center gap-1"><RefreshCw size={14} /> {t('admin.cms_reset')}</button></div></div>)}

              {/* Export/Import */}
              <div className="mt-6 p-4 sm:p-6 bg-navy/5 rounded-lg border border-navy/10">
                <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2"><DownloadIcon size={16} className="text-gold" /> {t('admin.cms_export')} / {t('admin.cms_import')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div><button onClick={() => { const data = CMS.exportAllCMSData(); setCmsExportData(JSON.stringify(data, null, 2)); addToast('success', t('admin.cms_export_success'), 3000); }} className="bg-navy text-white px-4 py-2 rounded font-semibold uppercase tracking-widest text-xs hover:bg-gold transition-colors cursor-pointer flex items-center gap-2"><Upload size={14} /> {t('admin.cms_export')}</button>{cmsExportData && <textarea readOnly rows={8} value={cmsExportData} className="w-full mt-3 p-3 border border-light-gray rounded text-xs font-mono bg-white"></textarea>}</div>
                  <div><textarea rows={8} placeholder={t('admin.cms_import_placeholder')} value={cmsImportData} onChange={e => setCmsImportData(e.target.value)} className="w-full p-3 border border-light-gray rounded text-xs font-mono bg-white mb-3"></textarea><button onClick={() => { try { CMS.importAllCMSData(JSON.parse(cmsImportData)); addToast('success', t('admin.cms_import_success'), 4000); } catch { addToast('error', 'Invalid JSON data', 4000); } }} className="bg-gold text-white px-4 py-2 rounded font-semibold uppercase tracking-widest text-xs hover:bg-navy transition-colors cursor-pointer flex items-center gap-2"><DownloadIcon size={14} /> {t('admin.cms_import_btn')}</button></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (<div><h2 className="font-serif text-xl sm:text-2xl font-bold text-navy mb-6">{t('admin.reviews_count')} ({reviews.length})</h2>{reviews.length === 0 ? <p className="text-text-secondary">{t('admin.no_reviews')}</p> : (<div className="grid gap-4 sm:gap-6">{reviews.map((r, i) => (<div key={i} className="border border-light-gray p-4 sm:p-6 rounded-lg flex flex-col md:flex-row justify-between gap-4"><div><div className="flex items-center gap-2 mb-2"><span className="font-bold text-navy">{r.name}</span><span className="text-sm text-text-secondary">{typeof r.date === 'number' ? new Date(r.date).toLocaleDateString() : r.date}</span></div><div className="flex text-gold mb-3">{Array.from({length: 5}).map((_, idx) => (<Star key={idx} size={14} fill={idx < r.rating ? "currentColor" : "none"} />))}</div><p className="text-text-secondary text-sm">"{r.text}"</p></div><div className="flex items-start"><button onClick={() => deleteReview(i)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded transition-colors flex items-center gap-2 cursor-pointer"><Trash2 size={16} /> <span className="text-xs sm:text-sm font-semibold">{t('admin.delete')}</span></button></div></div>))}</div>)}</div>)}
          {activeTab === 'projects' && (<div><h2 className="font-serif text-xl sm:text-2xl font-bold text-navy mb-6">{t('admin.projects_count')} ({projects.length})</h2><p className="text-text-secondary text-sm">Manage projects via the Projects CMS section.</p></div>)}
          {activeTab === 'insights' && (<div><h2 className="font-serif text-xl sm:text-2xl font-bold text-navy mb-6">{t('admin.insights_count')} ({posts.length})</h2><p className="text-text-secondary text-sm">Manage insights via the Insights CMS section.</p></div>)}

          {activeTab === 'settings' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2"><h2 className="font-serif text-xl sm:text-2xl font-bold text-navy">{t('admin.settings_title')}</h2><span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded">{t('admin.settings_badge')}</span></div>
              {settingsSavedMsg && <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2"><CheckCircle2 size={18} className="shrink-0 text-green-600" /><span className="font-medium text-sm">{t('admin.settings_saved')}</span></div>}
              <form onSubmit={handleSaveSettings}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="bg-light-gray/40 p-4 sm:p-6 rounded-lg border border-light-gray"><h3 className="font-serif text-base sm:text-lg font-bold text-navy mb-4 border-b border-light-gray pb-2"><Globe size={16} className="text-gold inline mr-1" />{t('admin.core_visual')}</h3><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.logo_url')}</label><input type="text" required value={localSettings.logoUrl} onChange={e => setLocalSettings({...localSettings, logoUrl: e.target.value})} className={inputClass} /><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.contact_image_url')}</label><input type="text" required value={localSettings.contactImageUrl} onChange={e => setLocalSettings({...localSettings, contactImageUrl: e.target.value})} className={inputClass} /><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest mt-2">{t('admin.site_url_label')}</label><input type="text" required value={localSettings.siteUrl || ''} onChange={e => setLocalSettings({...localSettings, siteUrl: e.target.value})} className={inputClass} /></div>
                  <div className="bg-light-gray/40 p-4 sm:p-6 rounded-lg border border-light-gray"><h3 className="font-serif text-base sm:text-lg font-bold text-navy mb-4 border-b border-light-gray pb-2"><FileText size={16} className="text-gold inline mr-1" />{t('admin.contact_info')}</h3><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.phone')}</label><input type="text" required value={localSettings.phone} onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} className={inputClass} /><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.whatsapp')}</label><input type="text" required value={localSettings.whatsapp} onChange={e => setLocalSettings({...localSettings, whatsapp: e.target.value})} className={inputClass} /><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.email')}</label><input type="email" required value={localSettings.email} onChange={e => setLocalSettings({...localSettings, email: e.target.value})} className={inputClass} /><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.address')}</label><textarea required rows={2} value={localSettings.address} onChange={e => setLocalSettings({...localSettings, address: e.target.value})} className={`${inputClass} resize-y`}></textarea></div>
                </div>
                <div className="bg-light-gray/40 p-4 sm:p-6 rounded-lg border border-light-gray mb-6"><h3 className="font-serif text-base sm:text-lg font-bold text-navy mb-4 border-b border-light-gray pb-2"><FileText size={16} className="text-gold inline mr-1" />{t('admin.admin_legal')}</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"><div><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.terms')}</label><textarea rows={4} value={localSettings.termsAndConditions || ''} onChange={e => setLocalSettings({...localSettings, termsAndConditions: e.target.value})} className={`${inputClass} resize-y`}></textarea></div><div><label className="block text-[10px] sm:text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{t('admin.admin_password')}</label><div className="relative"><input type={showSettingsPassword ? "text" : "password"} value={localSettings.adminPassword || ''} onChange={e => setLocalSettings({...localSettings, adminPassword: e.target.value})} className={`${inputClass} pr-12`} /><button type="button" onClick={() => setShowSettingsPassword(!showSettingsPassword)} className="absolute right-3 top-[14px] text-concrete-gray hover:text-navy transition-colors cursor-pointer" tabIndex={-1}>{showSettingsPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div></div></div>
                <div className="flex justify-end"><button type="submit" disabled={isSavingSettings} className="bg-gold text-white px-8 py-3 sm:px-10 sm:py-4 rounded font-semibold uppercase tracking-widest text-xs sm:text-sm hover:bg-navy transition-colors shadow-custom cursor-pointer disabled:opacity-50">{isSavingSettings ? <Loader size={14} className="animate-spin inline mr-2" /> : null}{isSavingSettings ? t('loading.saving') : t('admin.save_settings')}</button></div>
              </form>
            </div>
          )}

          {activeTab === 'enquiries' && (<div><h2 className="font-serif text-xl sm:text-2xl font-bold text-navy mb-6 flex items-center gap-2"><Mail size={20} className="text-gold" /> Contact Enquiries ({enquiries.length})</h2>{enquiries.length === 0 ? <div className="text-center py-12 text-text-secondary"><p className="text-base sm:text-lg">No enquiries received yet.</p></div> : (<div className="grid gap-3 sm:gap-4">{enquiries.map((enq, i) => (<div key={i} className="border border-light-gray p-4 sm:p-5 rounded-lg"><div className="flex flex-col sm:flex-row justify-between gap-3 mb-3"><div><h3 className="font-bold text-navy text-base sm:text-lg">{enq.name || 'Anonymous'}</h3><div className="flex flex-wrap gap-3 mt-1 text-sm text-text-secondary">{enq.email && <span className="flex items-center gap-1"><Mail size={14} className="text-gold shrink-0" /> {enq.email}</span>}{enq.phone && <span className="flex items-center gap-1"><Phone size={14} className="text-gold shrink-0" /> {enq.phone}</span>}</div></div><div className="flex items-start gap-2 shrink-0"><span className="text-xs text-concrete-gray whitespace-nowrap">{enq.timestamp ? new Date(enq.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</span><button onClick={() => deleteEnquiry(i)} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"><Trash2 size={16} /></button></div></div>{enq.message && <div className="bg-light-gray/30 p-3 sm:p-4 rounded text-sm text-text-secondary leading-relaxed whitespace-pre-line">{enq.message}</div>}</div>))}</div>)}</div>)}
        </div>
      </div>
    </div>
  );
}