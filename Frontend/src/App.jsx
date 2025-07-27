import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import apiService from './services/apiService';
import './App.css';
import './assets/gamified-ui.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [xpPoints, setXpPoints] = useState(0);
  const [lenderData, setLenderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug environment info
  useEffect(() => {
    console.log('🚀 HSR-Finances Frontend Started');
    console.log('📊 Environment Info:', {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
      apiUrl: import.meta.env.VITE_API_BASE_URL,
      hostname: window.location.hostname
    });
    
    // Test API connection
    apiService.testConnection().catch(err => {
      console.warn('⚠️ Initial API connection test failed:', err);
    });
  }, []);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (apiService.isAuthenticated()) {
          // Verify token is still valid by fetching profile
          const response = await apiService.getProfile();
          if (response.success) {
            setIsAuthenticated(true);
            setLenderData(response.data.lender);
          } else {
            // Token is invalid, clear storage
            apiService.logout();
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        apiService.logout();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

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

  const handleLogin = (lenderData) => {
    setIsAuthenticated(true);
    setLenderData(lenderData);
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setLenderData(null);
    setUserLevel(1);
    setXpPoints(0);
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          <div className="loading-spinner">
            <div className="logo-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>$</div>
            <div>Loading HSR-Finances...</div>
          </div>
        </div>
      </div>
    );
  }

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
                <Layout 
                  onLogout={handleLogout} 
                  userLevel={userLevel} 
                  xpPoints={xpPoints}
                  lenderData={lenderData}
                /> : 
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
