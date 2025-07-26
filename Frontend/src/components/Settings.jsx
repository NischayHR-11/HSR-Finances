import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  });
  
  const [businessInfo, setBusinessInfo] = useState({
    businessName: 'Personal Lending LLC',
    taxId: 'XX-XXXXXXX',
    businessAddress: '123 Business St, City, State 12345'
  });

  const tabs = [
    { id: 'Profile', label: 'Profile', icon: '👤' },
    { id: 'Notifications', label: 'Notifications', icon: '🔔' },
    { id: 'Security', label: 'Security', icon: '🔒' },
    { id: 'Preferences', label: 'Preferences', icon: '⚙️' }
  ];

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBusinessInfoChange = (field, value) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePersonal = () => {
    // Implementation for saving personal info
    console.log('Saving personal info:', personalInfo);
  };

  const handleSaveBusiness = () => {
    // Implementation for saving business info
    console.log('Saving business info:', businessInfo);
  };

  return (
    <div className="settings">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        <Link to="/dashboard" className="mobile-logo">
          <div className="logo-icon">$</div>
          <span>HSR-Finances</span>
        </Link>
        
        <div className="mobile-actions">
          <Link to="/notifications" className="notification-btn">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </Link>
          <div className="user-avatar mobile-avatar">JD</div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <Link to="/dashboard" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="logo-icon">$</div>
                <span>HSR-Finances</span>
              </Link>
              <button 
                className="close-menu"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <nav className="mobile-nav">
              <Link to="/dashboard" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="nav-icon">📊</span>
                <span>Dashboard</span>
              </Link>
              <Link to="/borrowers" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="nav-icon">👥</span>
                <span>Borrowers</span>
              </Link>
              <Link to="/notifications" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="nav-icon">🔔</span>
                <span>Notifications</span>
                <span className="nav-badge">3</span>
              </Link>
              <Link to="/settings" className="mobile-nav-item active" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="nav-icon">⚙️</span>
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and notifications</p>
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-panel">
          {activeTab === 'Profile' && (
            <div className="profile-settings">
              <div className="settings-section">
                <h2>Personal Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      value={personalInfo.fullName}
                      onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    />
                  </div>
                </div>
                
                <button className="save-btn" onClick={handleSavePersonal}>
                  💾 Save Changes
                </button>
              </div>

              <div className="settings-section">
                <h2>Business Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="businessName">Business Name</label>
                    <input
                      type="text"
                      id="businessName"
                      value={businessInfo.businessName}
                      onChange={(e) => handleBusinessInfoChange('businessName', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="taxId">Tax ID</label>
                    <input
                      type="text"
                      id="taxId"
                      value={businessInfo.taxId}
                      onChange={(e) => handleBusinessInfoChange('taxId', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label htmlFor="businessAddress">Business Address</label>
                    <input
                      type="text"
                      id="businessAddress"
                      value={businessInfo.businessAddress}
                      onChange={(e) => handleBusinessInfoChange('businessAddress', e.target.value)}
                    />
                  </div>
                </div>
                
                <button className="save-btn" onClick={handleSaveBusiness}>
                  💾 Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="notification-settings">
              <div className="settings-section">
                <h2>Notification Preferences</h2>
                <div className="notification-options">
                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Payment Reminders</h3>
                      <p>Get notified when payments are due</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Overdue Alerts</h3>
                      <p>Receive alerts for overdue payments</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Monthly Reports</h3>
                      <p>Get monthly portfolio summaries</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="security-settings">
              <div className="settings-section">
                <h2>Security Settings</h2>
                <div className="security-options">
                  <div className="security-item">
                    <h3>Change Password</h3>
                    <p>Update your account password</p>
                    <button className="btn-secondary">Change Password</button>
                  </div>
                  
                  <div className="security-item">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                    <button className="btn-secondary">Enable 2FA</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Preferences' && (
            <div className="preference-settings">
              <div className="settings-section">
                <h2>Application Preferences</h2>
                <div className="preference-options">
                  <div className="preference-item">
                    <div className="preference-info">
                      <h3>Dark Mode</h3>
                      <p>Use dark theme for the interface</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="preference-item">
                    <div className="preference-info">
                      <h3>Auto-backup</h3>
                      <p>Automatically backup your data</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
