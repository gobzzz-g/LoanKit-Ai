/**
 * LoanKit AI - Firebase Cloud Functions
 * CommonJS syntax for Node.js 18 compatibility
 */

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    status: "LoanKit AI API is running on Firebase Functions",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      chat: "/api/chat",
      agents: "/api/agents",
      pdf: "/api/pdf",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "LoanKit AI Functions",
  });
});

// Simple chat endpoint (minimal example)
app.post("/api/chat", async (req, res) => {
  try {
    const {message, sessionId} = req.body;
    
    if (!message) {
      return res.status(400).json({error: "Message is required"});
    }

    // Simple echo response for testing
    res.json({
      response: `Echo: ${message}`,
      sessionId: sessionId || "default-session",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

// Simple auth endpoint (minimal example)
app.post("/api/auth/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    
    if (!email || !password) {
      return res.status(400).json({error: "Email and password are required"});
    }

    // Mock login response
    res.json({
      success: true,
      message: "Login successful",
      user: {
        email: email,
        id: "demo-user-id",
        name: "Demo User",
      },
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// Export the Express app as a Firebase Function
// with limited instances for cost control
exports.api = functions
    .runWith({
      maxInstances: 10,
      timeoutSeconds: 60,
      memory: "256MB",
    })
    .https.onRequest(app);
