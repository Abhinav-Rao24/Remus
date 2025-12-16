# 🚀 Deployment Guide - Render

This guide will help you deploy REMUS to Render with Docker.

## Prerequisites

- GitHub account with your code pushed
- Render account (free tier available)
- Environment variables ready

## Step 1: Prepare Your Repository

Ensure all Docker files are committed:
```bash
git add .
git commit -m "Add Docker configuration for deployment"
git push origin main
```

## Step 2: Set Up MongoDB on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"** → Actually, use **MongoDB Atlas** (free tier)
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Get connection string
   - Save it for later

## Step 3: Deploy Backend

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `remus-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `resume-backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `resume-backend/Dockerfile`
   - **Instance Type**: Free

4. Add Environment Variables:
   ```
   PORT=8000
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=<generate_random_secret>
   OPENAI_API_KEY=<your_openai_key>
   GOOGLE_CLIENT_ID=<your_google_client_id>
   GOOGLE_CLIENT_SECRET=<your_google_client_secret>
   CLIENT_URL=<will_add_after_frontend_deployment>
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (~10-15 minutes for first build due to LaTeX)
7. Copy the backend URL (e.g., `https://remus-backend.onrender.com`)

## Step 4: Deploy Frontend

1. Click **"New +"** → **"Web Service"**
2. Connect same repository
3. Configure:
   - **Name**: `remus-frontend`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `resume-frontend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `resume-frontend/Dockerfile`
   - **Instance Type**: Free

4. **IMPORTANT**: Update frontend environment
   - Edit `resume-frontend/.env.production`:
     ```
     VITE_API_URL=https://remus-backend.onrender.com
     ```
   - Commit and push this change

5. Click **"Create Web Service"**
6. Copy frontend URL (e.g., `https://remus.onrender.com`)

## Step 5: Update Backend Environment

1. Go back to backend service settings
2. Update `CLIENT_URL` to your frontend URL
3. Redeploy backend

## Step 6: Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Update Authorized JavaScript Origins:
   - Add: `https://remus.onrender.com`
3. Update Authorized Redirect URIs:
   - Add: `https://remus-backend.onrender.com/api/auth/google/callback`

## Step 7: Test Your Deployment

1. Visit your frontend URL
2. Test features:
   - ✅ Sign up / Login
   - ✅ Create project
   - ✅ LaTeX compilation
   - ✅ ATS scoring
   - ✅ AI suggestions

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid tier for always-on service

### LaTeX Compilation
- First build takes 10-15 minutes (installing LaTeX)
- Subsequent builds are faster (~5 minutes)
- Docker image is ~2GB (normal for LaTeX)

### Troubleshooting

**Build fails:**
- Check Render logs
- Verify Dockerfile syntax
- Ensure all dependencies in package.json

**LaTeX compilation fails:**
- Check backend logs
- Verify pdflatex is installed in Docker image
- Test locally with `docker-compose up`

**Frontend can't connect to backend:**
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Ensure CLIENT_URL matches frontend URL

## Local Docker Testing

Before deploying, test locally:

```bash
# Create .env file from template
cp .env.example .env
# Edit .env with your values

# Build and run
docker-compose up --build

# Access:
# Frontend: http://localhost
# Backend: http://localhost:8000
```

## Monitoring

- View logs in Render dashboard
- Set up alerts for errors
- Monitor resource usage

## Updating Your Deployment

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Render auto-deploys on push!
```

## Cost Optimization

**Free Tier:**
- Backend + Frontend + MongoDB Atlas = $0/month
- Good for portfolio/demo

**Paid Tier ($7/month per service):**
- Always-on services
- No spin-down delay
- Better for production

## Resume Bullet Point

> *"Deployed full-stack resume builder to production using Docker containers on Render, implementing CI/CD pipeline with automated deployments from GitHub"*

---

Need help? Check Render docs or create an issue on GitHub!
