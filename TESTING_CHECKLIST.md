# ✅ Installation & Testing Checklist

## Pre-Installation Checklist

### System Requirements
- [ ] Windows 10/11 or macOS or Linux
- [ ] 4 GB RAM minimum (8 GB recommended)
- [ ] 500 MB free disk space
- [ ] Internet connection (for npm packages and Gemini API)

### Software Requirements
- [ ] Node.js 18+ installed
  ```powershell
  node --version  # Should show v18.x.x or higher
  ```
- [ ] npm 9+ installed
  ```powershell
  npm --version   # Should show 9.x.x or higher
  ```
- [ ] Google Gemini API key obtained
  - Visit: https://makersuite.google.com/app/apikey

## Installation Checklist

### Backend Setup
- [ ] Navigate to backend folder
- [ ] Run `npm install`
- [ ] Create `.env` file from `.env.example`
- [ ] Add Gemini API key to `.env`
- [ ] Verify all dependencies installed
  ```powershell
  # Check if node_modules exists
  dir node_modules  # Windows
  ls node_modules   # macOS/Linux
  ```

### Frontend Setup
- [ ] Navigate to frontend folder
- [ ] Run `npm install`
- [ ] Create `.env` file (optional)
- [ ] Verify all dependencies installed

## Startup Checklist

### Backend Server
- [ ] Open terminal in backend folder
- [ ] Run `npm run dev`
- [ ] Verify server starts without errors
- [ ] Check for success messages:
  - [ ] "🚀 Server running on http://localhost:3000"
  - [ ] "🤖 Gemini API: ✅ Configured"
- [ ] Test health endpoint:
  ```powershell
  # Open browser to: http://localhost:3000/health
  # Or use curl:
  curl http://localhost:3000/health
  ```
- [ ] Expected response: `{"status":"healthy","timestamp":"..."}`

### Frontend Server
- [ ] Open NEW terminal in frontend folder
- [ ] Run `npm run dev`
- [ ] Verify Vite starts without errors
- [ ] Check for success message:
  - [ ] "Local: http://localhost:5173/"
- [ ] Browser automatically opens (or open manually)

## Application Testing Checklist

### Landing Page Tests
- [ ] Landing page loads successfully
- [ ] Logo/title visible: "AI-Powered Personal Loans"
- [ ] Three feature cards displayed
- [ ] Three demo customer cards visible:
  - [ ] Rajesh Kumar (DEMO001)
  - [ ] Priya Sharma (DEMO002)
  - [ ] Amit Patel (DEMO003)
- [ ] Each card shows:
  - [ ] Customer name and ID
  - [ ] Credit score
  - [ ] Pre-approved limit
  - [ ] Scenario badge
- [ ] Footer shows "Built for EY Techathon 2025"

### Scenario 1: Instant Approval (Rajesh Kumar)

**Setup:**
- [ ] Click on "Rajesh Kumar" card
- [ ] Chat interface loads

**Greeting Phase:**
- [ ] Welcome message appears
- [ ] Shows customer name: "Hello Rajesh Kumar!"
- [ ] Shows pre-approved limit: "₹5,00,000"
- [ ] Progress tracker shows "Welcome" as complete

**Sales Phase:**
- [ ] Type: "I need 4 lakhs"
- [ ] Bot responds asking for tenure
- [ ] Progress tracker moves to "Loan Details"
- [ ] Quick replies appear (optional)

**Tenure Selection:**
- [ ] Type: "24 months"
- [ ] Bot summarizes loan request
- [ ] Shows estimated EMI
- [ ] Progress moves to "Verification"

**Verification Phase:**
- [ ] Automatic KYC verification message
- [ ] Success message: "✅ Verification complete"
- [ ] Progress moves to "Assessment"

**Underwriting Phase:**
- [ ] Credit assessment message
- [ ] Progress moves to "Decision"

**Decision Phase:**
- [ ] Approval message appears: "🎉 Congratulations! Your loan is APPROVED!"
- [ ] Loan details displayed:
  - [ ] Amount: ₹4,00,000
  - [ ] Tenure: 24 months
  - [ ] Interest rate: 10.5%
  - [ ] Monthly EMI shown
- [ ] "Download Sanction Letter" button appears in header

**PDF Generation:**
- [ ] Click "Download Sanction Letter" button
- [ ] PDF downloads successfully
- [ ] Open PDF and verify:
  - [ ] Customer details correct
  - [ ] Loan amount: ₹4,00,000
  - [ ] Tenure: 24 months
  - [ ] Interest rate: 10.5%
  - [ ] EMI amount shown
  - [ ] Terms & conditions listed
- [ ] Confirmation message in chat

### Scenario 2: Conditional Approval (Priya Sharma)

**Setup:**
- [ ] Click back arrow to return to landing page
- [ ] Click on "Priya Sharma" card

**Test Flow:**
- [ ] Follow same steps as Scenario 1
- [ ] Request: "5 lakhs for 36 months"
- [ ] Expected: Approval with salary verification mention
- [ ] Verify EMI is within 50% of income limit
- [ ] Download sanction letter

### Scenario 3: Rejection (Amit Patel)

**Setup:**
- [ ] Return to landing page
- [ ] Click on "Amit Patel" card

**Test Flow:**
- [ ] Request: "5 lakhs for 24 months"
- [ ] Expected: Rejection message
- [ ] Verify rejection reason is clear:
  - [ ] Mentions credit score below threshold (650 < 700)
  - [ ] Shows risk category: HIGH
- [ ] No sanction letter button appears
- [ ] Helpful message about alternatives

## Edge Cases & Error Handling

### Network Issues
- [ ] Stop backend server
- [ ] Try sending message in chat
- [ ] Verify error message appears
- [ ] Restart backend
- [ ] Verify chat resumes working

### Invalid Inputs
- [ ] Try sending empty message
- [ ] Send button should be disabled
- [ ] Try very long messages (1000+ characters)
- [ ] Should handle gracefully

### Session Management
- [ ] Complete one scenario
- [ ] Return to landing page
- [ ] Start new scenario
- [ ] Verify no data from previous session
- [ ] Each session should be independent

## Performance Testing

### Load Times
- [ ] Landing page loads in < 2 seconds
- [ ] Chat interface loads in < 1 second
- [ ] Message responses in < 3 seconds
- [ ] PDF generation in < 2 seconds

### Resource Usage
- [ ] Backend memory usage reasonable (< 200 MB)
- [ ] Frontend memory usage reasonable (< 100 MB)
- [ ] No memory leaks during multiple sessions

## UI/UX Testing

### Desktop (1920x1080)
- [ ] Layout is clean and professional
- [ ] Text is readable
- [ ] Buttons are appropriately sized
- [ ] Colors match BFSI theme (blue primary)
- [ ] Animations are smooth

### Mobile Responsive (375x667)
- [ ] Open browser dev tools (F12)
- [ ] Toggle device toolbar
- [ ] Select iPhone SE or similar
- [ ] Test all scenarios:
  - [ ] Landing page responsive
  - [ ] Chat interface scrollable
  - [ ] Buttons accessible
  - [ ] Text readable
  - [ ] Progress tracker visible

### Browser Compatibility
- [ ] Chrome (recommended)
- [ ] Edge
- [ ] Firefox
- [ ] Safari (if on Mac)

## API Endpoint Testing

### Health Check
```powershell
curl http://localhost:3000/health
```
- [ ] Returns 200 status
- [ ] Response: `{"status":"healthy",...}`

### Demo Customers
```powershell
curl http://localhost:3000/api/agents/demo-customers
```
- [ ] Returns 200 status
- [ ] Lists 3 customers
- [ ] Each has: customerId, name, creditScore, etc.

### Chat Start
```powershell
curl -X POST http://localhost:3000/api/chat/start `
  -H "Content-Type: application/json" `
  -d '{"customerId":"DEMO001"}'
```
- [ ] Returns sessionId
- [ ] Returns welcome message

## Gemini AI Integration Testing

### API Connection
- [ ] Verify Gemini API key in `.env`
- [ ] Test with first message
- [ ] Response should be natural and conversational
- [ ] No "API error" messages

### Response Quality
- [ ] Responses are human-like
- [ ] Grammar and spelling correct
- [ ] Context is maintained
- [ ] Explanations are clear

## Security Testing

### Environment Variables
- [ ] `.env` file not committed to git
- [ ] API key not visible in frontend
- [ ] Check browser dev tools → Network tab
- [ ] API key only in backend

### CORS
- [ ] Backend accepts requests from frontend
- [ ] Try accessing from different domain (should fail)
- [ ] Verify CORS headers in response

## Documentation Testing

### README Accuracy
- [ ] Follow README instructions
- [ ] All commands work
- [ ] Links are not broken
- [ ] Information is up-to-date

### Quick Start Guide
- [ ] Follow QUICKSTART.md step-by-step
- [ ] New user can set up successfully
- [ ] No missing steps

## Deployment Preparation

### Production Readiness
- [ ] All tests pass
- [ ] No console errors
- [ ] No console warnings (acceptable if minor)
- [ ] Environment variables documented
- [ ] README is complete

### Demo Preparation
- [ ] Practice demo flow 3 times
- [ ] Timing: 5-7 minutes total
- [ ] Can explain architecture clearly
- [ ] Can handle questions
- [ ] Backup plan if demo fails

## Final Sign-Off

### Code Quality
- [ ] Code is clean and readable
- [ ] Comments where necessary
- [ ] Consistent formatting
- [ ] No unused code
- [ ] Error handling in place

### Functionality
- [ ] All features working
- [ ] No critical bugs
- [ ] Edge cases handled
- [ ] Performance acceptable

### Documentation
- [ ] All docs are complete
- [ ] No broken links
- [ ] Clear instructions
- [ ] Examples provided

### Demo Ready
- [ ] Application runs smoothly
- [ ] All scenarios tested
- [ ] PDF generation works
- [ ] Presentation prepared

---

## Sign-Off

- [ ] **I have completed all installation steps**
- [ ] **I have tested all three scenarios**
- [ ] **I have verified PDF generation**
- [ ] **I have tested on mobile view**
- [ ] **I have reviewed all documentation**
- [ ] **I am ready to present**

**Tested by:** ___________________  
**Date:** ___________________  
**Signature:** ___________________  

---

## Emergency Troubleshooting Contacts

**If something fails during demo:**

1. **Refresh browser** - F5
2. **Restart servers** - Ctrl+C, then `npm run dev`
3. **Check backend logs** - Look at terminal output
4. **Check browser console** - F12 → Console tab
5. **Use backup demo video** - If all else fails

**Common Quick Fixes:**

| Problem | Quick Fix |
|---------|-----------|
| Backend not responding | Restart backend server |
| Frontend blank screen | Clear cache, hard refresh (Ctrl+F5) |
| API errors | Check Gemini API key and quota |
| PDF not downloading | Check browser pop-up blocker |
| Slow responses | Check internet connection |

---

**When all checkboxes are ticked, you're 100% ready! 🏆**

**Good luck with your EY Techathon presentation!** 🚀
