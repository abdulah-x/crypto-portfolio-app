#!/usr/bin/env python3
"""
Portfolio API Endpoints
Summary of holdings and portfolio overview
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from decimal import Decimal
from datetime import datetime
import sys
from pathlib import Path

# Add database to path
sys.path.append(str(Path(__file__).parent.parent))

from database import SessionLocal, User, Asset, Holding, CurrentPrice, PortfolioSnapshot
from pydantic import BaseModel

router = APIRouter()

# Pydantic models for responses
class AssetHolding(BaseModel):
    asset_symbol: str
    asset_name: str
    total_quantity: Decimal
    available_quantity: Decimal
    locked_quantity: Decimal
    average_cost_usd: Decimal
    current_price_usd: Optional[Decimal]
    current_value_usd: Optional[Decimal]
    unrealized_pnl_usd: Optional[Decimal]
    unrealized_pnl_percentage: Optional[Decimal]
    portfolio_percentage: Optional[Decimal]

class PortfolioSummary(BaseModel):
    user_id: int
    total_portfolio_value_usd: Decimal
    total_cost_usd: Decimal
    total_unrealized_pnl_usd: Decimal
    total_unrealized_pnl_percentage: Decimal
    asset_count: int
    last_updated: datetime
    holdings: List[AssetHolding]

def get_db():
    """Database dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/portfolio", response_model=Dict[str, Any])
async def get_portfolio_summary(user_id: int = 1, db = Depends(get_db)):
    """
    Get portfolio summary with all holdings
    
    Returns:
    - Total portfolio value
    - Individual asset holdings
    - P&L calculations
    - Portfolio allocation percentages
    """
    try:
        # Get user holdings with asset and price information
        holdings_query = (
            db.query(Holding, Asset, CurrentPrice)
            .join(Asset, Holding.asset_id == Asset.id)
            .outerjoin(CurrentPrice, Asset.id == CurrentPrice.asset_id)
            .filter(Holding.user_id == user_id)
            .filter(Holding.total_quantity > 0)
        )
        
        holdings_data = holdings_query.all()
        
        if not holdings_data:
            return {
                "message": "No holdings found for user",
                "user_id": user_id,
                "portfolio_summary": {
                    "total_portfolio_value_usd": 0,
                    "total_cost_usd": 0,
                    "total_unrealized_pnl_usd": 0,
                    "total_unrealized_pnl_percentage": 0,
                    "asset_count": 0,
                    "holdings": []
                }
            }
        
        # Calculate portfolio metrics
        total_value = Decimal('0')
        total_cost = Decimal('0')
        holdings_list = []
        
        for holding, asset, current_price in holdings_data:
            # Current price (use stored price or fetch live price)
            price_usd = current_price.price_usd if current_price else Decimal('0')
            current_value = holding.total_quantity * price_usd if price_usd > 0 else Decimal('0')
            
            # P&L calculations
            unrealized_pnl = current_value - holding.total_cost_usd if current_value > 0 else Decimal('0')
            unrealized_pnl_pct = (unrealized_pnl / holding.total_cost_usd * 100) if holding.total_cost_usd > 0 else Decimal('0')
            
            holdings_list.append({
                "asset_symbol": asset.symbol,
                "asset_name": asset.name,
                "total_quantity": float(holding.total_quantity),
                "available_quantity": float(holding.available_quantity),
                "locked_quantity": float(holding.locked_quantity),
                "average_cost_usd": float(holding.average_cost_usd),
                "current_price_usd": float(price_usd) if price_usd else None,
                "current_value_usd": float(current_value) if current_value else None,
                "unrealized_pnl_usd": float(unrealized_pnl),
                "unrealized_pnl_percentage": float(unrealized_pnl_pct),
                "portfolio_percentage": 0  # Will calculate after total
            })
            
            total_value += current_value
            total_cost += holding.total_cost_usd
        
        # Calculate portfolio percentages
        for holding in holdings_list:
            if total_value > 0 and holding["current_value_usd"]:
                holding["portfolio_percentage"] = float((Decimal(str(holding["current_value_usd"])) / total_value) * 100)
        
        # Overall P&L
        total_pnl = total_value - total_cost
        total_pnl_pct = (total_pnl / total_cost * 100) if total_cost > 0 else Decimal('0')
        
        return {
            "success": True,
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "portfolio_summary": {
                "total_portfolio_value_usd": float(total_value),
                "total_cost_usd": float(total_cost),
                "total_unrealized_pnl_usd": float(total_pnl),
                "total_unrealized_pnl_percentage": float(total_pnl_pct),
                "asset_count": len(holdings_list),
                "last_updated": datetime.utcnow().isoformat(),
                "holdings": holdings_list
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching portfolio: {str(e)}")

@router.get("/overview", response_model=Dict[str, Any])
async def get_portfolio_overview(user_id: int = 1, db = Depends(get_db)):
    """
    Get condensed portfolio overview (just totals, no individual holdings)
    """
    try:
        # Query portfolio totals
        holdings = db.query(Holding).filter(
            Holding.user_id == user_id,
            Holding.total_quantity > 0
        ).all()
        
        if not holdings:
            return {
                "user_id": user_id,
                "total_value_usd": 0,
                "total_cost_usd": 0,
                "total_pnl_usd": 0,
                "total_pnl_percentage": 0,
                "asset_count": 0
            }
        
        total_value = sum(h.current_value_usd or Decimal('0') for h in holdings)
        total_cost = sum(h.total_cost_usd for h in holdings)
        total_pnl = total_value - total_cost
        total_pnl_pct = (total_pnl / total_cost * 100) if total_cost > 0 else Decimal('0')
        
        return {
            "success": True,
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "summary": {
                "total_value_usd": float(total_value),
                "total_cost_usd": float(total_cost),
                "total_pnl_usd": float(total_pnl),
                "total_pnl_percentage": float(total_pnl_pct),
                "asset_count": len(holdings)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching portfolio summary: {str(e)}")