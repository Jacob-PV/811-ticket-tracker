"""
Ticket service for business logic and status updates.
"""

from datetime import date, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from app.models.ticket import Ticket
from app.utils.expiration import calculate_expiration, determine_status, is_expiring_soon, is_expired
from app.config import settings


def calculate_ticket_expiration(submit_date: date, state: str, manual_override: Optional[date] = None) -> date:
    """
    Calculate the expiration date for a ticket.

    Args:
        submit_date: The date the ticket was submitted
        state: Two-letter state code
        manual_override: Optional manual expiration date override

    Returns:
        The expiration date
    """
    if manual_override:
        return manual_override

    return calculate_expiration(submit_date, state)


async def update_ticket_statuses(db: Session):
    """
    Update the status of all tickets based on their expiration dates.
    This function is called periodically by the scheduler.

    Args:
        db: Database session
    """
    try:
        today = date.today()
        threshold = today + timedelta(days=settings.EXPIRATION_WARNING_DAYS)

        # Update expired tickets
        expired_count = db.query(Ticket).filter(
            Ticket.expiration_date < today,
            Ticket.status != "expired"
        ).update({"status": "expired"}, synchronize_session=False)

        # Update expiring soon tickets
        expiring_count = db.query(Ticket).filter(
            Ticket.expiration_date >= today,
            Ticket.expiration_date <= threshold,
            Ticket.status.in_(["active", "renewed"])
        ).update({"status": "expiring_soon"}, synchronize_session=False)

        # Update active tickets (those with more than threshold days remaining)
        active_count = db.query(Ticket).filter(
            Ticket.expiration_date > threshold,
            Ticket.status != "active"
        ).update({"status": "active"}, synchronize_session=False)

        db.commit()
        print(f"Status update complete: {expired_count} expired, {expiring_count} expiring soon, {active_count} active")

    except Exception as e:
        db.rollback()
        print(f"Error updating ticket statuses: {e}")


def get_expiring_tickets(db: Session, days_threshold: int = None) -> list[Ticket]:
    """
    Get tickets that are expiring soon.

    Args:
        db: Database session
        days_threshold: Number of days to look ahead (default from settings)

    Returns:
        List of tickets expiring within the threshold
    """
    if days_threshold is None:
        days_threshold = settings.EXPIRATION_WARNING_DAYS

    today = date.today()
    threshold_date = today + timedelta(days=days_threshold)

    return db.query(Ticket).filter(
        Ticket.expiration_date >= today,
        Ticket.expiration_date <= threshold_date,
        Ticket.status.in_(["active", "expiring_soon"])
    ).all()
