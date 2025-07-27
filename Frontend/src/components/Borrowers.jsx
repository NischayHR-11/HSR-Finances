import { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNavigation from './MobileNavigation';
import './Borrowers.css';

const Borrowers = ({ userLevel = 1, lenderData, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

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
          <button className="add-borrower-btn">
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
    </div>
  );
};

export default Borrowers;
