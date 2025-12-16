"""
Seed script to create initial admin user.
Run this after setting up the database.
"""

from app.database import SessionLocal
from app.models.user import User
from app.config import settings

def create_admin_user():
    """Create the initial admin user."""
    db = SessionLocal()

    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()

        if existing_admin:
            print(f"Admin user already exists: {settings.ADMIN_EMAIL}")
            return

        # Create admin user
        admin = User(
            email=settings.ADMIN_EMAIL,
            full_name="Admin User",
            role="admin",
            is_active=True
        )

        db.add(admin)
        db.commit()

        print(f"✓ Admin user created successfully!")
        print(f"  Email: {settings.ADMIN_EMAIL}")
        print(f"  Role: admin")
        print(f"\nTo log in:")
        print(f"  1. Go to the login page")
        print(f"  2. Enter email: {settings.ADMIN_EMAIL}")
        print(f"  3. Check your email for the magic link")
        print(f"  4. Click the link to log in")

    except Exception as e:
        db.rollback()
        print(f"Error creating admin user: {e}")

    finally:
        db.close()


def create_sample_users():
    """Create sample editor and viewer users for testing."""
    db = SessionLocal()

    sample_users = [
        {
            "email": "editor@example.com",
            "full_name": "Editor User",
            "role": "editor"
        },
        {
            "email": "viewer@example.com",
            "full_name": "Viewer User",
            "role": "viewer"
        }
    ]

    try:
        for user_data in sample_users:
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()

            if existing_user:
                print(f"User already exists: {user_data['email']}")
                continue

            user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                role=user_data["role"],
                is_active=True
            )

            db.add(user)
            print(f"✓ Created {user_data['role']} user: {user_data['email']}")

        db.commit()

    except Exception as e:
        db.rollback()
        print(f"Error creating sample users: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("811 Ticket Tracker - Database Seed")
    print("=" * 60)

    # Create admin user
    create_admin_user()

    # Ask if user wants to create sample users
    print("\nWould you like to create sample users for testing? (y/n)")
    response = input().strip().lower()

    if response == 'y':
        create_sample_users()

    print("\n" + "=" * 60)
    print("Seed complete!")
    print("=" * 60)
