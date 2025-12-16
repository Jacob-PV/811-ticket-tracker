"""
Notification service for sending daily expiration reminders.
"""

from datetime import date
from collections import defaultdict
from sqlalchemy.orm import Session
from app.services.ticket_service import get_expiring_tickets
from app.services.email_service import send_expiration_reminder
from app.config import settings


async def send_daily_reminders(db: Session):
    """
    Send daily expiration reminder emails to assigned PMs.
    This function is called by the scheduler every day.

    Args:
        db: Database session
    """
    try:
        # Get all expiring tickets
        expiring_tickets = get_expiring_tickets(db)

        if not expiring_tickets:
            print("No expiring tickets found")
            return

        # Group tickets by assigned PM
        tickets_by_pm = defaultdict(list)

        for ticket in expiring_tickets:
            pm = ticket.assigned_pm or "Unassigned"
            days_remaining = (ticket.expiration_date - date.today()).days

            ticket_data = {
                "id": str(ticket.id),
                "ticket_number": ticket.ticket_number,
                "job_name": ticket.job_name,
                "address": ticket.address,
                "expiration_date": ticket.expiration_date.strftime("%B %d, %Y"),
                "days_remaining": days_remaining
            }

            tickets_by_pm[pm].append(ticket_data)

        # Send email to each PM
        for pm, tickets in tickets_by_pm.items():
            if pm == "Unassigned":
                # Send to admin if no PM assigned
                recipient = settings.ADMIN_EMAIL
                pm_name = "Admin"
            else:
                # Assume PM field contains email address
                recipient = pm
                pm_name = pm.split("@")[0].replace(".", " ").title()

            try:
                await send_expiration_reminder(
                    tickets=tickets,
                    recipient=recipient,
                    pm_name=pm_name
                )
                print(f"Sent reminder to {recipient} for {len(tickets)} tickets")
            except Exception as e:
                print(f"Error sending reminder to {recipient}: {e}")

        print(f"Daily reminders sent for {len(expiring_tickets)} tickets to {len(tickets_by_pm)} recipients")

    except Exception as e:
        print(f"Error in send_daily_reminders: {e}")
