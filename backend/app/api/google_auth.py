"""
Google OAuth Authentication Endpoints
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import os
import httpx

from app.core.dependencies import get_db
from app.database.models import User
from app.core.auth import auth_manager
from app.services.email_service import email_service
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/auth", tags=["Google OAuth"])

# Environment variables
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/google/callback")

# Pydantic models
class GoogleAuthRequest(BaseModel):
    email: EmailStr

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

class GoogleAuthResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None


@router.post("/google/send-otp", response_model=GoogleAuthResponse)
async def send_google_otp(
    request: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    """
    Send OTP to Gmail for verification
    Step 1: User enters their Gmail address
    """
    try:
        email = request.email.lower()
        
        # Generate OTP
        otp = email_service.generate_otp()
        
        # Store OTP
        email_service.store_otp(email, otp, expires_in_minutes=10)
        
        # Send OTP email
        email_sent = email_service.send_otp_email(email, otp)
        
        if email_sent:
            return GoogleAuthResponse(
                success=True,
                message=f"Verification code sent to {email}",
                data={"email": email}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to send verification email")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending OTP: {str(e)}")


@router.post("/google/verify-otp", response_model=GoogleAuthResponse)
async def verify_google_otp(
    request: OTPVerifyRequest,
    db: Session = Depends(get_db)
):
    """
    Verify OTP and register/login user with Google account
    Step 2: User enters OTP received via email
    """
    try:
        email = request.email.lower()
        otp = request.otp.strip()
        
        # Verify OTP
        is_valid, message = email_service.verify_otp(email, otp)
        
        if not is_valid:
            return GoogleAuthResponse(
                success=False,
                message=message,
                data=None
            )
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        
        if existing_user:
            # User exists - login
            if not existing_user.is_active:
                raise HTTPException(status_code=403, detail="Account is disabled")
            
            # Update last login
            existing_user.last_login = datetime.utcnow()
            db.commit()
            
            # Generate access token
            access_token = auth_manager.create_access_token({"sub": str(existing_user.id)})
            
            return GoogleAuthResponse(
                success=True,
                message="Login successful",
                data={
                    "access_token": access_token,
                    "token_type": "bearer",
                    "user": {
                        "id": existing_user.id,
                        "email": existing_user.email,
                        "username": existing_user.username,
                        "first_name": existing_user.first_name,
                        "last_name": existing_user.last_name,
                        "is_verified": True,  # Google OAuth users are auto-verified
                        "created_at": existing_user.created_at.isoformat() if existing_user.created_at else None
                    },
                    "is_new_user": False
                }
            )
        else:
            # New user - create account
            # Extract username from email (before @)
            username = email.split('@')[0]
            
            # Ensure username is unique
            base_username = username
            counter = 1
            while db.query(User).filter(User.username == username).first():
                username = f"{base_username}{counter}"
                counter += 1
            
            # Extract first name from email (capitalize first letter)
            first_name = username.capitalize()
            
            # Create new user
            new_user = User(
                email=email,
                username=username,
                first_name=first_name,
                last_name="",  # User can update later
                password_hash=hash_password(os.urandom(32).hex()),  # Random password (OAuth users don't need it)
                is_active=True,
                is_verified=True,  # Auto-verify Google OAuth users
                oauth_provider="google",
                oauth_id=email,  # Use email as OAuth ID
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            # Generate access token
            access_token = auth_manager.create_access_token({"sub": str(new_user.id)})
            
            return GoogleAuthResponse(
                success=True,
                message="Account created successfully",
                data={
                    "access_token": access_token,
                    "token_type": "bearer",
                    "user": {
                        "id": new_user.id,
                        "email": new_user.email,
                        "username": new_user.username,
                        "first_name": new_user.first_name,
                        "last_name": new_user.last_name,
                        "is_verified": True,
                        "created_at": new_user.created_at.isoformat()
                    },
                    "is_new_user": True
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error during verification: {str(e)}")


@router.post("/google/resend-otp", response_model=GoogleAuthResponse)
async def resend_google_otp(
    request: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    """
    Resend OTP to Gmail
    """
    try:
        email = request.email.lower()
        
        # Generate new OTP
        otp = email_service.generate_otp()
        
        # Store OTP (replaces old one)
        email_service.store_otp(email, otp, expires_in_minutes=10)
        
        # Send OTP email
        email_sent = email_service.send_otp_email(email, otp)
        
        if email_sent:
            return GoogleAuthResponse(
                success=True,
                message=f"Verification code resent to {email}",
                data={"email": email}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to resend verification email")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resending OTP: {str(e)}")


@router.get("/google/check-email")
async def check_email_exists(
    email: str,
    db: Session = Depends(get_db)
):
    """
    Check if email already exists in database
    """
    try:
        email_lower = email.lower()
        existing_user = db.query(User).filter(User.email == email_lower).first()
        
        return {
            "exists": existing_user is not None,
            "email": email_lower,
            "message": "Email already registered" if existing_user else "Email available"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking email: {str(e)}")
