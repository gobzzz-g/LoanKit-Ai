# 🚨 QUICK FIX: Deploy Backend in 5 Minutes

Your frontend is live but can't connect to the backend. Here's the fastest solution:

## Option 1: Deploy to Render.com (Recommended - 5 mins)

### Step 1: Prepare Backend
Your backend is already configured with CORS for Firebase!

### Step 2: Deploy to Render
1. **Go to**: https://render.com
2. **Sign up** with GitHub or Email
3. Click **"New +"** → **"Web Service"**
4. Choose **"Build and deploy from a Git repository"**
   - OR click **"Deploy without Git"** and upload the `backend` folder

### Step 3: Configure Service
```
Name: loankit-ai-backend
Region: Choose closest to you
Branch: main (if using Git)
Root Directory: backend (if deploying full repo)
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### Step 4: Add Environment Variable
Click **"Environment"** tab:
```
GEMINI_API_KEY = your_actual_gemini_key_here
NODE_ENV = production
```

### Step 5: Deploy
- Click **"Create Web Service"**
- Wait 2-3 minutes for deployment
- Copy your backend URL (e.g., `https://loankit-ai-backend.onrender.com`)

### Step 6: Update Frontend
```bash
# Edit frontend/.env.production:
echo "VITE_API_URL=https://your-render-url.onrender.com/api" > frontend/.env.production

# Rebuild and deploy:
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

## Option 2: Railway.app (Fastest - 3 mins)

1. **Go to**: https://railway.app
2. **New Project** → **"Deploy from GitHub repo"** OR **"Empty Project"**
3. If empty project:
   - Click **"Deploy"** → **"Upload Files"**
   - Upload your `backend` folder
4. Railway auto-detects Node.js
5. Add environment variable:
   - Go to **Variables** tab
   - Add: `GEMINI_API_KEY=your_key`
6. Copy the deployment URL from **Settings** → **Domains**
7. Update frontend `.env.production` and redeploy (see Step 6 above)

---

## Option 3: Quick Test with Local Backend

**For immediate testing:**

1. **Keep backend running locally:**
   ```bash
   npm run dev:backend
   ```

2. **Install ngrok** (tunneling tool):
   ```bash
   npm install -g ngrok
   ```

3. **Create public tunnel:**
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

5. **Update frontend:**
   ```bash
   echo "VITE_API_URL=https://abc123.ngrok.io/api" > frontend/.env.production
   cd frontend && npm run build && cd .. && firebase deploy --only hosting
   ```

**⚠️ Note**: ngrok URL changes each time you restart. Good for quick demos only.

---

## ✅ After Backend Deployment

Your app will be fully functional at:
- **Frontend**: https://loankit-ai-demo.web.app
- **Backend**: Your deployed backend URL

Test the complete loan flow to ensure everything works!

---

## 🎯 Quickest Path (Recommended)

Use **Render.com** - it's free, reliable, and takes just 5 minutes:
1. Upload backend folder to Render
2. Add GEMINI_API_KEY
3. Get URL
4. Update frontend and redeploy

**Need help?** The backend is already configured with proper CORS settings for your Firebase domain!
