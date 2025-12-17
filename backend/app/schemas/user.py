from pydantic import BaseModel, EmailStr, field_serializer
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "viewer"


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: UUID | str  # Accept both UUID and string
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_serializer('id')
    def serialize_id(self, value, _info):
        return str(value)  # Always serialize to string

    class Config:
        from_attributes = True
