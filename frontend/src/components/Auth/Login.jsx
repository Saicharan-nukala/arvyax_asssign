import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await API.post('/auth/login', form);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        toast.success('🧘‍♀️ Welcome back to your wellness journey!');
        navigate('/dashboard');
        window.location.reload();
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wellness-auth-page">
      <div className="auth-split-container">
        {/* Left Side - Wellness Image & Content */}
        <div className="auth-image-side">
          <div className="wellness-overlay">
            <div className="wellness-content">
              <div className="wellness-quote">
                <h2>"Your wellness journey begins with a single breath"</h2>
                <p>Join thousands of users who have transformed their lives through mindful practice and personal growth.</p>
              </div>
              
              <div className="wellness-stats">
                <div className="stat-item">
                  <div className="stat-number">10,000+</div>
                  <div className="stat-label">Active Members</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50,000+</div>
                  <div className="stat-label">Sessions Completed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <div className="form-header">
              <img src="/arvyax-logo-short.png" alt="Arvyax Wellness" className="form-logo" />
              <h1>Welcome Back</h1>
              <p>Continue your path to wellness and mindfulness</p>
            </div>

            <form onSubmit={handleSubmit} className="professional-form">
              <div className="input-group">
                <label htmlFor="username" className="input-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="professional-input"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="professional-input"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-visibility-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>

              <button type="submit" className="professional-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12,5 19,12 12,19"/>
                    </svg>
                  </>
                )}
              </button>

              <div className="form-divider">
                <span>New to Arvyax Wellness?</span>
              </div>

              <Link to="/register" className="secondary-btn">
                Create Your Account
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
