// User Database Service with Data Persistence
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../data/users.json');
const SESSIONS_PATH = path.join(__dirname, '../data/sessions.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(__dirname, '../data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Initialize database files if thLoanKitdon't exist
async function initializeDB() {
  await ensureDataDir();
  
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify({ users: {} }, null, 2));
  }
  
  try {
    await fs.access(SESSIONS_PATH);
  } catch {
    await fs.writeFile(SESSIONS_PATH, JSON.stringify({ sessions: {} }, null, 2));
  }
}

// Load users from database
async function loadUsers() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data).users;
  } catch (error) {
    return {};
  }
}

// Save users to database
async function saveUsers(users) {
  await fs.writeFile(DB_PATH, JSON.stringify({ users }, null, 2));
}

// Load sessions
async function loadSessions() {
  try {
    const data = await fs.readFile(SESSIONS_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.sessions || {};
  } catch (error) {
    return {};
  }
}

// Save sessions
async function saveSessions(sessions) {
  await fs.writeFile(SESSIONS_PATH, JSON.stringify({ sessions }, null, 2));
}

// Hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate session token
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Generate customer ID
function generateCustomerId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `CUST${timestamp}${random}`.toUpperCase();
}

// User Registration
export async function registerUser(userData) {
  await initializeDB();
  const users = await loadUsers();
  
  const { name, email, mobile, password } = userData;
  
  // Validation
  if (!name || !email || !mobile || !password) {
    return { success: false, error: 'All fields are required' };
  }
  
  // Check if user already exists
  const existingUser = Object.values(users).find(
    u => u.email === email || u.mobile === mobile
  );
  
  if (existingUser) {
    return { success: false, error: 'User with this email or mobile already exists' };
  }
  
  // Create new user
  const customerId = generateCustomerId();
  const newUser = {
    customerId,
    name,
    email,
    mobile,
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
    kycVerified: false,
    creditScore: null,
    preApprovedLimit: null,
    loanHistory: [],
    conversations: [],
    documents: [],
    profile: {
      address: null,
      pan: null,
      employmentType: null,
      company: null,
      monthlyIncome: null
    }
  };
  
  users[customerId] = newUser;
  await saveUsers(users);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return { success: true, user: userWithoutPassword };
}

// User Login
export async function loginUser(credentials) {
  await initializeDB();
  const users = await loadUsers();
  
  const { emailOrMobile, password } = credentials;
  
  if (!emailOrMobile || !password) {
    return { success: false, error: 'Email/Mobile and password are required' };
  }
  
  // Find user by email or mobile
  const user = Object.values(users).find(
    u => u.email === emailOrMobile || u.mobile === emailOrMobile
  );
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  // Verify password
  const hashedPassword = hashPassword(password);
  if (user.password !== hashedPassword) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  // Create session
  const sessionToken = generateSessionToken();
  const sessions = await loadSessions();
  
  sessions[sessionToken] = {
    customerId: user.customerId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  };
  
  await saveSessions(sessions);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return { 
    success: true, 
    user: userWithoutPassword,
    sessionToken 
  };
}

// Verify Session
export async function verifySession(sessionToken) {
  await initializeDB();
  
  if (!sessionToken) {
    return { success: false, error: 'No session token provided' };
  }
  
  const sessions = await loadSessions();
  
  if (!sessions || typeof sessions !== 'object') {
    return { success: false, error: 'Session data unavailable' };
  }
  
  const session = sessions[sessionToken];
  
  if (!session) {
    return { success: false, error: 'Invalid session' };
  }
  
  // Check if session expired
  if (new Date(session.expiresAt) < new Date()) {
    delete sessions[sessionToken];
    await saveSessions(sessions);
    return { success: false, error: 'Session expired' };
  }
  
  // Get user
  const users = await loadUsers();
  const user = users[session.customerId];
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword };
}

// Logout
export async function logoutUser(sessionToken) {
  await initializeDB();
  const sessions = await loadSessions();
  
  if (sessions[sessionToken]) {
    delete sessions[sessionToken];
    await saveSessions(sessions);
  }
  
  return { success: true };
}

// Get User by Customer ID
export async function getUserById(customerId) {
  await initializeDB();
  const users = await loadUsers();
  const user = users[customerId];
  
  if (!user) {
    return null;
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Update User Profile
export async function updateUserProfile(customerId, profileData) {
  await initializeDB();
  const users = await loadUsers();
  const user = users[customerId];
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  // Update profile fields
  user.profile = { ...user.profile, ...profileData };
  
  // Update credit score and pre-approved limit if provided
  if (profileData.creditScore) user.creditScore = profileData.creditScore;
  if (profileData.preApprovedLimit) user.preApprovedLimit = profileData.preApprovedLimit;
  if (profileData.monthlyIncome) user.profile.monthlyIncome = profileData.monthlyIncome;
  
  await saveUsers(users);
  
  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword };
}

// Add Loan to History
export async function addLoanToHistory(customerId, loanData) {
  await initializeDB();
  const users = await loadUsers();
  const user = users[customerId];
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  const loan = {
    loanId: `LOAN${Date.now()}`,
    ...loanData,
    appliedAt: new Date().toISOString()
  };
  
  user.loanHistory.push(loan);
  await saveUsers(users);
  
  return { success: true, loan };
}

// Add Conversation
export async function addConversation(customerId, conversationData) {
  await initializeDB();
  const users = await loadUsers();
  const user = users[customerId];
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  const conversation = {
    conversationId: `CONV${Date.now()}`,
    ...conversationData,
    timestamp: new Date().toISOString()
  };
  
  user.conversations.push(conversation);
  await saveUsers(users);
  
  return { success: true, conversation };
}

// Add Document
export async function addDocument(customerId, documentData) {
  await initializeDB();
  const users = await loadUsers();
  const user = users[customerId];
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  const document = {
    documentId: `DOC${Date.now()}`,
    ...documentData,
    uploadedAt: new Date().toISOString()
  };
  
  user.documents.push(document);
  await saveUsers(users);
  
  return { success: true, document };
}

// Get User Loan History
export async function getUserLoanHistory(customerId) {
  await initializeDB();
  const users = await loadUsers();
  const user = users[customerId];
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  return { success: true, loans: user.loanHistory };
}

// Get User Conversations
export async function getUserConversations(customerId) {
  await initializeDB();
  const users = await loadUsers();
  const user = users[customerId];
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  return { success: true, conversations: user.conversations };
}
