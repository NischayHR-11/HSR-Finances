const mongoose = require('mongoose');

// Lender (Client) Schema
const lenderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  totalMoneyLent: {
    type: Number,
    default: 0
  },
  monthlyInterest: {
    type: Number,
    default: 0
  },
  activeLoans: {
    type: Number,
    default: 0
  },
  onTimeRate: {
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
const Lender = mongoose.model('Lender', lenderSchema);

module.exports = Lender;
