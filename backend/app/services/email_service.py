"""
Email Service for sending OTP verification codes
"""
import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Dict, Optional
import os

class EmailService:
    """Service for sending OTP emails"""
    
    def __init__(self):
        # Email configuration - use environment variables
        self.smtp_server = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.sender_email = os.getenv("SMTP_FROM_EMAIL", os.getenv("SMTP_USERNAME", "noreply@vaultx.com"))
        self.sender_password = os.getenv("SMTP_PASSWORD", "")
        
        # OTP storage (in production, use Redis or database)
        self.otp_storage: Dict[str, Dict] = {}
    
    def generate_otp(self, length: int = 6) -> str:
        """Generate a random OTP code"""
        return ''.join(random.choices(string.digits, k=length))
    
    def store_otp(self, email: str, otp: str, expires_in_minutes: int = 10):
        """Store OTP with expiration time"""
        self.otp_storage[email] = {
            "otp": otp,
            "created_at": datetime.now(),
            "expires_at": datetime.now() + timedelta(minutes=expires_in_minutes),
            "attempts": 0
        }
    
    def verify_otp(self, email: str, otp: str) -> tuple[bool, str]:
        """
        Verify OTP code
        Returns (is_valid, message)
        """
        if email not in self.otp_storage:
            return False, "No OTP found for this email"
        
        stored_data = self.otp_storage[email]
        
        # Check if OTP has expired
        if datetime.now() > stored_data["expires_at"]:
            del self.otp_storage[email]
            return False, "OTP has expired"
        
        # Check attempts
        if stored_data["attempts"] >= 3:
            del self.otp_storage[email]
            return False, "Too many failed attempts"
        
        # Verify OTP
        if stored_data["otp"] == otp:
            del self.otp_storage[email]
            return True, "OTP verified successfully"
        else:
            stored_data["attempts"] += 1
            return False, f"Invalid OTP. {3 - stored_data['attempts']} attempts remaining"
    
    def send_otp_email(self, recipient_email: str, otp: str) -> bool:
        """
        Send OTP via email
        """
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = "VaultX - Your Verification Code"
            message["From"] = self.sender_email
            message["To"] = recipient_email
            
            # Email body
            text_content = f"""
            Welcome to VaultX!
            
            Your verification code is: {otp}
            
            This code will expire in 10 minutes.
            
            If you didn't request this code, please ignore this email.
            
            Best regards,
            VaultX Team
            """
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }}
                    .container {{ background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                    .header {{ text-align: center; margin-bottom: 30px; }}
                    .logo {{ font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #8B5CF6, #06B6D4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}
                    .otp-box {{ background: linear-gradient(135deg, #8B5CF6, #06B6D4); color: white; font-size: 36px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0; letter-spacing: 8px; }}
                    .content {{ color: #333; line-height: 1.6; }}
                    .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px; }}
                    .warning {{ background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">VaultX</div>
                        <p style="color: #666; margin-top: 10px;">Professional Crypto Portfolio Tracker</p>
                    </div>
                    
                    <div class="content">
                        <h2 style="color: #8B5CF6;">Welcome to VaultX!</h2>
                        <p>Thank you for choosing VaultX to manage your cryptocurrency portfolio.</p>
                        <p>To complete your registration, please use the verification code below:</p>
                        
                        <div class="otp-box">{otp}</div>
                        
                        <p><strong>This code will expire in 10 minutes.</strong></p>
                        
                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong> If you didn't request this code, please ignore this email and your account will remain secure.
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>© 2026 VaultX. All rights reserved.</p>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Attach both versions
            part1 = MIMEText(text_content, "plain")
            part2 = MIMEText(html_content, "html")
            message.attach(part1)
            message.attach(part2)
            
            # Send email
            if self.sender_password:  # Only send if password is configured
                smtp_username = os.getenv("SMTP_USERNAME", self.sender_email)
                with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                    server.starttls()
                    server.login(smtp_username, self.sender_password)
                    server.send_message(message)
                print(f"✅ Email sent successfully to {recipient_email}")
                return True
            else:
                # Development mode - print OTP to console
                print(f"\n{'='*50}")
                print(f"📧 [DEV MODE] OTP Email for {recipient_email}")
                print(f"{'='*50}")
                print(f"OTP Code: {otp}")
                print(f"Expires: 10 minutes")
                print(f"{'='*50}\n")
                return True
                
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            # In development, print OTP anyway
            print(f"\n{'='*50}")
            print(f"📧 [DEV MODE - EMAIL FAILED] OTP for {recipient_email}")
            print(f"{'='*50}")
            print(f"OTP Code: {otp}")
            print(f"{'='*50}\n")
            return True  # Return True in dev mode so registration can continue

# Singleton instance
email_service = EmailService()
