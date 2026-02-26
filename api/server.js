import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

console.log('🔍 Starting server...');
console.log('📂 Current directory:', process.cwd());
console.log('🔑 GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);

import chatRouter from './routes/chat.js';
import agentRouter from './routes/agents.js';
import pdfRouter from './routes/pdf.js';
import authRouter from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// request logging
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  console.log(`Origin: ${req.headers.origin}`);
  next();
});

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://loankit-ai-demo.web.app',
  'https://loankit-ai-demo.firebaseapp.com',
  'https://web-production-a722.up.railway.app',
  'https://loankit-ai-production.up.railway.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // limit null origins (like server-to-server or postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // For debugging/hackathon: Log and allow usually blocked origins, but warn
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
    message: 'LoanKit AI Backend API',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      chat: '/api/chat/*',
      agents: '/api/agents/*',
      pdf: '/api/pdf/*'
    }
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/agents', agentRouter);
app.use('/api/pdf', pdfRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🌐 Server is ready to accept connections`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
