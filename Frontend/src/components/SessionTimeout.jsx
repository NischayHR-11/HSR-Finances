import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const SessionTimeout = ({ onLogout }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const checkSessionExpiry = () => {
      const token = apiService.token;
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeLeft = expiryTime - currentTime;

        // Show warning 5 minutes before expiry
        if (timeLeft <= 5 * 60 * 1000 && timeLeft > 0) {
          setShowWarning(true);
          setCountdown(Math.floor(timeLeft / 1000));
        } else if (timeLeft <= 0) {
          // Session expired
          onLogout();
        }
      } catch (error) {
        console.error('Error checking session expiry:', error);
      }
    };

    const interval = setInterval(checkSessionExpiry, 1000); // Check every second
    return () => clearInterval(interval);
  }, [onLogout]);

  useEffect(() => {
    if (countdown > 0 && showWarning) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, showWarning]);

  const handleExtendSession = async () => {
    try {
      // Refresh the session by making a profile request
      await apiService.getProfile();
      setShowWarning(false);
      setCountdown(0);
    } catch (error) {
      console.error('Failed to extend session:', error);
      onLogout();
    }
  };

  if (!showWarning) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="session-timeout-warning">
      <div className="session-timeout-content">
        <div className="warning-icon">⚠️</div>
        <div className="warning-text">
          <h3>Session Expiring Soon</h3>
          <p>
            Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')}
          </p>
          <div className="warning-actions">
            <button 
              className="extend-session-btn"
              onClick={handleExtendSession}
            >
              Extend Session
            </button>
            <button 
              className="logout-btn"
              onClick={onLogout}
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;
