import { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNavigation from './MobileNavigation';
import './Notifications.css';

const Notifications = ({ userLevel = 1, lenderData }) => {

  const notificationSummary = [
    {
      title: 'Due Today',
      count: 2,
      description: 'Payments requiring attention',
      icon: '⚠️',
      color: 'warning'
    },
    {
      title: 'Overdue',
      count: 1,
      description: 'Immediate action needed',
      icon: '⚠️',
      color: 'danger'
    },
    {
      title: 'This Week',
      count: 4,
      description: 'Upcoming payments',
      icon: '📅',
      color: 'info'
    }
  ];

  const recentNotifications = [
    {
      id: 1,
      name: 'Sarah Johnson',
      type: 'Payment Due',
      message: 'Monthly interest payment is due in 2 days',
      amount: '$115',
      date: '2024-02-12',
      time: '2 hours ago',
      priority: 'high',
      status: 'unread'
    },
    {
      id: 2,
      name: 'Emily Wilson',
      type: 'Overdue Payment',
      message: 'Payment is 2 days overdue',
      amount: '$133.33',
      date: '2024-02-10',
      time: '1 day ago',
      priority: 'urgent',
      status: 'unread'
    },
    {
      id: 3,
      name: 'John Smith',
      type: 'Payment Received',
      message: 'Monthly payment received successfully',
      amount: '$177.08',
      date: '2024-02-15',
      time: '3 hours ago',
      priority: 'normal',
      status: 'read'
    },
    {
      id: 4,
      name: 'Mike Davis',
      type: 'Payment Reminder',
      message: 'Payment due in 5 days',
      amount: '$195',
      date: '2024-02-20',
      time: '1 day ago',
      priority: 'normal',
      status: 'unread'
    },
    {
      id: 5,
      name: 'David Brown',
      type: 'Payment Received',
      message: 'Monthly payment received successfully',
      amount: '$123',
      date: '2024-02-18',
      time: '2 days ago',
      priority: 'normal',
      status: 'read'
    }
  ];

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

  const markAsRead = (id) => {
    // Implementation for marking notification as read
    console.log('Mark as read:', id);
  };

  const dismissNotification = (id) => {
    // Implementation for dismissing notification
    console.log('Dismiss notification:', id);
  };

  return (
    <div className="notifications">
      <MobileNavigation userLevel={userLevel} lenderData={lenderData} />
      
      <div className="page-content">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated on payment schedules and activities</p>
          </div>
          <div className="unread-count">
            3 unread
          </div>
        </div>

      <div className="notification-summary">
        {notificationSummary.map((item, index) => (
          <div key={index} className={`summary-card summary-${item.color}`}>
            <div className="summary-icon">{item.icon}</div>
            <div className="summary-content">
              <div className="summary-header">
                <span className="summary-title">{item.title}</span>
                <span className="summary-count">{item.count}</span>
              </div>
              <p className="summary-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="notifications-section">
        <div className="section-header">
          <h2>🔔 Recent Notifications</h2>
          <button className="mark-all-read-btn">Mark All Read</button>
        </div>

        <div className="notifications-list">
          {recentNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-card ${notification.status === 'unread' ? 'unread' : ''} ${getPriorityClass(notification.priority)}`}
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
                    <span className="notification-time">{notification.time}</span>
                  </div>
                </div>
                
                <p className="notification-message">{notification.message}</p>
                
                <div className="notification-details">
                  <span className="notification-date">📅 {notification.date}</span>
                </div>
              </div>
              
              <div className="notification-actions">
                {notification.status === 'unread' && (
                  <button 
                    className="action-btn mark-read-btn"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark Read
                  </button>
                )}
                <button 
                  className="action-btn dismiss-btn"
                  onClick={() => dismissNotification(notification.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Notifications;
