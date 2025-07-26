import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const stats = [
    {
      title: 'Total Money Lent',
      value: '$125,000',
      change: '+8.2% from last month',
      icon: '$',
      positive: true
    },
    {
      title: 'Monthly Interest',
      value: '$8,750',
      change: '+12.5% from last month',
      icon: '📈',
      positive: true
    },
    {
      title: 'Active Loans',
      value: '12',
      change: '2 new this month',
      icon: '👥',
      positive: true
    },
    {
      title: 'On-Time Rate',
      value: '95%',
      change: 'Excellent performance',
      icon: '🏆',
      positive: true
    }
  ];

  const recentBorrowers = [
    {
      name: 'John Smith',
      amount: '$25,000',
      rate: '8.5%',
      monthlyInterest: '$177.08',
      progress: 65,
      status: 'current',
      dueDate: '2024-02-15'
    },
    {
      name: 'Sarah Johnson',
      amount: '$15,000',
      rate: '9.2%',
      monthlyInterest: '$115',
      progress: 40,
      status: 'due',
      dueDate: '2024-02-12'
    }
  ];

  const achievements = [
    {
      title: 'Perfect Month',
      description: '100% on-time payments',
      icon: '🏆'
    },
    {
      title: 'Growth Master',
      description: 'Portfolio over $100K',
      icon: '🎯'
    },
    {
      title: 'Consistency King',
      description: '6 months streak',
      icon: '👑'
    }
  ];

  return (
    <div className="dashboard">
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
          <span>LendTracker</span>
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
                <span>LendTracker</span>
              </Link>
              <button 
                className="close-menu"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <nav className="mobile-nav">
              <Link to="/dashboard" className="mobile-nav-item active" onClick={() => setIsMobileMenuOpen(false)}>
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
              <Link to="/settings" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="nav-icon">⚙️</span>
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your lending overview.</p>
        </div>
        <div className="month-indicator">
          📈 +12% this month
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              <span className="stat-icon">{stat.icon}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="recent-borrowers-section">
          <div className="section-header">
            <h2>Recent Borrowers</h2>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="borrowers-list">
            {recentBorrowers.map((borrower, index) => (
              <div key={index} className="borrower-card">
                <div className="borrower-info">
                  <div className="borrower-header">
                    <h3>{borrower.name}</h3>
                    <span className={`status-badge status-${borrower.status}`}>
                      {borrower.status}
                    </span>
                  </div>
                  <div className="borrower-amount">{borrower.amount} @ {borrower.rate}</div>
                  <div className="borrower-due">Due: {borrower.dueDate}</div>
                </div>
                
                <div className="borrower-details">
                  <div className="monthly-interest">
                    Monthly Interest: <span className="amount-green">{borrower.monthlyInterest}</span>
                  </div>
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${borrower.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{borrower.progress}% paid</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="achievements-section">
          <div className="section-header">
            <h2>🏆 Achievements</h2>
          </div>
          
          <div className="achievements-list">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-card">
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-info">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
