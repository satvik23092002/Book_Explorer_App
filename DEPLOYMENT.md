# 🚀 Book Explorer Deployment Guide

## Overview
This guide will help you deploy your Book Explorer app to production using Vercel (frontend) and Railway (backend).

## Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free)
- MongoDB Atlas account (already set up)

## 🎯 Deployment Steps

### 1. Frontend Deployment (Vercel)

#### Step 1.1: Prepare GitHub Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/book-explorer.git
git push -u origin main
```

#### Step 1.2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   - `VITE_API_URL`: `https://your-backend-url.railway.app`
7. Click "Deploy"

### 2. Backend Deployment (Railway)

#### Step 2.1: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
7. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: `3001` (Railway will override this)
   - `CRON_ENABLED`: `true`
   - `CRON_SCHEDULE`: `0 3 * * *` (daily at 3 AM UTC)
8. Click "Deploy"

### 3. Update Frontend API URL

After backend deployment:
1. Go to Railway dashboard
2. Copy your backend URL (e.g., `https://book-explorer-backend.railway.app`)
3. Go to Vercel dashboard
4. Update environment variable:
   - `VITE_API_URL`: `https://your-backend-url.railway.app`

### 4. Update Frontend Code

Update the API URL in your frontend code:

```javascript
// In frontend/src/pages/BookList.jsx and BookDetail.jsx
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

## 🔧 Environment Variables

### Frontend (Vercel)
- `VITE_API_URL`: Backend API URL

### Backend (Railway)
- `MONGODB_URI`: MongoDB Atlas connection string
- `PORT`: Server port (Railway sets this automatically)
- `CRON_ENABLED`: `true` to enable scheduled scraping
- `CRON_SCHEDULE`: Cron schedule (default: `0 3 * * *`)

## 🌐 Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Vercel dashboard
2. Select your project
3. Go to "Domains" tab
4. Add your custom domain
5. Update DNS records as instructed

### Railway Custom Domain
1. Go to Railway dashboard
2. Select your service
3. Go to "Settings" → "Domains"
4. Add custom domain
5. Update DNS records

## 📊 Monitoring

### Vercel Analytics
- Built-in analytics available
- Performance monitoring
- User insights

### Railway Monitoring
- Built-in logs
- Performance metrics
- Health checks

## 🔄 CI/CD

Both platforms support automatic deployments:
- Push to `main` branch → Automatic deployment
- Pull requests → Preview deployments

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for your frontend domain

2. **Environment Variables**
   - Double-check all environment variables are set correctly

3. **Build Failures**
   - Check build logs in respective dashboards
   - Ensure all dependencies are in package.json

4. **Database Connection**
   - Verify MongoDB Atlas IP whitelist includes Railway IPs
   - Check connection string format

## 📱 Mobile Responsiveness

Your app is already fully responsive and will work great on:
- Desktop computers
- Tablets
- Mobile phones

## 🎉 Success!

Once deployed, your Book Explorer will be available at:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.railway.app/api`

The cron job will automatically scrape books daily at 3 AM UTC!
