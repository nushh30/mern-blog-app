const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
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

// Health check endpoint for Docker & Cloud Run
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to MERN Stack Blog Application API',
    endpoints: {
      health: '/health',
      posts: '/api/posts'
    }
  });
});

// API Routes
app.use('/api/posts', postRoutes);

// Connect to Database and start server if not testing
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log(` Connected to MongoDB successfully: ${MONGODB_URI}`);
      app.listen(PORT, () => {
        console.log(` Backend server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error(' MongoDB connection failed:', err.message);
    });
}

module.exports = app;
