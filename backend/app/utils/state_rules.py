"""
State-specific expiration rules for 811 tickets.
Based on state regulations for utility location ticket validity.
"""

STATE_EXPIRATION_RULES = {
    "VA": 30,  # Virginia: 30 days
    "MD": 15,  # Maryland: 15 days
    "DC": 30,  # District of Columbia: 30 days
    # Add more states as needed
}

DEFAULT_EXPIRATION_DAYS = 30


def get_state_expiration_days(state: str) -> int:
    """
    Get the number of days until expiration for a given state.

    Args:
        state: Two-letter state code (e.g., "VA", "MD", "DC")

    Returns:
        Number of days until the ticket expires
    """
    return STATE_EXPIRATION_RULES.get(state.upper(), DEFAULT_EXPIRATION_DAYS)
