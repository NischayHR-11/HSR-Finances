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
            title: 'Overdue',
            count: summary.overdue,
            description: 'Immediate action needed',
            icon: '🚨',
            color: 'danger'
          },
          {
            title: 'This Week',
            count: summary.thisWeek,
            description: 'Upcoming payments',
            icon: '📅',
            color: 'info'
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
                        <span className="notification-contact">📞 {notification.phone}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="notification-actions">
                    {['overdue', 'due_today', 'due_soon'].includes(notification.status) && (
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
    </div>
  );
};

export default Notifications;
