import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MobileNav.css';

const MobileNav = ({ onLogout, userLevel }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem('hasSeenWelcome');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('jwt');
    
    // Clear all authentication data from sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('jwt');
    
    // Close mobile menu
    setIsMobileMenuOpen(false);
    
    // Call parent logout function if provided
    if (onLogout) {
      onLogout();
    }
    
    console.log('User logged out successfully - All tokens cleared from web storage');
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z"/>
        </svg>
      ),
      label: 'Dashboard',
      isActive: location.pathname === '/dashboard'
    },
    {
      path: '/borrowers',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M16 4C16.88 4 17.67 4.5 18 5.26L20 9H16V11H20.5L20 12H16V14H20L18 17.74C17.67 18.5 16.88 19 16 19H8C7.12 19 6.33 18.5 6 17.74L4 14H8V12H3.5L4 11H8V9H4L6 5.26C6.33 4.5 7.12 4 8 4H16Z"/>
        </svg>
      ),
      label: 'Borrowers',
      isActive: location.pathname === '/borrowers'
    },
    {
      path: '/notifications',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
        </svg>
      ),
      label: 'Notifications',
      badge: 3,
      isActive: location.pathname === '/notifications'
    },
    {
      path: '/settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
        </svg>
      ),
      label: 'Settings',
      isActive: location.pathname === '/settings'
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-logo">
          <div className="mobile-logo-icon">$</div>
          <span className="mobile-logo-text">HSR-Finances</span>
        </div>
        
        <div className="mobile-header-right">
          <div className="mobile-level-badge">L{userLevel}</div>
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">JD</div>
                <div className="mobile-user-details">
                  <div className="mobile-user-name">John Doe</div>
                  <div className="mobile-user-level">Level {userLevel}</div>
                </div>
              </div>
            </div>

            <nav className="mobile-nav-menu">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-item ${item.isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">
                    {item.icon}
                  </span>
                  <span className="mobile-nav-label">{item.label}</span>
                  {item.badge && (
                    <span className="mobile-nav-badge">{item.badge}</span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="mobile-menu-footer">
              <div 
                className="mobile-nav-item mobile-logout-item"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
                <span className="mobile-nav-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
                  </svg>
                </span>
                <span className="mobile-nav-label">Logout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
