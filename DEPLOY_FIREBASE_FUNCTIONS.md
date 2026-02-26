# 🚀 LoanKit AI - Firebase Functions Deployment Guide

## Quick Start (3 Steps)

### 1️⃣ Install Dependencies
```bash
cd functions
npm install
```

### 2️⃣ Set API Key
```bash
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY_HERE"
```

### 3️⃣ Deploy
```bash
firebase deploy --only functions
```

---

## ✅ Verify Deployment

Test your API:
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

---

## 🌐 Your API URL

Your backend is now available at:

**Production:** `https://loankit-ai-demo.web.app/api`

Test endpoints:
- `GET /` → API info
- `GET /health` → Health check
- `POST /api/auth/login` → Login
- `POST /api/chat/start` → Start chat
- `GET /api/agents/status` → Agent status

---

## 📦 Available NPM Scripts

From project root:

```bash
# Deploy everything
npm run deploy

# Deploy only functions
npm run deploy:functions

# Deploy only frontend
npm run deploy:hosting

# View logs
npm run logs

# Run verification
npm run verify

# Start emulator
npm run emulate
```

---

## 📚 Documentation

- **[MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)** - Full migration summary
- **[FIREBASE_FUNCTIONS_MIGRATION.md](./FIREBASE_FUNCTIONS_MIGRATION.md)** - Detailed guide
- **[FIREBASE_QUICK_REFERENCE.md](./FIREBASE_QUICK_REFERENCE.md)** - Command reference

---

## 🔍 Troubleshooting

### Module Errors
```bash
cd functions
rm -rf node_modules package-lock.json
npm install
```

### Missing API Key
```bash
firebase functions:config:set gemini.api_key="YOUR_KEY"
firebase deploy --only functions
```

### Check Logs
```bash
firebase functions:log --only api
```

---

## 💰 Cost

**Free Tier Includes:**
- 2,000,000 invocations/month
- 400,000 GB-seconds/month
- Perfect for hackathons and moderate production use

**Your setup scales to zero** when idle = $0 cost when not used!

---

## 🎉 That's It!

Your backend is now live on Firebase Cloud Functions.

**No more Railway.** Everything runs on Firebase. 🚀

