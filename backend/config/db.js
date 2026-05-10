const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/traveloop';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✓ MongoDB Connected Successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
