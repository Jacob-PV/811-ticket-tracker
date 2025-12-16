from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    SECRET_KEY: str
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    APP_NAME: str = "811 Ticket Tracker"
    FRONTEND_URL: str = "http://localhost:5173"

    # Database
    DATABASE_URL: str = "sqlite:///./tickets.db"

    # Auth
    MAGIC_LINK_EXPIRATION_MINUTES: int = 15
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"

    # Email
    SMTP_HOST: str
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str
    SMTP_FROM_NAME: str = "811 Ticket Tracker"
    SMTP_USE_TLS: bool = True

    # Notifications
    NOTIFICATION_HOUR: int = 8
    NOTIFICATION_TIMEZONE: str = "America/New_York"
    EXPIRATION_WARNING_DAYS: int = 5

    # Admin
    ADMIN_EMAIL: str

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
