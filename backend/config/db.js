const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civicpulse_ai';
  try {
    // Set low timeout to quickly fallback to memory server if local Mongo is not running
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[Database] Connected to MongoDB at ${mongoose.connection.host}`);
  } catch (err) {
    console.warn('[Database] Local MongoDB connection failed or not running. Initializing MongoMemoryServer fallback...');
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`[Database] Connected to MongoMemoryServer at ${mongoUri}`);
    } catch (memErr) {
      console.error('[Database] MongoMemoryServer error:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
