import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [mySessions, setMySessions] = useState([]);
  const [publicSessions, setPublicSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('published'); // 'published' or 'my-sessions'
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch public wellness sessions (as per assignment: GET /sessions)
      const publicRes = await API.get('/sessions/published/all');
      setPublicSessions(publicRes.data || []);

      // Fetch user's own sessions (as per assignment: GET /my-sessions)
      const myRes = await API.get('/sessions');
      setMySessions(myRes.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishSession = async (sessionId) => {
    try {
      await API.put(`/sessions/${sessionId}`, { status: 'published' });

      // Update local state
      setMySessions(mySessions.map(s =>
        s._id === sessionId ? { ...s, status: 'published' } : s
      ));

      // Refresh public sessions to include newly published session
      const publicRes = await API.get('/sessions/published/all');
      setPublicSessions(publicRes.data || []);

      toast.success('Session published successfully!');
    } catch (error) {
      console.error('Error publishing session:', error);
      toast.error('Failed to publish session');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await API.delete(`/sessions/${sessionId}`);
        setMySessions(mySessions.filter(s => s._id !== sessionId));
        toast.success('Session deleted successfully');
      } catch (error) {
        console.error('Error deleting session:', error);
        toast.error('Failed to delete session');
      }
    }
  };

  const filteredSessions = (activeTab === 'published' ? publicSessions : mySessions)
    .filter(session => {
      const title = session.title || '';
      const tags = session.tags || [];
      return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    });

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading wellness sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Welcome, {userInfo.username}</h1>
            <p>Manage your wellness sessions and explore community content</p>
          </div>
          <Link to="/editor/new" className="create-session-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Session
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-section-dash">
        <div className="stat-card">
          <div className="stat-icon published">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{publicSessions.length}</div>
            <div className="stat-label">Public Sessions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon my-sessions">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{mySessions.length}</div>
            <div className="stat-label">My Sessions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon drafts">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{mySessions.filter(s => s.status === 'draft').length}</div>
            <div className="stat-label">Drafts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon published-mine">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{mySessions.filter(s => s.status === 'published').length}</div>
            <div className="stat-label">Published</div>
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="dashboard-controls">
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10,8 16,12 10,16 10,8" />
            </svg>
            Public Sessions
          </button>
          <button
            className={`tab-btn ${activeTab === 'my-sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-sessions')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            My Sessions
          </button>
        </div>

        <div className="search-section">
          <div className="search-box">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={`Search ${activeTab === 'published' ? 'public' : 'my'} sessions...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="sessions-section">
        {filteredSessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">
                {activeTab === 'published' ? (
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10,8 16,12 10,16 10,8" />
                  </svg>
                ) : (
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                )}
              </div>
              <h3>
                {activeTab === 'published'
                  ? 'No public sessions available'
                  : mySessions.length === 0
                    ? 'Create your first session'
                    : 'No sessions match your search'
                }
              </h3>
              <p>
                {activeTab === 'published'
                  ? 'Check back later for community wellness sessions'
                  : mySessions.length === 0
                    ? 'Start building your wellness library'
                    : 'Try different search terms'
                }
              </p>
              {activeTab === 'my-sessions' && mySessions.length === 0 && (
                <Link to="/editor/new" className="cta-button">
                  Create Your First Session
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="sessions-grid">
            {filteredSessions.map(session => (
              <div key={session._id} className="session-card">
                <div className="session-header">
                  <div className={`status-badge ${session.status || 'published'}`}>
                    <span className="status-dot"></span>
                    {session.status === 'draft' ? 'Draft' : 'Published'}
                  </div>
                  {activeTab === 'my-sessions' && (
                    <div className="session-actions">
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteSession(session._id)}
                        title="Delete session"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6" />
                          <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="session-content">
                  <h3 className="session-title">
                    {activeTab === 'my-sessions' ? (
                      <Link to={`/editor/${session._id}`}>
                        {session.title || 'Untitled Session'}
                      </Link>
                    ) : (
                      <span>{session.title || 'Untitled Session'}</span>
                    )}
                  </h3>

                  {session.tags && session.tags.length > 0 && (
                    <div className="session-tags">
                      {session.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                      {session.tags.length > 3 && (
                        <span className="tag-more">+{session.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  {session.jsonUrl && (
                    <div className="session-link">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <a href={session.jsonUrl} target="_blank" rel="noopener noreferrer">
                        View JSON
                      </a>
                    </div>
                  )}

                  {activeTab === 'published' && (
                    <div className="session-meta-enhanced">
                      <span className="meta-date">
                        Updated {formatDate(session.updatedAt)}
                      </span>
                      <span className="separator">•</span>
                      <span className="meta-creator">
                        by {session.user?.username || 'Unknown'}
                      </span>
                    </div>
                  )}

                </div>

                {activeTab === 'my-sessions' && (
                  <div className="session-footer">
                    <Link to={`/editor/${session._id}`} className="action-btn edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </Link>

                    {session.status === 'draft' && (
                      <button
                        className="action-btn publish"
                        onClick={() => handlePublishSession(session._id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22,4 12,14.01 9,11.01" />
                        </svg>
                        Publish
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
