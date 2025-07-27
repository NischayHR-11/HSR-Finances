import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line';
import apiService from '../services/apiService';
import suppressChartErrors from '../utils/chartErrorHandler';
import MobileNavigation from './MobileNavigation';
import './Dashboard.css';

const Dashboard = ({ userLevel = 1, lenderData, onLogout }) => {
  const [animateStats, setAnimateStats] = useState(false);
  const [activeAchievement, setActiveAchievement] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.max(window.innerWidth, 320); // Ensure minimum width
    }
    return 1024; // Default fallback
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getDashboardStats();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Trigger animations when component mounts
  useEffect(() => {
    // Suppress chart-related errors in production
    suppressChartErrors();
    
    setAnimateStats(true);
    
    // Check if user has already seen the welcome message
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    if (!hasSeenWelcome && lenderData) {
      setShowWelcome(true);
      // Mark as seen and auto-hide welcome message after 3 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false);
        localStorage.setItem('hasSeenWelcome', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lenderData]);

  // Handle window resize for responsive chart
  useEffect(() => {
    const handleResize = () => {
      const newWidth = Math.max(window.innerWidth, 320); // Ensure minimum width
      setWindowWidth(newWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Generate stats from real data
  const stats = dashboardData ? [
    {
      title: 'Total Money Lent',
      value: formatCurrency(dashboardData.stats.totalMoneyLent),
      change: dashboardData.stats.totalMoneyLent > 0 ? '+Active Lending' : 'No active loans',
      icon: '💰',
      positive: dashboardData.stats.totalMoneyLent > 0,
      color: 'var(--accent-primary)'
    },
    {
      title: 'Monthly Interest',
      value: formatCurrency(dashboardData.stats.monthlyInterest),
      change: dashboardData.stats.monthlyInterest > 0 ? '+Monthly Earning' : 'No earnings yet',
      icon: '📈',
      positive: dashboardData.stats.monthlyInterest > 0,
      color: 'var(--accent-green)'
    },
    {
      title: 'Active Loans',
      value: dashboardData.stats.activeLoans.toString(),
      change: `${dashboardData.stats.activeLoans} borrowers`,
      icon: '🏦',
      positive: dashboardData.stats.activeLoans > 0,
      color: 'var(--accent-tertiary)'
    },
    {
      title: 'On-Time Rate',
      value: `${dashboardData.stats.onTimeRate}%`,
      change: dashboardData.stats.onTimeRate > 80 ? 'Excellent!' : dashboardData.stats.onTimeRate > 60 ? 'Good' : 'Needs attention',
      icon: '⭐',
      positive: dashboardData.stats.onTimeRate > 60,
      color: 'var(--accent-secondary)'
    }
  ] : [
    {
      title: 'Total Money Lent',
      value: '$0',
      change: 'Loading...',
      icon: '💰',
      positive: true,
      color: 'var(--accent-primary)'
    },
    {
      title: 'Monthly Interest',
      value: '$0',
      change: 'Loading...',
      icon: '📈',
      positive: true,
      color: 'var(--accent-green)'
    },
    {
      title: 'Active Loans',
      value: '0',
      change: 'Loading...',
      icon: '🏦',
      positive: true,
      color: 'var(--accent-tertiary)'
    },
    {
      title: 'On-Time Rate',
      value: '0%',
      change: 'Loading...',
      icon: '⭐',
      positive: true,
      color: 'var(--accent-secondary)'
    }
  ];

  // Recent borrowers data (mix of real data from API and placeholder)
  const recentBorrowers = dashboardData?.recentBorrowers || [];

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

  // Monthly statistics data for Nivo chart - ensure all values are valid numbers
  const monthlyStatsData = [
    {
      id: 'Interest Earned',
      color: '#22C55E',
      data: [
        { x: 'Jan', y: 6500 },
        { x: 'Feb', y: 7200 },
        { x: 'Mar', y: 7800 },
        { x: 'Apr', y: 8100 },
        { x: 'May', y: 8400 },
        { x: 'Jun', y: 8750 },
        { x: 'Jul', y: 9200 },
        { x: 'Aug', y: 8900 },
        { x: 'Sep', y: 9500 },
        { x: 'Oct', y: 9800 },
        { x: 'Nov', y: 10200 },
        { x: 'Dec', y: 10500 }
      ].map(item => ({ 
        x: item.x, 
        y: isNaN(item.y) || item.y === null || item.y === undefined ? 0 : Number(item.y) 
      }))
    },
    {
      id: 'Money Lent',
      color: '#4EEAFF',
      data: [
        { x: 'Jan', y: 85000 },
        { x: 'Feb', y: 92000 },
        { x: 'Mar', y: 98000 },
        { x: 'Apr', y: 105000 },
        { x: 'May', y: 112000 },
        { x: 'Jun', y: 118000 },
        { x: 'Jul', y: 125000 },
        { x: 'Aug', y: 121000 },
        { x: 'Sep', y: 128000 },
        { x: 'Oct', y: 135000 },
        { x: 'Nov', y: 142000 },
        { x: 'Dec', y: 150000 }
      ].map(item => ({ 
        x: item.x, 
        y: isNaN(item.y) || item.y === null || item.y === undefined ? 0 : Number(item.y) 
      }))
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
      <MobileNavigation userLevel={userLevel} lenderData={lenderData} onLogout={onLogout} />
      
      <div className="page-content">
        {/* Desktop Top Navigation */}
        <div className="desktop-top-nav">
          <div className="desktop-navbar">
            <button 
              className="navbar-item notification-btn"
              onClick={handleNotificationClick}
              type="button"
            >
              <span className="navbar-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
                </svg>
              </span>
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
          <p>Welcome {lenderData?.name || 'User'} !!</p>
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
            <button className="view-all-btn" onClick={() => navigate('/borrowers')}>View All</button>
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

      {/* Monthly Statistics Chart - Full Width */}
      <div className="statistics-section" style={{ marginTop: '2rem' }}>
        <div className="section-header">
          <h2>
            <span className="section-icon" style={{ marginRight: '12px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"/>
                <path d="M7 16l4-4 4 4 6-6"/>
                <circle cx="7" cy="16" r="1"/>
                <circle cx="11" cy="12" r="1"/>
                <circle cx="15" cy="16" r="1"/>
                <circle cx="21" cy="10" r="1"/>
              </svg>
            </span>
            Monthly Statistics
          </h2>
        </div>
        
        <div className="chart-container">
          <div className="chart-wrapper">
            {windowWidth > 0 && (
              <ResponsiveLine
                data={monthlyStatsData}
                margin={{ 
                  top: 50, 
                  right: Math.max(windowWidth <= 768 ? 20 : 120, 20), 
                  bottom: Math.max(windowWidth <= 768 ? 60 : 80, 60), 
                  left: Math.max(windowWidth <= 768 ? 40 : 80, 40) 
                }}
                xScale={{ type: 'point' }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: false,
                  reverse: false
                }}
                yFormat=" >-.2f"
                curve="cardinal"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  orient: 'bottom',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: windowWidth <= 480 ? -45 : 0,
                  legend: 'Month',
                  legendOffset: 36,
                  legendPosition: 'middle',
                  tickColor: '#8B949E',
                  textColor: '#8B949E'
                }}
                axisLeft={{
                  orient: 'left',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: windowWidth <= 768 ? '' : 'Amount ($)',
                  legendOffset: -40,
                  legendPosition: 'middle',
                  tickColor: '#8B949E',
                  textColor: '#8B949E'
                }}
                pointSize={Math.max(windowWidth <= 768 ? 6 : 8, 4)}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={windowWidth <= 768 ? [] : [
                  {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    itemTextColor: '#8B949E',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
                theme={{
                  background: 'transparent',
                  text: {
                    fontSize: 12,
                    fill: '#8B949E',
                    outlineWidth: 0,
                    outlineColor: 'transparent'
                  },
                  axis: {
                    domain: {
                      line: {
                        stroke: '#30363D',
                        strokeWidth: 1
                      }
                    },
                    legend: {
                      text: {
                        fontSize: 12,
                        fill: '#8B949E',
                        fontWeight: 600
                      }
                    },
                    ticks: {
                      line: {
                        stroke: '#30363D',
                        strokeWidth: 1
                      },
                      text: {
                        fontSize: 11,
                        fill: '#8B949E'
                      }
                    }
                  },
                  grid: {
                    line: {
                      stroke: '#30363D',
                      strokeWidth: 1,
                      strokeOpacity: 0.3
                    }
                  },
                  crosshair: {
                    line: {
                      stroke: '#4EEAFF',
                      strokeWidth: 1,
                      strokeOpacity: 0.75,
                      strokeDasharray: '6 6'
                    }
                  },
                  tooltip: {
                    container: {
                      background: 'rgba(30, 41, 59, 0.95)',
                      color: '#E2E8F0',
                      fontSize: '12px',
                      border: '1px solid rgba(78, 234, 255, 0.3)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }
                  }
                }}
                enableSlices="x"
                sliceTooltip={({ slice }) => (
                  <div className="chart-tooltip">
                    <div className="tooltip-header">
                      <strong>{slice.points[0].data.x}</strong>
                    </div>
                    {slice.points.map((point) => (
                      <div key={point.id} className="tooltip-item">
                        <div 
                          className="tooltip-color" 
                          style={{ backgroundColor: point.serieColor }}
                        ></div>
                        <span>{point.serieId}: </span>
                        <strong>${point.data.y.toLocaleString()}</strong>
                      </div>
                    ))}
                  </div>
                )}
              />
            )}
          </div>
          </div>
        </div>

      {/* Welcome Popup */}
      {showWelcome && (
        <div className="welcome-popup">
          <div className="welcome-content">
            <div className="welcome-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <h3>Welcome {lenderData?.name || 'User'} !!</h3>
            <p>Ready to manage your finances</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
