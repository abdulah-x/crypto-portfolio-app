from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # App Configuration
    app_name: str = "Crypto Portfolio API"
    version: str = "1.0.0"
    debug: bool = True
    
    # Server Configuration
    host: str = "127.0.0.1"
    port: int = 8000
    
    # Database Configuration
    database_url: str = "sqlite:///./crypto_portfolio.db"
    
    # Security Configuration
    secret_key: str = "your-super-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Binance API Configuration
    binance_api_key: Optional[str] = None
    binance_secret_key: Optional[str] = None
    binance_testnet: bool = True
    
    # Redis Configuration
    redis_url: str = "redis://localhost:6379/0"
    
    # Security Settings
    enable_api_encryption: bool = True
    allowed_ips: str = "localhost,127.0.0.1"
    
    # Rate Limiting
    api_rate_limit_per_minute: int = 60
    binance_rate_limit_per_minute: int = 1000
    
    # Emergency Controls
    emergency_disable_binance: bool = False
    maintenance_mode: bool = False
    
    # CORS Configuration
    allowed_origins: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()