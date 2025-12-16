"""
Ticket routes for CRUD operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import Optional
from datetime import datetime, date
from app.database import get_db
from app.models.ticket import Ticket
from app.models.user import User
from app.schemas.ticket import (
    TicketCreate, TicketUpdate, TicketResponse, TicketListResponse,
    TicketRenew, TicketStats
)
from app.api.deps import get_current_user, require_role
from app.services.ticket_service import calculate_ticket_expiration
from app.utils.expiration import determine_status

router = APIRouter()


@router.get("", response_model=TicketListResponse)
async def list_tickets(
    status_filter: Optional[str] = Query(None, alias="status"),
    state: Optional[str] = None,
    assigned_pm: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "expiration_date",
    sort_order: str = "asc",
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all tickets with optional filtering and sorting.
    """
    # Start with base query
    query = db.query(Ticket)

    # Apply filters
    if status_filter:
        query = query.filter(Ticket.status == status_filter)

    if state:
        query = query.filter(Ticket.state == state)

    if assigned_pm:
        query = query.filter(Ticket.assigned_pm == assigned_pm)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Ticket.ticket_number.ilike(search_pattern),
                Ticket.job_name.ilike(search_pattern),
                Ticket.address.ilike(search_pattern)
            )
        )

    # Get total count before pagination
    total = query.count()

    # Apply sorting
    sort_column = getattr(Ticket, sort_by, Ticket.expiration_date)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    # Apply pagination
    tickets = query.offset(skip).limit(limit).all()

    return TicketListResponse(
        tickets=tickets,
        total=total,
        skip=skip,
        limit=limit
    )


@router.get("/stats", response_model=TicketStats)
async def get_ticket_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get aggregate statistics about tickets.
    """
    # Count tickets by status
    total_tickets = db.query(Ticket).count()
    active_tickets = db.query(Ticket).filter(Ticket.status == "active").count()
    expiring_soon_tickets = db.query(Ticket).filter(Ticket.status == "expiring_soon").count()
    expired_tickets = db.query(Ticket).filter(Ticket.status == "expired").count()
    renewed_tickets = db.query(Ticket).filter(Ticket.status == "renewed").count()

    # Count tickets by state
    state_counts = db.query(
        Ticket.state,
        func.count(Ticket.id)
    ).group_by(Ticket.state).all()

    tickets_by_state = {state: count for state, count in state_counts}

    # Count expiring in next 7 days
    from datetime import timedelta
    today = date.today()
    next_week = today + timedelta(days=7)
    expiring_in_next_7_days = db.query(Ticket).filter(
        Ticket.expiration_date >= today,
        Ticket.expiration_date <= next_week
    ).count()

    return TicketStats(
        total_tickets=total_tickets,
        active_tickets=active_tickets,
        expiring_soon_tickets=expiring_soon_tickets,
        expired_tickets=expired_tickets,
        renewed_tickets=renewed_tickets,
        tickets_by_state=tickets_by_state,
        expiring_in_next_7_days=expiring_in_next_7_days
    )


@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(
    ticket_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single ticket by ID.
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    return ticket


@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    ticket_data: TicketCreate,
    current_user: User = Depends(require_role("editor")),
    db: Session = Depends(get_db)
):
    """
    Create a new ticket.
    Requires editor or admin role.
    """
    # Check if ticket number already exists
    existing_ticket = db.query(Ticket).filter(
        Ticket.ticket_number == ticket_data.ticket_number
    ).first()

    if existing_ticket:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket number already exists"
        )

    # Calculate expiration date if not provided
    expiration_date = calculate_ticket_expiration(
        ticket_data.submit_date,
        ticket_data.state,
        ticket_data.expiration_date
    )

    # Determine initial status
    ticket_status = determine_status(expiration_date)

    # Create ticket
    ticket = Ticket(
        ticket_number=ticket_data.ticket_number,
        job_name=ticket_data.job_name,
        address=ticket_data.address,
        state=ticket_data.state,
        submit_date=ticket_data.submit_date,
        expiration_date=expiration_date,
        status=ticket_status,
        utility_responses=ticket_data.utility_responses,
        assigned_pm=ticket_data.assigned_pm,
        notes=ticket_data.notes,
        created_by_id=str(current_user.id)
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket


@router.put("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(
    ticket_id: str,
    ticket_data: TicketUpdate,
    current_user: User = Depends(require_role("editor")),
    db: Session = Depends(get_db)
):
    """
    Update an existing ticket.
    Requires editor or admin role.
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    # Update fields if provided
    update_data = ticket_data.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(ticket, field, value)

    # Recalculate status if expiration date changed
    if "expiration_date" in update_data:
        ticket.status = determine_status(ticket.expiration_date)

    db.commit()
    db.refresh(ticket)

    return ticket


@router.post("/{ticket_id}/renew", response_model=TicketResponse)
async def renew_ticket(
    ticket_id: str,
    renewal_data: TicketRenew,
    current_user: User = Depends(require_role("editor")),
    db: Session = Depends(get_db)
):
    """
    Renew a ticket by updating its expiration date and status.
    Requires editor or admin role.
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    # Update expiration date
    ticket.expiration_date = renewal_data.new_expiration_date
    ticket.last_renewed_at = datetime.utcnow()
    ticket.status = "renewed"

    db.commit()
    db.refresh(ticket)

    return ticket


@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ticket(
    ticket_id: str,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """
    Delete a ticket.
    Requires admin role only.
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    db.delete(ticket)
    db.commit()

    return None
