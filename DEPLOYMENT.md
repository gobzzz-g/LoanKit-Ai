# 🚀 Deployment Guide

## Production Deployment Options

### Option 1: Cloud Deployment (Recommended)

#### Backend Deployment (Railway / Render / Heroku)

**Using Railway:**

1. Install Railway CLI:
```powershell
npm install -g @railway/cli
```

2. Login and initialize:
```powershell
railway login
cd backend
railway init
```

3. Add environment variables in Railway dashboard:
```
GEMINI_API_KEY=your_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=3000
```

4. Deploy:
```powershell
railway up
```

**Using Render:**

1. Create `render.yaml` in root:
```yaml
services:
  - type: web
    name: ey-techathon-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: NODE_ENV
        value: production
```

2. Connect GitHub repo and deploy

#### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```powershell
npm install -g vercel
```

2. Deploy from frontend directory:
```powershell
cd frontend
vercel
```

3. Set environment variable in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

4. Redeploy after env var update

### Option 2: Docker Deployment

#### Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Frontend Dockerfile
Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

#### Docker Compose
Create `docker-compose.yml` in root:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NODE_ENV=production
      - FRONTEND_URL=http://localhost:80
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

Run with:
```powershell
docker-compose up -d
```

### Option 3: Traditional VPS (AWS EC2, DigitalOcean)

1. **Setup server:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

2. **Deploy backend:**
```bash
cd /var/www
git clone your-repo
cd your-repo/backend
npm install
pm2 start server.js --name ey-backend
pm2 save
pm2 startup
```

3. **Deploy frontend:**
```bash
cd /var/www/your-repo/frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

4. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables Checklist

### Backend (.env)
```
PORT=3000
GEMINI_API_KEY=your_actual_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-domain.com/api
```

## Pre-Deployment Checklist

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] API keys secured (not in code)
- [ ] CORS configured correctly
- [ ] Error handling tested
- [ ] Build successful locally
- [ ] Demo scenarios tested
- [ ] PDF generation working
- [ ] Mobile responsiveness checked

## Post-Deployment Testing

1. **Health Check:**
```bash
curl https://your-backend.com/health
```

2. **API Test:**
```bash
curl https://your-backend.com/api/agents/demo-customers
```

3. **Frontend Access:**
- Open browser to frontend URL
- Test all three demo scenarios
- Verify PDF download
- Check mobile view

## Monitoring & Maintenance

### Logs

**Backend (PM2):**
```bash
pm2 logs ey-backend
```

**Backend (Docker):**
```bash
docker-compose logs -f backend
```

### Performance Monitoring

Add these services (optional):
- **Uptime:** UptimeRobot or Pingdom
- **APM:** New Relic or Datadog
- **Errors:** Sentry
- **Analytics:** Google Analytics

### Backup Strategy

1. **Database:** Daily automated backups (when using real DB)
2. **Code:** Git repository (already done)
3. **Environment:** Secure storage for .env files
4. **PDFs:** S3 or cloud storage

## Scaling Considerations

### Horizontal Scaling

1. **Backend:** Add load balancer + multiple instances
2. **Frontend:** CDN (Cloudflare, AWS CloudFront)
3. **Sessions:** Move to Redis cluster
4. **Database:** Read replicas

### Cost Optimization

**Free Tier Options:**
- Backend: Railway (500 hours/month), Render (750 hours/month)
- Frontend: Vercel (unlimited), Netlify (100 GB bandwidth)
- Database: MongoDB Atlas (512 MB), Supabase (500 MB)

**Estimated Monthly Cost (Paid):**
- Backend: $5-15 (1-2 instances)
- Frontend: $0 (static hosting)
- Database: $10-25 (managed)
- **Total: $15-40/month**

## Security Best Practices

1. **API Keys:** Never commit to git, use environment variables
2. **HTTPS:** Always use SSL in production
3. **CORS:** Restrict to specific domains
4. **Rate Limiting:** Add rate limiting middleware
5. **Input Validation:** Sanitize all user inputs
6. **Headers:** Use helmet.js for security headers
7. **Dependencies:** Regular security audits with `npm audit`

## Troubleshooting

### Common Issues

**Issue: Backend not connecting to frontend**
- Solution: Check CORS configuration, verify FRONTEND_URL

**Issue: Gemini API errors**
- Solution: Verify API key, check quota limits, ensure billing enabled

**Issue: PDF not generating**
- Solution: Check PDFKit dependencies, verify file permissions

**Issue: Slow response times**
- Solution: Implement caching, optimize Gemini prompts, add CDN

## Rollback Strategy

1. **Git tags:** Tag each release
```bash
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

2. **Quick rollback:**
```bash
git checkout v1.0.0
pm2 restart all
```

3. **Database migrations:** Always backup before schema changes

## Support Contacts

For deployment assistance:
- Technical questions: [Your email]
- Emergency: [Your phone]
- Documentation: Check ARCHITECTURE.md

---

**Ready for Production! 🚀**
