const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  // 1. Try environment MONGODB_URI if provided (e.g. MongoDB Atlas)
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log(`[Database] Connected to remote MongoDB at ${mongoose.connection.host}`);
      return;
    } catch (err) {
      console.warn('[Database] Remote MONGODB_URI connection failed:', err.message);
    }
  }

  // 2. Try local MongoDB if running
  const localUri = 'mongodb://127.0.0.1:27017/civicpulse_ai';
  try {
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 1500 });
    console.log(`[Database] Connected to local MongoDB at ${mongoose.connection.host}`);
    return;
  } catch (err) {
    console.warn('[Database] Local MongoDB not active. Initializing MongoMemoryServer (MongoDB 7.0.3)...');
  }

  // 3. Fallback to MongoMemoryServer with explicit Debian 12+ compatible version 7.0.3
  try {
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.3'
      }
    });
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log(`[Database] Connected to MongoMemoryServer at ${mongoUri}`);
  } catch (memErr) {
    console.error('[Database] MongoMemoryServer initialization error:', memErr.message);
    console.warn('[Database] Application starting server without blocking...');
  }
};

module.exports = connectDB;
