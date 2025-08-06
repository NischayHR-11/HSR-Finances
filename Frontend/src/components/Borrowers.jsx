import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MobileNavigation from './MobileNavigation';
import apiService from '../services/apiService';
import './Borrowers.css';

const Borrowers = ({ userLevel = 1, lenderData, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddBorrowerModal, setShowAddBorrowerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [borrowers, setBorrowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    monthsPaid: '',
    phone: '',
    address: '',
    amount: '',
    interestRate: '',
    dueDate: ''
  });
  
  // Copy popup state
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  const filterOptions = ['All', 'current', 'due', 'overdue', 'paid'];

  // Fetch borrowers from API
  const fetchBorrowers = async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Map frontend filter to backend status
      const apiParams = {
        ...params,
        limit: 50 // Get more records for better UX
      };
      
      // Map filter status to backend format
      if (filterStatus !== 'All') {
        apiParams.status = filterStatus.toLowerCase();
      }
      
      // Add search term if present (only send to backend for basic filtering)
      // Client-side filtering will handle the detailed search
      if (searchTerm.trim() && searchTerm.trim().length > 2) {
        apiParams.search = searchTerm.trim();
      }

      console.log('🔍 Fetching borrowers with params:', apiParams);
      const response = await apiService.getBorrowers(apiParams);
      
      if (response.success) {
        console.log('✅ Borrowers fetched successfully:', response.data);
        setBorrowers(response.data.borrowers || []);
        setPagination(response.data.pagination || {
          current: 1,
          pages: 1,
          total: response.data.borrowers?.length || 0
        });
      } else {
        console.error('❌ Failed to fetch borrowers:', response.message);
        setError(response.message || 'Failed to fetch borrowers');
      }
    } catch (error) {
      console.error('❌ Error fetching borrowers:', error);
      setError('Unable to load borrowers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load borrowers on component mount
  useEffect(() => {
    fetchBorrowers();
  }, []);

  // Refetch when filter or search changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchBorrowers();
    }, searchTerm.trim() ? 500 : 100); // Longer debounce for search, shorter for filters

    return () => clearTimeout(debounceTimer);
  }, [filterStatus, searchTerm]);

  // Form handling functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = {
      ...formData,
      [name]: value
    };
    
    // Auto-calculate months paid when due date changes
    if (name === 'dueDate' && value) {
      const monthsPaid = calculateMonthsPaid(value);
      updatedFormData.monthsPaid = monthsPaid.toString();
    }
    
    setFormData(updatedFormData);
  };

  const handleAddBorrower = () => {
    setShowAddBorrowerModal(true);
    
    // Set default start date to today (not next month) to make it easier to set past dates
    const today = new Date();
    const defaultStartDate = today.toISOString().slice(0, 16); // Format for datetime-local input
    
    // Reset form data with default start date
    setFormData({
      name: '',
      monthsPaid: '0',
      phone: '',
      address: '',
      amount: '',
      interestRate: '',
      dueDate: defaultStartDate
    });
  };

  const handleCloseModal = () => {
    setShowAddBorrowerModal(false);
    setFormData({
      name: '',
      monthsPaid: '',
      phone: '',
      address: '',
      amount: '',
      interestRate: '',
      dueDate: ''
    });
  };

  const handleSubmitBorrower = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert amount and interestRate to numbers
      // For dueDate, ensure we preserve the exact date selected without timezone conversion
      const selectedDate = new Date(formData.dueDate);
      // Create a new date in UTC with the same year, month, day, hour, minute
      const utcDate = new Date(Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedDate.getHours(),
        selectedDate.getMinutes()
      ));
      
      const borrowerData = {
        ...formData,
        amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        monthsPaid: parseInt(formData.monthsPaid) || 0,
        dueDate: utcDate.toISOString()
      };

      console.log('📅 Form date handling:', {
        originalInput: formData.dueDate,
        selectedDate: selectedDate.toString(),
        utcDate: utcDate.toISOString(),
        localDateString: selectedDate.toLocaleDateString()
      });

      const response = await apiService.createBorrower(borrowerData);
      
      if (response.success) {
        console.log('✅ Borrower created successfully:', response.data);
        handleCloseModal();
        // Refresh borrowers list
        await fetchBorrowers();
      } else {
        console.error('❌ Failed to create borrower:', response.message);
      }
    } catch (error) {
      console.error('❌ Error creating borrower:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Handle delete borrower
  const handleDeleteBorrower = async (borrowerId, borrowerName) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${borrowerName}? This action cannot be undone.`);
    
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await apiService.deleteBorrower(borrowerId);
      
      if (response.success) {
        console.log('✅ Borrower deleted successfully');
        // Refresh borrowers list
        await fetchBorrowers();
      } else {
        console.error('❌ Failed to delete borrower:', response.message);
        alert('Failed to delete borrower. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error deleting borrower:', error);
      alert('Error deleting borrower. Please try again.');
    }
  };

  // Format currency values
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (rate) => {
    return `${rate}%`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate total earned with new logic (upfront profit + monthly payments received)
  const calculateTotalEarned = (amount, interestRate, progress) => {
    // 20% upfront profit
    const upfrontProfit = amount * 0.20;
    
    // Monthly payment (original amount / 10 months)
    const monthlyPayment = amount / 10;
    
    // Months elapsed based on progress (now out of 10 months, not 12)
    const monthsElapsed = Math.floor((progress / 100) * 10);
    
    // Total earned = upfront profit + (monthly payments * months elapsed)
    return upfrontProfit + (monthlyPayment * monthsElapsed);
  };

  // Calculate months paid based on account start date vs today
  const calculateMonthsPaid = (startDate) => {
    if (!startDate) return 0;
    
    const today = new Date();
    const accountStart = new Date(startDate);
    
    // If account starts in the future, return 0
    if (accountStart > today) return 0;
    
    // Calculate difference in months
    const yearDiff = today.getFullYear() - accountStart.getFullYear();
    const monthDiff = today.getMonth() - accountStart.getMonth();
    const dayDiff = today.getDate() - accountStart.getDate();
    
    let totalMonths = yearDiff * 12 + monthDiff;
    
    // If we haven't reached the day of the month yet, subtract one month
    if (dayDiff < 0) {
      totalMonths -= 1;
    }
    
    // Debug logging for troubleshooting
    console.log(`📅 Month calculation: start=${accountStart.toISOString()}, today=${today.toISOString()}, result=${totalMonths}`);
    
    // Ensure it's not negative and not more than 10 (max loan term)
    return Math.max(0, Math.min(totalMonths, 10));
  };

  // Calculate next due date based on payment status
  const calculateNextDueDate = (startDate, monthsPaid = 0, paidThisMonth = false) => {
    const accountStart = new Date(startDate);
    const now = new Date();
    
    // Calculate months since account creation
    const startMonth = new Date(accountStart.getFullYear(), accountStart.getMonth(), 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthsSinceStart = Math.max(0, (currentMonth.getFullYear() - startMonth.getFullYear()) * 12 + (currentMonth.getMonth() - startMonth.getMonth()));
    
    // Determine target month for next due date
    let targetMonth;
    
    if (monthsSinceStart === 0) {
      // Still in the creation month - next due is creation month (same month as account start)
      targetMonth = 0;
    } else if (!paidThisMonth) {
      // Haven't paid this month - show current month's due date
      // The due date should be the same day as account creation but in current month
      targetMonth = monthsSinceStart;
    } else {
      // Paid this month - show next month's due date
      targetMonth = monthsSinceStart + 1;
    }
    
    // Create next due date: keep the same day as account creation, but in the target month
    const nextDue = new Date(accountStart);
    nextDue.setMonth(accountStart.getMonth() + targetMonth);
    
    // Debug logging
    console.log(`📅 Next Due Calculation:`, {
      accountStart: accountStart.toDateString(),
      now: now.toDateString(),
      monthsSinceStart,
      paidThisMonth,
      targetMonth,
      nextDue: nextDue.toDateString()
    });
    
    return nextDue;
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'current':
        return 'status-current';
      case 'due':
        return 'status-due';
      case 'overdue':
        return 'status-overdue';
      case 'paid':
        return 'status-paid';
      default:
        return '';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'current':
        return 'Current';
      case 'due':
        return 'Due Soon';
      case 'overdue':
        return 'Overdue';
      case 'paid':
        return 'Completed';
      default:
        return status;
    }
  };

  // Client-side filtering for additional search functionality
  const filteredBorrowers = borrowers.filter(borrower => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    // Search in multiple fields
    const searchableFields = [
      borrower.name,
      borrower.phone,
      borrower.address
    ].filter(Boolean); // Remove null/undefined values
    
    return searchableFields.some(field => 
      field.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="borrowers">
      <MobileNavigation userLevel={userLevel} lenderData={lenderData} onLogout={onLogout} />
      
      <div className="page-content">
        <div className="borrowers-header">
          <div>
            <h1>Borrowers</h1>
            <p>Manage your lending portfolio and track payments</p>
          </div>
          <button className="add-borrower-btn" onClick={handleAddBorrower}>
            + Add Borrower
          </button>
        </div>

        <div className="borrowers-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search borrowers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            {filterOptions.map((option) => (
              <button
                key={option}
                className={`filter-btn ${filterStatus === option ? 'active' : ''}`}
                onClick={() => {
                  console.log('🔄 Filter clicked:', option);
                  setFilterStatus(option);
                }}
              >
                {option === 'current' ? 'Current' : 
                 option === 'due' ? 'Due' : 
                 option === 'overdue' ? 'Overdue' : 
                 option === 'paid' ? 'Completed' : option}
              </button>
            ))}
          </div>
        </div>

        <div className="borrowers-grid">
          {isLoading ? (
            // Loading skeleton
            <div className="loading-container">
              <div className="loading-message">
                <div className="loading-spinner"></div>
                <p>Loading borrowers...</p>
              </div>
            </div>
          ) : error ? (
            // Error state
            <div className="error-container">
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
                <button className="retry-btn" onClick={() => fetchBorrowers()}>
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredBorrowers.length === 0 ? (
            // Empty state
            <div className="empty-container">
              <div className="empty-message">
                <span className="empty-icon">👥</span>
                <h3>No borrowers found</h3>
                <p>
                  {searchTerm || filterStatus !== 'All' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start by adding your first borrower'
                  }
                </p>
                {(!searchTerm && filterStatus === 'All') && (
                  <button className="add-first-borrower-btn" onClick={handleAddBorrower}>
                    + Add Your First Borrower
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Borrowers list
            filteredBorrowers.map((borrower) => {
              const totalEarned = calculateTotalEarned(borrower.amount, borrower.interestRate, borrower.progress);
              // Calculate next due date based on payment status
              const nextDueDate = calculateNextDueDate(
                borrower.dueDate, 
                borrower.monthsPaid, 
                borrower.paidThisMonth || false // Default to false if not present
              );
              
              // Debug log the borrower data
              console.log(`🔍 Borrower ${borrower.name} (ID: ${borrower._id?.slice(-6)}):`, {
                dueDate: borrower.dueDate,
                createdAt: borrower.createdAt,
                monthsPaid: borrower.monthsPaid,
                paidThisMonth: borrower.paidThisMonth,
                status: borrower.status,
                fullBorrowerObject: borrower
              });
              return (
                <div key={borrower._id} className="borrower-card">
                  <div className="borrower-header">
                    <div className="borrower-info">
                      <h3>{borrower.name} <small style={{color: '#666', fontSize: '12px'}}>({borrower._id?.slice(-6)})</small></h3>
                      <div className="borrower-phone">
                        <span className="phone-number">📞 {borrower.phone}</span>
                        <button 
                          className="copy-phone-btn"
                          onClick={() => handleCopyPhone(borrower.phone)}
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
                    </div>
                    <div className="borrower-header-actions">
                      <span className={`status-badge ${getStatusClass(borrower.status)}`}>
                        {getStatusDisplay(borrower.status)}
                      </span>
                      <button 
                        className="delete-borrower-btn"
                        onClick={() => handleDeleteBorrower(borrower._id, borrower.name)}
                        title={`Delete ${borrower.name}`}
                      >
                        <svg viewBox="0 0 24 28" fill="currentColor" className="trash-icon">
                          <path d="M8 2V4H4V6H6V24C6 25.1 6.9 26 8 26H18C19.1 26 20 25.1 20 24V6H22V4H18V2C18 0.9 17.1 0 16 0H10C8.9 0 8 0.9 8 2ZM10 2H16V4H10V2ZM8 6H18V24H8V6ZM10 8V22H12V8H10ZM14 8V22H16V8H14Z"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="borrower-details">
                    <div className="detail-row loan-interest-row">
                      <div className="loan-interest-left">
                        <div className="detail-group">
                          <span className="detail-label">Loan Amount</span>
                          <span className="detail-value">{formatCurrency(borrower.amount)}</span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">Interest Rate</span>
                          <span className="detail-value">{formatPercentage(borrower.interestRate)}</span>
                        </div>
                      </div>
                      <div className="loan-interest-right">
                        <div className="detail-group">
                          <span className="detail-label">Monthly Payment</span>
                          <span className="detail-value green">{formatCurrency(borrower.monthlyInterest)}</span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">Total Earned</span>
                          <span className="detail-value green">{formatCurrency(totalEarned)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="address-row">
                      <div className="detail-group">
                        <span className="detail-label">Address</span>
                        <span className="detail-value">{borrower.address || 'Not provided'}</span>
                      </div>
                    </div>

                    <div className="progress-section">
                      <div className="progress-header">
                        <span className="progress-label">{borrower.monthsPaid || 0} / 10 months</span>
                        <span className="progress-streak">🔥 {borrower.monthsPaid || 0}</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${Math.min(((borrower.monthsPaid || 0) / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="next-due">
                      {borrower.monthsPaid >= 10 ? (
                        <>
                          <span className="due-label">Status:</span>
                          <span className="due-date completed">🎉 Loan Completed!</span>
                        </>
                      ) : (
                        <>
                          <span className="due-label">Next Due:</span>
                          <span className="due-date">📅 {formatDate(nextDueDate)}</span>
                          <br />
                          <small style={{color: '#666', fontSize: '11px'}}>
                            Account created: {formatDate(borrower.dueDate)} | Current date used: {formatDate(borrower.createdAt || borrower.dueDate)}
                          </small>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Borrower Modal */}
      {showAddBorrowerModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Borrower</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitBorrower} className="borrower-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1-555-0123"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Loan Amount *</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="10000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="interestRate">Interest Rate (%) *</label>
                  <input
                    type="number"
                    id="interestRate"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    placeholder="12"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="dueDate">Account Start Date *</label>
                  <input
                    type="datetime-local"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    This determines when the borrowing account started and auto-calculates months paid
                  </small>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Borrower'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
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

export default Borrowers;
