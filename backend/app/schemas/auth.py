from pydantic import BaseModel, EmailStr, field_serializer
from uuid import UUID


class MagicLinkRequest(BaseModel):
    email: EmailStr


class UserInToken(BaseModel):
    id: UUID | str  # Accept both UUID and string
    email: str
    full_name: str
    role: str

    @field_serializer('id')
    def serialize_id(self, value, _info):
        return str(value)  # Always serialize to string


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInToken
