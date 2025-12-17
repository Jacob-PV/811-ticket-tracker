from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base
from app.config import settings


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True) if "postgresql" in settings.DATABASE_URL else String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="viewer")  # viewer, editor, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    tickets = relationship("Ticket", back_populates="created_by")
    magic_links = relationship("MagicLink", back_populates="user", cascade="all, delete-orphan")
