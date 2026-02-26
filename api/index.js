import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Import routes from current directory
import chatRouter from './routes/chat.js';
import agentRouter from './routes/agents.js';
import pdfRouter from './routes/pdf.js';
import authRouter from './routes/auth.js';

const app = express();

// CORS - Allow Firebase Hosting
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://loankit-ai-demo.web.app',
    'https://loankit-ai-demo.firebaseapp.com'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'LoanKit AI Backend API',
    status: 'running',
    platform: 'Vercel Serverless',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      chat: '/api/chat/*',
      agents: '/api/agents/*',
      pdf: '/api/pdf/*'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'LoanKit AI - Vercel',
    gemini: process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/agents', agentRouter);
app.use('/api/pdf', pdfRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Export for Vercel
export default app;
