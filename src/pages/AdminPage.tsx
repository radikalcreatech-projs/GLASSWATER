import React from "react";
import { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Settings, LogOut, CheckCircle2, XCircle, Trash2, Edit, Star, Plus, FileText, Copy, Check, Info, Share2, Eye, PlusCircle, Trash, Globe } from 'lucide-react';
import { projects as defaultProjects, posts as defaultPosts } from '../data';
import { useSettings, WebsiteSettings, ClientDocument, DocumentItem } from '../context/SettingsContext';

export function AdminPage() {
  const { navigate } = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState<'reviews' | 'projects' | 'insights' | 'settings' | 'documents'>('reviews');
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  // Settings & Documents Integration
  const { settings, updateSettings, documents, addDocument, updateDocument, deleteDocument } = useSettings();
  
  const [localSettings, setLocalSettings] = useState<WebsiteSettings>({ ...settings });
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);
  
  // Client Documents States
  const [showDocForm, setShowDocForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ClientDocument | null>(null);
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [copyCodeSuccess, setCopyCodeSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLocalSettings({ ...settings });
  }, [settings]);

  const setFormSettingsVal = (key: keyof WebsiteSettings, val: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const calcDocTotal = (items: DocumentItem[]) => {
    return items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0)), 0);
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
      totalAmount: calcDocTotal(updatedItems)
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
    const code = 'GW-' + Math.floor(1000 + Math.random() * 9000);
    if (editingDoc) {
      setEditingDoc({
        ...editingDoc,
        code
      });
    }
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    if (!editingDoc.code.trim()) {
      alert('Please enter or generate a reference code.');
      return;
    }

    // If it's a new document, check if code already exists
    const isNew = !documents.some(d => d.code === editingDoc.code);
    
    // We are editing if we found the document in our original selection, but we must handle changing the code if we want
    // But for simplicity, if showDocForm is editing and isNew is true, it means it's a completely new created code.
    // If it is editing a code that existed, we update it.
    const isEditingOriginal = documents.some(d => d.code === editingDoc.code);

    if (isEditingOriginal) {
      updateDocument(editingDoc);
    } else {
      // Check if code already exists for another document to prevent duplicate keys
      const codeExists = documents.some(d => d.code === editingDoc.code);
      if (codeExists) {
        alert(`Document code ${editingDoc.code} already exists. Please choose a different code.`);
        return;
      }
      addDocument(editingDoc);
    }

    setShowDocForm(false);
    setEditingDoc(null);
  };

  useEffect(() => {
    // Load reviews
    const savedReviews = localStorage.getItem('glasswater_reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {}
    }
    
    // Load projects
    const savedProjects = localStorage.getItem('glasswater_projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {}
    } else {
      setProjects(defaultProjects);
    }
    
    // Load posts
    const savedPosts = localStorage.getItem('glasswater_posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {}
    } else {
      setPosts(defaultPosts);
    }
  }, []);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple mock auth
      setIsAuthenticated(true);
    } else {
      alert('Invalid password (hint: admin123)');
    }
  };

  const deleteReview = (index: number) => {
    if (!confirm('Are you sure?')) return;
    const newReviews = [...reviews];
    newReviews.splice(index, 1);
    setReviews(newReviews);
    localStorage.setItem('glasswater_reviews', JSON.stringify(newReviews));
  };

  const deleteProject = (id: number) => {
    if (!confirm('Are you sure?')) return;
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    localStorage.setItem('glasswater_projects', JSON.stringify(newProjects));
  };

  const deletePost = (slug: string) => {
    if (!confirm('Are you sure?')) return;
    const newPosts = posts.filter(p => p.slug !== slug);
    setPosts(newPosts);
    localStorage.setItem('glasswater_posts', JSON.stringify(newPosts));
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newProjects = [...projects];
    if (editingItem?.id) {
      const idx = newProjects.findIndex(p => p.id === editingItem.id);
      if (idx !== -1) newProjects[idx] = editingItem;
    } else {
      newProjects.unshift({
        ...editingItem,
        id: Date.now()
      });
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

  if (!isAuthenticated) {
    return (
      <div className="py-24 px-6 bg-light-gray min-h-[60vh] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-custom max-w-md w-full border border-gold/30">
          <div className="flex justify-center mb-6">
            <Settings className="text-gold w-12 h-12" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-navy text-center mb-6">Admin Login</h1>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-light-gray border border-transparent focus:border-gold px-4 py-3 rounded outline-none transition-colors"
              placeholder="Enter admin password (admin123)"
            />
          </div>
          <button type="submit" className="w-full bg-gold text-white font-semibold py-3 rounded uppercase tracking-widest hover:bg-navy transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  const inputClass = "w-full p-3 border border-light-gray rounded font-sans text-base mb-4 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-bg-body text-text-primary transition-all";

  return (
    <div className="py-12 px-6 bg-light-gray min-h-[80vh]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy flex items-center gap-3">
            <Settings className="text-gold" /> Admin Dashboard
          </h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-text-secondary hover:text-navy transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
        
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button 
            onClick={() => { setActiveTab('reviews'); setShowForm(false); }}
            className={`px-6 py-3 rounded font-semibold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-gold/10'}`}
          >
            Manage Reviews
          </button>
          <button 
            onClick={() => { setActiveTab('projects'); setShowForm(false); }}
            className={`px-6 py-3 rounded font-semibold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-gold/10'}`}
          >
            Manage Projects
          </button>
          <button 
            onClick={() => { setActiveTab('insights'); setShowForm(false); }}
            className={`px-6 py-3 rounded font-semibold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'insights' ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-gold/10'}`}
          >
            Manage Insights
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setShowForm(false); setShowDocForm(false); }}
            className={`px-6 py-3 rounded font-semibold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-gold/10'}`}
          >
            Website Settings
          </button>
          <button 
            onClick={() => { setActiveTab('documents'); setShowForm(false); setShowDocForm(false); }}
            className={`px-6 py-3 rounded font-semibold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'documents' ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-gold/10'}`}
          >
            Client Documents
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-custom p-6 md:p-8 border border-gold/20">
          
          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-6">User Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="text-text-secondary">No reviews found.</p>
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
                        <button onClick={() => deleteReview(i)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded transition-colors flex items-center gap-2">
                          <Trash2 size={18} /> <span className="text-sm font-semibold">Delete</span>
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
                <h2 className="font-serif text-2xl font-bold text-navy">Projects ({projects.length})</h2>
                <button 
                  onClick={() => {
                    setEditingItem({ title: '', category: '', desc: '', value: '', duration: '', image: 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ' });
                    setShowForm(true);
                  }}
                  className="bg-gold text-white px-4 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors flex items-center gap-2"
                >
                  <Plus size={16} /> Add New
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
                      <button 
                        onClick={() => { setEditingItem(p); setShowForm(true); }}
                        className="p-2 text-steel-blue hover:text-gold bg-light-gray rounded transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteProject(p.id)}
                        className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded transition-colors"
                      >
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
                <h2 className="font-serif text-2xl font-bold text-navy">{editingItem?.id ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-navy font-semibold uppercase tracking-widest text-sm transition-colors">
                  Cancel
                </button>
              </div>
              <form onSubmit={handleProjectSubmit}>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Title</label>
                <input type="text" required value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className={inputClass} />
                
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Category</label>
                <input type="text" required value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className={inputClass} />
                
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Description</label>
                <textarea required rows={4} value={editingItem.desc} onChange={e => setEditingItem({...editingItem, desc: e.target.value})} className={inputClass}></textarea>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Value</label>
                    <input type="text" value={editingItem.value} onChange={e => setEditingItem({...editingItem, value: e.target.value})} className={inputClass} placeholder="e.g. £2.5M" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Duration</label>
                    <input type="text" value={editingItem.duration} onChange={e => setEditingItem({...editingItem, duration: e.target.value})} className={inputClass} placeholder="e.g. 14 Months" />
                  </div>
                </div>

                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Image URL</label>
                <input type="text" required value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className={inputClass} />
                {editingItem.image && (
                  <div className="mb-4 w-32 h-32 bg-cover bg-center rounded border border-light-gray" style={{backgroundImage: `url(${editingItem.image})`}} />
                )}

                <button type="submit" className="bg-navy text-white px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-gold transition-colors">
                  Save Project
                </button>
              </form>
            </div>
          )}

          {/* INSIGHTS TAB */}
          {activeTab === 'insights' && !showForm && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy">Insights ({posts.length})</h2>
                <button 
                  onClick={() => {
                    setEditingItem({ title: '', slug: '', category: '', excerpt: '', content: '', date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), coverImage: 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ' });
                    setShowForm(true);
                  }}
                  className="bg-gold text-white px-4 py-2 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors flex items-center gap-2"
                >
                  <Plus size={16} /> Add New
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
                      <button 
                        onClick={() => { setEditingItem({...p, originalSlug: p.slug}); setShowForm(true); }}
                        className="p-2 text-steel-blue hover:text-gold bg-light-gray rounded transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deletePost(p.slug)}
                        className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded transition-colors"
                      >
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
                <h2 className="font-serif text-2xl font-bold text-navy">{editingItem?.originalSlug ? 'Edit Insight' : 'New Insight'}</h2>
                <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-navy font-semibold uppercase tracking-widest text-sm transition-colors">
                  Cancel
                </button>
              </div>
              <form onSubmit={handlePostSubmit}>
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Title</label>
                <input type="text" required value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className={inputClass} />
                
                {editingItem.originalSlug && (
                  <>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">URL Slug</label>
                    <input type="text" required value={editingItem.slug} onChange={e => setEditingItem({...editingItem, slug: e.target.value})} className={inputClass} />
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Category</label>
                    <input type="text" required value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Date</label>
                    <input type="text" required value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} className={inputClass} />
                  </div>
                </div>
                
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Excerpt</label>
                <textarea required rows={2} value={editingItem.excerpt} onChange={e => setEditingItem({...editingItem, excerpt: e.target.value})} className={inputClass}></textarea>
                
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Content (Markdown supported via formatting)</label>
                <textarea required rows={8} value={editingItem.content} onChange={e => setEditingItem({...editingItem, content: e.target.value})} className={inputClass} placeholder="Use '### Header' for sections, empty lines between paragraphs"></textarea>
                
                <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-widest">Cover Image URL</label>
                <input type="text" required value={editingItem.coverImage} onChange={e => setEditingItem({...editingItem, coverImage: e.target.value})} className={inputClass} />
                {editingItem.coverImage && (
                  <div className="mb-4 w-32 h-32 bg-cover bg-center rounded border border-light-gray" style={{backgroundImage: `url(${editingItem.coverImage})`}} />
                )}

                <button type="submit" className="bg-navy text-white px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-gold transition-colors">
                  Save Insight
                </button>
              </form>
            </div>
          )}

          {/* WEBSITE SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy">Global Website Settings</h2>
                <span className="text-sm font-semibold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded">Live Site Config</span>
              </div>
              
              {settingsSavedMsg && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={20} className="shrink-0 text-green-600" />
                  <span className="font-medium">Website settings updated successfully! Your updates are active on the site now.</span>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); updateSettings(localSettings); setSettingsSavedMsg(true); setTimeout(() => setSettingsSavedMsg(false), 4000); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Branding & Media Section */}
                  <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray">
                    <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2">
                      <Globe size={18} className="text-gold" /> Core Visual Assets
                    </h3>
                    
                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Logo Image URL</label>
                    <input type="text" required value={localSettings.logoUrl} onChange={e => setFormSettingsVal('logoUrl', e.target.value)} className={inputClass} />
                    {localSettings.logoUrl && (
                      <div className="mb-4 p-3 bg-white border border-light-gray rounded flex items-center justify-center h-20">
                        <img src={localSettings.logoUrl} alt="Logo Preview" className="h-12 object-contain" />
                      </div>
                    )}

                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Contact Page Image URL</label>
                    <input type="text" required value={localSettings.contactImageUrl} onChange={e => setFormSettingsVal('contactImageUrl', e.target.value)} className={inputClass} />
                    {localSettings.contactImageUrl && (
                      <div className="mb-4 p-2 bg-white border border-light-gray rounded flex items-center justify-center h-28">
                        <img src={localSettings.contactImageUrl} alt="Contact Preview" className="h-24 object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Contact Channels Section */}
                  <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray">
                    <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-light-gray pb-2">
                      <FileText size={18} className="text-gold" /> Contact Information
                    </h3>

                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Office Phone Number</label>
                    <input type="text" required value={localSettings.phone} onChange={e => setFormSettingsVal('phone', e.target.value)} className={inputClass} />

                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">WhatsApp Direct Link</label>
                    <input type="text" required value={localSettings.whatsapp} onChange={e => setFormSettingsVal('whatsapp', e.target.value)} className={inputClass} />
                    <p className="text-[11px] text-steel-blue mt-[-10px] mb-4">Starts with <code>https://wa.me/</code> + digits (e.g., <code>https://wa.me/2330248284384</code>)</p>

                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Enquiry Email Address</label>
                    <input type="email" required value={localSettings.email} onChange={e => setFormSettingsVal('email', e.target.value)} className={inputClass} />

                    <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Physical Location Address</label>
                    <textarea required rows={2} value={localSettings.address} onChange={e => setFormSettingsVal('address', e.target.value)} className={`${inputClass} resize-y`}></textarea>
                  </div>
                </div>

                {/* Social Channels Section */}
                <div className="bg-light-gray/40 p-6 rounded-lg border border-light-gray mb-8">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4 border-b border-light-gray pb-2">Social Channels Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Facebook Profile URL</label>
                      <input type="text" required value={localSettings.facebook} onChange={e => setFormSettingsVal('facebook', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Instagram Profile URL</label>
                      <input type="text" required value={localSettings.instagram} onChange={e => setFormSettingsVal('instagram', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">LinkedIn Company URL</label>
                      <input type="text" required value={localSettings.linkedin} onChange={e => setFormSettingsVal('linkedin', e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="bg-gold text-white px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors shadow-custom cursor-pointer">
                    Save Website Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CLIENT DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <div>
              {/* DOCUMENT EDITOR FORM */}
              {showDocForm && editingDoc ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-2xl font-bold text-navy">
                      {documents.some(d => d.code === editingDoc.code) ? 'Edit Document Details' : 'Create New Client Document'}
                    </h2>
                    <button 
                      type="button"
                      onClick={() => { setShowDocForm(false); setEditingDoc(null); }} 
                      className="text-text-secondary hover:text-navy font-semibold uppercase tracking-widest text-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleDocSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Reference Code (Sharing Code)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            required 
                            disabled={documents.some(d => d.code === editingDoc.code)}
                            placeholder="e.g. GW-2024" 
                            value={editingDoc.code} 
                            onChange={e => setEditingDoc({ ...editingDoc, code: e.target.value.toUpperCase().replace(/\s+/g, '') })} 
                            className={`${inputClass} !mb-0 disabled:opacity-50 disabled:bg-gray-100`} 
                          />
                          {!documents.some(d => d.code === editingDoc.code) && (
                            <button 
                              type="button" 
                              onClick={generateDocCode} 
                              className="bg-gold/10 text-gold border border-gold px-3 rounded font-semibold text-xs uppercase tracking-wider hover:bg-gold hover:text-white transition-colors"
                            >
                              Generate
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-steel-blue mt-1">This is the code clients will input to access this document.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Document Type</label>
                        <select 
                          value={editingDoc.type} 
                          onChange={e => setEditingDoc({ ...editingDoc, type: e.target.value as any })} 
                          className={inputClass}
                        >
                          <option value="Estimate">Estimate</option>
                          <option value="Waybill">Waybill</option>
                          <option value="Invoice">Invoice</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Status</label>
                        <select 
                          value={editingDoc.status} 
                          onChange={e => setEditingDoc({ ...editingDoc, status: e.target.value as any })} 
                          className={inputClass}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Sent">Sent</option>
                          <option value="Approved">Approved</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Paid">Paid</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Client Full Name</label>
                        <input type="text" required value={editingDoc.clientName} onChange={e => setEditingDoc({ ...editingDoc, clientName: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Client Email (Optional)</label>
                        <input type="email" value={editingDoc.clientEmail || ''} onChange={e => setEditingDoc({ ...editingDoc, clientEmail: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Client Phone (Optional)</label>
                        <input type="text" value={editingDoc.clientPhone || ''} onChange={e => setEditingDoc({ ...editingDoc, clientPhone: e.target.value })} className={inputClass} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Project / Document Title</label>
                        <input type="text" required placeholder="e.g. Commercial Interior Finishing and Partitioning Works" value={editingDoc.title} onChange={e => setEditingDoc({ ...editingDoc, title: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Issue Date</label>
                        <input type="date" required value={editingDoc.date} onChange={e => setEditingDoc({ ...editingDoc, date: e.target.value })} className={inputClass} />
                      </div>
                    </div>

                    {/* ITEMS breakdown dynamic table */}
                    <div className="bg-light-gray/20 p-6 rounded-lg border border-light-gray">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                          <PlusCircle size={18} className="text-gold" /> Line Items Breakdown
                        </h3>
                        <button 
                          type="button" 
                          onClick={handleAddDocItem} 
                          className="bg-navy text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-widest hover:bg-gold transition-colors flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Line Item
                        </button>
                      </div>

                      {editingDoc.items.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded border border-dashed border-light-gray text-text-secondary text-sm">
                          No line items added yet. Click "Add Line Item" to start building your pricing details.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse bg-white rounded shadow-sm">
                            <thead>
                              <tr className="bg-navy text-white text-[11px] uppercase tracking-widest">
                                <th className="p-3">Description / Scope</th>
                                <th className="p-3 w-24 text-center">Qty</th>
                                <th className="p-3 w-36">Unit Price (GHS)</th>
                                <th className="p-3 w-36 text-right">Total (GHS)</th>
                                <th className="p-3 w-16 text-center"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-light-gray text-sm">
                              {editingDoc.items.map((item) => (
                                <tr key={item.id}>
                                  <td className="p-3">
                                    <input 
                                      type="text" 
                                      required 
                                      placeholder="e.g. Copper conduit wiring installations" 
                                      value={item.description} 
                                      onChange={e => handleDocItemChange(item.id, 'description', e.target.value)} 
                                      className="w-full bg-transparent border-b border-transparent focus:border-gold outline-none py-1"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <input 
                                      type="number" 
                                      min="1" 
                                      required 
                                      value={item.quantity} 
                                      onChange={e => handleDocItemChange(item.id, 'quantity', e.target.value)} 
                                      className="w-full text-center bg-transparent border-b border-transparent focus:border-gold outline-none py-1"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <input 
                                      type="number" 
                                      min="0" 
                                      step="0.01" 
                                      required 
                                      placeholder="0.00" 
                                      value={item.unitPrice || ''} 
                                      onChange={e => handleDocItemChange(item.id, 'unitPrice', e.target.value)} 
                                      className="w-full bg-transparent border-b border-transparent focus:border-gold outline-none py-1"
                                    />
                                  </td>
                                  <td className="p-3 text-right font-semibold text-navy">
                                    GHS {Number(item.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>
                                  <td className="p-3 text-center">
                                    <button 
                                      type="button" 
                                      onClick={() => handleRemoveDocItem(item.id)} 
                                      className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                      title="Remove item"
                                    >
                                      <Trash size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-light-gray/30 font-bold text-navy text-base">
                                <td colSpan={3} className="p-4 text-right">Estimated/Total Value:</td>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Notes / Payment Terms / Instructions</label>
                        <textarea rows={3} placeholder="Provide payment instructions or validity period for estimates." value={editingDoc.notes || ''} onChange={e => setEditingDoc({ ...editingDoc, notes: e.target.value })} className={`${inputClass} resize-y`}></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Attached File Link (Optional - e.g. Google Drive PDF)</label>
                        <input type="text" placeholder="https://drive.google.com/file/d/.../view" value={editingDoc.fileUrl || ''} onChange={e => setEditingDoc({ ...editingDoc, fileUrl: e.target.value })} className={inputClass} />
                        <div className="p-3 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs flex gap-2">
                          <Info size={16} className="shrink-0 mt-0.5" />
                          <span>Clients will be able to download their physical estimate/bill if you attach a link.</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 border-t border-light-gray pt-6">
                      <button 
                        type="button" 
                        onClick={() => { setShowDocForm(false); setEditingDoc(null); }} 
                        className="bg-transparent border border-light-gray text-text-secondary px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="bg-gold text-white px-10 py-3 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors shadow-custom cursor-pointer"
                      >
                        Save Client Document
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* DOCUMENTS LISTING VIEWS */
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h2 className="font-serif text-2xl font-bold text-navy flex items-center gap-2">
                      <FileText size={22} className="text-gold" /> Client Waybills &amp; Estimates ({documents.length})
                    </h2>
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingDoc({
                          code: '',
                          clientName: '',
                          clientEmail: '',
                          clientPhone: '',
                          title: '',
                          type: 'Estimate',
                          status: 'Draft',
                          date: new Date().toISOString().split('T')[0],
                          items: [],
                          notes: '',
                          totalAmount: 0
                        });
                        setShowDocForm(true);
                      }}
                      className="bg-gold text-white px-6 py-3 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                    >
                      <Plus size={18} /> New Document
                    </button>
                  </div>

                  {/* Search Bar filter */}
                  <div className="mb-6">
                    <input 
                      type="text" 
                      placeholder="Search documents by code, client name, or project title..." 
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
                    <div className="text-center py-12 text-text-secondary">
                      No matching estimates, waybills, or invoices found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-light-gray text-navy text-[11px] uppercase tracking-widest font-bold">
                            <th className="p-4">Reference Code</th>
                            <th className="p-4">Client Name</th>
                            <th className="p-4">Document Title</th>
                            <th className="p-4 text-center">Type</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Total Amount</th>
                            <th className="p-4 text-center">Actions</th>
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
                                <div className="text-xs text-text-secondary font-normal">{doc.clientPhone || doc.clientEmail || 'No contact details'}</div>
                              </td>
                              <td className="p-4 max-w-xs truncate" title={doc.title}>
                                {doc.title}
                                <div className="text-[11px] text-text-secondary font-normal mt-0.5">Issued: {doc.date}</div>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  doc.type === 'Estimate' ? 'bg-yellow-100 text-yellow-800' :
                                  doc.type === 'Waybill' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {doc.type}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  doc.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                  doc.status === 'Approved' ? 'bg-sky-100 text-sky-800' :
                                  doc.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                  doc.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {doc.status}
                                </span>
                              </td>
                              <td className="p-4 text-right font-bold text-navy">
                                GHS {doc.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center gap-3">
                                  {/* Copy Code Button with success visual */}
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(doc.code);
                                      setCopyCodeSuccess(doc.code);
                                      setTimeout(() => setCopyCodeSuccess(null), 2000);
                                    }}
                                    className="p-1.5 hover:bg-gold/10 rounded text-gold transition-all relative flex items-center gap-1 cursor-pointer"
                                    title="Copy reference code for client"
                                  >
                                    {copyCodeSuccess === doc.code ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                    <span className="text-[10px] font-semibold uppercase tracking-wider hidden sm:inline">Code</span>
                                  </button>

                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setEditingDoc({ ...doc });
                                      setShowDocForm(true);
                                    }}
                                    className="p-1.5 hover:bg-navy/10 rounded text-navy transition-all cursor-pointer"
                                    title="Edit details"
                                  >
                                    <Edit size={16} />
                                  </button>

                                  <button 
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete client document ${doc.code}?`)) {
                                        deleteDocument(doc.code);
                                      }
                                    }}
                                    className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition-all cursor-pointer"
                                    title="Delete document"
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

        </div>
      </div>
    </div>
  );
}
