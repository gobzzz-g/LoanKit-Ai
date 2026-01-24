// Mock customer database
export const mockCustomers = {
  'DEMO001': {
    customerId: 'DEMO001',
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    email: 'rajesh.kumar@example.com',
    address: '123, MG Road, Bangalore - 560001',
    pan: 'ABCDE1234F',
    creditScore: 785,
    preApprovedLimit: 500000,
    monthlyIncome: 80000,
    employmentType: 'Salaried',
    company: 'Tech Corp India',
    kycVerified: true,
    existingLoans: []
  },
  'DEMO002': {
    customerId: 'DEMO002',
    name: 'Priya Sharma',
    phone: '+91-9876543211',
    email: 'priya.sharma@example.com',
    address: '456, Park Street, Mumbai - 400001',
    pan: 'FGHIJ5678K',
    creditScore: 720,
    preApprovedLimit: 300000,
    monthlyIncome: 60000,
    employmentType: 'Salaried',
    company: 'Finance Solutions Ltd',
    kycVerified: true,
    existingLoans: []
  },
  'DEMO003': {
    customerId: 'DEMO003',
    name: 'Amit Patel',
    phone: '+91-9876543212',
    email: 'amit.patel@example.com',
    address: '789, Ring Road, Ahmedabad - 380001',
    pan: 'LMNOP9012Q',
    creditScore: 650,
    preApprovedLimit: 200000,
    monthlyIncome: 45000,
    employmentType: 'Salaried',
    company: 'Manufacturing Inc',
    kycVerified: true,
    existingLoans: [
      { type: 'Credit Card', emi: 8000 }
    ]
  },
  'DEMO004': {
    customerId: 'DEMO004',
    name: 'Ananya Iyer',
    phone: '+91-9876543213',
    email: 'ananya.iyer@example.com',
    address: '45, Anna Salai, Chennai - 600002',
    pan: 'RSTUW3456V',
    creditScore: 805,
    preApprovedLimit: 750000,
    monthlyIncome: 120000,
    employmentType: 'Salaried',
    company: 'Global IT Solutions',
    kycVerified: true,
    existingLoans: []
  },
  'DEMO005': {
    customerId: 'DEMO005',
    name: 'Vikram Singh',
    phone: '+91-9876543214',
    email: 'vikram.singh@example.com',
    address: '88, Connaught Place, New Delhi - 110001',
    pan: 'XYZAB7890C',
    creditScore: 690,
    preApprovedLimit: 350000,
    monthlyIncome: 55000,
    employmentType: 'Salaried',
    company: 'Retail Solutions Pvt Ltd',
    kycVerified: true,
    existingLoans: [
      { type: 'Car Loan', emi: 12000 }
    ]
  },
  'DEMO006': {
    customerId: 'DEMO006',
    name: 'Neha Gupta',
    phone: '+91-9876543215',
    email: 'neha.gupta@example.com',
    address: '12, Salt Lake, Kolkata - 700091',
    pan: 'DEFGH2345I',
    creditScore: 770,
    preApprovedLimit: 600000,
    monthlyIncome: 95000,
    employmentType: 'Salaried',
    company: 'Pharmaceutical Corp',
    kycVerified: true,
    existingLoans: []
  }
};

// Mock interest rate tiers
export const interestRates = {
  excellent: { min: 750, rate: 10.5, label: 'Excellent' },
  good: { min: 700, rate: 12.0, label: 'Good' },
  fair: { min: 650, rate: 14.5, label: 'Fair' },
  poor: { min: 0, rate: 16.0, label: 'Poor' }
};

// Calculate interest rate based on credit score
export function getInterestRate(creditScore) {
  if (creditScore >= 750) return interestRates.excellent;
  if (creditScore >= 700) return interestRates.good;
  if (creditScore >= 650) return interestRates.fair;
  return interestRates.poor;
}

// Calculate EMI
export function calculateEMI(principal, annualRate, tenureMonths) {
  const monthlyRate = annualRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

// Loan eligibility assessment
export function assessLoanEligibility(customer, loanAmount, tenure) {
  // Provide default values for real users who might not have complete profiles
  const creditScore = customer.creditScore || 700;
  const preApprovedLimit = customer.preApprovedLimit || 300000;
  const monthlyIncome = customer.monthlyIncome || 50000;
  const existingLoans = customer.existingLoans || [];
  
  // Calculate existing EMI burden
  const existingEMI = existingLoans.reduce((sum, loan) => sum + (loan.emi || 0), 0);
  
  // Get interest rate
  const interestInfo = getInterestRate(creditScore);
  const proposedEMI = calculateEMI(loanAmount, interestInfo.rate, tenure);
  const totalEMI = existingEMI + proposedEMI;
  const emiToIncomeRatio = (totalEMI / monthlyIncome) * 100;
  
  // Decision logic
  let decision = 'REJECTED';
  let reason = '';
  let requiresSalarySlip = false;
  let riskCategory = 'HIGH';
  
  // Credit score check
  if (creditScore < 700) {
    decision = 'REJECTED';
    reason = `Credit score (${creditScore}) below minimum threshold of 700`;
    riskCategory = 'HIGH';
  }
  // Instant approval
  else if (loanAmount <= preApprovedLimit) {
    decision = 'APPROVED';
    reason = `Loan amount within pre-approved limit. Excellent credit profile (${creditScore})`;
    riskCategory = creditScore >= 750 ? 'LOW' : 'MEDIUM';
  }
  // Conditional approval
  else if (loanAmount <= preApprovedLimit * 2) {
    if (emiToIncomeRatio <= 50) {
      decision = 'APPROVED';
      reason = `Approved based on income verification. EMI to income ratio: ${emiToIncomeRatio.toFixed(1)}%`;
      riskCategory = 'MEDIUM';
      requiresSalarySlip = true;
    } else {
      decision = 'REJECTED';
      reason = `EMI burden (${emiToIncomeRatio.toFixed(1)}%) exceeds 50% of monthly income`;
      riskCategory = 'HIGH';
    }
  }
  // Reject excessive loan
  else {
    decision = 'REJECTED';
    reason = `Requested amount (₹${loanAmount.toLocaleString('en-IN')}) significantly exceeds pre-approved limit (₹${preApprovedLimit.toLocaleString('en-IN')})`;
    riskCategory = 'HIGH';
  }
  
  return {
    decision,
    reason,
    requiresSalarySlip,
    riskCategory,
    creditScore,
    interestRate: interestInfo.rate,
    proposedEMI,
    totalEMI,
    emiToIncomeRatio: emiToIncomeRatio.toFixed(2),
    preApprovedLimit,
    loanAmount,
    tenure
  };
}

// Verify KYC
export function verifyKYC(customerId) {
  const customer = mockCustomers[customerId];
  if (!customer) {
    return {
      verified: false,
      message: 'Customer not found in CRM',
      data: null
    };
  }
  
  return {
    verified: customer.kycVerified,
    message: customer.kycVerified ? 'KYC verified successfully' : 'KYC verification pending',
    data: {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      pan: customer.pan
    }
  };
}

// Get customer by ID
export function getCustomer(customerId) {
  return mockCustomers[customerId] || null;
}

// Get customer by phone number
export function getCustomerByPhone(phoneNumber) {
  // Normalize phone number (remove spaces, dashes, country code)
  const normalizedInput = phoneNumber.replace(/[\s\-+]/g, '');
  
  for (const customer of Object.values(mockCustomers)) {
    const normalizedCustomerPhone = customer.phone.replace(/[\s\-+]/g, '');
    
    // Check if the last 10 digits match (Indian mobile number)
    if (normalizedInput.length >= 10 && normalizedCustomerPhone.endsWith(normalizedInput.slice(-10))) {
      return customer;
    }
  }
  
  return null;
}

// Get all demo customers
export function getDemoCustomers() {
  return Object.values(mockCustomers);
}
