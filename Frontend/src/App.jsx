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
        <div className="website-loading-screen">
          {/* Animated Background */}
          <div className="loading-bg-pattern"></div>
          <div className="loading-crystals">
            <div className="crystal crystal-1"></div>
            <div className="crystal crystal-2"></div>
            <div className="crystal crystal-3"></div>
          </div>
          
          {/* Loading Content */}
          <div className="loading-container">
            <div className="loading-logo-wrapper">
              <div className="loading-logo-icon">$</div>
              <div className="logo-pulse-ring"></div>
              <div className="logo-pulse-ring pulse-delay"></div>
            </div>
            
            <h1 className="loading-brand">HSR-Finances</h1>
            <p className="loading-tagline">Gamified Finance Management</p>
            
            {/* Loading Progress Indicator */}
            <div className="loading-progress-wrapper">
              <div className="loading-bar">
                <div className="loading-fill"></div>
                <div className="loading-shine"></div>
              </div>
              <span className="loading-text">Loading HSR-Finances...</span>
            </div>
            
            {/* Loading Animation Dots */}
            <div className="loading-dots">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </div>
            
            {/* Status Message */}
            <div className="loading-status">
              <span className="status-indicator">⚡</span>
              <span>Connecting to your financial universe</span>
            </div>
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
          {/* Root route - Authentication page */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          
          {/* Login route - redirect to root for consistency */}
          <Route 
            path="/login" 
            element={<Navigate to="/" replace />}
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <Layout 
                  onLogout={handleLogout} 
                  userLevel={userLevel} 
                  xpPoints={xpPoints}
                  lenderData={lenderData}
                /> : 
                <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/borrowers" 
            element={
              isAuthenticated ? 
                <Layout 
                  onLogout={handleLogout} 
                  userLevel={userLevel} 
                  xpPoints={xpPoints}
                  lenderData={lenderData}
                /> : 
                <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/settings" 
            element={
              isAuthenticated ? 
                <Layout 
                  onLogout={handleLogout} 
                  userLevel={userLevel} 
                  xpPoints={xpPoints}
                  lenderData={lenderData}
                /> : 
                <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/notifications" 
            element={
              isAuthenticated ? 
                <Layout 
                  onLogout={handleLogout} 
                  userLevel={userLevel} 
                  xpPoints={xpPoints}
                  lenderData={lenderData}
                /> : 
                <Navigate to="/" replace />
            } 
          />
          
          {/* Catch all route - redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
