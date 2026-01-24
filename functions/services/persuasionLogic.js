// Customer Mindset Classification and Ethical Persuasion Logic

// Customer mindset states
export const MindsetStates = {
  EXPLORING: 'EXPLORING',           // Just looking, gathering information
  INTERESTED: 'INTERESTED',         // Showing interest, asking questions
  HESITANT: 'HESITANT',            // Has concerns or objections
  READY_TO_APPLY: 'READY_TO_APPLY' // Ready to proceed with application
};

// Analyze customer intent from message
export function analyzeCustomerIntent(message, conversationHistory = []) {
  const lowerMessage = message.toLowerCase();
  
  const intent = {
    loanPurpose: null,
    urgency: 'low',
    emiComfort: null,
    financialConfidence: 'neutral',
    concerns: [],
    readinessScore: 0
  };

  // Detect loan purpose
  const purposes = {
    'home': ['home', 'house', 'property', 'flat', 'apartment', 'construction', 'renovation'],
    'education': ['education', 'study', 'college', 'university', 'course', 'tuition', 'school'],
    'medical': ['medical', 'health', 'hospital', 'surgery', 'treatment', 'emergency'],
    'business': ['business', 'startup', 'expand', 'inventory', 'equipment', 'working capital'],
    'wedding': ['wedding', 'marriage', 'ceremony', 'celebration'],
    'travel': ['travel', 'vacation', 'tour', 'trip'],
    'debt_consolidation': ['consolidate', 'debt', 'credit card', 'existing loan', 'emi burden'],
    'personal': ['personal', 'general', 'miscellaneous']
  };

  for (const [purpose, keywords] of Object.entries(purposes)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      intent.loanPurpose = purpose;
      break;
    }
  }

  // Detect urgency
  const urgencyHigh = ['urgent', 'asap', 'immediately', 'quickly', 'soon', 'emergency', 'need now'];
  const urgencyMedium = ['within week', 'this month', 'few days', 'planning'];
  
  if (urgencyHigh.some(word => lowerMessage.includes(word))) {
    intent.urgency = 'high';
    intent.readinessScore += 2;
  } else if (urgencyMedium.some(word => lowerMessage.includes(word))) {
    intent.urgency = 'medium';
    intent.readinessScore += 1;
  }

  // Detect EMI comfort
  const emiPositive = ['affordable', 'comfortable', 'can pay', 'manageable', 'no problem'];
  const emiNegative = ['expensive', 'high emi', 'too much', 'can\'t afford', 'burden'];
  
  if (emiPositive.some(word => lowerMessage.includes(word))) {
    intent.emiComfort = 'comfortable';
    intent.readinessScore += 2;
  } else if (emiNegative.some(word => lowerMessage.includes(word))) {
    intent.emiComfort = 'concerned';
    intent.concerns.push('emi_affordability');
  }

  // Detect financial confidence
  const confidentPhrases = ['good credit', 'stable income', 'salaried', 'good job', 'repay easily'];
  const uncertainPhrases = ['not sure', 'maybe', 'thinking', 'considering', 'checking'];
  
  if (confidentPhrases.some(phrase => lowerMessage.includes(phrase))) {
    intent.financialConfidence = 'high';
    intent.readinessScore += 2;
  } else if (uncertainPhrases.some(phrase => lowerMessage.includes(phrase))) {
    intent.financialConfidence = 'low';
  }

  // Detect common concerns/objections
  const concerns = {
    'interest_rate': ['interest high', 'rate high', 'expensive rate', 'interest rate'],
    'documentation': ['documents', 'paperwork', 'too much work', 'hassle'],
    'processing_time': ['how long', 'when will', 'time take', 'duration'],
    'eligibility': ['eligible', 'qualify', 'get approved', 'credit score'],
    'hidden_charges': ['hidden charges', 'extra fees', 'additional cost', 'charges']
  };

  for (const [concern, keywords] of Object.entries(concerns)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      intent.concerns.push(concern);
    }
  }

  // Detect readiness signals
  const readySignals = ['apply', 'proceed', 'yes', 'let\'s do', 'go ahead', 'interested', 'want to'];
  const hesitantSignals = ['later', 'think about', 'not sure', 'maybe later', 'let me check'];
  
  if (readySignals.some(signal => lowerMessage.includes(signal))) {
    intent.readinessScore += 3;
  } else if (hesitantSignals.some(signal => lowerMessage.includes(signal))) {
    intent.readinessScore -= 2;
  }

  return intent;
}

// Classify customer mindset based on intent and conversation history
export function classifyCustomerMindset(intent, conversationHistory = []) {
  const { readinessScore, concerns, financialConfidence, urgency } = intent;

  // Count conversation turns
  const conversationTurns = conversationHistory.length;

  // Ready to apply: High readiness, few concerns, multiple interactions
  if (readinessScore >= 5 && concerns.length <= 1) {
    return MindsetStates.READY_TO_APPLY;
  }

  // Hesitant: Has concerns, low readiness, or negative signals
  if (concerns.length >= 2 || readinessScore < 0) {
    return MindsetStates.HESITANT;
  }

  // Interested: Medium readiness, asking questions, engaged
  if (readinessScore >= 2 || conversationTurns >= 3) {
    return MindsetStates.INTERESTED;
  }

  // Exploring: Early stage, gathering information
  return MindsetStates.EXPLORING;
}

// Generate ethical persuasion response based on mindset and intent
export function generatePersuasionResponse(mindset, intent, customerData, loanData) {
  const responses = [];

  switch (mindset) {
    case MindsetStates.EXPLORING:
      responses.push(buildExploringResponse(intent, customerData));
      break;

    case MindsetStates.INTERESTED:
      responses.push(buildInterestedResponse(intent, customerData, loanData));
      break;

    case MindsetStates.HESITANT:
      responses.push(buildHesitantResponse(intent, customerData, loanData));
      break;

    case MindsetStates.READY_TO_APPLY:
      responses.push(buildReadyResponse(intent, customerData, loanData));
      break;
  }

  return responses.join('\n\n');
}

// Build response for exploring customers
function buildExploringResponse(intent, customerData) {
  let response = "I'm here to help you explore your loan options. ";

  if (intent.loanPurpose) {
    response += `I see you're looking for a loan for ${intent.loanPurpose.replace('_', ' ')}. `;
  }

  response += "Let me understand your needs better so I can provide personalized recommendations.\n\n";
  response += "📋 To get started:\n";
  response += "• What amount are you looking for?\n";
  response += "• What's your preferred repayment tenure?\n";
  response += "• Do you have any specific EMI budget in mind?";

  return response;
}

// Build response for interested customers
function buildInterestedResponse(intent, customerData, loanData) {
  let response = "Great! I can see you're interested. Let me show you how this works perfectly for you:\n\n";

  if (loanData && loanData.proposedEMI && customerData.profile?.monthlyIncome) {
    const emiRatio = (loanData.proposedEMI / customerData.profile.monthlyIncome * 100).toFixed(1);
    response += `💰 **Affordability Check:**\n`;
    response += `Your EMI would be ₹${loanData.proposedEMI.toLocaleString('en-IN')}, which is ${emiRatio}% of your monthly income. `;
    
    if (emiRatio <= 40) {
      response += "This is well within a comfortable range! ✅\n\n";
    } else {
      response += "Let's explore options to make this more comfortable.\n\n";
    }
  }

  response += "✨ **Why this works for you:**\n";
  response += `• ${intent.urgency === 'high' ? 'Quick approval process' : 'Flexible approval process'}\n`;
  response += "• Transparent terms with no hidden charges\n";
  response += "• Competitive interest rates based on your profile\n\n";
  
  response += "Would you like to proceed with the application? I can guide you through each step.";

  return response;
}

// Build response for hesitant customers
function buildHesitantResponse(intent, customerData, loanData) {
  let response = "I understand you have some concerns. Let me address them:\n\n";

  // Handle specific concerns
  intent.concerns.forEach((concern, index) => {
    switch (concern) {
      case 'interest_rate':
        response += `🏦 **Interest Rate:** `;
        if (loanData?.interestRate) {
          response += `Your rate is ${loanData.interestRate}% p.a., which is competitive based on your credit profile. `;
          response += `We offer rates from 10.5% - 16% depending on credit score.\n\n`;
        }
        break;

      case 'emi_affordability':
        response += `💳 **EMI Affordability:** `;
        if (loanData) {
          response += `We can adjust the tenure to make EMI more comfortable. `;
          response += `Longer tenure = lower EMI (but slightly higher total interest). Would you like to explore this?\n\n`;
        }
        break;

      case 'documentation':
        response += `📄 **Documentation:** Minimal paperwork required! Just:\n`;
        response += `• ID Proof (Aadhaar/PAN - already verified)\n`;
        response += `• Latest salary slip or bank statement\n`;
        response += `• That's it! Process is 80% digital.\n\n`;
        break;

      case 'processing_time':
        response += `⚡ **Processing Time:** \n`;
        response += `• Instant eligibility check (done!)\n`;
        response += `• Approval: Within 24-48 hours\n`;
        response += `• Disbursal: 2-3 working days after approval\n\n`;
        break;

      case 'eligibility':
        if (customerData.creditScore) {
          response += `✅ **Good News!** Your credit score (${customerData.creditScore}) makes you eligible. `;
          response += `We've already pre-approved you for up to ₹${customerData.preApprovedLimit?.toLocaleString('en-IN')}.\n\n`;
        }
        break;

      case 'hidden_charges':
        response += `💯 **100% Transparent Pricing:**\n`;
        response += `• Processing Fee: 2% (one-time)\n`;
        response += `• No foreclosure charges after 6 months\n`;
        response += `• No hidden fees whatsoever\n\n`;
        break;
    }
  });

  response += "💡 Remember: We only recommend loans that are affordable for you. ";
  response += "Your financial well-being is our priority.\n\n";
  response += "Any other questions I can help clarify?";

  return response;
}

// Build response for ready customers
function buildReadyResponse(intent, customerData, loanData) {
  let response = "Excellent! You're all set to move forward. Here's what happens next:\n\n";

  response += "📋 **Next Steps:**\n";
  response += "1️⃣ Complete KYC verification (quick!)\n";
  response += "2️⃣ Upload salary slip for final verification\n";
  response += "3️⃣ Get instant approval decision\n";
  response += "4️⃣ E-sign sanction letter\n";
  response += "5️⃣ Loan disbursed to your account\n\n";

  if (loanData) {
    response += "💰 **Your Loan Summary:**\n";
    response += `• Amount: ₹${loanData.loanAmount?.toLocaleString('en-IN')}\n`;
    response += `• EMI: ₹${loanData.proposedEMI?.toLocaleString('en-IN')}/month\n`;
    response += `• Tenure: ${loanData.tenure} months\n`;
    response += `• Interest Rate: ${loanData.interestRate}% p.a.\n\n`;
  }

  response += "Ready to proceed? Just say 'Yes' and we'll get started! 🚀";

  return response;
}

// Handle specific objections with empathetic responses
export function handleObjection(objection, customerData, loanData) {
  const lowerObjection = objection.toLowerCase();

  if (lowerObjection.includes('interest') && lowerObjection.includes('high')) {
    return `I understand interest rate is important to you. Your rate of ${loanData?.interestRate || '10.5-12'}% is based on your credit profile. With your credit score of ${customerData.creditScore}, this is actually competitive. Would you like me to show how improving your credit score could get you better rates in future?`;
  }

  if (lowerObjection.includes('not sure') || lowerObjection.includes('think about')) {
    return `That's completely fine! Taking time to think is smart. Can I help clarify anything specific? Remember, there's no pressure - I'm here to provide information so you can make the best decision for yourself.`;
  }

  if (lowerObjection.includes('apply later') || lowerObjection.includes('later')) {
    return `No problem at all! Your pre-approval will remain valid. When you're ready, you can come back anytime. Before you go, is there anything specific you'd like to know that might help your decision?`;
  }

  if (lowerObjection.includes('can\'t afford') || lowerObjection.includes('too expensive')) {
    return `I appreciate your honesty. Let's find a solution that works for you:\n• We can extend the tenure to reduce EMI\n• Or reduce the loan amount to what's comfortable\n• Your financial comfort is more important than the loan amount. What monthly EMI feels right to you?`;
  }

  return `I understand your concern. Let me help address that so you can make an informed decision. What specific aspect would you like me to clarify?`;
}
