const mongoose = require('mongoose');

const RECONNECT_INTERVAL = 5000; // 5 seconds between retries
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const URI = process.env.MONGODB_URI;
  if (!URI) {
    console.error('❌ MONGODB_URI not set in .env file. Backend cannot connect to database.');
    return;
  }

  try {
    const conn = await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50,           // Handle up to 50 concurrent connections
      minPoolSize: 5,            // Keep minimum 5 alive always
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto-reconnect on drop
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Auto-reconnecting in 5s...');
      isConnected = false;
      setTimeout(connectDB, RECONNECT_INTERVAL);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB error: ${err.message}`);
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      console.log('✅ MongoDB reconnected successfully!');
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.log(`🔄 Retrying in ${RECONNECT_INTERVAL / 1000}s...`);
    isConnected = false;
    // Retry instead of crashing the server
    setTimeout(connectDB, RECONNECT_INTERVAL);
  }
};

module.exports = connectDB;
