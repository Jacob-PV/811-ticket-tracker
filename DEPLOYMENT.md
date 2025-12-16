# Deployment Guide

Complete guide for deploying 811 Ticket Tracker to production.

## Pre-Deployment Checklist

- [ ] SECRET_KEY generated and secure
- [ ] SMTP credentials configured and tested
- [ ] Admin email verified
- [ ] Database backup strategy planned
- [ ] SSL/HTTPS enabled
- [ ] CORS origins configured correctly
- [ ] Environment variables documented

## Backend Deployment

### Option 1: Railway (Recommended)

**Pros**: Easy setup, built-in PostgreSQL, auto-deploy from GitHub
**Pricing**: Free tier available, ~$5/month for production

#### Steps:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `backend` as the root directory

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically creates DATABASE_URL

4. **Configure Environment Variables**
   - Go to project settings → Variables
   - Add all variables from `.env.example`:
     ```
     SECRET_KEY=<your-secure-key>
     ENVIRONMENT=production
     DEBUG=False
     FRONTEND_URL=https://your-app.vercel.app
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     SMTP_HOST=smtp.sendgrid.net
     SMTP_PORT=587
     SMTP_USER=apikey
     SMTP_PASSWORD=<your-sendgrid-key>
     SMTP_FROM_EMAIL=noreply@your-domain.com
     SMTP_FROM_NAME=811 Ticket Tracker
     ADMIN_EMAIL=admin@your-company.com
     ALLOWED_ORIGINS=https://your-app.vercel.app
     ```

5. **Deploy**
   - Railway auto-deploys on push to main
   - Monitor deployment logs
   - Note the deployment URL

6. **Initialize Database**
   - Go to project → Settings → Service
   - Open "Run Command"
   - Run: `python seed.py`

### Option 2: Render

**Pros**: Simple, free tier, good documentation
**Pricing**: Free tier available

#### Steps:

1. **Create Render Account**
   - Go to https://render.com
   - Sign up

2. **Create Web Service**
   - New → Web Service
   - Connect GitHub repository
   - Configure:
     - Name: `811-ticket-tracker-api`
     - Root Directory: `backend`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add PostgreSQL**
   - Dashboard → New → PostgreSQL
   - Note the Internal Database URL

4. **Set Environment Variables**
   - Add all variables from `.env.example`
   - Use Render's DATABASE_URL

5. **Deploy**
   - Render auto-deploys on push
   - Run seed command via shell

### Option 3: DigitalOcean App Platform

**Pros**: Good performance, predictable pricing
**Pricing**: Starting at $5/month

#### Steps:

1. Create App from GitHub repo
2. Add managed PostgreSQL database
3. Configure environment variables
4. Deploy

## Frontend Deployment

### Vercel (Recommended)

**Pros**: Optimized for React, instant deploys, global CDN
**Pricing**: Free for personal projects

#### Steps:

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import from GitHub
   - Select your repository

3. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)

4. **Set Environment Variables**
   - Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend.railway.app/api/v1
     ```

5. **Deploy**
   - Vercel auto-deploys on push to main
   - Preview deployments for PRs
   - Note the production URL

6. **Configure Custom Domain** (Optional)
   - Settings → Domains
   - Add your domain
   - Update DNS records

### Netlify (Alternative)

**Pros**: Simple, good documentation
**Pricing**: Free tier available

#### Steps:

1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

## Post-Deployment Steps

### 1. Update CORS Settings

In backend environment variables:
```bash
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 2. Test Email Delivery

1. Go to login page
2. Request magic link
3. Verify email arrives
4. Test magic link works

### 3. Create Admin User

```bash
# If using Railway, use the shell
python seed.py

# If using Render, use the shell feature
```

### 4. Configure SendGrid (Email)

1. **Create SendGrid Account**
   - Go to https://sendgrid.com
   - Sign up (free tier: 100 emails/day)

2. **Create API Key**
   - Settings → API Keys
   - Create API Key
   - Copy the key

3. **Verify Sender**
   - Settings → Sender Authentication
   - Verify single sender email
   - Use this as SMTP_FROM_EMAIL

4. **Update Environment Variables**
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=<your-api-key>
   SMTP_FROM_EMAIL=<verified-email>
   ```

### 5. Set Up Custom Domain (Optional)

**For Backend (Railway):**
- Settings → Domains → Add Custom Domain
- Update DNS A record to Railway's IP

**For Frontend (Vercel):**
- Settings → Domains → Add
- Update DNS CNAME to Vercel

## Monitoring & Maintenance

### Health Checks

Set up monitoring for:
- Backend: `https://your-api.com/health`
- Uptime monitoring with UptimeRobot (free)

### Backup Strategy

**Database Backups:**
- Railway: Automatic daily backups
- Render: Download backups from dashboard
- Recommended: Schedule weekly exports

### Logs

**Backend Logs:**
- Railway: Built-in log viewer
- Render: Real-time logs in dashboard

**Error Tracking:**
- Optional: Add Sentry for error monitoring
- Free tier available

### Performance Monitoring

**Metrics to Track:**
- API response times
- Error rates
- Database query performance
- Email delivery rates

**Tools:**
- Railway/Render built-in metrics
- Optional: New Relic, Datadog

## Scaling

### When to Scale

Scale up when you experience:
- >100 concurrent users
- >10,000 tickets
- Slow API responses (>500ms)

### Scaling Options

**Railway:**
- Increase plan tier
- Add more replicas

**Render:**
- Upgrade instance type
- Enable autoscaling

**Database:**
- Upgrade PostgreSQL plan
- Add connection pooling
- Add read replicas (advanced)

## Security Best Practices

### SSL/HTTPS
- ✅ Enabled by default on Railway/Render/Vercel
- Verify green padlock in browser

### Environment Variables
- ✅ Never commit .env files
- ✅ Rotate SECRET_KEY periodically
- ✅ Use different keys for dev/prod

### Database
- ✅ Use managed database services
- ✅ Enable automatic backups
- ✅ Restrict access by IP (if possible)

### CORS
- ✅ Set specific origins (not *)
- ✅ Update when domain changes

### Monitoring
- Set up alerts for:
  - High error rates
  - Failed logins
  - Database connection issues

## Troubleshooting

### Backend Won't Start

**Check logs for:**
- Database connection errors
- Missing environment variables
- Port binding issues

**Solutions:**
- Verify DATABASE_URL is correct
- Check all required env vars are set
- Ensure port is $PORT on Railway/Render

### Frontend Can't Connect to Backend

**Check:**
- VITE_API_URL is correct
- CORS is configured correctly
- Backend is actually running

**Solutions:**
- Verify API URL in browser console
- Check network tab for CORS errors
- Test API health endpoint directly

### Emails Not Sending

**Check:**
- SMTP credentials are correct
- Sender email is verified
- Not hitting rate limits

**Solutions:**
- Test SMTP connection locally
- Check SendGrid dashboard
- Verify no firewall blocking port 587

### Database Migration Issues

**Problem:** Schema changes not applied

**Solution:**
```bash
# In Railway/Render shell
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

## Cost Estimates

### Free Tier (Development)
- Railway: Free tier
- Vercel: Free tier
- SendGrid: Free (100 emails/day)
- **Total: $0/month**

### Production (Small Team)
- Railway: $5/month (backend + database)
- Vercel: Free or $20/month (pro)
- SendGrid: $15/month (40k emails)
- **Total: ~$20-40/month**

### Production (Growing Team)
- Railway: $20/month (scaled)
- Vercel: $20/month
- SendGrid: $15/month
- **Total: ~$55/month**

## Support Resources

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- SendGrid Docs: https://docs.sendgrid.com
- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev

## Rollback Procedure

If deployment fails:

1. **Railway/Render:**
   - Go to Deployments
   - Click on previous working deployment
   - Click "Redeploy"

2. **Vercel:**
   - Go to Deployments
   - Find previous working version
   - Click "Promote to Production"

3. **Database:**
   - Restore from last backup
   - Re-run migrations if needed

---

**Need help?** Check logs first, then consult platform-specific documentation.
