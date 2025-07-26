import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ currentPath, onLogout }) => {
  const menuItems = [
    {
      path: '/dashboard',
      icon: '📊',
      label: 'Dashboard',
      isActive: currentPath === '/dashboard'
    },
    {
      path: '/borrowers',
      icon: '👥',
      label: 'Borrowers',
      isActive: currentPath === '/borrowers'
    },
    {
      path: '/notifications',
      icon: '🔔',
      label: 'Notifications',
      badge: 3,
      isActive: currentPath === '/notifications'
    },
    {
      path: '/settings',
      icon: '⚙️',
      label: 'Settings',
      isActive: currentPath === '/settings'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="logo">
          <div className="logo-icon">$</div>
          <span className="logo-text">LendTracker</span>
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${item.isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">JD</div>
          <div className="notification-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
