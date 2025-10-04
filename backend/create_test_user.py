#!/usr/bin/env python3
"""
Create a fresh test user with simple credentials
"""

import sys
from pathlib import Path
from datetime import datetime

# Add database to path
sys.path.append(str(Path(__file__).parent / "app"))

from database import SessionLocal, User
from core.auth import auth_manager

def create_test_user():
    """Create a fresh test user"""
    db = SessionLocal()
    
    try:
        print("👤 Creating fresh test user...")
        
        # Delete existing test user if exists
        existing_user = db.query(User).filter(User.email == "test@test.com").first()
        if existing_user:
            db.delete(existing_user)
            db.commit()
            print("🗑️ Removed existing test user")
        
        # Create new test user with simple password
        simple_password = "test123"
        hashed_password = auth_manager.get_password_hash(simple_password)
        
        test_user = User(
            username="testuser",
            email="test@test.com",
            hashed_password=hashed_password,
            first_name="Test",
            last_name="User",
            timezone="UTC",
            preferred_currency="USD",
            is_active=True,
            is_verified=True,
            created_at=datetime.utcnow()
        )
        
        db.add(test_user)
        db.commit()
        
        print("✅ Fresh test user created successfully!")
        print("\n🔑 Test Credentials:")
        print("  Email: test@test.com")
        print("  Password: test123")
        print("\n📝 Test in Postman:")
        print("  POST http://127.0.0.1:8000/api/auth/login")
        print("  Body: {\"username\": \"test@test.com\", \"password\": \"test123\"}")
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()