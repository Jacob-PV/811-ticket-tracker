"""
Main FastAPI application for 811 Ticket Tracker.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import engine, Base
from app.tasks.scheduler import start_scheduler, shutdown_scheduler
from app.api.routes import auth, tickets, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.
    """
    # Startup
    print("🚀 Starting 811 Ticket Tracker API...")

    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")

    # Start background scheduler
    start_scheduler()

    yield

    # Shutdown
    print("⏹️  Shutting down...")
    shutdown_scheduler()


# Create FastAPI app
app = FastAPI(
    title="811 Ticket Tracker API",
    description="API for tracking 811 utility location ticket expirations",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
allowed_origins = settings.ALLOWED_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(tickets.router, prefix="/api/v1/tickets", tags=["Tickets"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])


@app.get("/")
async def root():
    """
    Root endpoint - API information.
    """
    return {
        "message": "811 Ticket Tracker API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring.
    """
    return {
        "status": "healthy",
        "service": "811-ticket-tracker-api"
    }
