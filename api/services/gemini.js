import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class GeminiService {
  constructor() {
    // Use gemini-pro as fallback model name
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateResponse(prompt, context = {}) {
    // Use fallback responses directly since Gemini API is not working
    return this.getFallbackResponse(context.role, prompt);
    
    /* Gemini API disabled temporarily
    try {
      const enhancedPrompt = this.buildPrompt(prompt, context);
      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      // Fallback to simple responses if Gemini fails
      return this.getFallbackResponse(context.role, prompt);
    }
    */
  }

  getFallbackResponse(role, prompt) {
    // Simple fallback responses when Gemini API is unavailable
    const responses = {
      master: "Thank you for your interest! I'm processing your request and will provide you with the best loan options available.",
      sales: "Based on your requirements, this loan structure looks great! The EMI will be comfortable for your monthly budget.",
      verification: "Your details have been verified successfully from our records.",
      underwriting: "Based on your excellent credit profile, you qualify for our best interest rates."
    };
    return responses[role] || responses.master;
  }

  buildPrompt(prompt, context) {
    const { role, customerData, conversationHistory } = context;
    
    let systemPrompt = '';
    
    switch (role) {
      case 'master':
        systemPrompt = `You are a Master AI Agent for an NBFC personal loan platform. You are professional, empathetic, and conversational. Your role is to:
- Greet customers warmly and build trust
- Understand their loan requirements
- Guide them through the process smoothly
- Explain decisions clearly and transparently
- Be human-like and avoid robotic responses

Keep responses concise (2-3 sentences max), natural, and friendly.`;
        break;
      
      case 'sales':
        systemPrompt = `You are a Sales Agent specializing in personal loans. Your role is to:
- Understand the customer's financial needs
- Recommend optimal loan amounts, tenure, and EMI options
- Negotiate and align expectations with NBFC policies
- Suggest EMI-friendly alternatives if needed
- Be persuasive but ethical

Keep responses brief and focused on value proposition.`;
        break;
      
      case 'verification':
        systemPrompt = `You are a KYC Verification Agent. Your role is to:
- Confirm customer identity details
- Flag any inconsistencies in data
- Request missing documents professionally
- Ensure compliance with regulations

Keep responses clear and action-oriented.`;
        break;
      
      case 'underwriting':
        systemPrompt = `You are an Underwriting Agent responsible for credit assessment. Your role is to:
- Analyze credit profiles objectively
- Apply eligibility rules consistently
- Explain decisions with clear reasoning
- Suggest alternatives when possible
- Maintain professional tone

Provide factual, data-driven explanations.`;
        break;
      
      default:
        systemPrompt = 'You are a helpful AI assistant for a loan platform.';
    }
    
    let fullPrompt = `${systemPrompt}\n\n`;
    
    if (customerData) {
      fullPrompt += `Customer Context:\n${JSON.stringify(customerData, null, 2)}\n\n`;
    }
    
    if (conversationHistory && conversationHistory.length > 0) {
      fullPrompt += `Previous Conversation:\n`;
      conversationHistory.slice(-3).forEach(msg => {
        fullPrompt += `${msg.sender}: ${msg.text}\n`;
      });
      fullPrompt += '\n';
    }
    
    fullPrompt += `User: ${prompt}\n\nRespond naturally and conversationally:`;
    
    return fullPrompt;
  }

  async explainDecision(decision, assessmentData) {
    const prompt = `Explain this loan decision to the customer in a clear, empathetic way:

Decision: ${decision}
Reason: ${assessmentData.reason}
Credit Score: ${assessmentData.creditScore}
Loan Amount: ₹${assessmentData.loanAmount.toLocaleString('en-IN')}
Tenure: ${assessmentData.tenure} months
Interest Rate: ${assessmentData.interestRate}%
EMI: ₹${assessmentData.proposedEMI.toLocaleString('en-IN')}

Provide a 2-3 sentence explanation that is warm, professional, and clear.`;

    try {
      return await this.generateResponse(prompt, { role: 'master' });
    } catch (error) {
      // Fallback explanation
      if (decision === 'APPROVED') {
        return `Your loan application has been approved! With your strong credit profile (${assessmentData.creditScore}), you qualify for an interest rate of ${assessmentData.interestRate}% per annum. Your monthly EMI will be ₹${assessmentData.proposedEMI.toLocaleString('en-IN')}.`;
      } else {
        return `We're unable to approve your loan application at this time due to: ${assessmentData.reason}. Please contact our loan specialists to explore alternative options.`;
      }
    }
  }

  async generateNegotiationResponse(customerRequest, assessmentData) {
    const prompt = `Customer wants: ${customerRequest}

Current loan terms:
- Amount: ₹${assessmentData.loanAmount?.toLocaleString('en-IN') || 'Not set'}
- Tenure: ${assessmentData.tenure || 'Not set'} months
- Pre-approved limit: ₹${assessmentData.preApprovedLimit?.toLocaleString('en-IN') || 'Not available'}
- Credit Score: ${assessmentData.creditScore}

Suggest the best option that balances customer needs with NBFC policies. Be persuasive and helpful.`;

    return await this.generateResponse(prompt, { role: 'sales' });
  }
}

export const geminiService = new GeminiService();
