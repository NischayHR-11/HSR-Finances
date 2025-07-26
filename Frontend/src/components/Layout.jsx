import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Borrowers from './Borrowers';
import Notifications from './Notifications';
import Settings from './Settings';
import './Layout.css';

const Layout = ({ onLogout, userLevel, xpPoints }) => {
  const location = useLocation();
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // XP percentage calculation
  const maxXp = userLevel * 100;
  const xpPercentage = (xpPoints / maxXp) * 100;
  
  // Check for level up
  useEffect(() => {
    if (xpPoints === 0 && userLevel > 1) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [userLevel, xpPoints]);

  return (
    <div className="layout">
      <Sidebar 
        currentPath={location.pathname} 
        onLogout={onLogout} 
        userLevel={userLevel}
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
        
        <Routes>
          <Route path="/dashboard" element={<Dashboard userLevel={userLevel} />} />
          <Route path="/borrowers" element={<Borrowers userLevel={userLevel} />} />
          <Route path="/notifications" element={<Notifications userLevel={userLevel} />} />
          <Route path="/settings" element={<Settings userLevel={userLevel} />} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
