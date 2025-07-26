import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ userLevel = 1 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [activeAchievement, setActiveAchievement] = useState(null);
  const navigate = useNavigate();

  // Trigger animations when component mounts
  useEffect(() => {
    setAnimateStats(true);
  }, []);

  const stats = [
    {
      title: 'Total Money Lent',
      value: '$125,000',
      change: '+8.2% from last month',
      icon: '💰',
      positive: true,
      color: 'var(--accent-primary)'
    },
    {
      title: 'Monthly Interest',
      value: '$8,750',
      change: '+12.5% from last month',
      icon: '📈',
      positive: true,
      color: 'var(--accent-tertiary)'
    },
    {
      title: 'Active Loans',
      value: '12',
      change: '2 new this month',
      icon: '👥',
      positive: true,
      color: 'var(--accent-secondary)'
    },
    {
      title: 'On-Time Rate',
      value: '95%',
      change: 'Excellent performance',
      icon: '🏆',
      positive: true,
      color: 'var(--accent-warning)'
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
      dueDate: '2024-02-15',
      avatar: 'JS',
      level: 3,
      streak: 12
    },
    {
      name: 'Sarah Johnson',
      amount: '$15,000',
      rate: '9.2%',
      monthlyInterest: '$115',
      progress: 40,
      status: 'due',
      dueDate: '2024-02-12',
      avatar: 'SJ',
      level: 2,
      streak: 5
    }
  ];

  const achievements = [
    {
      title: 'Perfect Month',
      description: '100% on-time payments',
      icon: '🏆',
      xp: 50,
      unlocked: true,
      color: 'var(--accent-primary)'
    },
    {
      title: 'Growth Master',
      description: 'Portfolio over $100K',
      icon: '📊',
      xp: 100,
      unlocked: true,
      color: 'var(--accent-tertiary)'
    },
    {
      title: 'Consistency King',
      description: '6 months streak',
      icon: '👑',
      xp: 75,
      unlocked: false,
      color: 'var(--accent-warning)'
    }
  ];
  
  const handleAchievementHover = (index) => {
    setActiveAchievement(index);
  };

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    console.log('Notification clicked - redirecting to notifications');
    navigate('/notifications');
  };

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

      {/* Desktop Top Navigation */}
      <div className="desktop-top-nav">
        <div className="desktop-navbar">
          <button 
            className="navbar-item notification-btn"
            onClick={handleNotificationClick}
            type="button"
          >
            <span className="navbar-icon">🔔</span>
            <span className="notification-badge">3</span>
            <span className="navbar-tooltip">Notifications</span>
          </button>
          
          <div className="navbar-item profile-section">
            <div className="user-avatar desktop-avatar">JD</div>
            <span className="profile-name">John Doe</span>
          </div>
        </div>
      </div>

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your lending overview.</p>
        </div>
        <div className="month-indicator glass-card">
          <span className="indicator-icon">📈</span> 
          <span className="indicator-text">+12% this month</span>
          <div className="indicator-glow"></div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`stat-card ${animateStats ? 'animate-in' : ''}`} 
            style={{ 
              animationDelay: `${index * 0.1}s`,
              borderColor: stat.positive ? stat.color : 'var(--accent-danger)'
            }}
          >
            <div 
              className="stat-header"
              style={{
                borderBottom: `1px solid ${stat.color}40`
              }}
            >
              <span className="stat-title">{stat.title}</span>
              <span 
                className="stat-icon" 
                style={{ 
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}80)`,
                  boxShadow: `0 0 15px ${stat.color}40`
                }}
              >
                {stat.icon}
              </span>
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
            <h2>
              <span className="section-icon">👥</span>
              Active Borrowers
            </h2>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="borrowers-list">
            {recentBorrowers.map((borrower, index) => (
              <div 
                key={index} 
                className={`borrower-card ${animateStats ? 'animate-in' : ''}`}
                style={{ 
                  animationDelay: `${0.3 + index * 0.1}s`
                }}
              >
                <div className="borrower-info">
                  <div className="borrower-header">
                    <div className="borrower-avatar-container">
                      <div className="borrower-avatar">{borrower.avatar}</div>
                      <div className="borrower-level">Lvl {borrower.level}</div>
                    </div>
                    <div>
                      <h3>{borrower.name}</h3>
                      <span className={`status-badge status-${borrower.status}`}>
                        {borrower.status}
                      </span>
                    </div>
                  </div>
                  <div className="borrower-amount">{borrower.amount} @ {borrower.rate}</div>
                  <div className="borrower-due">Due: {borrower.dueDate}</div>
                  <div className="borrower-streak">
                    <span className="streak-icon">🔥</span> {borrower.streak} day streak
                  </div>
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
            <h2>
              <span className="section-icon">🏆</span>
              Achievements
            </h2>
          </div>
          
          <div className="achievements-list">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} ${animateStats ? 'animate-in' : ''}`}
                style={{ 
                  animationDelay: `${0.5 + index * 0.1}s`,
                  borderColor: achievement.unlocked ? achievement.color : 'var(--border-color)'
                }}
                onMouseEnter={() => handleAchievementHover(index)}
                onMouseLeave={() => handleAchievementHover(null)}
              >
                <div 
                  className="achievement-icon-container"
                  style={{
                    background: achievement.unlocked 
                      ? `linear-gradient(135deg, ${achievement.color}, ${achievement.color}80)` 
                      : 'var(--bg-highlight)',
                    boxShadow: achievement.unlocked ? `0 0 15px ${achievement.color}40` : 'none'
                  }}
                >
                  <span className="achievement-icon">{achievement.icon}</span>
                </div>
                <div className="achievement-info">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                  {achievement.unlocked ? (
                    <div className="achievement-xp">+{achievement.xp} XP</div>
                  ) : (
                    <div className="achievement-locked">Locked</div>
                  )}
                </div>
                {activeAchievement === index && achievement.unlocked && (
                  <div className="achievement-tooltip">
                    <div className="tooltip-header">
                      <span className="tooltip-icon">{achievement.icon}</span>
                      <h4>{achievement.title}</h4>
                    </div>
                    <p>{achievement.description}</p>
                    <div className="tooltip-xp">
                      <span className="xp-icon">⭐</span> 
                      Awarded {achievement.xp} XP
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
