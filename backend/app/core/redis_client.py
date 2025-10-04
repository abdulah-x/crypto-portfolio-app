"""
Redis client for token blacklisting and caching
"""
import redis
import json
from typing import Optional, Any
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class RedisClient:
    """Redis client for token blacklisting and session management"""
    
    def __init__(self):
        # Use Redis URL from environment or default to local Redis
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        
        try:
            # Try to connect to Redis
            self.redis_client = redis.from_url(redis_url, decode_responses=True)
            # Test connection
            self.redis_client.ping()
            self.connected = True
            print("✅ Redis connected for token blacklisting")
        except (redis.ConnectionError, redis.TimeoutError) as e:
            print(f"⚠️  Redis not available: {e}")
            print("🔄 Falling back to in-memory token blacklist")
            self.redis_client = None
            self.connected = False
            # Fallback to in-memory storage
            self._memory_blacklist = set()
    
    def blacklist_token(self, token: str, expires_in_seconds: int) -> bool:
        """
        Add token to blacklist with expiration
        
        Args:
            token: JWT token to blacklist
            expires_in_seconds: How long to keep the token blacklisted
            
        Returns:
            bool: True if successfully blacklisted
        """
        try:
            if self.connected:
                # Store in Redis with expiration
                key = f"blacklist:{token}"
                return self.redis_client.setex(key, expires_in_seconds, "blacklisted")
            else:
                # Fallback to in-memory storage
                self._memory_blacklist.add(token)
                return True
        except Exception as e:
            print(f"❌ Error blacklisting token: {e}")
            return False
    
    def is_token_blacklisted(self, token: str) -> bool:
        """
        Check if token is blacklisted
        
        Args:
            token: JWT token to check
            
        Returns:
            bool: True if token is blacklisted
        """
        try:
            if self.connected:
                key = f"blacklist:{token}"
                return self.redis_client.exists(key) == 1
            else:
                # Check in-memory storage
                return token in self._memory_blacklist
        except Exception as e:
            print(f"❌ Error checking token blacklist: {e}")
            # On error, assume token is not blacklisted (fail-safe)
            return False
    
    def cleanup_expired_tokens(self):
        """
        Clean up expired tokens (Redis handles this automatically)
        For in-memory storage, we rely on token natural expiration
        """
        if not self.connected:
            # For in-memory storage, we could implement cleanup here
            # but for simplicity, we'll rely on application restart
            pass
    
    def get_blacklist_stats(self) -> dict:
        """Get statistics about blacklisted tokens"""
        try:
            if self.connected:
                blacklist_keys = self.redis_client.keys("blacklist:*")
                return {
                    "blacklisted_tokens": len(blacklist_keys),
                    "storage": "redis",
                    "connected": True
                }
            else:
                return {
                    "blacklisted_tokens": len(self._memory_blacklist),
                    "storage": "memory",
                    "connected": False
                }
        except Exception as e:
            return {
                "error": str(e),
                "blacklisted_tokens": 0,
                "storage": "unknown",
                "connected": False
            }

# Global Redis client instance
redis_client = RedisClient()