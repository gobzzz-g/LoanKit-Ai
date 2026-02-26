# Firebase Functions Migration Guide

## ✅ Migration Complete!

Your LoanKit AI backend has been successfully migrated from Railway to Firebase Cloud Functions.

---

## 🏗️ Architecture Overview

**Before:**
- Frontend: Firebase Hosting
- Backend: Railway (Express.js)

**After:**
- Frontend: Firebase Hosting
- Backend: Firebase Cloud Functions (Express.js wrapped)
- **Benefit:** Single Firebase project, no Railway dependency

---

## 📦 Step 1: Install Dependencies

Navigate to the functions folder and install dependencies:

```bash
cd functions
npm install
```

This will install:
- `firebase-functions` - Firebase Functions SDK
- `firebase-admin` - Firebase Admin SDK
- `express` - Express.js framework
- `cors` - CORS middleware
- `@google/generative-ai` - Gemini API client
- `pdfkit`, `uuid`, `axios`, `dotenv` - Other dependencies

---

## 🔑 Step 2: Set Up Environment Variables

### Option A: Using Firebase Console (Recommended for Production)

Set your Gemini API key using Firebase CLI:

```bash
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY_HERE"
```

To view current config:
```bash
firebase functions:config:get
```

**Note:** After setting config, you need to redeploy functions for changes to take effect.

### Option B: Using .env file (Local Development Only)

1. Copy the example file:
```bash
cd functions
copy .env.example .env
```

2. Edit `.env` and add your API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key
NODE_ENV=production
```

**⚠️ Important:** The `.env` file only works locally. For production, use Firebase Functions config (Option A).

---

## 🚀 Step 3: Deploy to Firebase

### Deploy Everything (Hosting + Functions)

From the project root:

```bash
firebase deploy
```

### Deploy Only Functions (Faster)

```bash
firebase deploy --only functions
```

### Deploy Only Hosting

```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

## 🎯 Your API Endpoints

After deployment, your backend will be available at:

### Primary URL (via Firebase Hosting rewrite):
```
https://loankit-ai-demo.web.app/api
```

### Direct Cloud Functions URL (alternative):
```
https://us-central1-loankit-ai-demo.cloudfunctions.net/api
```

### Available Routes:
- `GET /` - API info
- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User signup
- `POST /api/chat/start` - Start chat session
- `POST /api/chat/message` - Send chat message
- `GET /api/agents/status` - Agent status
- `POST /api/pdf/generate` - Generate PDF

---

## 🧪 Step 4: Test Your Deployment

### Test Health Endpoint

```bash
curl https://loankit-ai-demo.web.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-26T...",
  "service": "LoanKit AI Functions",
  "gemini": "✅ Configured"
}
```

### Test from Frontend

1. Build and deploy frontend:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

2. Visit: `https://loankit-ai-demo.web.app`

3. Try logging in and chatting

---

## 📊 Monitor Your Functions

### View Logs

Real-time logs:
```bash
firebase functions:log --only api
```

Recent logs:
```bash
firebase functions:log --only api --limit 50
```

### Firebase Console

Visit: https://console.firebase.google.com/project/loankit-ai-demo/functions

Here you can monitor:
- Function invocations
- Execution time
- Error rate
- Memory usage
- Cost estimates

---

## 💰 Cost Optimization

Your functions are configured for **free tier friendly** usage:

```javascript
{
  maxInstances: 10,         // Limit concurrent instances
  timeoutSeconds: 60,       // 60 seconds max
  memory: '512MB',          // Adequate for AI operations
  minInstances: 0           // Scale to zero when idle (FREE!)
}
```

**Free Tier Limits:**
- 2,000,000 invocations/month
- 400,000 GB-seconds/month
- 200,000 GHz-seconds/month
- 5GB network egress/month

**Estimated Usage:**
With moderate usage (1000 requests/day), you'll stay well within free tier.

---

## 🔧 Troubleshooting

### Issue: "GEMINI_API_KEY is missing"

**Solution:** Set the environment variable:
```bash
firebase functions:config:set gemini.api_key="YOUR_KEY"
firebase deploy --only functions
```

### Issue: "CORS error from frontend"

**Solution:** The allowed origins are already configured in `functions/index.js`:
- `https://loankit-ai-demo.web.app`
- `https://loankit-ai-demo.firebaseapp.com`
- `http://localhost:5173` (for development)

If you need to add more origins, edit the `allowedOrigins` array.

### Issue: "Function deployment failed"

**Solution:** 
1. Check Node.js version: `node --version` (should be v18+)
2. Check Firebase CLI: `firebase --version` (should be latest)
3. Check `functions/package.json` has `"type": "module"`
4. Ensure you're logged in: `firebase login`

### Issue: "Module not found" errors

**Solution:**
```bash
cd functions
rm -rf node_modules package-lock.json
npm install
firebase deploy --only functions
```

### Issue: "Function times out"

**Solution:** 
- Default timeout is 60s
- If you need more, change `timeoutSeconds` in `functions/index.js`
- Maximum allowed: 540s (9 minutes) for HTTP functions

---

## 🔄 Local Development

### Run Functions Emulator

```bash
firebase emulators:start --only functions
```

This will start the emulator at: `http://localhost:5001/loankit-ai-demo/us-central1/api`

### Test Locally

Update `frontend/.env` to point to emulator:
```env
VITE_API_URL=http://localhost:5001/loankit-ai-demo/us-central1/api/api
```

---

## 📝 File Structure

```
functions/
├── index.js              # Main entry point (Express app wrapper)
├── package.json          # Dependencies & scripts
├── .env                  # Local environment variables (not deployed)
├── .env.example          # Environment template
│
├── routes/               # API route handlers
│   ├── auth.js          # Authentication routes
│   ├── chat.js          # Chat routes
│   ├── agents.js        # Agent management routes
│   └── pdf.js           # PDF generation routes
│
├── services/             # Business logic
│   ├── gemini.js        # Gemini AI integration
│   ├── userDatabase.js  # User data management
│   ├── persuasionLogic.js
│   └── mockData.js
│
├── agents/               # AI agents
│   └── masterAgent.js   # Main orchestration agent
│
└── data/                 # JSON data storage
    ├── users.json
    └── sessions.json
```

---

## 🎉 Benefits of This Migration

✅ **No More Railway Costs** - Functions scale to zero when idle  
✅ **Same Codebase** - All existing business logic preserved  
✅ **Better Integration** - Frontend and backend in one Firebase project  
✅ **Auto-scaling** - Handles traffic spikes automatically  
✅ **Built-in Monitoring** - Firebase Console provides metrics  
✅ **Simpler Deployment** - One command: `firebase deploy`  
✅ **Free Tier Friendly** - 2M invocations/month free  

---

## 🚦 Quick Deployment Checklist

- [ ] Install dependencies: `cd functions && npm install`
- [ ] Set Gemini API key: `firebase functions:config:set gemini.api_key="YOUR_KEY"`
- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Deploy everything: `firebase deploy`
- [ ] Test health check: `curl https://loankit-ai-demo.web.app/health`
- [ ] Test frontend: Visit `https://loankit-ai-demo.web.app`
- [ ] Check logs: `firebase functions:log --only api`

---

## 📞 Support & Resources

- **Firebase Functions Docs:** https://firebase.google.com/docs/functions
- **Express.js Docs:** https://expressjs.com/
- **Gemini API Docs:** https://ai.google.dev/docs

---

## 🎯 Next Steps

1. **Set up CI/CD:** Use GitHub Actions for automated deployments
2. **Add monitoring:** Set up alerts for errors and performance
3. **Implement caching:** Use Firebase Firestore for session storage
4. **Add rate limiting:** Protect against abuse

---

**🎊 Congratulations!** Your backend is now fully migrated to Firebase Cloud Functions!
