import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = ({ currentPath, onLogout, userLevel, notificationCount = 0 }) => {
  const [menuExpanded, setMenuExpanded] = useState(null);
  const [activeEffects, setActiveEffects] = useState({});
  const navigate = useNavigate();
  
  // Animated menu items with gamified effects
  const menuItems = [
    {
      path: '/dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z"/>
        </svg>
      ),
      label: 'Dashboard',
      isActive: currentPath === '/dashboard',
      color: 'var(--accent-primary)'
    },
    {
      path: '/borrowers',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M16 4C16.88 4 17.67 4.5 18 5.26L20 9H16V11H20.5L20 12H16V14H20L18 17.74C17.67 18.5 16.88 19 16 19H8C7.12 19 6.33 18.5 6 17.74L4 14H8V12H3.5L4 11H8V9H4L6 5.26C6.33 4.5 7.12 4 8 4H16ZM8 6.25C7.31 6.25 6.75 6.81 6.75 7.5S7.31 8.75 8 8.75 9.25 8.19 9.25 7.5 8.69 6.25 8 6.25ZM16 6.25C15.31 6.25 14.75 6.81 14.75 7.5S15.31 8.75 16 8.75 17.25 8.19 17.25 7.5 16.69 6.25 16 6.25Z"/>
        </svg>
      ),
      label: 'Borrowers',
      isActive: currentPath === '/borrowers',
      color: 'var(--accent-secondary)'
    },
    {
      path: '/notifications',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
        </svg>
      ),
      label: 'Notifications',
      badge: notificationCount > 0 ? notificationCount : null, // Only show badge if there are notifications
      isActive: currentPath === '/notifications',
      color: 'var(--accent-warning)'
    },
    {
      path: '/settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
        </svg>
      ),
      label: 'Settings',
      isActive: currentPath === '/settings',
      color: 'var(--accent-tertiary)'
    }
  ];
  
  // Trigger animation effect when menu item is hovered
  const handleMouseEnter = (path) => {
    setMenuExpanded(path);
  };
  
  const handleMouseLeave = () => {
    setMenuExpanded(null);
  };
  
  // Trigger effect when path changes
  useEffect(() => {
    setActiveEffects({ [currentPath]: true });
    
    const timer = setTimeout(() => {
      setActiveEffects({});
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentPath]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="logo">
          <div className="logo-icon">$</div>
          <span className="logo-text">HSR-Finances</span>
          <div className="logo-glow"></div>
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${item.isActive ? 'active' : ''} ${activeEffects[item.path] ? 'pulse-effect' : ''} ${menuExpanded === item.path ? 'expanded' : ''}`}
            onMouseEnter={() => handleMouseEnter(item.path)}
            onMouseLeave={handleMouseLeave}
            style={
              item.isActive 
                ? { borderColor: item.color, boxShadow: `0 0 10px ${item.color}` } 
                : {}
            }
          >
            <span 
              className="nav-icon" 
              style={item.isActive ? { backgroundColor: item.color } : {}}
            >
              {item.icon}
              {item.isActive && <div className="icon-glow" style={{ backgroundColor: item.color }}></div>}
            </span>
            <span className="nav-label">{item.label}</span>
            {item.badge && (
              <span className="nav-badge" style={{ backgroundColor: item.color }}>
                {item.badge}
              </span>
            )}
            <div className="hover-indicator" style={{ backgroundColor: item.color }}></div>
          </Link>
        ))}
      </nav>
      
      {/* Logout Button */}
      <button
        className="logout-btn"
        onClick={onLogout}
        title="Logout"
      >
        <span className="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </span>
        <span className="nav-label">Logout</span>
        <div className="hover-indicator"></div>
      </button>
      
      <div className="sidebar-footer">
        <div className="level-indicator">
          <div className="level-badge">{userLevel}</div>
          <span className="level-text">Level {userLevel}</span>
        </div>
        <div className="user-profile">
          <button 
            className="user-avatar" 
            onClick={() => navigate('/settings')}
            title="Go to Settings"
          >
            JD
          </button>
          <div className="notification-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
