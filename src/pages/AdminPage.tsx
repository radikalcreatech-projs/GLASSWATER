import React from "react";
import { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Settings, LogOut, CheckCircle2, XCircle, Trash2, Edit, Star, Plus } from 'lucide-react';
import { projects as defaultProjects, posts as defaultPosts } from '../data';

export function AdminPage() {
  const { navigate } = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState<'reviews' | 'projects' | 'insights'>('reviews');
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

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

        </div>
      </div>
    </div>
  );
}
