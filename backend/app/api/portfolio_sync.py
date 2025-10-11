"""
Advanced Portfolio Sync Service
Automatically sync Binance portfolio data with local database
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from decimal import Decimal
from datetime import datetime, timedelta
import asyncio
import logging

from core.dependencies import get_db, get_current_active_user
from core.errors import DatabaseError, ValidationError
from database.models import User, Holding
from services.binance.client import BinanceClientManager
from services.binance.account import BinanceAccountService

router = APIRouter()
logger = logging.getLogger(__name__)

class AdvancedPortfolioSync:
    """Advanced portfolio synchronization with Binance"""
    
    def __init__(self):
        self.binance_service = BinanceAccountService()
        self.sync_in_progress = {}
        
    async def sync_user_portfolio(self, user_id: int, db: Session) -> Dict[str, Any]:
        """
        Comprehensive portfolio sync with enhanced features
        """
        try:
            if user_id in self.sync_in_progress:
                return {
                    "success": False,
                    "message": "Sync already in progress for this user",
                    "status": "in_progress"
                }
            
            self.sync_in_progress[user_id] = True
            sync_start_time = datetime.utcnow()
            
            logger.info(f"🔄 Starting portfolio sync for user {user_id}")
            
            # Get Binance balances
            binance_balances = self.binance_service.get_balances()
            if not binance_balances:
                return {
                    "success": False,
                    "message": "Failed to retrieve Binance balances",
                    "error": "binance_connection_failed"
                }
            
            # Get current prices for all assets
            prices = await self._get_asset_prices(binance_balances)
            
            # Process and categorize assets
            processed_assets = self._process_assets(binance_balances, prices)
            
            # Update database
            sync_results = await self._update_portfolio_database(
                user_id, processed_assets, db
            )
            
            sync_end_time = datetime.utcnow()
            sync_duration = (sync_end_time - sync_start_time).total_seconds()
            
            # Update user's last sync information
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.last_sync_at = sync_end_time
                user.last_sync_status = "success"
                db.commit()
            
            logger.info(f"✅ Portfolio sync completed for user {user_id} in {sync_duration:.2f}s")
            
            return {
                "success": True,
                "message": "Portfolio sync completed successfully",
                "sync_results": sync_results,
                "duration_seconds": sync_duration,
                "synced_at": sync_end_time.isoformat(),
                "total_assets": len(processed_assets),
                "categories": {
                    "major_coins": len([a for a in processed_assets if a["category"] == "major"]),
                    "stablecoins": len([a for a in processed_assets if a["category"] == "stable"]),
                    "altcoins": len([a for a in processed_assets if a["category"] == "altcoin"]),
                    "others": len([a for a in processed_assets if a["category"] == "other"])
                }
            }
            
        except Exception as e:
            logger.error(f"❌ Portfolio sync failed for user {user_id}: {e}")
            
            # Update sync status as failed
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.last_sync_status = "failed"
                user.sync_error_message = str(e)[:500]
                db.commit()
            
            return {
                "success": False,
                "message": f"Portfolio sync failed: {str(e)}",
                "error": "sync_failed"
            }
        finally:
            # Remove from in-progress tracking
            self.sync_in_progress.pop(user_id, None)
    
    async def _get_asset_prices(self, balances: List[Dict]) -> Dict[str, float]:
        """Get current prices for all assets"""
        prices = {}
        client_manager = BinanceClientManager()
        client = client_manager.get_client()
        
        if not client:
            logger.warning("⚠️ Binance client not available for price fetching")
            return prices
        
        # Get all tickers at once (more efficient)
        try:
            all_tickers = client.get_all_tickers()
            ticker_dict = {ticker['symbol']: float(ticker['price']) for ticker in all_tickers}
            
            for balance in balances:
                asset = balance['asset']
                
                # Try different symbol combinations
                potential_symbols = [
                    f"{asset}USDT",
                    f"{asset}BUSD", 
                    f"{asset}BTC",
                    f"{asset}ETH"
                ]
                
                for symbol in potential_symbols:
                    if symbol in ticker_dict:
                        prices[asset] = ticker_dict[symbol]
                        break
                
                # For stablecoins, assume $1
                if asset in ['USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'USDP']:
                    prices[asset] = 1.0
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to get prices: {e}")
        
        return prices
    
    def _process_assets(self, balances: List[Dict], prices: Dict[str, float]) -> List[Dict]:
        """Process and categorize assets with enhanced metadata"""
        processed = []
        
        # Asset categories
        major_coins = ['BTC', 'ETH', 'BNB', 'ADA', 'DOT', 'SOL', 'MATIC', 'AVAX', 'LINK']
        stablecoins = ['USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'USDP', 'FDUSD']
        
        for balance in balances:
            asset = balance['asset']
            total_amount = float(balance['total'])
            free_amount = float(balance['free'])
            locked_amount = float(balance['locked'])
            
            # Determine category
            if asset in major_coins:
                category = "major"
            elif asset in stablecoins:
                category = "stable"
            elif total_amount > 0:
                category = "altcoin" if asset not in ['BTC', 'ETH'] else "major"
            else:
                category = "other"
            
            # Calculate USD value
            price = prices.get(asset, 0)
            usd_value = total_amount * price
            
            processed.append({
                "asset": asset,
                "total_amount": total_amount,
                "free_amount": free_amount,
                "locked_amount": locked_amount,
                "category": category,
                "price_usd": price,
                "value_usd": usd_value,
                "percentage_locked": (locked_amount / total_amount * 100) if total_amount > 0 else 0,
                "last_updated": datetime.utcnow().isoformat()
            })
        
        # Sort by USD value (descending)
        processed.sort(key=lambda x: x['value_usd'], reverse=True)
        
        return processed
    
    async def _update_portfolio_database(self, user_id: int, assets: List[Dict], db: Session) -> Dict[str, Any]:
        """Update portfolio in database with sync results"""
        try:
            updated_count = 0
            created_count = 0
            
            for asset_data in assets:
                # Check if portfolio entry exists
                existing = db.query(Holding).filter(
                    Holding.user_id == user_id,
                    Holding.symbol == asset_data['asset']
                ).first()
                
                if existing:
                    # Update existing entry
                    existing.quantity = Decimal(str(asset_data['total_amount']))
                    existing.current_price = Decimal(str(asset_data['price_usd'])) if asset_data['price_usd'] > 0 else None
                    existing.current_value = Decimal(str(asset_data['value_usd'])) if asset_data['value_usd'] > 0 else None
                    existing.last_updated = datetime.utcnow()
                    existing.metadata = {
                        "category": asset_data['category'],
                        "free_amount": asset_data['free_amount'],
                        "locked_amount": asset_data['locked_amount'],
                        "percentage_locked": asset_data['percentage_locked']
                    }
                    updated_count += 1
                else:
                    # Create new entry
                    new_portfolio = Holding(
                        user_id=user_id,
                        symbol=asset_data['asset'],
                        quantity=Decimal(str(asset_data['total_amount'])),
                        average_price=Decimal(str(asset_data['price_usd'])) if asset_data['price_usd'] > 0 else None,
                        current_price=Decimal(str(asset_data['price_usd'])) if asset_data['price_usd'] > 0 else None,
                        current_value=Decimal(str(asset_data['value_usd'])) if asset_data['value_usd'] > 0 else None,
                        metadata={
                            "category": asset_data['category'],
                            "free_amount": asset_data['free_amount'],
                            "locked_amount": asset_data['locked_amount'],
                            "percentage_locked": asset_data['percentage_locked']
                        }
                    )
                    db.add(new_portfolio)
                    created_count += 1
            
            db.commit()
            
            return {
                "updated_assets": updated_count,
                "created_assets": created_count,
                "total_processed": len(assets),
                "total_value_usd": sum(asset['value_usd'] for asset in assets)
            }
            
        except Exception as e:
            db.rollback()
            raise e

# Global sync service instance
portfolio_sync_service = AdvancedPortfolioSync()

@router.post("/portfolio/sync", response_model=Dict[str, Any])
async def sync_portfolio(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Trigger comprehensive portfolio sync with Binance
    """
    try:
        result = await portfolio_sync_service.sync_user_portfolio(current_user.id, db)
        return result
        
    except Exception as e:
        logger.error(f"Portfolio sync failed: {str(e)}")
        raise DatabaseError(f"Portfolio sync failed: {str(e)}")

@router.get("/portfolio/sync/status", response_model=Dict[str, Any])
async def get_sync_status(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current sync status for user
    """
    is_syncing = current_user.id in portfolio_sync_service.sync_in_progress
    
    return {
        "success": True,
        "user_id": current_user.id,
        "sync_in_progress": is_syncing,
        "last_sync_at": current_user.last_sync_at.isoformat() if current_user.last_sync_at else None,
        "last_sync_status": current_user.last_sync_status,
        "sync_error_message": current_user.sync_error_message
    }

@router.get("/portfolio/enhanced", response_model=Dict[str, Any])
async def get_enhanced_portfolio(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get enhanced portfolio with categorization and analytics
    """
    try:
        portfolios = db.query(Holding).filter(Holding.user_id == current_user.id).all()
        
        if not portfolios:
            return {
                "success": True,
                "message": "No portfolio data found. Run sync first.",
                "portfolios": [],
                "analytics": {}
            }
        
        # Categorize and analyze
        major_coins = []
        stablecoins = []
        altcoins = []
        others = []
        total_value = Decimal('0')
        
        for portfolio in portfolios:
            portfolio_data = {
                "symbol": portfolio.symbol,
                "quantity": float(portfolio.quantity),
                "current_price": float(portfolio.current_price) if portfolio.current_price else 0,
                "current_value": float(portfolio.current_value) if portfolio.current_value else 0,
                "category": portfolio.metadata.get('category', 'unknown') if portfolio.metadata else 'unknown',
                "last_updated": portfolio.last_updated.isoformat() if portfolio.last_updated else None
            }
            
            category = portfolio_data['category']
            if category == 'major':
                major_coins.append(portfolio_data)
            elif category == 'stable':
                stablecoins.append(portfolio_data)
            elif category == 'altcoin':
                altcoins.append(portfolio_data)
            else:
                others.append(portfolio_data)
            
            total_value += portfolio.current_value or Decimal('0')
        
        analytics = {
            "total_value_usd": float(total_value),
            "asset_counts": {
                "major_coins": len(major_coins),
                "stablecoins": len(stablecoins),
                "altcoins": len(altcoins),
                "others": len(others),
                "total": len(portfolios)
            },
            "allocation": {
                "major_coins_value": sum(p['current_value'] for p in major_coins),
                "stablecoins_value": sum(p['current_value'] for p in stablecoins),
                "altcoins_value": sum(p['current_value'] for p in altcoins),
                "others_value": sum(p['current_value'] for p in others)
            }
        }
        
        return {
            "success": True,
            "portfolios": {
                "major_coins": major_coins,
                "stablecoins": stablecoins,
                "altcoins": altcoins,
                "others": others
            },
            "analytics": analytics,
            "last_sync": current_user.last_sync_at.isoformat() if current_user.last_sync_at else None
        }
        
    except Exception as e:
        logger.error(f"Failed to get enhanced portfolio: {str(e)}")
        raise DatabaseError(f"Failed to get enhanced portfolio: {str(e)}")