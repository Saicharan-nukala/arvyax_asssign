import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-text">Arvyax</span>
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          
          {!token ? (
            <>
              <Link to="/login" className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
                Login
              </Link>
              <Link to="/register" className="nav-btn">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-btn logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
