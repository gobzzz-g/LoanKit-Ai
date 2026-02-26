// Authentication Routes
import express from 'express';
import { 
  registerUser, 
  loginUser, 
  verifySession, 
  logoutUser,
  getUserById,
  updateUserProfile,
  getUserLoanHistory,
  getUserConversations
} from '../services/userDatabase.js';

const router = express.Router();

// Middleware to verify session
export async function authMiddleware(req, res, next) {
  const sessionToken = req.headers['authorization']?.replace('Bearer ', '');
  
  if (!sessionToken) {
    return res.status(401).json({ success: false, error: 'No session token provided' });
  }
  
  const result = await verifySession(sessionToken);
  
  if (!result.success) {
    return res.status(401).json(result);
  }
  
  req.user = result.user;
  next();
}

// Register new user
router.post('/register', async (req, res) => {
  try {
    const result = await registerUser(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const result = await loginUser(req.body);
    
    if (!result.success) {
      return res.status(401).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Verify session (get current user)
router.get('/me', authMiddleware, async (req, res) => {
  console.log('👤 Fetching user data for:', req.user.customerId, '| Loan history count:', req.user?.loanHistory?.length);
  res.json({ success: true, user: req.user });
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const sessionToken = req.headers['authorization']?.replace('Bearer ', '');
    await logoutUser(sessionToken);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, error: 'Logout failed' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await updateUserProfile(req.user.customerId, req.body);
    res.json(result);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, error: 'Profile update failed' });
  }
});

// Get loan history
router.get('/loans', authMiddleware, async (req, res) => {
  try {
    const result = await getUserLoanHistory(req.user.customerId);
    res.json(result);
  } catch (error) {
    console.error('Loan history error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch loan history' });
  }
});

// Get conversations
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const result = await getUserConversations(req.user.customerId);
    res.json(result);
  } catch (error) {
    console.error('Conversations error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
  }
});

export default router;
