import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MobileNavigation from './MobileNavigation';
import apiService from '../services/apiService';
import './Notifications.css';

const Notifications = ({ userLevel = 1, lenderData, onLogout }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationSummary, setNotificationSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
            description: 'Overdue payments (1-30 days)',
            icon: '📅',
            color: 'info'
          },
          {
            title: 'Overdue',
            count: summary.overdue,
            description: 'Critical overdue (30+ days)',
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
        
        // Show success message (you can add a toast notification here)
        console.log('Payment marked as paid successfully');
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
            <button className="refresh-btn" onClick={fetchNotifications} disabled={isLoading}>
              {isLoading ? '🔄' : '↻'} Refresh
            </button>
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
