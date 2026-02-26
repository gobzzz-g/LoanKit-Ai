import { geminiService } from '../services/gemini.js';
import { getCustomer, getCustomerByPhone, verifyKYC, assessLoanEligibility } from '../services/mockData.js';
import {
  analyzeCustomerIntent,
  classifyCustomerMindset,
  generatePersuasionResponse,
  handleObjection,
  MindsetStates
} from '../services/persuasionLogic.js';
import { addLoanToHistory } from '../services/userDatabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SESSIONS_FILE = path.join(__dirname, '../data/sessions.json');

// Session storage (in production, use Redis or database)
const sessions = new Map();

// Load sessions from file on startup
function loadSessions() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      // Handle both array and object formats
      const sessionsArray = Array.isArray(parsed) ? parsed : (parsed.sessions ? Object.values(parsed.sessions) : []);
      sessionsArray.forEach(session => {
        sessions.set(session.id, session);
      });
      console.log(`📂 Loaded ${sessions.size} sessions from file`);
    }
  } catch (error) {
    console.error('Error loading sessions:', error.message);
  }
}

// Save sessions to file
function saveSessions() {
  try {
    const dir = path.dirname(SESSIONS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const sessionsArray = Array.from(sessions.values());
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessionsArray, null, 2));
  } catch (error) {
    console.error('Error saving sessions:', error.message);
  }
}

// Load sessions on module load
loadSessions();

// Helper function to ensure customer object has all required fields
function ensureCompleteCustomerData(customer) {
  return {
    customerId: customer.customerId || 'UNKNOWN',
    name: customer.name || 'Customer',
    phone: customer.phone || null,
    email: customer.email || null,
    address: customer.address || null,
    pan: customer.pan || null,
    creditScore: customer.creditScore || 700,
    preApprovedLimit: customer.preApprovedLimit || 300000,
    monthlyIncome: customer.monthlyIncome || 50000,
    employmentType: customer.employmentType || 'Salaried',
    company: customer.company || null,
    kycVerified: customer.kycVerified || false,
    existingLoans: customer.existingLoans || []
  };
}

class MasterAgent {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.session = this.getOrCreateSession(sessionId);
  }

  getOrCreateSession(sessionId) {
    if (!sessions.has(sessionId)) {
      console.log(`Creating new session: ${sessionId}`);
      sessions.set(sessionId, {
        id: sessionId,
        customer: null,
        conversationHistory: [],
        loanRequest: {
          amount: null,
          tenure: null,
          purpose: null
        },
        verificationStatus: null,
        underwritingResult: null,
        customerIntent: null,
        customerMindset: MindsetStates.EXPLORING,
        stage: 'GREETING', // GREETING -> SALES -> VERIFICATION -> UNDERWRITING -> DECISION
        documentsUploaded: [],
        startTime: new Date()
      });
      saveSessions();
    } else {
      console.log(`Retrieved existing session: ${sessionId}, stage: ${sessions.get(sessionId).stage}`);
    }
    return sessions.get(sessionId);
  }

  async processMessage(userMessage, metadata = {}) {
    console.log(`\n=== Processing Message ===`);
    console.log(`SessionID: ${this.sessionId}`);
    console.log(`Current Stage: ${this.session.stage}`);
    console.log(`User Message: "${userMessage}"`);
    console.log(`Has Customer: ${!!this.session.customer}`);
    console.log(`Has Underwriting Result: ${!!this.session.underwritingResult}`);
    
    // Add user message to history
    this.session.conversationHistory.push({
      sender: 'user',
      text: userMessage,
      timestamp: new Date()
    });

    // Analyze customer intent and mindset
    const intent = analyzeCustomerIntent(userMessage, this.session.conversationHistory);
    this.session.customerIntent = intent;
    
    const mindset = classifyCustomerMindset(intent, this.session.conversationHistory);
    this.session.customerMindset = mindset;

    // Check for objections or concerns
    let response = '';
    const hasObjection = intent.concerns && intent.concerns.length > 0;
    
    if (hasObjection && this.session.stage === 'SALES' && this.session.customer) {
      // Handle objections with ethical persuasion
      const objectionResponse = handleObjection(
        userMessage, 
        this.session.customer, 
        this.session.loanRequest
      );
      response = objectionResponse + '\n\n';
    }

    let actions = [];
    let stageUpdate = null;

    // Handle different stages with error handling
    try {
      switch (this.session.stage) {
        case 'GREETING':
          response += await this.handleGreeting(userMessage, metadata);
          break;
        
        case 'SALES':
          response += await this.handleSales(userMessage, metadata);
          break;
        
      case 'DOCUMENT_UPLOAD':
        response += await this.handleDocumentUpload(userMessage, metadata);
        break;
      
      case 'VERIFICATION':
        response += await this.handleVerification(userMessage, metadata);
        break;
      
        case 'UNDERWRITING':
          response += await this.handleUnderwriting(userMessage, metadata);
          break;
        
        case 'DECISION':
          response += await this.handleDecision(userMessage, metadata);
          break;
        
        default:
          response += "I'm here to help you with your personal loan. How can I assist you today?";
      }
    } catch (error) {
      console.error('Error in processMessage stage handling:', error);
      response += "I apologize for the inconvenience. There was an issue processing your request. Please try again or contact support.";
    }

    // Add agent response to history
    this.session.conversationHistory.push({
      sender: 'agent',
      text: response,
      timestamp: new Date(),
      mindset: mindset,
      intent: intent
    });
// Save session after each message
    saveSessions();
    
    
    return {
      message: response,
      session: this.getSessionData(),
      customerMindset: mindset,
      actions
    };
  }

  async handleGreeting(userMessage, metadata) {
    // Check if customer ID is provided in metadata
    if (metadata.customerId) {
      const customer = getCustomer(metadata.customerId);
      if (customer) {
        this.session.customer = ensureCompleteCustomerData(customer);
        this.session.stage = 'SALES';
        return `Hello ${customer.name}! 👋 Welcome to our personal loan platform. I'm here to help you get the best loan offer tailored to your needs. 

I can see you're pre-approved for loans up to ₹${customer.preApprovedLimit.toLocaleString('en-IN')}. How much would you like to borrow?`;
      } else {
        // For new registered users without demo profile, create a basic profile
        const userName = metadata.userName || 'Customer';
        this.session.customer = ensureCompleteCustomerData({
          customerId: metadata.customerId,
          name: userName,  // Use actual user name
          preApprovedLimit: 300000,
          creditScore: 700,
          monthlyIncome: 50000,
          kycVerified: false
        });
        this.session.stage = 'SALES';
        return `Hello ${userName}! 👋 Welcome to our personal loan platform. I'm your AI loan Approver, here to help you get the best loan offer tailored to your needs.

Based on your profile, you're eligible for loans up to ₹3,00,000. How much would you like to borrow today?`;
      }
    }

    // Try to extract phone number or customer ID from user message
    const phoneMatch = userMessage.match(/\d{10,}/);
    const customerIdMatch = userMessage.match(/DEMO\d{3}/i);
    
    if (phoneMatch) {
      const customer = getCustomerByPhone(phoneMatch[0]);
      if (customer) {
        this.session.customer = ensureCompleteCustomerData(customer);
        this.session.stage = 'SALES';
        return `Hello ${customer.name}! 👋 Welcome back to our personal loan platform. I'm here to help you get the best loan offer tailored to your needs. 

I can see you're pre-approved for loans up to ₹${customer.preApprovedLimit.toLocaleString('en-IN')}. How much would you like to borrow?`;
      } else {
        return `I couldn't find an account with mobile number ${phoneMatch[0]}. Please verify your number or contact support to register.

You can also try with your customer ID (e.g., DEMO001).`;
      }
    }
    
    if (customerIdMatch) {
      const customer = getCustomer(customerIdMatch[0].toUpperCase());
      if (customer) {
        this.session.customer = ensureCompleteCustomerData(customer);
        this.session.stage = 'SALES';
        return `Hello ${customer.name}! 👋 Welcome back to our personal loan platform. I'm here to help you get the best loan offer tailored to your needs. 

I can see you're pre-approved for loans up to ₹${customer.preApprovedLimit.toLocaleString('en-IN')}. How much would you like to borrow?`;
      }
    }

    // If no customer ID or phone found, ask for it
    return `Hello! Welcome to our personal loan platform. 👋 I'm your AI loan Approver, here to make your loan journLoanKitsmooth and instant.

To get started, could you please provide your registered mobile number or customer ID?`;
  }

  async handleSales(userMessage, metadata) {
    // Use Sales Agent to negotiate
    const salesAgent = new SalesAgent(this.session);
    const result = await salesAgent.process(userMessage, metadata);
    
    if (result.complete) {
      this.session.loanRequest = result.loanRequest;
      
      // Check if documents are required (only when loan amount exceeds pre-approved limit)
      const requiresDocuments = result.loanRequest.amount > this.session.customer.preApprovedLimit;
      
      if (requiresDocuments && (!this.session.documentsUploaded || this.session.documentsUploaded.length === 0)) {
        this.session.stage = 'DOCUMENT_UPLOAD';
        return result.message + `\n\n📄 **Document Verification Required**

Since your loan amount of ₹${result.loanRequest.amount.toLocaleString('en-IN')} exceeds your pre-approved limit of ₹${this.session.customer.preApprovedLimit.toLocaleString('en-IN')}, please upload the following documents:

• Recent salary slips (last 3 months)
• Bank statements (last 6 months)
• Identity proof (Aadhaar/PAN)

Please type "documents uploaded" once you have uploaded the required documents, or type "skip" to proceed with limited approval.`;
      }
      
      // If documents not required or already uploaded, proceed with verification
      this.session.stage = 'VERIFICATION';
      
      const summaryMessage = result.message + '\n\nGreat! Let me quickly verify your details before we proceed. This will just take a moment...';
      
      // Automatically run verification
      const verificationResponse = await this.handleVerification(userMessage, metadata);
      
      return summaryMessage + '\n\n' + verificationResponse;
    }
    
    return result.message;
  }

  async handleDocumentUpload(userMessage, metadata) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('upload') || lowerMessage.includes('done') || lowerMessage.includes('submitted') || lowerMessage.includes('yes')) {
      // Mark documents as uploaded
      this.session.documentsUploaded = ['salary_slips', 'bank_statements', 'identity_proof'];
      this.session.stage = 'VERIFICATION';
      
      return `✅ Thank you! Documents received successfully.

Let me quickly verify your details before we proceed. This will just take a moment...`;
    } else if (lowerMessage.includes('skip')) {
      // Proceed without documents (limited approval possible)
      this.session.stage = 'VERIFICATION';
      
      return `⚠️ Proceeding without complete documentation. This may affect your loan approval amount.

Let me verify your details...`;
    } else {
      return `📄 Please upload the required documents:
- Recent salary slips (last 3 months)
- Bank statements (last 6 months)  
- Identity proof (Aadhaar/PAN)

Type "documents uploaded" when ready, or "skip" to proceed without documents (may limit approval amount).`;
    }
  }

  async handleVerification(userMessage, metadata) {
    const verificationAgent = new VerificationAgent(this.session);
    const result = await verificationAgent.process();
    
    this.session.verificationStatus = result;
    
    if (result.verified) {
      this.session.stage = 'UNDERWRITING';
      
      // Return verification success message
      // The frontend will auto-trigger underwriting
      return `✅ Verification complete! Your KYC details are confirmed.

Now let me assess your loan eligibility based on your credit profile and the requested amount of ₹${this.session.loanRequest.amount.toLocaleString('en-IN')} for ${this.session.loanRequest.tenure} months...`;
    } else {
      return `⚠️ We found some issues with verification: ${result.message}. Please contact our support team to resolve this.`;
    }
  }

  async handleUnderwriting(userMessage, metadata) {
    const underwritingAgent = new UnderwritingAgent(this.session);
    const result = await underwritingAgent.process();
    
    this.session.underwritingResult = result;
    this.session.stage = 'DECISION';
    
    // Save loan application to user history
    if (this.session.customer?.customerId) {
      try {
        await addLoanToHistory(this.session.customer.customerId, {
          amount: result.loanAmount,
          tenure: result.tenure,
          interestRate: result.interestRate,
          emi: result.proposedEMI,
          status: result.decision === 'APPROVED' ? 'APPROVED' : 'REJECTED',
          decision: result.decision,
          riskCategory: result.riskCategory,
          creditScore: result.creditScore
        });
      } catch (error) {
        console.error('Failed to save loan to history:', error);
      }
    }
    
    // Generate explanation using Gemini with fallback
    let explanation;
    try {
      explanation = await geminiService.explainDecision(result.decision, result);
    } catch (error) {
      console.error('Gemini API Error in handleUnderwriting:', error.message);
      // Fallback explanation
      if (result.decision === 'APPROVED') {
        explanation = `Your loan application has been approved! With your strong credit profile (${result.creditScore}), you qualify for an interest rate of ${result.interestRate}% per annum.`;
      } else {
        explanation = `Based on our assessment, we're unable to approve your loan application at this time. ${result.reason}`;
      }
    }
    
    if (result.decision === 'APPROVED') {
      const totalPayment = result.proposedEMI * result.tenure;
      const totalInterest = totalPayment - result.loanAmount;
      
      let documentNote = '';
      if (result.requiresSalarySlip || result.loanAmount > this.session.customer.preApprovedLimit) {
        documentNote = `\n\n📄 **Document Requirements:**
Since this loan exceeds your pre-approved limit, please upload your recent salary slips and income proof for final verification.`;
      }
      
      return `🎉 Congratulations! Your loan is APPROVED!

${explanation}

**Loan Details:**
💰 Amount: ₹${result.loanAmount.toLocaleString('en-IN')}
📅 Tenure: ${result.tenure} months (${Math.round(result.tenure/12)} ${result.tenure >= 24 ? 'years' : 'year'})
📊 Interest Rate: ${result.interestRate}% per annum
💳 Monthly EMI: ₹${result.proposedEMI.toLocaleString('en-IN')}

**EMI Breakdown:**
💵 Total Interest: ₹${totalInterest.toLocaleString('en-IN')}
💰 Total Amount Payable: ₹${totalPayment.toLocaleString('en-IN')}
📊 EMI to Income Ratio: ${result.emiToIncomeRatio}%${documentNote}

**💡 Decision Transparency:**
This decision was based on your credit score (${result.creditScore}), monthly income (₹${this.session.customer.monthlyIncome?.toLocaleString('en-IN')}), and repayment capacity. Our AI evaluated these factors to ensure responsible lending.

Your application has been saved to your dashboard. Would you like me to generate your sanction letter?`;
    } else {
      return `😔 Unfortunately, your loan application couldn't be approved at this time.

${explanation}

**Assessment Details:**
Credit Score: ${result.creditScore}
Risk Category: ${result.riskCategory}

**💡 Decision Transparency:**
This decision was based on your credit score, current income levels, and existing EMI obligations. Our AI system evaluates these factors to ensure responsible lending practices that protect both you and the lender.

Your application has been saved to your dashboard. We're here to help you improve your eligibility. Would you like to explore other options or speak with our loan specialist?`;
    }
  }

  async handleDecision(userMessage, metadata) {
    const lowerMessage = userMessage.toLowerCase();
    const result = this.session.underwritingResult;
    
    console.log(`DECISION stage - Message: "${userMessage}", Has result: ${!!result}`);
    
    if (lowerMessage.includes('yes') || lowerMessage.includes('sanction') || lowerMessage.includes('letter')) {
      return `Perfect! I'm generating your sanction letter now. You'll be able to download it in a moment. 📄

Thank you for choosing us for your personal loan needs! Is there anything else I can help you with?`;
    }
    
    // Handle EMI-related questions or any message asking for details
    if (result && result.decision === 'APPROVED' && 
        (lowerMessage.includes('emi') || lowerMessage.includes('payment') || 
         lowerMessage.includes('monthly') || lowerMessage.includes('tell') || 
         lowerMessage.includes('more') || lowerMessage.includes('detail'))) {
      const totalPayment = result.proposedEMI * result.tenure;
      const totalInterest = totalPayment - result.loanAmount;
      
      return `📊 **EMI Breakdown Details:**

💳 **Monthly EMI:** ₹${result.proposedEMI.toLocaleString('en-IN')}
📅 **Tenure:** ${result.tenure} months (${Math.round(result.tenure/12)} ${result.tenure >= 24 ? 'years' : 'year'})
📊 **Interest Rate:** ${result.interestRate}% per annum

**Payment Summary:**
💰 Principal Amount: ₹${result.loanAmount.toLocaleString('en-IN')}
💵 Total Interest: ₹${totalInterest.toLocaleString('en-IN')}
💳 Total Amount Payable: ₹${totalPayment.toLocaleString('en-IN')}

**EMI Includes:**
- Principal repayment
- Interest charges
- Processing fee amortized over tenure

Your EMI will be auto-debited on the same date each month. You can set up auto-pay through your bank for convenience!

Would you like to generate your sanction letter or have any other questions?`;
    }
    
    return `Thank you for your time! If you have any questions or would like to discuss your application further, feel free to ask. We're here to help! 😊

${result ? '💡 You can ask me to "generate sanction letter" or "tell me more about EMI"' : ''}`;
  }

  getSessionData() {
    return {
      sessionId: this.session.id,
      stage: this.session.stage,
      customer: this.session.customer ? {
        name: this.session.customer.name,
        customerId: this.session.customer.customerId,
        preApprovedLimit: this.session.customer.preApprovedLimit
      } : null,
      loanRequest: this.session.loanRequest,
      verificationStatus: this.session.verificationStatus,
      underwritingResult: this.session.underwritingResult
    };
  }
}

class SalesAgent {
  constructor(session) {
    this.session = session;
  }

  async process(userMessage, metadata) {
    const loanRequest = this.session.loanRequest;
    
    // Extract loan amount and tenure from message
    const amountMatch = userMessage.match(/(\d+)\s*(lakh|lac|l|lakhs|lacs|k|thousand)?/i);
    const tenureMatch = userMessage.match(/(\d+)\s*(month|months|year|years|yr|yrs)/i);
    
    if (amountMatch && !loanRequest.amount) {
      let amount = parseInt(amountMatch[1]);
      const unit = amountMatch[2]?.toLowerCase();
      
      if (unit && (unit.includes('lakh') || unit.includes('lac') || unit === 'l')) {
        amount = amount * 100000;
      } else if (unit && unit.includes('k')) {
        amount = amount * 1000;
      }
      
      loanRequest.amount = amount;
    }
    
    if (tenureMatch && !loanRequest.tenure) {
      let tenure = parseInt(tenureMatch[1]);
      const unit = tenureMatch[2]?.toLowerCase();
      
      if (unit && unit.includes('year') || unit.includes('yr')) {
        tenure = tenure * 12;
      }
      
      loanRequest.tenure = tenure;
    }
    
    // Check metadata for explicit values
    if (metadata.loanAmount) loanRequest.amount = metadata.loanAmount;
    if (metadata.tenure) loanRequest.tenure = metadata.tenure;
    if (metadata.purpose) loanRequest.purpose = metadata.purpose;
    
    // Determine if we have enough information
    if (!loanRequest.amount) {
      const mindset = this.session.customerMindset || MindsetStates.EXPLORING;
      
      if (mindset === MindsetStates.EXPLORING) {
        return {
          complete: false,
          message: `I'd be happy to help you explore loan options! To get started, could you share:\n\n💰 What loan amount are you looking for?\n📋 What's the purpose of this loan?\n\nFor example: "I need 3 lakhs for home renovation" or "500000 for wedding expenses"`
        };
      } else {
        return {
          complete: false,
          message: `Great! I can see you're interested. What loan amount would work best for you? (For example: "3 lakhs" or "300000")`
        };
      }
    }
    
    if (!loanRequest.tenure) {
      const customer = this.session.customer;
      const emiLow = this.calculateEMI(loanRequest.amount, 12.0, 36); // 3 years
      const emiMid = this.calculateEMI(loanRequest.amount, 12.0, 24); // 2 years
      const emiHigh = this.calculateEMI(loanRequest.amount, 12.0, 12); // 1 year
      
      return {
        complete: false,
        message: `Excellent! You're looking for ₹${loanRequest.amount.toLocaleString('en-IN')}.\n\nLet me show you some EMI options based on different tenures:\n\n💳 **12 months:** ₹${emiHigh.toLocaleString('en-IN')}/month\n💳 **24 months:** ₹${emiMid.toLocaleString('en-IN')}/month\n💳 **36 months:** ₹${emiLow.toLocaleString('en-IN')}/month\n\nWhich tenure feels comfortable for you? Or you can specify any other tenure (6-60 months).`
      };
    }
    
    // We have all information
    const customer = this.session.customer;
    const emi = this.calculateEMI(loanRequest.amount, 12.0, loanRequest.tenure);
    
    // Check affordability
    const emiRatio = customer.monthlyIncome ? (emi / customer.monthlyIncome * 100).toFixed(1) : 0;
    let affordabilityNote = '';
    
    if (customer.monthlyIncome && emiRatio <= 40) {
      affordabilityNote = `\n\n✅ Good news! Your EMI would be ${emiRatio}% of your monthly income, which is very comfortable and within safe limits.`;
    } else if (customer.monthlyIncome && emiRatio > 50) {
      affordabilityNote = `\n\n⚠️ Just a note: The EMI would be ${emiRatio}% of your monthly income. Would you like to consider a longer tenure to reduce the monthly payment?`;
    }
    
    return {
      complete: true,
      loanRequest,
      message: `Perfect! Let me summarize your loan request:

💰 **Loan Amount:** ₹${loanRequest.amount.toLocaleString('en-IN')}
📅 **Tenure:** ${loanRequest.tenure} months (${Math.round(loanRequest.tenure/12)} years)
💳 **Estimated EMI:** ~₹${emi.toLocaleString('en-IN')} per month
📊 **Interest Rate:** ~10.5-14% p.a. (based on your credit profile)${affordabilityNote}

${loanRequest.amount <= customer.preApprovedLimit 
  ? "✨ Great! Since this is within your pre-approved limit of ₹" + customer.preApprovedLimit.toLocaleString('en-IN') + ", we can proceed with instant approval." 
  : "⚠️ Since your requested amount of ₹" + loanRequest.amount.toLocaleString('en-IN') + " exceeds your pre-approved limit of ₹" + customer.preApprovedLimit.toLocaleString('en-IN') + ", we'll need to verify your documents for approval."}`
    };
  }

  calculateEMI(principal, annualRate, tenureMonths) {
    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return Math.round(emi);
  }
}

class VerificationAgent {
  constructor(session) {
    this.session = session;
  }

  async process() {
    const customer = this.session.customer;
    if (!customer || !customer.customerId) {
      return {
        verified: false,
        message: 'Customer ID not found'
      };
    }
    
    // Check if it's a demo customer or a real registered user
    const kycResult = verifyKYC(customer.customerId);
    
    if (kycResult.verified) {
      // Demo customer with existing KYC
      return kycResult;
    } else if (customer.customerId.startsWith('CUST')) {
      // Real registered user - auto-verify for now
      return {
        verified: true,
        message: 'KYC verified successfully',
        data: {
          name: customer.name || 'Customer',
          phone: customer.phone || 'Not provided',
          address: customer.address || 'To be verified',
          pan: customer.pan || 'To be verified'
        }
      };
    } else {
      return kycResult;
    }
  }
}

class UnderwritingAgent {
  constructor(session) {
    this.session = session;
  }

  async process() {
    const { customer, loanRequest } = this.session;
    
    if (!customer) {
      console.error('UnderwritingAgent: No customer data found');
      throw new Error('Customer data not found');
    }
    
    if (!loanRequest || !loanRequest.amount || !loanRequest.tenure) {
      console.error('UnderwritingAgent: Incomplete loan request', loanRequest);
      throw new Error('Incomplete loan request data');
    }
    
    // Ensure customer has complete data structure
    const completeCustomer = ensureCompleteCustomerData(customer);
    
    return assessLoanEligibility(completeCustomer, loanRequest.amount, loanRequest.tenure);
  }
}

export { MasterAgent, SalesAgent, VerificationAgent, UnderwritingAgent };
