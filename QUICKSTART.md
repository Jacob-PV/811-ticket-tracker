# Quick Start Guide

Get the 811 Ticket Tracker running in under 10 minutes!

## Prerequisites

- Python 3.11+
- Node.js 18+

## Installation (5 minutes)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux
```

**Edit backend/.env** and set these minimum required values:

```bash
SECRET_KEY=paste-your-generated-key-here
ADMIN_EMAIL=your-email@company.com
SMTP_FROM_EMAIL=noreply@your-domain.com
```

Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Create database and admin user:**
```bash
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"
python seed.py
```

### 2. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# .env is already configured for local development
```

## Run the App (2 minutes)

### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
uvicorn app.main:app --reload
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## Access the App

1. Open http://localhost:5173
2. Enter your admin email
3. Check console logs for magic link (or email if SMTP configured)
4. Click the link to login
5. Start creating tickets!

## Next Steps

- Configure SMTP for real email delivery (see README.md)
- Add more users (Settings > Users)
- Create your first tickets
- Explore the API docs at http://localhost:8000/docs

## Troubleshooting

**Backend won't start:**
- Make sure you activated the virtual environment
- Check that .env has SECRET_KEY set

**Frontend won't start:**
- Delete node_modules and run `npm install` again
- Make sure port 5173 is not in use

**Can't log in:**
- Check backend console for magic link URL
- Verify ADMIN_EMAIL in backend/.env matches login email

Need more help? See the full README.md
