import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { useAutosave } from '../hooks/useAutoSave';

export default function SessionEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lastSavedFormRef = useRef('');
  
  const [form, setForm] = useState({
    title: '',
    tags: '',
    jsonUrl: '',
    status: 'draft',
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [tagSuggestions] = useState([
    'meditation', 'mindfulness', 'relaxation', 'breathing', 'stress-relief',
    'focus', 'sleep', 'anxiety', 'healing', 'wellness', 'self-care', 'peace'
  ]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Fetch existing session if editing
  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true);
      API.get(`/sessions/${id}`)
        .then(res => {
          const formData = {
            title: res.data.title || '',
            tags: res.data.tags ? res.data.tags.join(', ') : '',
            jsonUrl: res.data.jsonUrl || '',
            status: res.data.status || 'draft',
          };
          setForm(formData);
          lastSavedFormRef.current = JSON.stringify(formData);
          setHasUnsavedChanges(false);
        })
        .catch(() => toast.error('Failed to load session'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Check if form has actually changed
  const hasFormChanged = useCallback(() => {
    const currentForm = JSON.stringify(form);
    return currentForm !== lastSavedFormRef.current;
  }, [form]);

  // Autosave function
  const performAutosave = useCallback(async () => {
    if (!form.title.trim() || !hasFormChanged() || id === 'new') {
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        jsonUrl: form.jsonUrl,
        status: form.status,
      };

      await API.put(`/sessions/${id}`, payload);
      lastSavedFormRef.current = JSON.stringify(form);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      console.log('Autosaved successfully');
    } catch (error) {
      console.error('Autosave failed:', error);
      // Don't show error toast for autosave failures to avoid annoying users
    } finally {
      setSaving(false);
    }
  }, [form, id, hasFormChanged]);

  // Initialize autosave with 5-second delay
  const autosave = useAutosave(performAutosave, 5000);

  // Manual save function
  const saveSession = useCallback(async (showToast = true) => {
    if (!form.title.trim()) {
      toast.error('Please add a title before saving');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        jsonUrl: form.jsonUrl,
        status: form.status,
      };

      if (id === 'new') {
        const res = await API.post('/sessions', payload);
        if (showToast) toast.success('✨ Session created!');
        navigate(`/editor/${res.data._id}`, { replace: true });
      } else {
        await API.put(`/sessions/${id}`, payload);
        lastSavedFormRef.current = JSON.stringify(form);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        if (showToast) toast.success('💾 Session saved');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('❌ Save failed - please try again');
    } finally {
      setSaving(false);
    }
  }, [form, id, navigate]);

  // Handle form input changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setHasUnsavedChanges(true);
    
    // Trigger autosave only for existing sessions
    if (id !== 'new') {
      autosave.trigger();
    }
  };

  // Manual save
  const handleManualSave = () => {
    autosave.cancel(); // Cancel pending autosave
    saveSession(true);
  };

  const handlePublish = async () => {
    if (!form.title.trim()) {
      toast.error('Please add a title before publishing');
      return;
    }
    
    try {
      setSaving(true);
      autosave.cancel(); // Cancel any pending autosave
      
      const updatedForm = { ...form, status: 'published' };
      const payload = {
        title: updatedForm.title,
        tags: updatedForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        jsonUrl: updatedForm.jsonUrl,
        status: 'published',
      };
      
      await API.put(`/sessions/${id}`, payload);
      setForm(updatedForm);
      lastSavedFormRef.current = JSON.stringify(updatedForm);
      setHasUnsavedChanges(false);
      toast.success('🎉 Session published successfully!');
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('❌ Failed to publish session');
    } finally {
      setSaving(false);
    }
  };

  const handleTagClick = (tag) => {
    const currentTags = form.tags ? form.tags.split(',').map(t => t.trim()) : [];
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(', ');
      setForm({ ...form, tags: newTags });
      setHasUnsavedChanges(true);
      
      if (id !== 'new') {
        autosave.trigger();
      }
    }
    setShowTagSuggestions(false);
  };

  const handleBack = () => {
    autosave.cancel(); // Cancel any pending autosave
    
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const getFormattedLastSaved = () => {
    if (!lastSaved) return '';
    return `Last saved at ${lastSaved.toLocaleTimeString()}`;
  };

  const getUserInfo = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { username: payload.username || 'User' };
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
    return { username: 'User' };
  };

  const userInfo = getUserInfo();

  // Cleanup autosave on unmount
  useEffect(() => {
    return () => {
      autosave.cancel();
    };
  }, [autosave]);

  if (loading) {
    return (
      <div className="editor-loading">
        <div className="loading-content">
          <div className="loading-spinner-large"></div>
          <h3>Loading session editor...</h3>
          <p>Preparing your wellness workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="session-editor">
      {/* Header */}
      <div className="editor-header">
        <div className="header-left">
          <button onClick={handleBack} className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
            <span>{id === 'new' ? 'Create Session' : 'Edit Session'}</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="save-status">
            {saving && (
              <div className="saving-indicator">
                <div className="save-spinner"></div>
                <span>Saving...</span>
              </div>
            )}
            {lastSaved && !saving && !hasUnsavedChanges && (
              <div className="saved-indicator">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>{getFormattedLastSaved()}</span>
              </div>
            )}
            {hasUnsavedChanges && !saving && id !== 'new' && (
              <div className="unsaved-indicator">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>Will autosave in 5 seconds...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="editor-container">
        <div className="editor-sidebar">
          <div className="sidebar-section">
            <h3>Session Settings</h3>
            <div className="setting-item">
              <div className={`status-indicator ${form.status}`}>
                <span className="status-dot"></span>
                <span className="status-text">
                  {form.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            
            <div className="setting-item">
              <label>Session Type</label>
              <div className="session-type-badges">
                <span className="type-badge meditation">🧘‍♀️ Meditation</span>
                <span className="type-badge wellness">🌱 Wellness</span>
              </div>
            </div>

            <div className="setting-item">
              <label>Creator</label>
              <div className="creator-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{userInfo.username}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            <button 
              onClick={handleManualSave} 
              className="sidebar-btn save-btn"
              disabled={saving || !form.title.trim() || !hasUnsavedChanges}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17,21 17,13 7,13 7,21"/>
                <polyline points="7,3 7,8 15,8"/>
              </svg>
              {saving ? 'Saving...' : 'Save Now'}
            </button>
            
            <button 
              onClick={handlePublish} 
              className="sidebar-btn publish-btn"
              disabled={form.status === 'published' || saving || !form.title.trim() || id === 'new'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
              {form.status === 'published' ? 'Published' : 'Publish Session'}
            </button>
          </div>
        </div>

        <div className="editor-main">
          <div className="editor-form">
            <div className="form-section">
              <h2 className="section-title">
                {id === 'new' ? 'Create New Wellness Session' : 'Edit Wellness Session'}
              </h2>
              <p className="section-description">
                Design a meaningful wellness experience that will inspire and guide others on their journey.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Session Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter a meaningful title for your wellness session..."
                value={form.title}
                onChange={handleChange}
                className="form-input title-input"
                maxLength={100}
              />
              <div className="input-helper">
                <span className="char-count">{form.title.length}/100</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tags">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                Tags
              </label>
              <div className="tags-input-container">
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="meditation, mindfulness, relaxation..."
                  value={form.tags}
                  onChange={handleChange}
                  onFocus={() => setShowTagSuggestions(true)}
                  className="form-input"
                />
                <button 
                  type="button" 
                  className="tags-help-btn"
                  onClick={() => setShowTagSuggestions(!showTagSuggestions)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </button>
              </div>
              
              {showTagSuggestions && (
                <div className="tag-suggestions">
                  <div className="suggestions-header">
                    <span>Suggested tags:</span>
                  </div>
                  <div className="suggestions-grid">
                    {tagSuggestions.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className="suggestion-tag"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="jsonUrl">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                Resource Link (JSON URL)
              </label>
              <input
                id="jsonUrl"
                name="jsonUrl"
                type="url"
                placeholder="https://example.com/session-data.json"
                value={form.jsonUrl}
                onChange={handleChange}
                className="form-input"
              />
              <div className="input-helper">
                <span>Optional: Link to external session data or resources</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
