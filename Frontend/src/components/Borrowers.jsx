import { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNavigation from './MobileNavigation';
import apiService from '../services/apiService';
import './Borrowers.css';

const Borrowers = ({ userLevel = 1, lenderData, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddBorrowerModal, setShowAddBorrowerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    amount: '',
    interestRate: '',
    dueDate: ''
  });

  const borrowers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      loanAmount: '$25,000',
      interestRate: '8.5%',
      monthlyInterest: '$177.08',
      totalEarned: '$1416.64',
      progress: 65,
      nextDue: '2024-02-15',
      status: 'Current'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      loanAmount: '$15,000',
      interestRate: '9.2%',
      monthlyInterest: '$115',
      totalEarned: '$920',
      progress: 40,
      nextDue: '2024-02-12',
      status: 'Due Soon'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      loanAmount: '$30,000',
      interestRate: '7.8%',
      monthlyInterest: '$195',
      totalEarned: '$2340',
      progress: 80,
      nextDue: '2024-02-20',
      status: 'Current'
    },
    {
      id: 4,
      name: 'Emily Wilson',
      email: 'emily.wilson@email.com',
      loanAmount: '$20,000',
      interestRate: '9.5%',
      monthlyInterest: '$158.33',
      totalEarned: '$950',
      progress: 25,
      nextDue: '2024-02-08',
      status: 'Overdue'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@email.com',
      loanAmount: '$18,000',
      interestRate: '8.2%',
      monthlyInterest: '$123',
      totalEarned: '$1476',
      progress: 75,
      nextDue: '2024-02-18',
      status: 'Current'
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      loanAmount: '$22,000',
      interestRate: '8.8%',
      monthlyInterest: '$161.33',
      totalEarned: '$1936',
      progress: 90,
      nextDue: '2024-02-22',
      status: 'Current'
    }
  ];

  const filterOptions = ['All', 'Current', 'Due', 'Overdue'];

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
      email: '',
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
      email: '',
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
        dueDate: new Date(formData.dueDate).toISOString()
      };

      const response = await apiService.createBorrower(borrowerData);
      
      if (response.success) {
        console.log('✅ Borrower created successfully:', response.data);
        handleCloseModal();
        // TODO: Refresh borrowers list or add to local state
      } else {
        console.error('❌ Failed to create borrower:', response.message);
      }
    } catch (error) {
      console.error('❌ Error creating borrower:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBorrowers = borrowers.filter(borrower => {
    const matchesSearch = borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         borrower.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || borrower.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Current':
        return 'status-current';
      case 'Due Soon':
        return 'status-due';
      case 'Overdue':
        return 'status-overdue';
      default:
        return '';
    }
  };

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
                onClick={() => setFilterStatus(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="borrowers-grid">
          {filteredBorrowers.map((borrower) => (
            <div key={borrower.id} className="borrower-card">
              <div className="borrower-header">
                <div className="borrower-info">
                  <h3>{borrower.name}</h3>
                  <p>{borrower.email}</p>
                </div>
                <span className={`status-badge ${getStatusClass(borrower.status)}`}>
                  {borrower.status}
                </span>
              </div>

              <div className="borrower-details">
                <div className="detail-row">
                  <div className="detail-group">
                    <span className="detail-label">Loan Amount</span>
                    <span className="detail-value">{borrower.loanAmount}</span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">Interest Rate</span>
                    <span className="detail-value">{borrower.interestRate}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-group">
                    <span className="detail-label">Monthly Interest</span>
                    <span className="detail-value green">{borrower.monthlyInterest}</span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">Total Earned</span>
                    <span className="detail-value green">{borrower.totalEarned}</span>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Progress</span>
                    <span className="progress-percentage">{borrower.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${borrower.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="next-due">
                  <span className="due-label">Next Due:</span>
                  <span className="due-date">📅 {borrower.nextDue}</span>
                </div>
              </div>
            </div>
          ))}
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
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john.smith@example.com"
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
    </div>
  );
};

export default Borrowers;
