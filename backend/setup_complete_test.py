#!/usr/bin/env python3
"""
Complete setup script for testing JWT authentication
Creates users and sample data
"""

import sys
from pathlib import Path
from datetime import datetime
from decimal import Decimal

# Add database to path
sys.path.append(str(Path(__file__).parent / "app"))

try:
    from database import SessionLocal, User, Asset, Holding, CurrentPrice, Trade
    from core.auth import auth_manager
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running this from the backend directory")
    sys.exit(1)

def setup_complete_test_environment():
    """Setup complete test environment with users and data"""
    db = SessionLocal()
    
    try:
        print("🚀 Setting up complete test environment...")
        
        # 1. Create demo user if not exists
        demo_user = db.query(User).filter(User.username == "demo").first()
        if not demo_user:
            print("👤 Creating demo user...")
            demo_user = User(
                username="demo",
                email="demo@crypto-portfolio.com",
                hashed_password=auth_manager.get_password_hash("DemoPass123!"),
                first_name="Demo",
                last_name="User",
                timezone="UTC",
                preferred_currency="USD",
                is_active=True,
                is_verified=True,
                created_at=datetime.utcnow()
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
        else:
            print("✅ Demo user already exists")
        
        # 2. Create assets if not exist
        btc_asset = db.query(Asset).filter(Asset.symbol == "BTC").first()
        eth_asset = db.query(Asset).filter(Asset.symbol == "ETH").first()
        
        if not btc_asset:
            print("💰 Creating BTC asset...")
            btc_asset = Asset(
                symbol="BTC",
                name="Bitcoin",
                asset_type="cryptocurrency",
                is_active=True
            )
            db.add(btc_asset)
        
        if not eth_asset:
            print("💰 Creating ETH asset...")
            eth_asset = Asset(
                symbol="ETH",
                name="Ethereum",
                asset_type="cryptocurrency",
                is_active=True
            )
            db.add(eth_asset)
        
        db.commit()
        
        # Refresh assets
        if not btc_asset.id:
            db.refresh(btc_asset)
        if not eth_asset.id:
            db.refresh(eth_asset)
        
        # 3. Create current prices
        btc_price = db.query(CurrentPrice).filter(CurrentPrice.asset_id == btc_asset.id).first()
        if not btc_price:
            print("💲 Setting BTC price...")
            btc_price = CurrentPrice(
                asset_id=btc_asset.id,
                price_usd=Decimal('65000.00'),
                price_change_24h=Decimal('2500.00'),
                price_change_percentage_24h=Decimal('4.00')
            )
            db.add(btc_price)
        
        eth_price = db.query(CurrentPrice).filter(CurrentPrice.asset_id == eth_asset.id).first()
        if not eth_price:
            print("💲 Setting ETH price...")
            eth_price = CurrentPrice(
                asset_id=eth_asset.id,
                price_usd=Decimal('2500.00'),
                price_change_24h=Decimal('150.00'),
                price_change_percentage_24h=Decimal('6.40')
            )
            db.add(eth_price)
        
        # 4. Create sample holdings
        existing_holdings = db.query(Holding).filter(Holding.user_id == demo_user.id).count()
        if existing_holdings == 0:
            print("📊 Creating sample holdings...")
            
            btc_holding = Holding(
                user_id=demo_user.id,
                asset_id=btc_asset.id,
                total_quantity=Decimal('0.5'),
                available_quantity=Decimal('0.5'),
                locked_quantity=Decimal('0'),
                average_cost_usd=Decimal('60000.00'),
                total_cost_usd=Decimal('30000.00'),
                current_value_usd=Decimal('32500.00')  # Current price * quantity
            )
            
            eth_holding = Holding(
                user_id=demo_user.id,
                asset_id=eth_asset.id,
                total_quantity=Decimal('10.0'),
                available_quantity=Decimal('10.0'),
                locked_quantity=Decimal('0'),
                average_cost_usd=Decimal('2200.00'),
                total_cost_usd=Decimal('22000.00'),
                current_value_usd=Decimal('25000.00')  # Current price * quantity
            )
            
            db.add(btc_holding)
            db.add(eth_holding)
        
        # 5. Create sample trades
        existing_trades = db.query(Trade).filter(Trade.user_id == demo_user.id).count()
        if existing_trades == 0:
            print("📈 Creating sample trades...")
            
            # BTC buy trade
            btc_trade = Trade(
                user_id=demo_user.id,
                binance_order_id="1000001",
                binance_trade_id="2000001",
                symbol="BTCUSDT",
                base_asset_id=btc_asset.id,
                quote_asset_id=btc_asset.id,  # Simplified
                side="BUY",
                order_type="MARKET",
                quantity=Decimal('0.5'),
                price=Decimal('60000.00'),
                quote_quantity=Decimal('30000.00'),
                commission=Decimal('30.00'),
                commission_asset="USDT",
                executed_at=datetime.utcnow(),
                realized_pnl_usd=Decimal('0'),
                realized_pnl_percentage=Decimal('0')
            )
            
            # ETH buy trade
            eth_trade = Trade(
                user_id=demo_user.id,
                binance_order_id="1000002",
                binance_trade_id="2000002",
                symbol="ETHUSDT",
                base_asset_id=eth_asset.id,
                quote_asset_id=eth_asset.id,  # Simplified
                side="BUY",
                order_type="MARKET",
                quantity=Decimal('10.0'),
                price=Decimal('2200.00'),
                quote_quantity=Decimal('22000.00'),
                commission=Decimal('22.00'),
                commission_asset="USDT",
                executed_at=datetime.utcnow(),
                realized_pnl_usd=Decimal('0'),
                realized_pnl_percentage=Decimal('0')
            )
            
            db.add(btc_trade)
            db.add(eth_trade)
        
        db.commit()
        
        print("✅ Test environment setup completed!")
        print("\n📋 Summary:")
        print(f"  👤 Demo user: demo@crypto-portfolio.com (password: DemoPass123!)")
        print(f"  💰 Assets: BTC ($65,000), ETH ($2,500)")
        print(f"  📊 Holdings: 0.5 BTC ($32,500), 10 ETH ($25,000)")
        print(f"  📈 Total Portfolio Value: $57,500")
        print(f"  💹 Total Cost: $52,000")
        print(f"  🎯 Unrealized P&L: $5,500 (+10.58%)")
        
        print("\n🧪 Test the P&L API:")
        print("  1. Start server: python app/main.py")
        print("  2. Run tests: python test_pnl_api.py")
        
    except Exception as e:
        print(f"❌ Error setting up test environment: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    setup_complete_test_environment()