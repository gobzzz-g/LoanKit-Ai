// User Database Service with In-Memory Storage (Vercel Serverless Compatible)
import crypto from 'crypto';

// In-memory storage (data persists only during function lifetime)
let usersDB = {};
let sessionsDB = {};

console.log('✅ In-memory database initialized for Vercel serverless');

// Load users from memory
function loadUsers() {
  return usersDB;
}

// Save users to memory
function saveUsers(users) {
  usersDB = users;
}

// Load sessions from memory
function loadSessions() {
  return sessionsDB;
}

// Save sessions to memory
function saveSessions(sessions) {
  sessionsDB = sessions;
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
  const users = loadUsers();

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
  saveUsers(users);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return { success: true, user: userWithoutPassword };
}

// User Login
export async function loginUser(credentials) {
  const users = loadUsers();

  const { emailOrMobile, password } = credentials;

  if (!emailOrMobile || !password) {
    return { success: false, error: 'Email/Mobile and password are required' };
  }

  // Find user by email or mobile
  let user = Object.values(users).find(
    u => u.email === emailOrMobile || u.mobile === emailOrMobile
  );

  // Hackathon Mode: Auto-register if user doesn't exist
  if (!user) {
    console.log('⚠️ Hackathon Mode: User not found. Auto-registering...', emailOrMobile);
    const isEmail = emailOrMobile.includes('@');
    // Create dummy user data
    const newUser = {
      name: isEmail ? emailOrMobile.split('@')[0] : 'Demo User',
      email: isEmail ? emailOrMobile : `user${Date.now()}@loankit.ai`,
      mobile: !isEmail ? emailOrMobile : `9${Date.now().toString().slice(-9)}`,
      password: 'demo-password' // Dummy password
    };

    const regResult = await registerUser(newUser);
    if (!regResult.success) {
      return { success: false, error: 'Hackathon auto-registration failed: ' + regResult.error };
    }
    user = regResult.user;
  }

  // Hackathon Mode: Bypass password check
  // const hashedPassword = hashPassword(password);
  // if (user.password !== hashedPassword) { ... }

  // Create session
  const sessionToken = generateSessionToken();
  const sessions = loadSessions();

  sessions[sessionToken] = {
    customerId: user.customerId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  };

  saveSessions(sessions);

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
  if (!sessionToken) {
    return { success: false, error: 'No session token provided' };
  }

  const sessions = loadSessions();

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
    saveSessions(sessions);
    return { success: false, error: 'Session expired' };
  }

  // Get user
  const users = loadUsers();
  const user = users[session.customerId];

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword };
}

// Logout
export async function logoutUser(sessionToken) {
  const sessions = loadSessions();

  if (sessions[sessionToken]) {
    delete sessions[sessionToken];
    saveSessions(sessions);
  }

  return { success: true };
}

// Get User by Customer ID
export async function getUserById(customerId) {
  const users = loadUsers();
  const user = users[customerId];

  if (!user) {
    return null;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Update User Profile
export async function updateUserProfile(customerId, profileData) {
  const users = loadUsers();
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

  saveUsers(users);

  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword };
}

// Add Loan to History
export async function addLoanToHistory(customerId, loanData) {
  const users = loadUsers();
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
  saveUsers(users);

  return { success: true, loan };
}

// Add Conversation
export async function addConversation(customerId, conversationData) {
  const users = loadUsers();
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
  saveUsers(users);

  return { success: true, conversation };
}

// Add Document
export async function addDocument(customerId, documentData) {
  const users = loadUsers();
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
  saveUsers(users);

  return { success: true, document };
}

// Get User Loan History
export async function getUserLoanHistory(customerId) {
  const users = loadUsers();
  const user = users[customerId];

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  return { success: true, loans: user.loanHistory };
}

// Get User Conversations
export async function getUserConversations(customerId) {
  const users = loadUsers();
  const user = users[customerId];

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  return { success: true, conversations: user.conversations };
}
