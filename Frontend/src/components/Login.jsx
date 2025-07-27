import { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      // Sign up validation
      if (email && password && confirmPassword && fullName) {
        if (password === confirmPassword) {
          onLogin(); // For now, just log in after sign up
        } else {
          alert('Passwords do not match!');
        }
      }
    } else {
      // Sign in validation
      if (email && password) {
        onLogin();
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Clear form when switching modes
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo" onClick={handleSubmit}>
            <div className="logo-icon">$</div>
          </div>
          <h1 onClick={handleSubmit} style={{ cursor: 'pointer' }}>HSR-FINANCES</h1>
          <p>Manage your lending portfolio with confidence</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
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
            />
          </div>
          
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
            />
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
              />
            </div>
          )}
          
          <button type="submit" className="sign-in-btn">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span className="link-text" onClick={toggleMode}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
