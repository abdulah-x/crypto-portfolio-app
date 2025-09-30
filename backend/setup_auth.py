#!/usr/bin/env python3
"""
Setup script for JWT authentication system
Creates sample users for testing
"""

import sys
from pathlib import Path
from datetime import datetime

# Add database to path
sys.path.append(str(Path(__file__).parent / "app"))

from database import SessionLocal, User
from core.auth import auth_manager

def setup_auth_system():
    """Setup authentication system with sample users"""
    db = SessionLocal()
    
    try:
        print("🔐 Setting up JWT Authentication System...")
        
        # Check if we already have users
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"✅ Already have {existing_users} users in database")
            
            # List existing users
            users = db.query(User).all()
            print("\n👥 Existing Users:")
            for user in users:
                print(f"  - {user.username} ({user.email}) - Active: {user.is_active}")
            return
        
        # Create sample users
        print("👤 Creating sample users...")
        
        # Admin user
        admin_user = User(
            username="admin",
            email="admin@crypto-portfolio.com",
            hashed_password=auth_manager.get_password_hash("AdminPass123!"),
            first_name="Admin",
            last_name="User",
            timezone="UTC",
            preferred_currency="USD",
            is_active=True,
            is_verified=True,
            created_at=datetime.utcnow()
        )
        
        # Demo user
        demo_user = User(
            username="demo",
            email="demo@crypto-portfolio.com",
            hashed_password=auth_manager.get_password_hash("DemoPass123!"),
            first_name="Demo",
            last_name="User",
            timezone="UTC",
            preferred_currency="USD",
            is_active=True,
            is_verified=True,
            created_at=datetime.utcnow()
        )
        
        # Test user
        test_user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=auth_manager.get_password_hash("TestPass123!"),
            first_name="Test",
            last_name="User",
            timezone="UTC",
            preferred_currency="USD",
            is_active=True,
            is_verified=False,  # Unverified for testing
            created_at=datetime.utcnow()
        )
        
        # Add users to database
        db.add(admin_user)
        db.add(demo_user)
        db.add(test_user)
        db.commit()
        
        print("✅ Sample users created successfully!")
        print("\n👥 Created Users:")
        print("  1. admin@crypto-portfolio.com (password: AdminPass123!)")
        print("  2. demo@crypto-portfolio.com (password: DemoPass123!)")
        print("  3. test@example.com (password: TestPass123!)")
        
        print("\n🔑 Authentication Features:")
        print("  ✅ JWT token-based authentication")
        print("  ✅ Password hashing with bcrypt")
        print("  ✅ User registration and login")
        print("  ✅ Protected API endpoints")
        print("  ✅ User profile management")
        print("  ✅ Comprehensive error handling")
        
        print("\n📝 Next Steps:")
        print("  1. Start the FastAPI server: python -m uvicorn app.main:app --reload")
        print("  2. Visit http://127.0.0.1:8000/docs for API documentation")
        print("  3. Test authentication: python test_auth_api.py")
        
    except Exception as e:
        print(f"❌ Error setting up authentication: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    setup_auth_system()