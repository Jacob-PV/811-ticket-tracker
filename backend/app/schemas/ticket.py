from pydantic import BaseModel, field_serializer
from typing import Optional
from datetime import date, datetime
from uuid import UUID


class TicketBase(BaseModel):
    ticket_number: str
    job_name: str
    address: str
    state: str
    submit_date: date
    utility_responses: Optional[str] = None
    assigned_pm: Optional[str] = None
    notes: Optional[str] = None


class TicketCreate(TicketBase):
    expiration_date: Optional[date] = None  # Auto-calculated if not provided


class TicketUpdate(BaseModel):
    job_name: Optional[str] = None
    address: Optional[str] = None
    state: Optional[str] = None
    submit_date: Optional[date] = None
    expiration_date: Optional[date] = None
    status: Optional[str] = None
    utility_responses: Optional[str] = None
    assigned_pm: Optional[str] = None
    notes: Optional[str] = None


class TicketRenew(BaseModel):
    new_expiration_date: date


class UserMin(BaseModel):
    id: UUID | str  # Accept both UUID and string
    email: str
    full_name: str

    @field_serializer('id')
    def serialize_id(self, value, _info):
        return str(value)  # Always serialize to string

    class Config:
        from_attributes = True


class TicketResponse(TicketBase):
    id: UUID | str  # Accept both UUID and string
    expiration_date: date
    status: str
    last_renewed_at: Optional[datetime] = None
    created_by: Optional[UserMin] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_serializer('id')
    def serialize_id(self, value, _info):
        return str(value)  # Always serialize to string

    class Config:
        from_attributes = True


class TicketListResponse(BaseModel):
    tickets: list[TicketResponse]
    total: int
    skip: int
    limit: int


class TicketStats(BaseModel):
    total_tickets: int
    active_tickets: int
    expiring_soon_tickets: int
    expired_tickets: int
    renewed_tickets: int
    tickets_by_state: dict[str, int]
    expiring_in_next_7_days: int
