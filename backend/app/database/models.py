from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, DECIMAL, Date, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .connection import Base
import datetime

# Users and Authentication
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile information
    first_name = Column(String(50))
    last_name = Column(String(50))
    timezone = Column(String(50), default='UTC')
    preferred_currency = Column(String(10), default='USD')
    
    # Account settings
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Binance API credentials (encrypted)
    encrypted_api_key = Column(Text)
    encrypted_api_secret = Column(Text)
    binance_testnet = Column(Boolean, default=True)
    
    # Auto-sync settings
    auto_sync_enabled = Column(Boolean, default=True)
    sync_interval_minutes = Column(Integer, default=60)
    last_sync_at = Column(DateTime)
    last_sync_status = Column(String(20), default='pending')
    sync_error_message = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    last_login = Column(DateTime)
    
    # Relationships
    trades = relationship("Trade", back_populates="user", cascade="all, delete-orphan")
    holdings = relationship("Holding", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_token = Column(String(255), nullable=False, unique=True, index=True)
    device_info = Column(Text)
    ip_address = Column(String(45))  # IPv6 support
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())

# Assets and Market Data
class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    
    # Asset classification
    asset_type = Column(String(20), default='cryptocurrency')
    is_base_currency = Column(Boolean, default=False)
    
    # Display information
    logo_url = Column(Text)
    decimals = Column(Integer, default=8)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    current_price = relationship("CurrentPrice", back_populates="asset", uselist=False)
    price_history = relationship("PriceHistory", back_populates="asset")

class CurrentPrice(Base):
    __tablename__ = "current_prices"
    
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # Price information
    price_usd = Column(DECIMAL(20, 8), nullable=False)
    price_btc = Column(DECIMAL(20, 8))
    
    # 24h statistics
    price_change_24h = Column(DECIMAL(10, 4))
    price_change_percentage_24h = Column(DECIMAL(10, 4))
    volume_24h = Column(Integer)
    
    # Source and timing
    data_source = Column(String(50), default='binance')
    last_updated = Column(DateTime, default=func.now())
    
    # Relationship
    asset = relationship("Asset", back_populates="current_price")

class PriceHistory(Base):
    __tablename__ = "price_history"
    
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Price and volume
    price_usd = Column(DECIMAL(20, 8), nullable=False)
    volume_24h = Column(Integer)
    
    # Snapshot timing
    snapshot_date = Column(Date, nullable=False, index=True)
    snapshot_type = Column(String(20), default='daily')
    
    created_at = Column(DateTime, default=func.now())
    
    # Relationship
    asset = relationship("Asset", back_populates="price_history")

# Trading and Transactions
class Trade(Base):
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Binance trade identification
    binance_order_id = Column(String(100), nullable=False, index=True)
    binance_trade_id = Column(String(100))
    
    # Trading pair information
    symbol = Column(String(20), nullable=False, index=True)
    base_asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    quote_asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    
    # Trade details
    side = Column(String(10), nullable=False)  # 'BUY', 'SELL'
    order_type = Column(String(20), nullable=False)  # 'MARKET', 'LIMIT'
    
    # Quantities and prices
    quantity = Column(DECIMAL(20, 8), nullable=False)
    price = Column(DECIMAL(20, 8), nullable=False)
    quote_quantity = Column(DECIMAL(20, 8), nullable=False)
    
    # Fees
    commission = Column(DECIMAL(20, 8), default=0)
    commission_asset = Column(String(10))
    
    # Status
    status = Column(String(20), default='FILLED')
    
    # Timing
    executed_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, default=func.now())
    
    # P&L tracking
    realized_pnl_usd = Column(DECIMAL(20, 8))
    realized_pnl_percentage = Column(DECIMAL(10, 4))
    
    # User notes
    notes = Column(Text)
    
    # Import tracking
    import_source = Column(String(50), default='binance_api')
    
    # Relationships
    user = relationship("User", back_populates="trades")
    base_asset = relationship("Asset", foreign_keys=[base_asset_id])
    quote_asset = relationship("Asset", foreign_keys=[quote_asset_id])

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Transaction details
    transaction_type = Column(String(50), nullable=False)  # 'DEPOSIT', 'WITHDRAWAL'
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    
    # Amount and fees
    amount = Column(DECIMAL(20, 8), nullable=False)
    fee = Column(DECIMAL(20, 8), default=0)
    
    # Status and details
    status = Column(String(20), default='COMPLETED')
    transaction_hash = Column(String(100))
    address = Column(String(100))
    
    # Timing
    executed_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, default=func.now())
    
    # Notes
    notes = Column(Text)
    
    # Import tracking
    import_source = Column(String(50), default='binance_api')
    
    # Relationships
    user = relationship("User", back_populates="transactions")
    asset = relationship("Asset")

# Portfolio Holdings
class Holding(Base):
    __tablename__ = "holdings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False, index=True)
    
    # Quantity details
    total_quantity = Column(DECIMAL(20, 8), nullable=False, default=0)
    available_quantity = Column(DECIMAL(20, 8), nullable=False, default=0)
    locked_quantity = Column(DECIMAL(20, 8), nullable=False, default=0)
    
    # Cost basis calculations
    average_cost_usd = Column(DECIMAL(20, 8), nullable=False, default=0)
    total_cost_usd = Column(DECIMAL(20, 8), nullable=False, default=0)
    
    # Current market values
    current_price_usd = Column(DECIMAL(20, 8))
    current_value_usd = Column(DECIMAL(20, 8))
    
    # P&L calculations
    unrealized_pnl_usd = Column(DECIMAL(20, 8))
    unrealized_pnl_percentage = Column(DECIMAL(10, 4))
    realized_pnl_usd = Column(DECIMAL(20, 8), default=0)
    
    # Portfolio allocation
    portfolio_percentage = Column(DECIMAL(10, 4))
    
    # Tracking
    first_acquired_at = Column(DateTime)
    last_transaction_at = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="holdings")
    asset = relationship("Asset")

class PortfolioSnapshot(Base):
    __tablename__ = "portfolio_snapshots"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Snapshot timing
    snapshot_date = Column(Date, nullable=False, index=True)
    snapshot_type = Column(String(20), default='daily')
    
    # Portfolio totals
    total_value_usd = Column(DECIMAL(20, 8), nullable=False)
    total_cost_usd = Column(DECIMAL(20, 8), nullable=False)
    total_pnl_usd = Column(DECIMAL(20, 8), nullable=False)
    total_pnl_percentage = Column(DECIMAL(10, 4), nullable=False)
    
    # Portfolio composition (stored as JSON)
    top_holdings = Column(JSON)
    
    # Asset counts
    total_assets = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User")

# Analytics and Performance
class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Time period
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    period_type = Column(String(20), nullable=False)
    
    # Portfolio performance
    starting_value_usd = Column(DECIMAL(20, 8), nullable=False)
    ending_value_usd = Column(DECIMAL(20, 8), nullable=False)
    
    # Returns
    absolute_return_usd = Column(DECIMAL(20, 8))
    percentage_return = Column(DECIMAL(10, 4))
    
    # Trading activity
    total_trades = Column(Integer, default=0)
    total_volume_usd = Column(DECIMAL(20, 8), default=0)
    
    # Best and worst performers
    best_performing_asset = Column(String(20))
    best_performer_return = Column(DECIMAL(10, 4))
    worst_performing_asset = Column(String(20))
    worst_performer_return = Column(DECIMAL(10, 4))
    
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User")

# Simple Gamification
class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Achievement details
    achievement_code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    
    # Requirements
    requirement_type = Column(String(50), nullable=False)
    requirement_value = Column(Integer, nullable=False)
    
    # Reward
    points_reward = Column(Integer, default=0)
    badge_icon = Column(Text)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False)
    
    # Progress tracking
    current_progress = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime)
    points_earned = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    achievement = relationship("Achievement", back_populates="user_achievements")

class UserStreak(Base):
    __tablename__ = "user_streaks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Streak types
    streak_type = Column(String(50), nullable=False)
    
    # Streak data
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(Date)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User")

# System and Audit
class SystemSetting(Base):
    __tablename__ = "system_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    setting_key = Column(String(100), unique=True, nullable=False)
    setting_value = Column(Text, nullable=False)
    setting_type = Column(String(20), default='STRING')
    description = Column(Text)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Action details
    action_type = Column(String(50), nullable=False)
    action_description = Column(Text)
    
    # Context
    entity_type = Column(String(50))
    entity_id = Column(Integer)
    
    # Request info
    ip_address = Column(String(45))
    user_agent = Column(Text)
    
    # Result
    success = Column(Boolean, default=True)
    error_message = Column(Text)
    
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User")

class SyncHistory(Base):
    __tablename__ = "sync_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Sync details
    sync_type = Column(String(50), nullable=False)
    sync_status = Column(String(20), nullable=False)
    
    # Results
    trades_synced = Column(Integer, default=0)
    transactions_synced = Column(Integer, default=0)
    holdings_updated = Column(Integer, default=0)
    
    # Timing
    started_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime)
    duration_seconds = Column(Integer)
    
    # Error handling
    error_message = Column(Text)
    error_details = Column(JSON)
    
    # Relationships
    user = relationship("User")