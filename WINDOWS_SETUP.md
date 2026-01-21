# 🪟 Windows Setup Instructions

## Step-by-Step Guide for Windows Users

### Prerequisites

1. **Install Node.js**
   - Download from: https://nodejs.org/
   - Choose LTS version (18.x or higher)
   - Run installer and follow prompts
   - Verify installation:
   ```powershell
   node --version
   npm --version
   ```

2. **Get Gemini API Key**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the key (you'll need it later)

3. **Install Git (Optional but recommended)**
   - Download from: https://git-scm.com/download/win
   - Use default settings during installation

### Installation Steps

#### Method 1: Automated Setup (Recommended)

1. **Open PowerShell in project folder**
   - Navigate to: `C:\Users\gobin\OneDrive\Pictures\EY - Phase Two`
   - Right-click and select "Open in Terminal" or "Open PowerShell window here"

2. **Run setup script**
   ```powershell
   node setup.js
   ```

3. **Follow prompts**
   - Enter your Gemini API key when asked
   - Wait for dependencies to install
   - Setup will complete automatically

#### Method 2: Manual Setup

**Backend Setup:**

1. **Open PowerShell in backend folder**
   ```powershell
   cd "C:\Users\gobin\OneDrive\Pictures\EY - Phase Two\backend"
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Create .env file**
   - Copy `.env.example` to `.env`
   ```powershell
   copy .env.example .env
   ```

4. **Edit .env file**
   - Open `.env` in Notepad or VS Code
   - Replace `your_gemini_api_key_here` with your actual API key
   - Save the file

**Frontend Setup:**

1. **Open NEW PowerShell window**
   ```powershell
   cd "C:\Users\gobin\OneDrive\Pictures\EY - Phase Two\frontend"
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Create .env file (optional)**
   ```powershell
   copy .env.example .env
   ```

### Running the Application

#### Start Backend Server

1. **In backend PowerShell terminal:**
   ```powershell
   cd "C:\Users\gobin\OneDrive\Pictures\EY - Phase Two\backend"
   npm run dev
   ```

2. **You should see:**
   ```
   🚀 Server running on http://localhost:3000
   📊 Environment: development
   🤖 Gemini API: ✅ Configured
   ```

#### Start Frontend Server

1. **In frontend PowerShell terminal (NEW window):**
   ```powershell
   cd "C:\Users\gobin\OneDrive\Pictures\EY - Phase Two\frontend"
   npm run dev
   ```

2. **You should see:**
   ```
   VITE v5.0.8  ready in XXX ms

   ➜  Local:   http://localhost:5173/
   ```

#### Access the Application

1. **Open your web browser**
2. **Go to:** http://localhost:5173
3. **You should see the landing page with demo customers**

### Testing the Demo

1. **Click on any demo customer card:**
   - Rajesh Kumar (Instant Approval)
   - Priya Sharma (Conditional Approval)
   - Amit Patel (Rejection)

2. **Chat with the AI:**
   - Type: "I need 4 lakhs"
   - Type: "24 months"
   - Follow the conversation

3. **Download sanction letter:**
   - If approved, click "Download Sanction Letter"
   - PDF will be saved to your Downloads folder

### Troubleshooting Windows-Specific Issues

#### Issue: PowerShell execution policy error

**Error message:**
```
cannot be loaded because running scripts is disabled on this system
```

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Issue: Port already in use

**Error message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
1. Find process using the port:
```powershell
netstat -ano | findstr :3000
```

2. Kill the process:
```powershell
taskkill /PID <PID_NUMBER> /F
```

Or change port in `.env` file:
```
PORT=3001
```

#### Issue: npm not recognized

**Error message:**
```
'npm' is not recognized as an internal or external command
```

**Solution:**
1. Reinstall Node.js
2. Restart PowerShell/Terminal
3. Add Node.js to PATH manually:
   - Search "Environment Variables" in Windows
   - Add: `C:\Program Files\nodejs\` to PATH

#### Issue: Node modules not found

**Error message:**
```
Error: Cannot find module 'express'
```

**Solution:**
```powershell
# In backend folder
npm install

# In frontend folder
npm install
```

#### Issue: Gemini API errors

**Error message:**
```
Failed to generate AI response
```

**Solution:**
1. Verify API key in `.env` file
2. Check if you have API quota
3. Ensure billing is enabled in Google Cloud (if required)
4. Test API key: https://aistudio.google.com/

#### Issue: Frontend can't connect to backend

**Symptoms:**
- Chat not working
- Network errors in browser console

**Solution:**
1. Ensure backend is running (check PowerShell terminal)
2. Verify backend URL in frontend `.env`:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
3. Check Windows Firewall:
   - Allow Node.js through firewall
   - Settings → Privacy & Security → Windows Security → Firewall

### Windows-Specific Tips

1. **Keep both terminals open**
   - One for backend
   - One for frontend
   - Don't close them while testing

2. **Use Windows Terminal (recommended)**
   - Install from Microsoft Store
   - Better experience than PowerShell
   - Multiple tabs support

3. **File paths**
   - Use quotes for paths with spaces:
   ```powershell
   cd "C:\Users\gobin\OneDrive\Pictures\EY - Phase Two"
   ```

4. **Antivirus interference**
   - Some antivirus software blocks Node.js
   - Add exception for project folder

5. **Windows Defender**
   - May scan node_modules (slow)
   - Add exclusion for better performance

### Quick Commands Reference

```powershell
# Check Node.js version
node --version

# Check npm version
npm --version

# Install packages
npm install

# Start development server
npm run dev

# Stop server (in terminal)
Ctrl + C

# Clear npm cache (if issues)
npm cache clean --force

# Reinstall everything
Remove-Item node_modules -Recurse -Force
npm install
```

### Keyboard Shortcuts

- **Ctrl + C**: Stop server
- **Ctrl + Shift + C**: Copy in terminal
- **Ctrl + Shift + V**: Paste in terminal
- **Alt + Tab**: Switch between windows
- **Windows + Arrow**: Snap windows side-by-side

### Folder Structure (Windows Explorer)

```
📁 EY - Phase Two
├── 📁 backend
│   ├── 📁 agents
│   ├── 📁 routes
│   ├── 📁 services
│   ├── 📄 server.js
│   ├── 📄 package.json
│   └── 📄 .env (you create this)
├── 📁 frontend
│   ├── 📁 src
│   │   ├── 📁 components
│   │   └── 📁 services
│   ├── 📄 index.html
│   ├── 📄 package.json
│   └── 📄 .env (optional)
└── 📄 README.md
```

### Need Help?

1. **Check documentation:**
   - README.md
   - QUICKSTART.md
   - ARCHITECTURE.md

2. **Common issues:**
   - See TROUBLESHOOTING section above

3. **Still stuck?**
   - Check package.json scripts
   - Verify Node.js installation
   - Review PowerShell output for errors

### Success Checklist

- [ ] Node.js installed (v18+)
- [ ] Both terminals open
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Browser showing landing page
- [ ] Demo customers clickable
- [ ] Chat working
- [ ] PDF downloads working

**Once all checkboxes are ticked, you're ready to demo! 🎉**

---

## Video Tutorial (Optional)

For visual learners, consider recording a screen capture showing:
1. Opening PowerShell
2. Running npm install
3. Starting servers
4. Opening browser
5. Testing a demo scenario

**Good luck with your EY Techathon demo! 🏆**
