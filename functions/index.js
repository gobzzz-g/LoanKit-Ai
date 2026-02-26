/**
 * LoanKit AI - Firebase Cloud Functions
 * Full Express Backend Migration from Railway
 * Node.js 18 with ES Modules
 */

import functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import all routes
import chatRouter from './routes/chat.js';
import agentRouter from './routes/agents.js';
import pdfRouter from './routes/pdf.js';
import authRouter from './routes/auth.js';

// Load environment variables
dotenv.config();

console.log('🔍 Starting Firebase Functions...');
console.log('🔑 GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);

// Create Express app
const app = express();

// Middleware - Request logging
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  console.log(`Origin: ${req.headers.origin}`);
  next();
});

// CORS Configuration - Allow Firebase Hosting and local dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://loankit-ai-demo.web.app',
  'https://loankit-ai-demo.firebaseapp.com',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // For hackathon/testing: Log and allow other origins with warning
    console.log(`⚠️ Warning: Origin ${origin} not in allowed list. Allowing for testing.`);
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'LoanKit AI Backend API - Firebase Cloud Functions',
    status: 'running',
    version: '2.0.0',
    platform: 'Firebase Functions',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      chat: '/api/chat/*',
      agents: '/api/agents/*',
      pdf: '/api/pdf/*'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'LoanKit AI Functions',
    gemini: process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'
  });
});

// API Routes - All routes already prefixed with /api in their respective files
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/agents', agentRouter);
app.use('/api/pdf', pdfRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Export the Express app as a Firebase Function
// Optimized for cost control and performance
export const api = functions
  .runWith({
    maxInstances: 10,         // Limit concurrent instances for cost control
    timeoutSeconds: 60,       // 60 seconds timeout
    memory: '512MB',          // Increased memory for AI operations
    minInstances: 0           // Scale to zero when idle (free tier friendly)
  })
  .https.onRequest(app);

console.log('✅ Firebase Functions configured successfully');
