// test-models.js - Test file to verify model imports work correctly

require('dotenv').config();
const mongoose = require('mongoose');

// Test model imports
try {
  const { Lender, Borrower } = require('./models');
  
  console.log('✅ Models imported successfully!');
  console.log('Lender model:', typeof Lender);
  console.log('Borrower model:', typeof Borrower);
  
  // Test MongoDB connection
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('✅ All tests passed! The modular structure is working correctly.');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
  
} catch (error) {
  console.log('❌ Error importing models:', error.message);
  process.exit(1);
}
