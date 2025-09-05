import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Borrowers from './Borrowers';
import Notifications from './Notifications';
import Settings from './Settings';
import apiService from '../services/apiService';
import './Layout.css';

const Layout = ({ onLogout, userLevel, xpPoints, lenderData }) => {
  const location = useLocation();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  
  // XP percentage calculation
  const maxXp = userLevel * 100;
  const xpPercentage = (xpPoints / maxXp) * 100;
  
  // Fetch notification count
  const fetchNotificationCount = async () => {
    try {
      const response = await apiService.getDueNotifications();
      if (response.success) {
        const totalCount = response.data.summary.dueToday + 
                          response.data.summary.due + 
                          response.data.summary.overdue;
        setNotificationCount(totalCount);
      }
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
      setNotificationCount(0);
    }
  };
  
  // Check for level up
  useEffect(() => {
    if (xpPoints === 0 && userLevel > 1) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [userLevel, xpPoints]);

  // Fetch notification count on component mount and periodically
  useEffect(() => {
    fetchNotificationCount();
    
    // Refresh notification count every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Refresh notification count when user navigates to different pages
  useEffect(() => {
    fetchNotificationCount();
  }, [location.pathname]);

  // Render the appropriate component based on current path
  const renderCurrentComponent = () => {
    switch (location.pathname) {
      case '/dashboard':
        return <Dashboard userLevel={userLevel} lenderData={lenderData} onLogout={onLogout} />;
      case '/borrowers':
        return <Borrowers userLevel={userLevel} lenderData={lenderData} onLogout={onLogout} />;
      case '/notifications':
        return <Notifications userLevel={userLevel} lenderData={lenderData} onLogout={onLogout} />;
      case '/settings':
        return <Settings userLevel={userLevel} lenderData={lenderData} onLogout={onLogout} />;
      default:
        return <Dashboard userLevel={userLevel} lenderData={lenderData} onLogout={onLogout} />;
    }
  };

  return (
    <div className="layout">
      <Sidebar 
        currentPath={location.pathname} 
        onLogout={onLogout} 
        userLevel={userLevel}
        notificationCount={notificationCount}
        lenderData={lenderData}
      />
      
      <main className="main-content">
        {/* Gamified UI elements */}
        {showLevelUp && (
          <div className="level-up-notification">
            <div className="level-up-icon">⬆️</div>
            <div className="level-up-text">
              <h3>Level Up!</h3>
              <p>You've reached level {userLevel}</p>
            </div>
          </div>
        )}
        
        {/* Render current component */}
        {renderCurrentComponent()}
      </main>
    </div>
  );
};

export default Layout;
