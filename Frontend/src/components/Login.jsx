import { useState } from 'react';
import apiService from '../services/apiService';
import './Login.css';
import ThreeBackground from './ThreeBackground';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up validation
        if (!fullName || !email || !password || !confirmPassword) {
          setError('All fields are required for registration');
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match!');
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        // Register user
        const userData = {
          name: fullName,
          email: email.toLowerCase().trim(),
          password,
          phone: phone || undefined
        };

        const response = await apiService.register(userData);
        
        if (response.success) {
          setSuccess('Account created successfully! Logging you in...');
          setTimeout(() => {
            onLogin(response.data.lender);
          }, 1000);
        }
      } else {
        // Sign in validation
        if (!email || !password) {
          setError('Email and password are required');
          return;
        }

        // Login user
        const credentials = {
          email: email.toLowerCase().trim(),
          password
        };

        const response = await apiService.login(credentials);
        
        if (response.success) {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            onLogin(response.data.lender);
          }, 800);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Clear form when switching modes
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhone('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-container">
      <ThreeBackground />
      <div className="login-card">
        <div className="login-header">
          <div className="logo" onClick={handleSubmit}>
            <div className="logo-icon">$</div>
          </div>
          <h1 onClick={handleSubmit} style={{ cursor: 'pointer' }}>HSR-FINANCES</h1>
          <p>Manage your lending portfolio with confidence</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {/* Error and Success Messages */}
          {error && (
            <div className="message error-message">
              {error}
            </div>
          )}
          
          {success && (
            <div className="message success-message">
              {success}
            </div>
          )}

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="phone">Phone (Optional)</label>
              <input
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="password-input"
              disabled={isLoading}
              minLength={6}
            />
            {isSignUp && (
              <small style={{ color: '#888', fontSize: '0.8rem' }}>
                Password must be at least 6 characters long
              </small>
            )}
          </div>
          
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="password-input"
                disabled={isLoading}
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="sign-in-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
                <span className="loading-dots">...</span>
              </span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span 
              className="link-text" 
              onClick={toggleMode}
              style={{ 
                opacity: isLoading ? 0.5 : 1, 
                cursor: isLoading ? 'not-allowed' : 'pointer' 
              }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
