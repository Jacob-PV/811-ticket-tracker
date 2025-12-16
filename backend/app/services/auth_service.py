"""
Authentication service for magic link generation and validation.
"""

import uuid
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.magic_link import MagicLink
from app.config import settings
from app.utils.security import create_access_token


def generate_magic_link(user_id: str, db: Session) -> str:
    """
    Generate a magic link token for a user.

    Args:
        user_id: User's unique identifier
        db: Database session

    Returns:
        Magic link token string
    """
    # Generate unique token
    token = str(uuid.uuid4())

    # Calculate expiration time
    expires_at = datetime.utcnow() + timedelta(minutes=settings.MAGIC_LINK_EXPIRATION_MINUTES)

    # Create magic link record
    magic_link = MagicLink(
        user_id=user_id,
        token=token,
        expires_at=expires_at,
        used=False
    )

    db.add(magic_link)
    db.commit()

    return token


def verify_magic_link(token: str, db: Session) -> Optional[User]:
    """
    Verify a magic link token and return the associated user.

    Args:
        token: Magic link token
        db: Database session

    Returns:
        User object if valid, None otherwise
    """
    # Find magic link
    magic_link = db.query(MagicLink).filter(MagicLink.token == token).first()

    if not magic_link:
        return None

    # Check if already used
    if magic_link.used:
        return None

    # Check if expired
    if datetime.utcnow() > magic_link.expires_at:
        return None

    # Mark as used
    magic_link.used = True
    db.commit()

    # Return user
    return db.query(User).filter(User.id == magic_link.user_id).first()


def create_user_token(user: User) -> str:
    """
    Create a JWT access token for a user.

    Args:
        user: User object

    Returns:
        JWT access token string
    """
    return create_access_token(str(user.id), user.role)
