const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const analyzeRoutes = require('./routes/analyze');
const issuesRoutes = require('./routes/issues');
const dashboardRoutes = require('./routes/dashboard');
const Issue = require('./models/Issue');
const { seedIssues } = require('./utils/seed');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// API Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'CivicPulse AI Backend API',
    timestamp: new Date().toISOString(),
    aiEngine: (process.env.GEMINI_API_KEY || process.env.AI_API_KEY) ? 'Gemini AI Active' : 'Deterministic Rule Engine Fallback'
  });
});

// Auto Seed on Startup if database is empty
async function autoSeedIfEmpty() {
  try {
    const count = await Issue.countDocuments();
    if (count === 0) {
      console.log('[Server] Database is empty. Seeding initial demo civic issues...');
      await Issue.insertMany(seedIssues);
      console.log(`[Server] Auto-seeded ${seedIssues.length} demo records successfully.`);
    }
  } catch (err) {
    console.error('[Server] Auto-seed check failed:', err.message);
  }
}

// Start Server
async function startServer() {
  await connectDB();
  await autoSeedIfEmpty();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 CivicPulse AI Backend running on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

startServer();
