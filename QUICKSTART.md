# 🚀 Quick Start Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Google Gemini API Key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Installation Steps

### 1. Backend Setup

Open terminal and navigate to backend folder:

```powershell
cd backend
npm install
```

Create `.env` file from example:

```powershell
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
PORT=3000
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```powershell
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
📊 Environment: development
🤖 Gemini API: ✅ Configured
```

### 2. Frontend Setup

Open a NEW terminal and navigate to frontend folder:

```powershell
cd frontend
npm install
```

Start the frontend development server:

```powershell
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### 3. Access the Application

Open your browser and go to: **http://localhost:5173**

## Demo Flow

### Test Scenario 1: Instant Approval (Rajesh Kumar)
- Customer ID: DEMO001
- Credit Score: 785 (Excellent)
- Pre-approved: ₹5 lakhs
- Try requesting: ₹4 lakhs for 24 months
- Expected: ✅ Instant approval

### Test Scenario 2: Conditional Approval (Priya Sharma)
- Customer ID: DEMO002
- Credit Score: 720 (Good)
- Pre-approved: ₹3 lakhs
- Try requesting: ₹5 lakhs for 36 months
- Expected: ⚠️ Approval with salary verification

### Test Scenario 3: Rejection (Amit Patel)
- Customer ID: DEMO003
- Credit Score: 650 (Below threshold)
- Pre-approved: ₹2 lakhs
- Try requesting: ₹3 lakhs for 24 months
- Expected: ❌ Rejection due to credit score

## Troubleshooting

### Backend won't start
- Check if port 3000 is available
- Verify Gemini API key is correct
- Run `npm install` again

### Frontend won't start
- Check if port 5173 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### API connection errors
- Ensure backend is running on port 3000
- Check CORS settings in backend/server.js
- Verify VITE_API_URL in frontend/.env

### Gemini API errors
- Verify API key is valid
- Check API quota limits
- Ensure you have billing enabled (if required)

## Project Structure

```
EY - Phase Two/
├── backend/
│   ├── agents/           # AI Agent logic
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── server.js         # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   └── App.jsx       # Main app
│   ├── index.html
│   └── package.json
└── README.md
```

## Features Demonstrated

✅ Multi-agent AI orchestration (Master + 4 Worker Agents)
✅ Conversational UI with natural language processing
✅ Real-time credit assessment
✅ Automated KYC verification
✅ Dynamic loan negotiation
✅ PDF sanction letter generation
✅ Explainable AI decisions
✅ Progress tracking
✅ Mobile-responsive design

## Technology Stack

**Backend:**
- Node.js + Express
- Google Gemini AI
- PDFKit for document generation
- Mock data services

**Frontend:**
- React 18
- Vite (build tool)
- Tailwind CSS
- Lucide Icons
- Axios

## Support

For issues or questions, check:
- Backend logs in terminal
- Browser console (F12)
- Network tab for API calls

---

**Happy Testing! 🎉**
