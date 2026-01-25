# Deployment Configuration Fix ✅

## Issue Fixed
The application was using hardcoded `http://localhost:3000` URLs that don't work when deployed to hosting platforms.

## Changes Made

### 1. Environment Configuration Files Created
- **Frontend `.env`**: Local development configuration
- **Frontend `.env.production`**: Production deployment configuration  
- **Backend `.env`**: API keys and server configuration

### 2. Frontend API Calls Fixed
All hardcoded fetch calls in `App.jsx` now use the centralized API service:
- ✅ Session verification (`getCurrentUser`)
- ✅ Logout (`authAPI.logout`)
- ✅ Start chat session (`chatAPI.startSession`)
- ✅ Refresh user data across all pages

### 3. API Base URL Now Dynamic
- **Local dev**: Uses `http://localhost:3000/api`
- **Production**: Uses `VITE_API_URL` from `.env.production`

---

## 🚀 Deployment Instructions

### Step 1: Deploy Backend First

#### Option A: Render (Recommended - Free Tier)

1. **Push your code to GitHub** (if not already done)

2. **Go to [Render](https://render.com)** and sign in

3. **Create New Web Service**:
   - Connect your GitHub repository
   - Select `backend` folder as root directory
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables** in Render dashboard:
   ```
   GEMINI_API_KEY=AIzaSyBrh2iDq0J5-VuQkihtYX6qPk_mSRiZ4M0
   NODE_ENV=production
   PORT=3000
   ```

5. **Deploy and copy your backend URL** (e.g., `https://loankit-backend.onrender.com`)

#### Option B: Railway

1. Go to [Railway](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo and `backend` folder
4. Add environment variables (same as above)
5. Copy the deployed URL

---

### Step 2: Configure Frontend for Production

1. **Update `.env.production`** with your backend URL:
   ```bash
   # In frontend/.env.production
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Update CORS in backend** (if not already set):
   ```javascript
   // In backend/server.js
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://your-frontend-url.web.app',  // Add your frontend URL
       'https://your-frontend-url.firebaseapp.com'
     ],
     credentials: true
   }));
   ```

---

### Step 3: Deploy Frontend

#### Option A: Firebase (Current Setup)

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

3. **Your app will be live at**: `https://your-app.web.app`

#### Option B: Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel --prod
   ```

#### Option C: Netlify

1. Build:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy via Netlify CLI or drag-and-drop `dist` folder to [Netlify](https://netlify.com)

---

## 🧪 Testing After Deployment

1. **Open your frontend URL** in a browser
2. **Try to signup/login** - should NOT show "Failed to connect"
3. **Start a chat session** - should work without errors
4. **Apply for a loan** - should save to database
5. **Download PDF** - should generate sanction letter
6. **Check Dashboard** - should show loan history

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Failed to connect to server" | Update `.env.production` with correct backend URL |
| CORS errors | Add frontend URL to backend CORS settings |
| 404 errors | Ensure backend is deployed and running |
| Environment variables not working | Rebuild frontend after changing `.env.production` |
| Backend sleeping (Render free tier) | First request takes 30-60s to wake up |

---

## 📋 Deployment Checklist

### Backend
- [x] Backend deployed to Render/Railway
- [ ] Environment variables set (GEMINI_API_KEY, NODE_ENV)
- [ ] Backend URL copied
- [ ] Backend is accessible (test: `https://your-backend-url.com/health`)

### Frontend  
- [ ] `.env.production` updated with backend URL
- [ ] Frontend built with `npm run build`
- [ ] Frontend deployed to Firebase/Vercel/Netlify
- [ ] CORS updated in backend with frontend URL
- [ ] Test all features work

---

## 🔧 Local Development

To run locally after these changes:

```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend  
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3000

---

## 🌐 Current Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:3000/api
```

### Frontend (`.env.production`)
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Backend (`.env`)
```
GEMINI_API_KEY=AIzaSyBrh2iDq0J5-VuQkihtYX6qPk_mSRiZ4M0
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

---

## 🎯 Next Steps

1. **Deploy backend** to Render or Railway
2. **Update** `.env.production` with backend URL
3. **Build and deploy** frontend
4. **Test** all features end-to-end
5. **Share** your live URL! 🎉
