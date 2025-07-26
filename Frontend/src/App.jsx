import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import './App.css';
import './assets/gamified-ui.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [xpPoints, setXpPoints] = useState(0);

  // Simulated XP gain for gamified UI
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        setXpPoints(prev => {
          const newXp = prev + Math.floor(Math.random() * 5) + 1;
          
          // Level up system
          if (newXp >= userLevel * 100) {
            setUserLevel(prevLevel => prevLevel + 1);
            return newXp - (userLevel * 100);
          }
          
          return newXp;
        });
      }, 60000); // Gain XP every minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userLevel]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        {/* Decorative UI elements for gamified theme */}
        <div className="crystal" style={{ top: '10%', left: '5%' }}></div>
        <div className="crystal" style={{ top: '30%', right: '8%' }}></div>
        <div className="crystal" style={{ bottom: '15%', left: '20%' }}></div>
        
        {/* Game context provider for gamified UI */}
        <div className="game-context" style={{ display: 'none' }} 
          data-user-level={userLevel} 
          data-xp-points={xpPoints}
          data-max-xp={userLevel * 100}>
        </div>
        
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/*" 
            element={
              isAuthenticated ? 
                <Layout onLogout={handleLogout} userLevel={userLevel} xpPoints={xpPoints} /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
