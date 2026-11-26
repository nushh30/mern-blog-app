const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const postRoutes = require('./routes/postRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_blog';

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint for Docker, Render & Cloud Run
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/posts', postRoutes);

// Serve static frontend files if public folder exists (for unified Docker deployment)
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Fallback to React index.html for SPA client-side routing, or API info if not static build
app.get('*', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).json({
      message: 'Welcome to MERN Stack Blog Application API',
      endpoints: {
        health: '/health',
        posts: '/api/posts'
      }
    });
  }
});

// Function to connect to MongoDB with automatic retry
const connectWithRetry = () => {
  console.log(`📡 Connecting to MongoDB: ${MONGODB_URI}`);
  mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    })
    .then(() => {
      console.log('✅ Connected to MongoDB successfully!');
    })
    .catch((err) => {
      console.error('⚠️ MongoDB connection issue:', err.message);
      console.log('🔄 Will retry connecting in 10 seconds...');
      setTimeout(connectWithRetry, 10000);
    });
};

// Start Express server immediately so Render health check always passes
if (require.main === module && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on port ${PORT}`);
    // Connect to database in the background without blocking the HTTP server
    connectWithRetry();
  });
}

module.exports = app;
