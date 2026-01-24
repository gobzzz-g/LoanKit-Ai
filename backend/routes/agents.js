import express from 'express';
import { getDemoCustomers, getCustomer } from '../services/mockData.js';

const router = express.Router();

// Get demo customers
router.get('/demo-customers', (req, res) => {
  try {
    const customers = getDemoCustomers();
    res.json({
      success: true,
      customers: customers.map(c => ({
        customerId: c.customerId,
        name: c.name,
        creditScore: c.creditScore,
        preApprovedLimit: c.preApprovedLimit,
        scenario: c.creditScore >= 750 ? 'Instant Approval' : 
                  c.creditScore >= 700 ? 'Conditional Approval' : 'Rejection'
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get customer details
router.get('/customer/:customerId', (req, res) => {
  try {
    const customer = getCustomer(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
