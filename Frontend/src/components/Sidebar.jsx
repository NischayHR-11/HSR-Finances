import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = ({ currentPath, onLogout, userLevel }) => {
  const [menuExpanded, setMenuExpanded] = useState(null);
  const [activeEffects, setActiveEffects] = useState({});
  
  // Animated menu items with gamified effects
  const menuItems = [
    {
      path: '/dashboard',
      icon: '📊',
      label: 'Dashboard',
      isActive: currentPath === '/dashboard',
      color: 'var(--accent-primary)'
    },
    {
      path: '/borrowers',
      icon: '👥',
      label: 'Borrowers',
      isActive: currentPath === '/borrowers',
      color: 'var(--accent-secondary)'
    },
    {
      path: '/notifications',
      icon: '🔔',
      label: 'Notifications',
      badge: 3,
      isActive: currentPath === '/notifications',
      color: 'var(--accent-warning)'
    },
    {
      path: '/settings',
      icon: '⚙️',
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
          <span className="logo-text">LendTracker</span>
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
      
      <div className="sidebar-footer">
        <div className="level-indicator">
          <div className="level-badge">{userLevel}</div>
          <span className="level-text">Level {userLevel}</span>
        </div>
        <div className="user-profile">
          <div className="user-avatar">JD</div>
          <div className="notification-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
