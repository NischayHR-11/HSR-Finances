import { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNavigation from './MobileNavigation';
import './Settings.css';

const Settings = ({ userLevel = 1, lenderData }) => {
  const [activeTab, setActiveTab] = useState('Profile');
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
    { 
      id: 'Profile', 
      label: 'Profile', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
        </svg>
      )
    },
    { 
      id: 'Notifications', 
      label: 'Notifications', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
        </svg>
      )
    },
    { 
      id: 'Security', 
      label: 'Security', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V17C16,18.4 15.4,19 14.8,19H9.2C8.6,19 8,18.4 8,17V13C8,12.4 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
        </svg>
      )
    },
    { 
      id: 'Preferences', 
      label: 'Preferences', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
        </svg>
      )
    }
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
      <MobileNavigation userLevel={userLevel} lenderData={lenderData} />
      
      <div className="page-content">
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
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '8px'}}>
                    <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/>
                  </svg>
                  Save Changes
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
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '8px'}}>
                    <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/>
                  </svg>
                  Save Changes
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
    </div>
  );
};

export default Settings;
