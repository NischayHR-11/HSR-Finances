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

  const filterOptions = ['All', 'current', 'due', 'overdue'];

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBorrower = () => {
    setShowAddBorrowerModal(true);
    // Reset form data
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
      const borrowerData = {
        ...formData,
        amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        monthsPaid: parseInt(formData.monthsPaid) || 0,
        dueDate: new Date(formData.dueDate).toISOString()
      };

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

  // Calculate total earned (this would ideally come from backend)
  const calculateTotalEarned = (amount, interestRate, progress) => {
    const monthlyInterest = (amount * interestRate) / 100 / 12;
    const monthsElapsed = Math.floor((progress / 100) * 12); // Assuming 1 year term
    return monthlyInterest * monthsElapsed;
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
        return 'Paid';
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
                 option === 'overdue' ? 'Overdue' : option}
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
              return (
                <div key={borrower._id} className="borrower-card">
                  <div className="borrower-header">
                    <div className="borrower-info">
                      <h3>{borrower.name}</h3>
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
                          <span className="detail-label">Monthly Interest</span>
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
                        <span className="progress-label">{borrower.monthsPaid || 0} / 12 months</span>
                        <span className="progress-streak">🔥 {borrower.monthsPaid || 0}</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${Math.min(((borrower.monthsPaid || 0) / 12) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="next-due">
                      <span className="due-label">Next Due:</span>
                      <span className="due-date">📅 {formatDate(borrower.dueDate)}</span>
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
                  <label htmlFor="monthsPaid">Months Paid</label>
                  <input
                    type="number"
                    id="monthsPaid"
                    name="monthsPaid"
                    value={formData.monthsPaid}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
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
                  <label htmlFor="dueDate">Due Date *</label>
                  <input
                    type="datetime-local"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
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
