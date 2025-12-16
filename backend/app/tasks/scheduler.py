"""
Background scheduler for periodic tasks.
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.services.notification_service import send_daily_reminders
from app.services.ticket_service import update_ticket_statuses
from app.database import SessionLocal
from app.config import settings

scheduler = AsyncIOScheduler()


def start_scheduler():
    """
    Start the background scheduler with configured jobs.
    """
    # Daily reminders at configured hour (default 8 AM)
    scheduler.add_job(
        func=run_daily_reminders,
        trigger=CronTrigger(
            hour=settings.NOTIFICATION_HOUR,
            minute=0,
            timezone=settings.NOTIFICATION_TIMEZONE
        ),
        id="daily_expiration_reminders",
        name="Send daily expiration reminders",
        replace_existing=True
    )

    # Update ticket statuses hourly
    scheduler.add_job(
        func=run_status_updates,
        trigger=CronTrigger(minute=0),
        id="update_ticket_statuses",
        name="Update all ticket statuses",
        replace_existing=True
    )

    scheduler.start()
    print("✓ Background scheduler started")


def shutdown_scheduler():
    """
    Shutdown the background scheduler.
    """
    scheduler.shutdown()
    print("✓ Background scheduler stopped")


async def run_daily_reminders():
    """
    Wrapper function to run daily reminders with database session.
    """
    db = SessionLocal()
    try:
        await send_daily_reminders(db)
    finally:
        db.close()


async def run_status_updates():
    """
    Wrapper function to run status updates with database session.
    """
    db = SessionLocal()
    try:
        await update_ticket_statuses(db)
    finally:
        db.close()
