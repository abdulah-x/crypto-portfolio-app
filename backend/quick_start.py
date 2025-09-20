#!/usr/bin/env python3
"""
Quick start script for setting up the crypto portfolio database
"""

import subprocess
import sys
from pathlib import Path

def run_command(command, description):
    """Run a command and show the result"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully")
            if result.stdout.strip():
                print(f"   {result.stdout.strip()}")
        else:
            print(f"❌ {description} failed")
            if result.stderr.strip():
                print(f"   Error: {result.stderr.strip()}")
        return result.returncode == 0
    except Exception as e:
        print(f"❌ {description} failed with exception: {e}")
        return False

def quick_setup():
    """Quick setup for the database"""
    print("🚀 Crypto Portfolio Database Quick Setup")
    print("=" * 40)
    
    # Step 1: Create database tables
    success1 = run_command("python manage_db.py create", "Creating database tables")
    
    # Step 2: Seed sample data
    if success1:
        success2 = run_command("python -m app.database.seeds.sample_data", "Seeding sample data")
    else:
        print("⚠️ Skipping sample data seeding due to table creation failure")
        success2 = False
    
    # Step 3: Run tests
    if success1:
        success3 = run_command("python test_database.py", "Running database tests")
    else:
        print("⚠️ Skipping database tests due to setup failure")
        success3 = False
    
    # Step 4: Show database info
    run_command("python manage_db.py info", "Showing database information")
    
    print("\n" + "=" * 40)
    if success1 and success2:
        print("🎉 Quick setup completed successfully!")
        print("\n📚 Next steps:")
        print("   1. Start your FastAPI application")
        print("   2. Visit http://localhost:8000/docs for API documentation")
        print("   3. Use demo_user credentials to test the API")
        print("\n💡 Useful commands:")
        print("   python manage_db.py info    - Show database info")
        print("   python test_database.py     - Run tests")
        print("   python manage_db.py backup  - Create backup")
    else:
        print("❌ Quick setup encountered some issues")
        print("📋 Check the error messages above and try manual setup")

if __name__ == "__main__":
    quick_setup()