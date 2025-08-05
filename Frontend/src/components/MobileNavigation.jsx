import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiService from '../services/apiService';
import './MobileNavigation.css';

const MobileNavigation = ({ userLevel = 1, lenderData, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch notification count
  const fetchNotificationCount = async () => {
    try {
      const response = await apiService.getDueNotifications();
      if (response.success) {
        const urgentCount = response.data.notifications.filter(
          n => ['overdue', 'due', 'due_soon'].includes(n.status)
        ).length;
        setNotificationCount(urgentCount);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  // Load notification count on component mount
  useEffect(() => {
    fetchNotificationCount();
    
    // Refresh notification count every 5 minutes
    const interval = setInterval(fetchNotificationCount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate user initials from name
  const getUserInitials = (name) => {
    if (!name) return 'JD';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    // Close mobile menu first
    setIsMobileMenuOpen(false);
    
    // Use the parent's logout handler (same as desktop)
    onLogout();
    
    console.log('User logged out successfully');
  };

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    console.log('Notification clicked - redirecting to notifications');
    navigate('/notifications');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        <Link to="/dashboard" className="mobile-logo">
          <div className="logo-icon">$</div>
          <span>HSR-Finances</span>
        </Link>
        
        <div className="mobile-actions">
          <div className="notification-container">
            <button className="notification-btn" onClick={handleNotificationClick}>
              <span className="notification-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
                </svg>
              </span>
            </button>
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </div>
          <button 
            className="user-avatar mobile-avatar" 
            onClick={() => navigate('/settings')}
            title="Go to Settings"
          >
            {getUserInitials(lenderData?.name)}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <Link to="/dashboard" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="logo-icon">$</div>
                <span>HSR-Finances</span>
              </Link>
              <button 
                className="close-menu"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <nav className="mobile-nav">
              <Link 
                to="/dashboard" 
                className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`} 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </span>
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/borrowers" 
                className={`mobile-nav-item ${isActive('/borrowers') ? 'active' : ''}`} 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                <span>Borrowers</span>
              </Link>
              <Link 
                to="/notifications" 
                className={`mobile-nav-item ${isActive('/notifications') ? 'active' : ''}`} 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
                  </svg>
                </span>
                <span>Notifications</span>
                {notificationCount > 0 && (
                  <span className="nav-badge">{notificationCount}</span>
                )}
              </Link>
              <Link 
                to="/settings" 
                className={`mobile-nav-item ${isActive('/settings') ? 'active' : ''}`} 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m21-3a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 21a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                </span>
                <span>Settings</span>
              </Link>
              <div className="mobile-nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </span>
                <span>Logout</span>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;
