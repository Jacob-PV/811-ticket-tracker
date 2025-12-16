from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True) if "postgresql" in str else String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_number = Column(String(100), unique=True, nullable=False)
    job_name = Column(String(255), nullable=False)
    address = Column(Text, nullable=False)
    state = Column(String(2), nullable=False, index=True)
    submit_date = Column(Date, nullable=False)
    expiration_date = Column(Date, nullable=False, index=True)
    status = Column(String(20), nullable=False, default="active", index=True)  # active, expiring_soon, expired, renewed
    utility_responses = Column(Text)
    assigned_pm = Column(String(255), index=True)
    created_by_id = Column(UUID(as_uuid=True) if "postgresql" in str else String(36), ForeignKey("users.id"), nullable=True)
    notes = Column(Text)
    last_renewed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    created_by = relationship("User", back_populates="tickets")
