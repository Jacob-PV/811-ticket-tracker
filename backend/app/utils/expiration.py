"""
Expiration date calculation and status checking utilities.
"""

from datetime import date, timedelta
from app.utils.state_rules import get_state_expiration_days


def calculate_expiration(submit_date: date, state: str) -> date:
    """
    Calculate the expiration date based on submit date and state.

    Args:
        submit_date: The date the ticket was submitted
        state: Two-letter state code

    Returns:
        The expiration date
    """
    days = get_state_expiration_days(state)
    return submit_date + timedelta(days=days)


def is_expiring_soon(expiration_date: date, threshold_days: int = 5) -> bool:
    """
    Check if a ticket is expiring soon.

    Args:
        expiration_date: The ticket's expiration date
        threshold_days: Number of days to consider "soon" (default: 5)

    Returns:
        True if the ticket expires within threshold_days, False otherwise
    """
    today = date.today()
    days_until_expiration = (expiration_date - today).days
    return 0 <= days_until_expiration <= threshold_days


def is_expired(expiration_date: date) -> bool:
    """
    Check if a ticket has expired.

    Args:
        expiration_date: The ticket's expiration date

    Returns:
        True if the ticket has expired, False otherwise
    """
    return expiration_date < date.today()


def get_days_until_expiration(expiration_date: date) -> int:
    """
    Get the number of days until expiration (negative if expired).

    Args:
        expiration_date: The ticket's expiration date

    Returns:
        Number of days until expiration (negative if already expired)
    """
    return (expiration_date - date.today()).days


def determine_status(expiration_date: date) -> str:
    """
    Determine the status based on expiration date.

    Args:
        expiration_date: The ticket's expiration date

    Returns:
        Status string: "expired", "expiring_soon", or "active"
    """
    if is_expired(expiration_date):
        return "expired"
    elif is_expiring_soon(expiration_date):
        return "expiring_soon"
    else:
        return "active"
