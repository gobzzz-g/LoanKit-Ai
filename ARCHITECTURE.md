# 🏗️ Architecture Documentation

## System Overview

The application follows a **Multi-Agent Architecture** pattern where a Master AI Agent orchestrates multiple specialized Worker Agents to complete the loan application process.

## Agent Architecture

### Master Agent (Orchestrator)
**Location:** `backend/agents/masterAgent.js`

**Responsibilities:**
- Main conversation interface with customers
- Session state management
- Delegates tasks to appropriate Worker Agents
- Aggregates responses and makes final decisions
- Maintains conversation context

**State Machine:**
```
GREETING → SALES → VERIFICATION → UNDERWRITING → DECISION
```

### Worker Agents

#### 1. Sales Agent
**Purpose:** Loan negotiation and terms alignment

**Functions:**
- Extract loan requirements from conversation
- Suggest optimal EMI options
- Negotiate within NBFC policy limits
- Recommend tenure and amount combinations

**Logic:**
```javascript
Input: User message + Customer profile
Process: Extract loan amount, tenure, purpose
Output: Loan request object + negotiation response
```

#### 2. Verification Agent
**Purpose:** KYC validation

**Functions:**
- Verify customer identity
- Check CRM records
- Validate phone, address, PAN
- Flag missing or inconsistent data

**Data Sources:**
- Mock CRM API (`services/mockData.js`)
- Customer database

#### 3. Underwriting Agent
**Purpose:** Credit assessment and eligibility

**Functions:**
- Fetch credit score from mock bureau
- Apply eligibility rules
- Calculate EMI and affordability
- Determine risk category
- Generate approval/rejection decision

**Decision Rules:**
```
IF credit_score < 700:
    REJECT (credit threshold)
ELSE IF loan_amount <= pre_approved_limit:
    APPROVE (instant approval)
ELSE IF loan_amount <= 2× pre_approved_limit:
    IF emi_to_income_ratio <= 50%:
        APPROVE (conditional)
    ELSE:
        REJECT (affordability)
ELSE:
    REJECT (excessive amount)
```

#### 4. Sanction Letter Generator
**Purpose:** PDF document creation

**Functions:**
- Generate formatted sanction letter
- Include all loan terms
- Add terms & conditions
- Create downloadable PDF

**Technology:** PDFKit library

## Data Flow

```
1. User starts chat → Master Agent initializes session
                    ↓
2. Master Agent greets → Sales Agent collects requirements
                    ↓
3. Sales Agent validates → Verification Agent checks KYC
                    ↓
4. KYC passes → Underwriting Agent assesses eligibility
                    ↓
5. Decision made → Master Agent explains outcome
                    ↓
6. If approved → Sanction Letter Generator creates PDF
```

## API Endpoints

### Chat Endpoints (`/api/chat`)

#### `POST /api/chat/start`
Start a new chat session

**Request:**
```json
{
  "customerId": "DEMO001"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-v4",
  "message": "Welcome message",
  "session": {
    "stage": "GREETING",
    "customer": {...}
  }
}
```

#### `POST /api/chat/message`
Send a message in existing session

**Request:**
```json
{
  "sessionId": "uuid",
  "message": "I want 5 lakhs loan",
  "metadata": {
    "loanAmount": 500000,
    "tenure": 24
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Agent response",
  "session": {
    "stage": "SALES",
    "loanRequest": {...}
  }
}
```

### Agent Endpoints (`/api/agents`)

#### `GET /api/agents/demo-customers`
Get all demo customer profiles

#### `GET /api/agents/customer/:customerId`
Get specific customer details

### PDF Endpoints (`/api/pdf`)

#### `POST /api/pdf/generate-sanction-letter`
Generate and download sanction letter

**Request:**
```json
{
  "customer": {...},
  "loanDetails": {...},
  "underwritingResult": {...}
}
```

**Response:** PDF file (application/pdf)

## Frontend Architecture

### Component Hierarchy

```
App.jsx
├── LandingPage.jsx
│   └── Demo customer cards
└── ChatInterface.jsx
    ├── ProgressTracker.jsx
    ├── MessageBubble.jsx (multiple)
    └── Input area
```

### State Management

**Session State:**
- Stored in sessionData from backend
- Updated on each message exchange
- Contains: stage, customer, loanRequest, results

**UI State:**
- Local component state for messages
- Loading and typing indicators
- Input field state

### API Service Layer

**Location:** `frontend/src/services/api.js`

Provides abstraction over Axios calls:
- `chatAPI`: Session and messaging
- `agentAPI`: Customer data
- `pdfAPI`: Document generation

## Mock Data Services

**Location:** `backend/services/mockData.js`

### Mock Customers Database
Three pre-configured profiles with different credit scenarios:
- DEMO001: High credit score (instant approval)
- DEMO002: Medium credit score (conditional)
- DEMO003: Low credit score (rejection)

### Interest Rate Tiers
```javascript
{
  excellent: { min: 750, rate: 10.5% },
  good:      { min: 700, rate: 12.0% },
  fair:      { min: 650, rate: 14.5% },
  poor:      { min: 0,   rate: 16.0% }
}
```

### EMI Calculation
```
EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]

Where:
P = Principal loan amount
r = Monthly interest rate (annual/12/100)
n = Tenure in months
```

## Gemini AI Integration

**Location:** `backend/services/gemini.js`

### Purpose
- Generate natural, human-like responses
- Explain loan decisions
- Provide negotiation suggestions
- Create empathetic communication

### Prompt Engineering

Each agent has a specialized system prompt:

**Master Agent:**
```
Role: Professional, empathetic loan advisor
Goals: Build trust, guide smoothly, explain clearly
Constraints: 2-3 sentences max, natural tone
```

**Sales Agent:**
```
Role: Persuasive loan specialist
Goals: Recommend optimal terms, negotiate ethically
Constraints: Value proposition focused
```

**Underwriting Agent:**
```
Role: Objective credit assessor
Goals: Data-driven decisions, clear reasoning
Constraints: Factual, professional tone
```

### Context Management
- Customer data injected into prompts
- Conversation history (last 3 messages)
- Role-specific instructions
- Current stage awareness

## Security Considerations

### API Key Protection
- Stored in `.env` file (never committed)
- Accessed via `process.env.GEMINI_API_KEY`
- Not exposed to frontend

### CORS Configuration
- Restricted to specific frontend origin
- Configurable via environment variable

### Input Validation
- Message length limits
- Session ID validation
- Parameter sanitization

## Performance Optimizations

### Backend
- In-memory session storage (use Redis in production)
- Lazy loading of Gemini model
- Efficient EMI calculations

### Frontend
- React component memoization
- Lazy loading of chat history
- Optimized re-renders
- Smooth scroll behavior

## Scalability Considerations

### Current Architecture (Demo)
- In-memory session storage
- Single server instance
- Mock data sources

### Production Recommendations
1. **Session Management:** Redis or database
2. **Load Balancing:** Nginx + multiple Node instances
3. **Database:** PostgreSQL for customer data
4. **Caching:** Redis for frequently accessed data
5. **Queue System:** Bull/RabbitMQ for async tasks
6. **Monitoring:** Prometheus + Grafana
7. **Logging:** Winston + ELK stack

## Testing Strategy

### Unit Tests (Recommended)
- Agent logic functions
- EMI calculations
- Eligibility rules
- API endpoints

### Integration Tests
- End-to-end chat flow
- PDF generation
- API contract tests

### User Acceptance Tests
- Demo scenarios
- Edge cases
- Error handling

## Future Enhancements

1. **Real Credit Bureau Integration**
2. **Document Upload (salary slips, bank statements)**
3. **Video KYC**
4. **Multi-language Support**
5. **Voice Interface**
6. **Advanced Analytics Dashboard**
7. **A/B Testing for Conversion**
8. **Integration with Core Banking Systems**

---

**Built for EY Techathon 2025 - BFSI Track**
