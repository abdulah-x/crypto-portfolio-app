#!/usr/bin/env python3
"""
Authentication API endpoints
User registration, login, logout, profile management
"""

from fastapi import APIRouter, Depends, Request, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import re

from core.dependencies import get_db, get_current_active_user, get_current_user
from core.auth import auth_manager
from core.errors import (
    AuthenticationError, 
    ValidationError, 
    NotFoundError,
    DatabaseError
)
from database.models import User, UserSession

router = APIRouter()

# Pydantic models for requests and responses
class UserRegistration(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    timezone: Optional[str] = "UTC"
    preferred_currency: Optional[str] = "USD"
    
    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3 or len(v) > 50:
            raise ValueError('Username must be between 3 and 50 characters')
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserLogin(BaseModel):
    username: str  # Can be username or email
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: Dict[str, Any]

class UserProfile(BaseModel):
    id: int
    username: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    timezone: str
    preferred_currency: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime]

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    timezone: Optional[str] = None
    preferred_currency: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v

@router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserRegistration,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Register a new user account
    """
    try:
        # Check if username or email already exists
        existing_user = db.query(User).filter(
            (User.username == user_data.username) | (User.email == user_data.email)
        ).first()
        
        if existing_user:
            if existing_user.username == user_data.username:
                raise ValidationError("Username already taken")
            else:
                raise ValidationError("Email already registered")
        
        # Create new user
        hashed_password = auth_manager.get_password_hash(user_data.password)
        
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            timezone=user_data.timezone,
            preferred_currency=user_data.preferred_currency,
            is_active=True,
            is_verified=False  # Require email verification
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create access token
        token_data = {"sub": new_user.id, "username": new_user.username}
        access_token = auth_manager.create_access_token(token_data)
        
        # Create user session
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        
        auth_manager.create_user_session(
            db, new_user.id, user_agent, client_ip
        )
        
        # Update last login
        new_user.last_login = datetime.utcnow()
        db.commit()
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=auth_manager.access_token_expire_minutes * 60,
            user={
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email,
                "is_verified": new_user.is_verified
            }
        )
        
    except ValidationError:
        raise
    except Exception as e:
        raise DatabaseError(f"Failed to create user account: {str(e)}")

@router.post("/auth/login", response_model=TokenResponse)
async def login_user(
    login_data: UserLogin,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return access token
    """
    try:
        # Authenticate user
        user = auth_manager.authenticate_user(db, login_data.username, login_data.password)
        
        if not user:
            raise AuthenticationError("Invalid username/email or password")
        
        if not user.is_active:
            raise AuthenticationError("Account is disabled")
        
        # Create access token
        token_data = {"sub": user.id, "username": user.username}
        access_token = auth_manager.create_access_token(token_data)
        
        # Create user session
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        
        auth_manager.create_user_session(
            db, user.id, user_agent, client_ip
        )
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=auth_manager.access_token_expire_minutes * 60,
            user={
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_verified": user.is_verified
            }
        )
        
    except AuthenticationError:
        raise
    except Exception as e:
        raise DatabaseError(f"Login failed: {str(e)}")

@router.post("/auth/logout")
async def logout_user(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Logout current user (invalidate current session)
    """
    try:
        # For now, we'll just return success since we don't track individual sessions by token
        # In a production system, you'd want to maintain a blacklist of tokens
        
        return {"message": "Successfully logged out"}
        
    except Exception as e:
        raise DatabaseError(f"Logout failed: {str(e)}")

@router.post("/auth/logout-all")
async def logout_all_devices(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Logout from all devices (invalidate all user sessions)
    """
    try:
        auth_manager.invalidate_user_sessions(db, current_user.id)
        
        return {"message": "Successfully logged out from all devices"}
        
    except Exception as e:
        raise DatabaseError(f"Logout all failed: {str(e)}")

@router.get("/auth/profile", response_model=UserProfile)
async def get_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user's profile information
    """
    return UserProfile(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        timezone=current_user.timezone,
        preferred_currency=current_user.preferred_currency,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
        last_login=current_user.last_login
    )

@router.put("/auth/profile", response_model=UserProfile)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile information
    """
    try:
        # Update only provided fields
        if profile_data.first_name is not None:
            current_user.first_name = profile_data.first_name
        if profile_data.last_name is not None:
            current_user.last_name = profile_data.last_name
        if profile_data.timezone is not None:
            current_user.timezone = profile_data.timezone
        if profile_data.preferred_currency is not None:
            current_user.preferred_currency = profile_data.preferred_currency
        
        current_user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(current_user)
        
        return UserProfile(
            id=current_user.id,
            username=current_user.username,
            email=current_user.email,
            first_name=current_user.first_name,
            last_name=current_user.last_name,
            timezone=current_user.timezone,
            preferred_currency=current_user.preferred_currency,
            is_active=current_user.is_active,
            is_verified=current_user.is_verified,
            created_at=current_user.created_at,
            last_login=current_user.last_login
        )
        
    except Exception as e:
        raise DatabaseError(f"Failed to update profile: {str(e)}")

@router.post("/auth/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Change user's password
    """
    try:
        # Verify current password
        if not auth_manager.verify_password(password_data.current_password, current_user.hashed_password):
            raise AuthenticationError("Current password is incorrect")
        
        # Hash new password
        new_hashed_password = auth_manager.get_password_hash(password_data.new_password)
        
        # Update password
        current_user.hashed_password = new_hashed_password
        current_user.updated_at = datetime.utcnow()
        db.commit()
        
        # Invalidate all sessions (force re-login on all devices)
        auth_manager.invalidate_user_sessions(db, current_user.id)
        
        return {"message": "Password changed successfully. Please log in again on all devices."}
        
    except AuthenticationError:
        raise
    except Exception as e:
        raise DatabaseError(f"Failed to change password: {str(e)}")

@router.get("/auth/verify-token")
async def verify_token(
    current_user: User = Depends(get_current_user)
):
    """
    Verify if the current token is valid
    """
    return {
        "valid": True,
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "is_active": current_user.is_active
        }
    }