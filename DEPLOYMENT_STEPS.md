# Deployment Steps for 811 Ticket Tracker

## Status: Ready for Deployment

### GitHub Repository
**COMPLETED** ✅
- Repository URL: https://github.com/Jacob-PV/811-ticket-tracker
- All code has been pushed to GitHub
- Repository is public and ready for deployment platforms

---

## Backend Deployment to Railway

### Step 1: Create Railway Account & Project

1. Go to https://railway.app
2. Click "Login" and sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `Jacob-PV/811-ticket-tracker`
6. Railway will detect the repository

### Step 2: Configure Service Settings

1. After project is created, click on the service
2. Go to **Settings** tab
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"New"** button
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically provision a PostgreSQL database
4. The `DATABASE_URL` environment variable will be automatically available

### Step 4: Generate SECRET_KEY

Before setting environment variables, generate a secure SECRET_KEY:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output - you'll need it for the next step.

### Step 5: Set Environment Variables

1. Go to your backend service
2. Click **"Variables"** tab
3. Add the following environment variables:

```
SECRET_KEY=<paste-the-generated-key-from-step-4>
ENVIRONMENT=production
DEBUG=False
APP_NAME=811 Ticket Tracker
FRONTEND_URL=https://your-app.vercel.app
DATABASE_URL=${{Postgres.DATABASE_URL}}
MAGIC_LINK_EXPIRATION_MINUTES=15
ACCESS_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<your-sendgrid-api-key>
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=811 Ticket Tracker
SMTP_USE_TLS=True
NOTIFICATION_HOUR=8
NOTIFICATION_TIMEZONE=America/New_York
EXPIRATION_WARNING_DAYS=5
ADMIN_EMAIL=admin@yourcompany.com
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Note:**
- Replace `<your-sendgrid-api-key>` with your SendGrid API key
- Replace `noreply@yourdomain.com` with a verified sender email
- Replace `admin@yourcompany.com` with your admin email
- You'll update `FRONTEND_URL` and `ALLOWED_ORIGINS` after deploying to Vercel

### Step 6: Deploy Backend

1. Railway will automatically deploy after you set the variables
2. Wait for deployment to complete (check the **Deployments** tab)
3. Once deployed, go to **Settings** → **Networking**
4. Click **"Generate Domain"** to get a public URL
5. **Copy this URL** - it will look like: `https://811-ticket-tracker-production.up.railway.app`

### Step 7: Initialize Database

1. Go to your backend service
2. Click on the **three dots** (•••) menu
3. Select **"Run a command"**
4. Enter: `python seed.py`
5. Click **"Run"** to create the database tables and admin user

---

## Frontend Deployment to Vercel

### Option A: Deploy via Web Interface (Recommended)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import `Jacob-PV/811-ticket-tracker`
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-backend.up.railway.app/api/v1`
7. Click **"Deploy"**
8. Wait for deployment to complete
9. Copy the production URL (e.g., `https://811-ticket-tracker.vercel.app`)

### Option B: Deploy via CLI

1. Navigate to project directory:
   ```bash
   cd C:\Users\Jacob\Documents\0MyDocuments\Code\mvp-automation\workspace\811-ticket-tracker\frontend
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

4. Follow prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `811-ticket-tracker`
   - In which directory is your code located? `./`

5. Add environment variable:
   ```bash
   vercel env add VITE_API_URL production
   ```
   Enter value: `https://your-railway-backend.up.railway.app/api/v1`

6. Redeploy to apply environment variable:
   ```bash
   vercel --prod
   ```

---

## Post-Deployment Configuration

### Step 1: Update Backend Environment Variables

Now that you have the Vercel URL, go back to Railway:

1. Go to your Railway backend service
2. Go to **Variables** tab
3. Update these variables:
   - `FRONTEND_URL=https://811-ticket-tracker.vercel.app`
   - `ALLOWED_ORIGINS=https://811-ticket-tracker.vercel.app`
4. The service will automatically redeploy

### Step 2: Set Up SendGrid (Email Service)

1. Go to https://sendgrid.com
2. Sign up for a free account (100 emails/day)
3. Go to **Settings** → **API Keys**
4. Click **"Create API Key"**
5. Name it "811-ticket-tracker" and select **"Full Access"**
6. Copy the API key
7. Go to **Settings** → **Sender Authentication**
8. Click **"Verify a Single Sender"**
9. Enter your email and complete verification
10. Update Railway environment variable `SMTP_PASSWORD` with your API key
11. Update `SMTP_FROM_EMAIL` with your verified email

### Step 3: Test the Application

1. Open your Vercel URL in a browser
2. Go to the login page
3. Enter your admin email (from `ADMIN_EMAIL` env var)
4. Check your email for the magic link
5. Click the link to log in
6. Create a test ticket to verify everything works

### Step 4: Verify Backend Health

1. Visit `https://your-railway-backend.up.railway.app/health`
2. You should see: `{"status": "healthy"}`

### Step 5: Check API Documentation

1. Visit `https://your-railway-backend.up.railway.app/docs`
2. You should see the interactive API documentation

---

## Final URLs

After completing all steps, you'll have:

1. **GitHub Repository**: https://github.com/Jacob-PV/811-ticket-tracker
2. **Backend API**: https://your-project.up.railway.app
3. **Frontend App**: https://811-ticket-tracker.vercel.app
4. **API Docs**: https://your-project.up.railway.app/docs

---

## Troubleshooting

### Backend won't start
- Check Railway logs in the **Deployments** tab
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correctly referencing the Postgres service

### Frontend can't connect to backend
- Verify `VITE_API_URL` in Vercel environment variables
- Check CORS settings in Railway (`ALLOWED_ORIGINS`)
- Check browser console for errors

### Emails not sending
- Verify SendGrid API key is correct
- Check sender email is verified in SendGrid
- Review Railway logs for email errors

### Database errors
- Run `python seed.py` again in Railway console
- Check PostgreSQL service is running
- Verify `DATABASE_URL` connection string

---

## Cost Estimate

- **Railway**: Free tier or ~$5/month
- **Vercel**: Free tier
- **SendGrid**: Free tier (100 emails/day)
- **Total**: $0-5/month

---

## Next Steps

1. Set up custom domain (optional)
2. Configure monitoring with Sentry or similar
3. Set up database backups
4. Add team members as users
5. Customize email templates
6. Add your company logo

---

**Need Help?**
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- SendGrid Docs: https://docs.sendgrid.com
