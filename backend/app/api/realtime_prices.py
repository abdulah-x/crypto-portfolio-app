"""
Real-time Price Updates Service
WebSocket-based real-time price streaming from Binance
"""
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Set
import asyncio
import json
import logging
from datetime import datetime, timedelta
import websockets

from core.dependencies import get_db, get_current_active_user
from database.models import User, Holding
from services.binance.client import BinanceClientManager

router = APIRouter()
logger = logging.getLogger(__name__)

class RealTimePriceManager:
    """Manage real-time price updates and WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_subscriptions: Dict[int, Set[str]] = {}
        self.price_cache: Dict[str, Dict] = {}
        self.binance_ws_connection = None
        self.is_streaming = False
        
    async def connect_user(self, websocket: WebSocket, user_id: int, user_token: str):
        """Connect a user to real-time price updates"""
        await websocket.accept()
        connection_id = f"{user_id}_{user_token[:8]}"
        self.active_connections[connection_id] = websocket
        
        if user_id not in self.user_subscriptions:
            self.user_subscriptions[user_id] = set()
            
        logger.info(f"✅ User {user_id} connected for real-time prices")
        
        return connection_id
    
    async def disconnect_user(self, connection_id: str, user_id: int):
        """Disconnect a user from real-time updates"""
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
            
        if user_id in self.user_subscriptions and len(self.user_subscriptions[user_id]) == 0:
            del self.user_subscriptions[user_id]
            
        logger.info(f"❌ User {user_id} disconnected from real-time prices")
    
    async def subscribe_to_symbols(self, user_id: int, symbols: List[str]):
        """Subscribe user to specific symbols for price updates"""
        if user_id not in self.user_subscriptions:
            self.user_subscriptions[user_id] = set()
            
        for symbol in symbols:
            self.user_subscriptions[user_id].add(symbol.upper())
            
        # Start streaming if not already started
        if not self.is_streaming and self.user_subscriptions:
            await self._start_binance_stream()
            
        logger.info(f"📈 User {user_id} subscribed to {len(symbols)} symbols")
    
    async def get_portfolio_symbols(self, user_id: int, db: Session) -> List[str]:
        """Get symbols from user's portfolio for automatic subscription"""
        portfolios = db.query(Holding).filter(
            Holding.user_id == user_id,
            Holding.quantity > 0
        ).all()
        
        symbols = []
        for portfolio in portfolios:
            asset = portfolio.symbol
            # Generate potential trading pairs
            potential_symbols = [
                f"{asset}USDT",
                f"{asset}BUSD",
                f"{asset}BTC", 
                f"{asset}ETH"
            ]
            symbols.extend(potential_symbols)
        
        return list(set(symbols))  # Remove duplicates
    
    async def _start_binance_stream(self):
        """Start Binance WebSocket stream for real-time prices"""
        try:
            if self.is_streaming:
                return
                
            self.is_streaming = True
            
            # Get all unique symbols from all users
            all_symbols = set()
            for user_symbols in self.user_subscriptions.values():
                all_symbols.update(user_symbols)
            
            if not all_symbols:
                self.is_streaming = False
                return
            
            # Create WebSocket streams for all symbols
            streams = [f"{symbol.lower()}@ticker" for symbol in all_symbols]
            stream_url = f"wss://testnet.binance.vision/ws-api/v3"  # Testnet WebSocket
            
            logger.info(f"🔌 Starting Binance WebSocket for {len(streams)} symbols")
            
            # Start streaming in background
            asyncio.create_task(self._handle_binance_stream(streams))
            
        except Exception as e:
            logger.error(f"❌ Failed to start Binance stream: {e}")
            self.is_streaming = False
    
    async def _handle_binance_stream(self, streams: List[str]):
        """Handle incoming Binance WebSocket data"""
        try:
            # For testnet, we'll simulate real-time updates
            # In production, this would connect to actual Binance WebSocket
            await self._simulate_price_updates()
            
        except Exception as e:
            logger.error(f"❌ Binance stream error: {e}")
            self.is_streaming = False
    
    async def _simulate_price_updates(self):
        """Simulate real-time price updates for testnet"""
        client_manager = BinanceClientManager()
        
        while self.is_streaming and self.active_connections:
            try:
                client = client_manager.get_client()
                if not client:
                    await asyncio.sleep(5)
                    continue
                
                # Get all unique symbols
                all_symbols = set()
                for user_symbols in self.user_subscriptions.values():
                    all_symbols.update(user_symbols)
                
                if not all_symbols:
                    await asyncio.sleep(5)
                    continue
                
                # Get current prices
                for symbol in list(all_symbols)[:10]:  # Limit to prevent rate limiting
                    try:
                        ticker = client.get_symbol_ticker(symbol=symbol)
                        
                        price_data = {
                            "symbol": symbol,
                            "price": float(ticker['price']),
                            "timestamp": datetime.utcnow().isoformat(),
                            "change_24h": 0,  # Would need additional API call
                            "volume_24h": 0   # Would need additional API call
                        }
                        
                        self.price_cache[symbol] = price_data
                        
                        # Send to subscribed users
                        await self._broadcast_price_update(symbol, price_data)
                        
                    except Exception as e:
                        logger.warning(f"⚠️ Failed to get price for {symbol}: {e}")
                        continue
                
                # Update every 5 seconds
                await asyncio.sleep(5)
                
            except Exception as e:
                logger.error(f"❌ Price simulation error: {e}")
                await asyncio.sleep(10)
        
        self.is_streaming = False
        logger.info("📴 Price streaming stopped")
    
    async def _broadcast_price_update(self, symbol: str, price_data: Dict):
        """Broadcast price update to subscribed users"""
        message = {
            "type": "price_update",
            "data": price_data
        }
        
        disconnected_connections = []
        
        for connection_id, websocket in self.active_connections.items():
            try:
                # Check if any user is subscribed to this symbol
                user_id = int(connection_id.split('_')[0])
                if user_id in self.user_subscriptions and symbol in self.user_subscriptions[user_id]:
                    await websocket.send_text(json.dumps(message))
                    
            except Exception as e:
                logger.warning(f"⚠️ Failed to send price update to {connection_id}: {e}")
                disconnected_connections.append(connection_id)
        
        # Clean up disconnected connections
        for conn_id in disconnected_connections:
            if conn_id in self.active_connections:
                del self.active_connections[conn_id]
    
    async def get_current_prices(self, symbols: List[str]) -> Dict[str, Dict]:
        """Get current cached prices for symbols"""
        result = {}
        
        for symbol in symbols:
            if symbol in self.price_cache:
                result[symbol] = self.price_cache[symbol]
            else:
                # Try to get from Binance directly
                try:
                    client_manager = BinanceClientManager()
                    client = client_manager.get_client()
                    if client:
                        ticker = client.get_symbol_ticker(symbol=symbol)
                        result[symbol] = {
                            "symbol": symbol,
                            "price": float(ticker['price']),
                            "timestamp": datetime.utcnow().isoformat()
                        }
                except Exception as e:
                    logger.warning(f"⚠️ Failed to get price for {symbol}: {e}")
        
        return result

# Global price manager instance
price_manager = RealTimePriceManager()

@router.websocket("/prices/stream")
async def websocket_price_stream(
    websocket: WebSocket,
    token: str,
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint for real-time price streaming
    Usage: ws://localhost:8000/api/prices/stream?token=YOUR_JWT_TOKEN
    """
    connection_id = None
    user_id = None
    
    try:
        # Validate JWT token (simplified for demo)
        # In production, properly validate the JWT token
        user_id = 1  # Would extract from token
        
        connection_id = await price_manager.connect_user(websocket, user_id, token)
        
        # Get user's portfolio symbols and subscribe
        portfolio_symbols = await price_manager.get_portfolio_symbols(user_id, db)
        if portfolio_symbols:
            await price_manager.subscribe_to_symbols(user_id, portfolio_symbols)
        
        # Send initial connection confirmation
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "message": "Connected to real-time price stream",
            "subscribed_symbols": portfolio_symbols
        }))
        
        # Keep connection alive and handle client messages
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                
                if message.get("type") == "subscribe":
                    symbols = message.get("symbols", [])
                    await price_manager.subscribe_to_symbols(user_id, symbols)
                    
                    await websocket.send_text(json.dumps({
                        "type": "subscription_confirmed",
                        "symbols": symbols
                    }))
                
                elif message.get("type") == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
                    
            except WebSocketDisconnect:
                break
            except Exception as e:
                logger.error(f"❌ WebSocket message error: {e}")
                break
                
    except Exception as e:
        logger.error(f"❌ WebSocket connection error: {e}")
        
    finally:
        if connection_id and user_id:
            await price_manager.disconnect_user(connection_id, user_id)

@router.get("/prices/current", response_model=Dict[str, Any])
async def get_current_prices(
    symbols: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get current prices for specified symbols or user's portfolio
    """
    try:
        if symbols:
            symbol_list = [s.strip().upper() for s in symbols.split(',')]
        else:
            # Get from user's portfolio
            symbol_list = await price_manager.get_portfolio_symbols(current_user.id, db)
        
        if not symbol_list:
            return {
                "success": True,
                "message": "No symbols to get prices for",
                "prices": {}
            }
        
        prices = await price_manager.get_current_prices(symbol_list)
        
        return {
            "success": True,
            "prices": prices,
            "symbols_requested": symbol_list,
            "symbols_found": len(prices),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get prices: {str(e)}")

@router.get("/prices/stream/status", response_model=Dict[str, Any])
async def get_stream_status(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get real-time streaming status
    """
    return {
        "success": True,
        "status": {
            "streaming_active": price_manager.is_streaming,
            "active_connections": len(price_manager.active_connections),
            "subscribed_users": len(price_manager.user_subscriptions),
            "cached_prices": len(price_manager.price_cache),
            "user_subscriptions": len(price_manager.user_subscriptions.get(current_user.id, set()))
        }
    }

@router.post("/prices/portfolio-watch", response_model=Dict[str, Any])
async def start_portfolio_price_watch(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Start price watching for user's entire portfolio
    """
    try:
        # Get user's portfolio symbols
        portfolio_symbols = await price_manager.get_portfolio_symbols(current_user.id, db)
        
        if not portfolio_symbols:
            return {
                "success": False,
                "message": "No portfolio assets found to watch",
                "symbols": []
            }
        
        # Subscribe to price updates
        await price_manager.subscribe_to_symbols(current_user.id, portfolio_symbols)
        
        return {
            "success": True,
            "message": f"Started price watching for {len(portfolio_symbols)} symbols",
            "symbols": portfolio_symbols,
            "websocket_url": "/api/prices/stream"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start price watch: {str(e)}")