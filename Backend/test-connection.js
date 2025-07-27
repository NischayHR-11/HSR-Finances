const mongoose = require('mongoose');
require('dotenv').config();

// Test MongoDB connection
async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    
    // Test JWT secret
    if (process.env.JWT_SECRET) {
      console.log('✅ JWT Secret configured');
    } else {
      console.log('❌ JWT Secret not configured');
    }
    
    // List all environment variables
    console.log('\n📋 Environment Configuration:');
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`PORT: ${process.env.PORT}`);
    console.log(`MONGODB_URI: ${process.env.MONGODB_URI}`);
    console.log(`JWT_EXPIRE: ${process.env.JWT_EXPIRE}`);
    console.log(`APP_NAME: ${process.env.APP_NAME}`);
    console.log(`API_VERSION: ${process.env.API_VERSION}`);
    
    await mongoose.disconnect();
    console.log('\n✅ Connection test completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
