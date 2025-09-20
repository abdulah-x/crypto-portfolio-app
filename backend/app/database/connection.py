from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
from pathlib import Path

# Create database directory
DB_DIR = Path(__file__).parent.parent.parent / "data"
DB_DIR.mkdir(exist_ok=True)

# Database configuration
DATABASE_URL = f"sqlite:///{DB_DIR}/crypto_portfolio.db"
TEST_DATABASE_URL = f"sqlite:///{DB_DIR}/test_portfolio.db"

# Create engine with SQLite optimizations
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging
    connect_args={
        "check_same_thread": False,  # Allow multiple threads
        "timeout": 20,  # Connection timeout in seconds
    },
    poolclass=StaticPool,  # Use static pool for SQLite
)

# Enable foreign key constraints for SQLite
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Enable SQLite optimizations and constraints"""
    cursor = dbapi_connection.cursor()
    
    # Enable foreign key constraints
    cursor.execute("PRAGMA foreign_keys=ON")
    
    # Performance optimizations
    cursor.execute("PRAGMA journal_mode=WAL")  # Write-Ahead Logging
    cursor.execute("PRAGMA synchronous=NORMAL")  # Faster than FULL, still safe
    cursor.execute("PRAGMA cache_size=10000")  # Increase cache size
    cursor.execute("PRAGMA temp_store=MEMORY")  # Store temp tables in memory
    cursor.execute("PRAGMA mmap_size=268435456")  # Use memory-mapped I/O (256MB)
    
    cursor.close()

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create declarative base
Base = declarative_base()

def get_database():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_all_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ All database tables created successfully!")

def drop_all_tables():
    """Drop all database tables (use with caution!)"""
    Base.metadata.drop_all(bind=engine)
    print("⚠️ All database tables dropped!")

def get_database_info():
    """Get information about the database"""
    db_path = DB_DIR / "crypto_portfolio.db"
    
    if db_path.exists():
        size_mb = db_path.stat().st_size / (1024 * 1024)
        return {
            "path": str(db_path),
            "size_mb": round(size_mb, 2),
            "exists": True
        }
    else:
        return {
            "path": str(db_path),
            "size_mb": 0,
            "exists": False
        }