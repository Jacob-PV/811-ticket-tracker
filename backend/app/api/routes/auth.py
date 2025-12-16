"""
Authentication routes for magic link login.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import MagicLinkRequest, TokenResponse, UserInToken
from app.services.auth_service import generate_magic_link, verify_magic_link, create_user_token
from app.services.email_service import send_magic_link_email
from app.api.deps import get_current_user
from app.config import settings

router = APIRouter()


@router.post("/request-magic-link", status_code=status.HTTP_200_OK)
async def request_magic_link(
    request: MagicLinkRequest,
    db: Session = Depends(get_db)
):
    """
    Request a magic link for passwordless login.
    Sends an email with a login link that expires in 15 minutes.
    """
    # Find user by email
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Contact your administrator for access."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Contact your administrator."
        )

    # Generate magic link token
    token = generate_magic_link(str(user.id), db)

    # Construct magic link URL
    magic_link_url = f"{settings.FRONTEND_URL}/verify?token={token}"

    # Send email
    await send_magic_link_email(user.email, magic_link_url)

    return {
        "message": "Magic link sent to your email",
        "email": user.email
    }


@router.get("/verify-magic-link", response_model=TokenResponse)
async def verify_magic_link_route(
    token: str,
    db: Session = Depends(get_db)
):
    """
    Verify a magic link token and return a JWT access token.
    """
    # Verify magic link
    user = verify_magic_link(token, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired magic link"
        )

    # Create JWT access token
    access_token = create_user_token(user)

    # Return token and user info
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserInToken(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role
        )
    )


@router.get("/me", response_model=UserInToken)
async def get_current_user_route(
    current_user: User = Depends(get_current_user)
):
    """
    Get the current authenticated user's information.
    """
    return UserInToken(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role
    )
