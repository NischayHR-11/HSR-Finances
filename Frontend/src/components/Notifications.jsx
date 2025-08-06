import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MobileNavigation from './MobileNavigation';
import apiService from '../services/apiService';
import './Notifications.css';

const Notifications = ({ userLevel = 1, lenderData, onLogout }) => {
  const [notifications, setNotifications] = useState([]);
  const [upcomingNotifications, setUpcomingNotifications] = useState([]);
  const [notificationSummary, setNotificationSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [error, setError] = useState(null);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  // Fetch due notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getDueNotifications();
      
      if (response.success) {
        setNotifications(response.data.notifications);
        
        // Set summary data
        const summary = response.data.summary;
        setNotificationSummary([
          {
            title: 'Due Today',
            count: summary.dueToday,
            description: 'Payments requiring attention',
            icon: '⚠️',
            color: 'warning'
          },
          {
            title: 'Due This Month',
            count: summary.due,
            description: 'Payments 1 month behind',
            icon: '📅',
            color: 'info'
          },
          {
            title: 'Overdue',
            count: summary.overdue,
            description: 'Payments 2+ months behind',
            icon: '🚨',
            color: 'danger'
          }
        ]);
      } else {
        setError(response.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Unable to load notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch upcoming notifications based on borrowers' due dates
  const fetchUpcomingNotifications = async () => {
    try {
      setIsLoadingUpcoming(true);
      setError(null);
      
      // Get all borrowers and calculate upcoming due dates
      const response = await apiService.getBorrowers({ limit: 100 });
      
      if (response.success) {
        const borrowers = response.data.borrowers || [];
        const today = new Date();
        const upcomingList = [];

        borrowers.forEach(borrower => {
          // Skip completed loans
          if (borrower.monthsPaid >= 10) return;

          // Calculate next due date using the same logic as in Borrowers component
          const accountStart = new Date(borrower.dueDate);
          const startMonth = new Date(accountStart.getFullYear(), accountStart.getMonth(), 1);
          const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const monthsSinceStart = Math.max(0, (currentMonth.getFullYear() - startMonth.getFullYear()) * 12 + (currentMonth.getMonth() - startMonth.getMonth()));
          
          let targetMonth;
          if (monthsSinceStart === 0) {
            targetMonth = 0;
          } else if (!borrower.paidThisMonth) {
            targetMonth = monthsSinceStart;
          } else {
            targetMonth = monthsSinceStart + 1;
          }
          
          const nextDue = new Date(accountStart);
          nextDue.setMonth(accountStart.getMonth() + targetMonth);
          
          // Calculate days until due
          const timeDiff = nextDue.getTime() - today.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          
          // Only include upcoming notifications (next 30 days)
          if (daysDiff >= 0 && daysDiff <= 30) {
            upcomingList.push({
              id: borrower._id,
              borrowerId: borrower._id,
              name: borrower.name,
              phone: borrower.phone,
              amount: `$${(borrower.amount / 10).toFixed(0)}`, // Monthly payment
              dueDate: nextDue.toISOString(),
              daysDiff,
              type: daysDiff === 0 ? 'Due Today' : 
                    daysDiff <= 3 ? 'Due Soon' : 
                    daysDiff <= 7 ? 'Due This Week' : 'Due This Month',
              priority: daysDiff === 0 ? 'urgent' : 
                       daysDiff <= 3 ? 'high' : 'normal',
              monthsPaid: borrower.monthsPaid,
              paidThisMonth: borrower.paidThisMonth
            });
          }
        });

        // Sort by due date (closest first)
        upcomingList.sort((a, b) => a.daysDiff - b.daysDiff);
        
        setUpcomingNotifications(upcomingList);
        setShowUpcoming(true);
      } else {
        setError(response.message || 'Failed to fetch upcoming notifications');
      }
    } catch (error) {
      console.error('Error fetching upcoming notifications:', error);
      setError('Unable to load upcoming notifications. Please try again.');
    } finally {
      setIsLoadingUpcoming(false);
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle copy phone number
  const handleCopyPhone = async (phoneNumber) => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      // Show copy popup
      setShowCopyPopup(true);
      setTimeout(() => setShowCopyPopup(false), 2000); // Hide after 2 seconds
      console.log('📋 Phone number copied to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy phone number:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = phoneNumber;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      // Show copy popup for fallback too
      setShowCopyPopup(true);
      setTimeout(() => setShowCopyPopup(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays > 0) {
      return `${diffDays} days ago`;
    } else {
      const futureDays = Math.abs(diffDays);
      return `In ${futureDays} day${futureDays > 1 ? 's' : ''}`;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'priority-urgent';
      case 'high':
        return 'priority-high';
      case 'normal':
        return 'priority-normal';
      default:
        return '';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'normal':
        return '✅';
      default:
        return '📄';
    }
  };

  const markAsPaid = async (notification) => {
    try {
      const response = await apiService.markPaymentAsPaid(notification.borrowerId);
      
      if (response.success) {
        // Refresh notifications to update the list
        await fetchNotifications();
        
        // Show different messages based on completion status
        if (response.data.completed) {
          console.log('🎉 Borrower completed all 10 payments! No more notifications will be sent.');
          // You could add a toast notification here for completion
        } else {
          console.log('✅ Payment marked as paid successfully');
        }
      } else {
        setError(response.message || 'Failed to mark payment as paid');
      }
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      setError('Unable to mark payment as paid. Please try again.');
    }
  };

  const dismissNotification = (id) => {
    // For now, just remove from local state
    // In a real app, you might want to store dismissed notifications
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notifications">
      <MobileNavigation userLevel={userLevel} lenderData={lenderData} onLogout={onLogout} />
      
      <div className="page-content">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with payment due dates and reminders</p>
          </div>
        </div>

        <div className="notification-summary">
          {notificationSummary.map((item, index) => (
            <div key={index} className={`summary-card ${item.color}`}>
              <div className="summary-icon">{item.icon}</div>
              <div className="summary-content">
                <h3>{item.count}</h3>
                <p className="summary-title">{item.title}</p>
                <p className="summary-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="notifications-section">
          <div className="section-header">
            <h2>🔔 Recent Notifications</h2>
            <div className="header-buttons">
              <button 
                className="upcoming-btn" 
                onClick={() => {
                  if (showUpcoming) {
                    setShowUpcoming(false);
                  } else {
                    fetchUpcomingNotifications();
                  }
                }}
                disabled={isLoadingUpcoming}
              >
                {isLoadingUpcoming ? '🔄' : '📅'} {showUpcoming ? 'Hide Upcoming' : 'Show Upcoming'}
              </button>
              <button className="refresh-btn" onClick={fetchNotifications} disabled={isLoading}>
                {isLoading ? '🔄' : '↻'} Refresh
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-message">
                <div className="loading-spinner"></div>
                <p>Loading notifications...</p>
              </div>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
                <button className="retry-btn" onClick={fetchNotifications}>
                  Try Again
                </button>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="empty-container">
              <div className="empty-message">
                <span className="empty-icon">🎉</span>
                <h3>All caught up!</h3>
                <p>No pending payment notifications at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-card ${getPriorityClass(notification.priority)}`}
                >
                  <div className="notification-priority">
                    {getPriorityIcon(notification.priority)}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-header">
                      <div className="notification-info">
                        <h3>{notification.name}</h3>
                        <span className="notification-type">{notification.type}</span>
                      </div>
                      <div className="notification-meta">
                        <span className="notification-amount">{notification.amount}</span>
                        <span className="notification-time">{getTimeAgo(notification.dueDate)}</span>
                      </div>
                    </div>
                    
                    <p className="notification-message">{notification.message}</p>
                    
                    <div className="notification-details">
                      <span className="notification-date">📅 Due: {formatDate(notification.dueDate)}</span>
                      {notification.phone && (
                        <div className="borrower-phone">
                          <span className="phone-number">📞 {notification.phone}</span>
                          <button 
                            className="copy-phone-btn"
                            onClick={() => handleCopyPhone(notification.phone)}
                            title="Copy phone number"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="copy-icon">
                              {/* Back document */}
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" fill="none" stroke="currentColor"/>
                              {/* Front document */}
                              <rect x="2" y="2" width="13" height="13" rx="2" ry="2" fill="currentColor" stroke="currentColor"/>
                              {/* Lines on front document */}
                              <line x1="4" y1="6" x2="11" y2="6" stroke="white" strokeWidth="1"/>
                              <line x1="4" y1="9" x2="11" y2="9" stroke="white" strokeWidth="1"/>
                              <line x1="4" y1="12" x2="8" y2="12" stroke="white" strokeWidth="1"/>
                            </svg>
                            <span className="copy-text">Copy</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="notification-actions">
                    {['overdue', 'due', 'due_soon'].includes(notification.status) && (
                      <button 
                        className="action-btn paid-btn"
                        onClick={() => markAsPaid(notification)}
                        title="Mark payment as paid"
                      >
                        ✓ Paid
                      </button>
                    )}
                    <button 
                      className="action-btn dismiss-btn"
                      onClick={() => dismissNotification(notification.id)}
                      title="Dismiss notification"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Notifications Section */}
        {showUpcoming && (
          <div className="notifications-section upcoming-section">
            <div className="section-header">
              <h2>📅 Upcoming Due Dates (Next 30 Days)</h2>
              <span className="upcoming-count">
                {upcomingNotifications.length} upcoming
              </span>
            </div>

            {isLoadingUpcoming ? (
              <div className="loading-container">
                <div className="loading-message">
                  <div className="loading-spinner"></div>
                  <p>Loading upcoming notifications...</p>
                </div>
              </div>
            ) : upcomingNotifications.length === 0 ? (
              <div className="empty-container">
                <div className="empty-message">
                  <span className="empty-icon">📅</span>
                  <h3>No upcoming due dates</h3>
                  <p>All borrowers are up to date or have no payments due in the next 30 days.</p>
                </div>
              </div>
            ) : (
              <div className="notifications-list upcoming-list">
                {upcomingNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-card upcoming-card ${getPriorityClass(notification.priority)}`}
                  >
                    <div className="notification-priority">
                      {getPriorityIcon(notification.priority)}
                    </div>
                    
                    <div className="notification-content">
                      <div className="notification-header">
                        <div className="notification-info">
                          <h3>{notification.name}</h3>
                          <span className="notification-type">{notification.type}</span>
                        </div>
                        <div className="notification-meta">
                          <span className="notification-amount">{notification.amount}</span>
                          <span className="notification-time">
                            {notification.daysDiff === 0 ? 'Today' : 
                             notification.daysDiff === 1 ? 'Tomorrow' : 
                             `In ${notification.daysDiff} days`}
                          </span>
                        </div>
                      </div>
                      
                      <p className="notification-message">
                        Monthly payment due {notification.daysDiff === 0 ? 'today' : 
                                           notification.daysDiff === 1 ? 'tomorrow' : 
                                           `in ${notification.daysDiff} days`}
                        {notification.paidThisMonth && ' (Already paid this month)'}
                      </p>
                      
                      <div className="notification-details">
                        <span className="notification-date">📅 Due: {formatDate(notification.dueDate)}</span>
                        <span className="progress-info">
                          📊 Progress: {notification.monthsPaid}/10 months
                        </span>
                        {notification.phone && (
                          <div className="borrower-phone">
                            <span className="phone-number">📞 {notification.phone}</span>
                            <button 
                              className="copy-phone-btn"
                              onClick={() => handleCopyPhone(notification.phone)}
                              title="Copy phone number"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="copy-icon">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" fill="none" stroke="currentColor"/>
                                <rect x="2" y="2" width="13" height="13" rx="2" ry="2" fill="currentColor" stroke="currentColor"/>
                                <line x1="4" y1="6" x2="11" y2="6" stroke="white" strokeWidth="1"/>
                                <line x1="4" y1="9" x2="11" y2="9" stroke="white" strokeWidth="1"/>
                                <line x1="4" y1="12" x2="8" y2="12" stroke="white" strokeWidth="1"/>
                              </svg>
                              <span className="copy-text">Copy</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="notification-actions">
                      {!notification.paidThisMonth && (
                        <button 
                          className="action-btn paid-btn"
                          onClick={() => markAsPaid(notification)}
                          title="Mark payment as paid"
                        >
                          ✓ Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Copy Success Popup */}
      {showCopyPopup && (
        <div className="copy-popup">
          <div className="copy-popup-content">
            <span className="copy-popup-icon">✓</span>
            <span className="copy-popup-text">Copied!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
