import express from 'express';
import { MasterAgent } from '../agents/masterAgent.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create new chat session
router.post('/start', async (req, res) => {
  try {
    const sessionId = uuidv4();
    const masterAgent = new MasterAgent(sessionId);
    
    const { customerId, userName } = req.body;
    
    const response = await masterAgent.processMessage('Hello', { 
      customerId,
      userName 
    });
    
    res.json({
      success: true,
      sessionId,
      ...response
    });
  } catch (error) {
    console.error('Chat start error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send message to chat
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message, metadata } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Session ID and message are required' 
      });
    }
    
    const masterAgent = new MasterAgent(sessionId);
    const response = await masterAgent.processMessage(message, metadata || {});
    
    res.json({
      success: true,
      ...response
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get session data
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const masterAgent = new MasterAgent(sessionId);
    
    res.json({
      success: true,
      session: masterAgent.getSessionData()
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
