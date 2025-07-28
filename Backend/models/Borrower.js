const mongoose = require('mongoose');

// Borrower Schema
const borrowerSchema = new mongoose.Schema({
  lenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lender',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  monthsPaid: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  monthlyInterest: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['current', 'due', 'paid', 'overdue'],
    default: 'current'
  },
  dueDate: {
    type: Date,
    required: true
  },
  avatar: {
    type: String,
    default: function() {
      return this.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
  },
  streak: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the model
const Borrower = mongoose.model('Borrower', borrowerSchema);

module.exports = Borrower;
