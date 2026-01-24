import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import chatRouter from "./routes/chat.js";
import agentRouter from "./routes/agents.js";
import pdfRouter from "./routes/pdf.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://loankit-ai-demo.web.app",
    "https://loankit-ai-demo.firebaseapp.com",
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/agents", agentRouter);
app.use("/api/pdf", pdfRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({status: "healthy", timestamp: new Date().toISOString()});
});

app.get("/", (req, res) => {
  res.json({
    status: "LoanKit AI API is running",
    endpoints: {
      auth: "/api/auth",
      chat: "/api/chat",
      agents: "/api/agents",
      pdf: "/api/pdf",
    },
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && {stack: err.stack}),
  });
});

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);

const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
