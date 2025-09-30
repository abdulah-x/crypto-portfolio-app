#!/usr/bin/env python3
"""
Add sample data to test our API endpoints
"""
import sys
from pathlib import Path
from decimal import Decimal
from datetime import datetime, timedelta

# Add database to path
sys.path.append(str(Path(__file__).parent / "app"))

from database import SessionLocal, User, Asset, Holding, CurrentPrice, Trade

def add_sample_data():
    """Add sample data for testing"""
    db = SessionLocal()
    
    try:
        print("📊 Adding sample data for API testing...")
        
        # Check if we already have data
        existing_holdings = db.query(Holding).count()
        if existing_holdings > 0:
            print(f"✅ Already have {existing_holdings} holdings in database")
            return
        
        # Get user (should exist from previous setup)
        user = db.query(User).first()
        if not user:
            print("❌ No user found. Please run database setup first.")
            return
        
        # Get assets
        btc = db.query(Asset).filter(Asset.symbol == 'BTC').first()
        eth = db.query(Asset).filter(Asset.symbol == 'ETH').first()
        
        if not btc or not eth:
            print("❌ Assets not found. Please run database setup first.")
            return
        
        # Add sample holdings
        print("💰 Adding sample holdings...")
        holdings = [
            Holding(
                user_id=user.id,
                asset_id=btc.id,
                quantity=Decimal('0.5'),
                average_price=Decimal('45000.00'),
                total_cost=Decimal('22500.00')
            ),
            Holding(
                user_id=user.id,
                asset_id=eth.id,
                quantity=Decimal('2.0'),
                average_price=Decimal('2500.00'),
                total_cost=Decimal('5000.00')
            )
        ]
        
        for holding in holdings:
            db.add(holding)
        
        # Add current prices
        print("💲 Adding current prices...")
        prices = [
            CurrentPrice(
                asset_id=btc.id,
                price_usd=Decimal('47000.00'),
                last_updated=datetime.utcnow()
            ),
            CurrentPrice(
                asset_id=eth.id,
                price_usd=Decimal('2600.00'),
                last_updated=datetime.utcnow()
            )
        ]
        
        for price in prices:
            # Check if price already exists
            existing = db.query(CurrentPrice).filter(CurrentPrice.asset_id == price.asset_id).first()
            if existing:
                existing.price_usd = price.price_usd
                existing.last_updated = price.last_updated
            else:
                db.add(price)
        
        # Add sample trades
        print("📈 Adding sample trades...")
        trades = [
            Trade(
                user_id=user.id,
                base_asset_id=btc.id,
                quote_asset_id=None,  # Assuming USDT
                symbol='BTCUSDT',
                side='BUY',
                order_type='MARKET',
                quantity=Decimal('0.3'),
                price=Decimal('44000.00'),
                quote_quantity=Decimal('13200.00'),
                commission=Decimal('13.20'),
                commission_asset='USDT',
                executed_at=datetime.utcnow() - timedelta(days=10)
            ),
            Trade(
                user_id=user.id,
                base_asset_id=btc.id,
                quote_asset_id=None,
                symbol='BTCUSDT',
                side='BUY',
                order_type='LIMIT',
                quantity=Decimal('0.2'),
                price=Decimal('46000.00'),
                quote_quantity=Decimal('9200.00'),
                commission=Decimal('9.20'),
                commission_asset='USDT',
                executed_at=datetime.utcnow() - timedelta(days=5)
            ),
            Trade(
                user_id=user.id,
                base_asset_id=eth.id,
                quote_asset_id=None,
                symbol='ETHUSDT',
                side='BUY',
                order_type='MARKET',
                quantity=Decimal('2.0'),
                price=Decimal('2500.00'),
                quote_quantity=Decimal('5000.00'),
                commission=Decimal('5.00'),
                commission_asset='USDT',
                executed_at=datetime.utcnow() - timedelta(days=7)
            )
        ]
        
        for trade in trades:
            db.add(trade)
        
        db.commit()
        
        # Show summary
        holdings_count = db.query(Holding).count()
        trades_count = db.query(Trade).count()
        prices_count = db.query(CurrentPrice).count()
        
        print(f"✅ Sample data added successfully!")
        print(f"   📊 Holdings: {holdings_count}")
        print(f"   📈 Trades: {trades_count}")
        print(f"   💲 Current Prices: {prices_count}")
        print(f"\n🚀 Ready to test API endpoints!")
        
    except Exception as e:
        print(f"❌ Error adding sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_sample_data()