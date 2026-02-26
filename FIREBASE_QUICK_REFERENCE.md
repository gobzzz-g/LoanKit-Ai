# 🚀 Quick Firebase Functions Commands

## Essential Commands

### Install Dependencies
```bash
cd functions
npm install
```

### Set Environment Variables
```bash
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

### Deploy Functions Only
```bash
firebase deploy --only functions
```

### Deploy Everything
```bash
firebase deploy
```

### View Logs
```bash
firebase functions:log --only api
```

### Test Health Check
```bash
curl https://loankit-ai-demo.web.app/health
```

---

## Frontend Commands

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Hosting Only
```bash
firebase deploy --only hosting
```

---

## Local Development

### Start Emulator
```bash
firebase emulators:start --only functions
```

### Run Frontend Dev Server
```bash
cd frontend
npm run dev
```

---

## Environment Configuration

### Check Current Config
```bash
firebase functions:config:get
```

### Update Config
```bash
firebase functions:config:set key="value"
```

### Remove Config
```bash
firebase functions:config:unset key
```

---

## Monitoring

### View Project in Console
```
https://console.firebase.google.com/project/loankit-ai-demo/functions
```

### Watch Logs in Real-time
```bash
firebase functions:log --only api --follow
```

---

## Troubleshooting

### Clear and Reinstall
```bash
cd functions
rm -rf node_modules package-lock.json
npm install
```

### Force Redeploy
```bash
firebase deploy --only functions --force
```

### Check Firebase Login
```bash
firebase login
firebase projects:list
```

---

## API URLs

**Production (via Hosting):**
```
https://loankit-ai-demo.web.app/api
```

**Production (Direct Functions):**
```
https://us-central1-loankit-ai-demo.cloudfunctions.net/api
```

**Local Emulator:**
```
http://localhost:5001/loankit-ai-demo/us-central1/api
```

---

## Quick Test Suite

```bash
# Test root
curl https://loankit-ai-demo.web.app/api

# Test health
curl https://loankit-ai-demo.web.app/health

# Test auth (POST)
curl -X POST https://loankit-ai-demo.web.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```
