# Deploy Backend to Render.com (Free)

## Step 1: Create Render Account
1. Go to https://render.com/
2. Sign up with GitHub

## Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `gobzzz-g/LoanKit--AI`
3. Configure:
   - **Name**: `loankit-ai-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

## Step 3: Add Environment Variables
In Render dashboard, add:
```
GEMINI_API_KEY=your-gemini-api-key-here
NODE_ENV=production
PORT=3000
```

## Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your service URL: `https://loankit-ai-backend.onrender.com`

## Step 5: Update Frontend
Update `frontend/.env.production`:
```env
VITE_API_URL=https://loankit-ai-backend.onrender.com/api
```

## Step 6: Rebuild and Redeploy Frontend
```powershell
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

## Note:
- Free tier sleeps after 15 min of inactivity
- First request after sleep takes ~30 seconds
- Good enough for demos and hackathons!
