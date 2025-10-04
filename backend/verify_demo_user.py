#!/usr/bin/env python3
"""
Verify demo user exists and works for testing
"""

import sys
from pathlib import Path

# Add database to path
sys.path.append(str(Path(__file__).parent / "app"))

from database import SessionLocal, User
from core.auth import auth_manager

def verify_demo_user():
    """Verify demo user exists and credentials work"""
    db = SessionLocal()
    
    try:
        print("Checking for demo user...")
        
        # Check for demo@example.com user (used in tests)
        demo_user = db.query(User).filter(User.email == "demo@example.com").first()
        
        if demo_user:
            print("✅ Demo user found: demo@example.com")
            
            # Test password verification
            try:
                if auth_manager.verify_password("demo123", demo_user.hashed_password):
                    print("✅ Demo user password verified")
                    print("✅ Ready for testing!")
                    return True
                else:
                    print("❌ Demo user password verification failed")
                    print("🔧 Fixing password hash...")
                    
                    # Fix the password hash
                    new_hash = auth_manager.get_password_hash("demo123")
                    demo_user.hashed_password = new_hash
                    db.commit()
                    
                    print("✅ Password hash fixed!")
                    print("✅ Ready for testing!")
                    return True
            except Exception as e:
                print(f"❌ Password verification error: {e}")
                print("🔧 Fixing password hash...")
                
                # Fix the password hash
                new_hash = auth_manager.get_password_hash("demo123")
                demo_user.hashed_password = new_hash
                db.commit()
                
                print("✅ Password hash fixed!")
                print("✅ Ready for testing!")
                return True
        else:
            print("❌ Demo user not found")
            print("Creating demo user...")
            
            # Create demo user
            hashed_password = auth_manager.get_password_hash("demo123")
            
            demo_user = User(
                username="demo_user",
                email="demo@example.com", 
                hashed_password=hashed_password,
                first_name="Demo",
                last_name="User",
                timezone="UTC",
                preferred_currency="USD",
                is_active=True,
                is_verified=True,
                encrypted_api_key=None,
                encrypted_api_secret=None,
                binance_testnet=True,
                auto_sync_enabled=True,
                sync_interval_minutes=60
            )
            
            db.add(demo_user)
            db.commit()
            
            print("✅ Demo user created successfully!")
            print("✅ Ready for testing!")
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = verify_demo_user()
    if success:
        print("\n🎯 You can now run the test suites!")
        print("Command: cd .. && python complete_test_suite.py")
    else:
        print("\n❌ Please fix the issues above before testing")