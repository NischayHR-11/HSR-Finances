const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite default port (development)
    'http://localhost:3000', // React default port (development)
    'http://127.0.0.1:5173', // Alternative localhost (development)
    'http://127.0.0.1:3000', // Alternative localhost (development)
    'https://hsr-finances.nischay.tech', // Production frontend URL
    'https://hsr-finances.nischay.tech/', // Production frontend URL with trailing slash
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Log CORS configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 CORS Origins allowed:', corsOptions.origin);
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// ===== MODELS =====

// Import models from separate files
const { Lender, Borrower } = require('./models');

// ===== MIDDLEWARE =====

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token is required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const lender = await Lender.findById(decoded.id).select('-password');
    
    if (!lender) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    req.lender = lender;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

//===== UTILITY FUNCTIONS =====

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Hash Password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare Password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Update Borrower Statuses Based on Due Dates
const updateBorrowerStatuses = async (lenderId = null) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get borrowers (all or for specific lender)
    const query = lenderId ? { lenderId } : {};
    const borrowers = await Borrower.find(query);

    let updatedCount = 0;

    for (const borrower of borrowers) {
      const dueDate = new Date(borrower.dueDate);
      const timeDiff = dueDate - today;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      let newStatus = borrower.status;
      
      if (daysDiff < -30) {
        // More than 1 month overdue
        newStatus = 'overdue';
      } else if (daysDiff < 0) {
        // Up to 1 month overdue (due section)
        newStatus = 'due';
      } else {
        // Current or future payments
        newStatus = 'current';
      }

      // Update status if it has changed
      if (newStatus !== borrower.status) {
        await Borrower.findByIdAndUpdate(borrower._id, {
          status: newStatus,
          updatedAt: Date.now()
        });
        updatedCount++;
      }
    }

    if (lenderId) {
      console.log(`✅ Updated ${updatedCount} borrower statuses for lender ${lenderId}`);
    } else {
      console.log(`✅ Updated ${updatedCount} borrower statuses globally`);
    }
    
    return updatedCount;
  } catch (error) {
    console.error('❌ Error updating borrower statuses:', error);
    throw error;
  }
};

// ===== ROUTES =====

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'HSR-Finances API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1'
  });
});

// ===== AUTHENTICATION ROUTES =====

// Register Lender
app.post('/api/auth/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, phone } = req.body;

    // Check if lender already exists
    const existingLender = await Lender.findOne({ email });
    if (existingLender) {
      return res.status(400).json({
        success: false,
        message: 'Lender with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new lender
    const lender = new Lender({
      name,
      email,
      password: hashedPassword,
      phone
    });

    await lender.save();

    // Generate token
    const token = generateToken(lender._id);

    res.status(201).json({
      success: true,
      message: 'Lender registered successfully',
      data: {
        lender: {
          id: lender._id,
          name: lender.name,
          email: lender.email,
          phone: lender.phone,
          totalMoneyLent: lender.totalMoneyLent,
          monthlyInterest: lender.monthlyInterest,
          activeLoans: lender.activeLoans,
          onTimeRate: lender.onTimeRate,
          createdAt: lender.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login Lender
app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find lender by email
    const lender = await Lender.findOne({ email });
    if (!lender) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await comparePassword(password, lender.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(lender._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        lender: {
          id: lender._id,
          name: lender.name,
          email: lender.email,
          phone: lender.phone,
          totalMoneyLent: lender.totalMoneyLent,
          monthlyInterest: lender.monthlyInterest,
          activeLoans: lender.activeLoans,
          onTimeRate: lender.onTimeRate,
          createdAt: lender.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get Current Lender Profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        lender: {
          id: req.lender._id,
          name: req.lender.name,
          email: req.lender.email,
          phone: req.lender.phone,
          totalMoneyLent: req.lender.totalMoneyLent,
          monthlyInterest: req.lender.monthlyInterest,
          activeLoans: req.lender.activeLoans,
          onTimeRate: req.lender.onTimeRate,
          createdAt: req.lender.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// ===== LENDER ROUTES =====

// Update Lender Profile
app.put('/api/lender/profile', authenticateToken, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone } = req.body;
    const updateData = { updatedAt: Date.now() };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    // Check if email is being updated and already exists
    if (email && email !== req.lender.email) {
      const existingLender = await Lender.findOne({ email });
      if (existingLender) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const updatedLender = await Lender.findByIdAndUpdate(
      req.lender._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { lender: updatedLender }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// Get Dashboard Statistics
app.get('/api/lender/dashboard', authenticateToken, async (req, res) => {
  try {
    // Update borrower statuses for this lender first
    await updateBorrowerStatuses(req.lender._id);
    
    const borrowers = await Borrower.find({ lenderId: req.lender._id });
    
    // Calculate statistics
    const totalMoneyLent = borrowers.reduce((sum, borrower) => sum + borrower.amount, 0);
    const monthlyInterest = borrowers.reduce((sum, borrower) => sum + borrower.monthlyInterest, 0);
    const totalProfit = borrowers.reduce((sum, borrower) => sum + (borrower.amount * 0.20), 0);
    const activeLoans = borrowers.filter(b => b.status === 'current' || b.status === 'due').length;
    const onTimePayments = borrowers.filter(b => b.status === 'current').length;
    const onTimeRate = borrowers.length > 0 ? Math.round((onTimePayments / borrowers.length) * 100) : 0;

    // Update lender statistics
    await Lender.findByIdAndUpdate(req.lender._id, {
      totalMoneyLent,
      monthlyInterest,
      activeLoans,
      onTimeRate,
      updatedAt: Date.now()
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalMoneyLent,
          monthlyInterest,
          totalProfit,
          activeLoans,
          onTimeRate
        },
        recentBorrowers: borrowers.slice(-5) // Last 5 borrowers
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// ===== BORROWER ROUTES =====

// Get All Borrowers for Lender
app.get('/api/borrowers', authenticateToken, async (req, res) => {
  try {
    // Update borrower statuses for this lender before fetching
    await updateBorrowerStatuses(req.lender._id);

    const { page = 1, limit = 10, status, search } = req.query;
    const query = { lenderId: req.lender._id };

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const borrowers = await Borrower.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Borrower.countDocuments(query);

    res.json({
      success: true,
      data: {
        borrowers,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get borrowers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching borrowers'
    });
  }
});

// Get Single Borrower
app.get('/api/borrowers/:id', authenticateToken, async (req, res) => {
  try {
    const borrower = await Borrower.findOne({
      _id: req.params.id,
      lenderId: req.lender._id
    });

    if (!borrower) {
      return res.status(404).json({
        success: false,
        message: 'Borrower not found'
      });
    }

    res.json({
      success: true,
      data: { borrower }
    });

  } catch (error) {
    console.error('Get borrower error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching borrower'
    });
  }
});

// Create New Borrower
app.post('/api/borrowers', authenticateToken, [
  body('name').notEmpty().withMessage('Name is required'),
  body('monthsPaid').optional().isNumeric().withMessage('Months paid must be a number'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('interestRate').isNumeric().withMessage('Interest rate must be a number'),
  body('dueDate').isISO8601().withMessage('Please provide a valid due date'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, monthsPaid, phone, address, amount, interestRate, dueDate } = req.body;

    // Calculate upfront profit (20% of loan amount)
    const upfrontProfit = amount * 0.20;
    
    // Calculate monthly payment (original amount / 10 months)
    const monthlyPayment = amount / 10;

    // Create borrower
    const borrower = new Borrower({
      lenderId: req.lender._id,
      name,
      monthsPaid: monthsPaid || 0,
      phone,
      address,
      amount,
      interestRate,
      monthlyInterest: monthlyPayment, // Keep field name for compatibility, but it's now monthly payment
      upfrontProfit,
      dueDate: new Date(dueDate)
    });

    await borrower.save();

    res.status(201).json({
      success: true,
      message: 'Borrower created successfully',
      data: { borrower }
    });

  } catch (error) {
    console.error('Create borrower error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating borrower'
    });
  }
});

// Update Borrower
app.put('/api/borrowers/:id', authenticateToken, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('monthsPaid').optional().isNumeric().withMessage('Months paid must be a number'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('interestRate').optional().isNumeric().withMessage('Interest rate must be a number'),
  body('progress').optional().isNumeric().withMessage('Progress must be a number'),
  body('status').optional().isIn(['current', 'due', 'paid', 'overdue']).withMessage('Invalid status'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const borrower = await Borrower.findOne({
      _id: req.params.id,
      lenderId: req.lender._id
    });

    if (!borrower) {
      return res.status(404).json({
        success: false,
        message: 'Borrower not found'
      });
    }

    const updateData = { ...req.body, updatedAt: Date.now() };

    // Recalculate monthly payment and upfront profit if amount or interest rate changed
    if (updateData.amount || updateData.interestRate) {
      const amount = updateData.amount || borrower.amount;
      const interestRate = updateData.interestRate || borrower.interestRate;
      
      // Calculate upfront profit (20% of loan amount)
      updateData.upfrontProfit = amount * 0.20;
      
      // Calculate monthly payment (original amount / 10 months)
      updateData.monthlyInterest = amount / 10; // Keep field name for compatibility
    }

    const updatedBorrower = await Borrower.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Borrower updated successfully',
      data: { borrower: updatedBorrower }
    });

  } catch (error) {
    console.error('Update borrower error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating borrower'
    });
  }
});

// Delete Borrower
app.delete('/api/borrowers/:id', authenticateToken, async (req, res) => {
  try {
    const borrower = await Borrower.findOneAndDelete({
      _id: req.params.id,
      lenderId: req.lender._id
    });

    if (!borrower) {
      return res.status(404).json({
        success: false,
        message: 'Borrower not found'
      });
    }

    res.json({
      success: true,
      message: 'Borrower deleted successfully'
    });

  } catch (error) {
    console.error('Delete borrower error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting borrower'
    });
  }
});

// ===== NOTIFICATION ROUTES =====

// Update Borrower Statuses
app.put('/api/borrowers/update-statuses', authenticateToken, async (req, res) => {
  try {
    await updateBorrowerStatuses();
    res.json({
      success: true,
      message: 'Borrower statuses updated successfully'
    });
  } catch (error) {
    console.error('Update statuses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating borrower statuses'
    });
  }
});

// Get Due Date Notifications
app.get('/api/notifications/due', authenticateToken, async (req, res) => {
  try {
    // Update borrower statuses for this lender first
    await updateBorrowerStatuses(req.lender._id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all borrowers for this lender
    const borrowers = await Borrower.find({
      lenderId: req.lender._id,
      status: { $in: ['current', 'due', 'overdue'] }
    }).sort({ dueDate: 1 });

    const notifications = [];

    for (const borrower of borrowers) {
      const dueDate = new Date(borrower.dueDate);
      const timeDiff = dueDate - today;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      let status, message, priority, type, shouldNotify = false;
      
      if (borrower.status === 'overdue') {
        // More than 1 month overdue
        status = 'overdue';
        type = 'Overdue Payment';
        const monthsOverdue = Math.ceil(Math.abs(daysDiff) / 30);
        message = `Payment is ${monthsOverdue} month${monthsOverdue > 1 ? 's' : ''} overdue`;
        priority = 'urgent';
        shouldNotify = true;
      } else if (borrower.status === 'due') {
        // Up to 1 month overdue (due section)
        status = 'due';
        type = 'Payment Due';
        const daysOverdue = Math.abs(daysDiff);
        if (daysOverdue === 0) {
          message = 'Monthly payment is due today';
        } else {
          message = `Payment is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`;
        }
        priority = 'high';
        shouldNotify = true;
      } else if (borrower.status === 'current' && daysDiff <= 7) {
        // Due this week (current month payment)
        status = 'due_soon';
        type = 'Monthly Payment Due';
        if (daysDiff === 0) {
          message = 'Monthly payment is due today';
        } else {
          message = `Monthly payment due in ${daysDiff} day${daysDiff > 1 ? 's' : ''}`;
        }
        priority = 'high';
        shouldNotify = true;
      }

      // Only add to notifications if it should be notified
      if (shouldNotify) {
        notifications.push({
          id: borrower._id,
          borrowerId: borrower._id,
          name: borrower.name,
          type,
          message,
          amount: `$${borrower.monthlyInterest?.toFixed(2) || '0.00'}`,
          dueDate: borrower.dueDate,
          priority,
          status,
          phone: borrower.phone,
          address: borrower.address
        });
      }
    }

    // Calculate summary statistics
    const summary = {
      dueToday: notifications.filter(n => n.status === 'due_soon' && n.message.includes('today')).length,
      due: notifications.filter(n => n.status === 'due').length,
      overdue: notifications.filter(n => n.status === 'overdue').length,
      thisMonth: notifications.filter(n => ['due_soon', 'due'].includes(n.status)).length
    };

    res.json({
      success: true,
      data: {
        notifications,
        summary
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
});

// Mark Payment as Paid
app.put('/api/notifications/paid/:id', authenticateToken, async (req, res) => {
  try {
    const borrowerId = req.params.id;
    
    const borrower = await Borrower.findOne({
      _id: borrowerId,
      lenderId: req.lender._id
    });

    if (!borrower) {
      return res.status(404).json({
        success: false,
        message: 'Borrower not found'
      });
    }

    // Update borrower's months paid and due date
    const currentMonthsPaid = borrower.monthsPaid || 0;
    const newDueDate = new Date(borrower.dueDate);
    newDueDate.setMonth(newDueDate.getMonth() + 1);

    const updatedBorrower = await Borrower.findByIdAndUpdate(
      borrowerId,
      {
        monthsPaid: currentMonthsPaid + 1,
        dueDate: newDueDate,
        status: 'current',
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Payment marked as paid successfully',
      data: { borrower: updatedBorrower }
    });

  } catch (error) {
    console.error('Mark paid error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking payment as paid'
    });
  }
});

// ===== ERROR HANDLING =====

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// ===== SERVER START =====

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║        HSR-Finances Backend          ║
║                                      ║
║  Server running on port ${PORT}      ║
║  Environment: ${process.env.NODE_ENV}           ║
║  API Version: ${process.env.API_VERSION}               ║
║                                      ║
║  Health Check: http://localhost:${PORT}/api/health
╚══════════════════════════════════════╝
  `);
});

module.exports = app;
