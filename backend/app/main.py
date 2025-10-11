from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from binance.exceptions import BinanceAPIException
from datetime import datetime
import uvicorn
import sys
import os
import uuid

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.config import settings
from core.errors import (
    APIError, api_error_handler, validation_error_handler,
    http_exception_handler, database_error_handler, 
    binance_error_handler, general_exception_handler
)

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="A comprehensive crypto portfolio management API with JWT authentication",
    debug=settings.debug
)

# Add request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Add unique request ID to each request"""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Import and include API routers
from api.auth import router as auth_router
from api.portfolio import router as portfolio_router
from api.trades import router as trades_router
from api.pnl import router as pnl_router
from api.binance_test import router as binance_test_router

# Import advanced features with error handling
try:
    from api.portfolio_sync import router as portfolio_sync_router
    PORTFOLIO_SYNC_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Portfolio Sync import failed: {e}")
    PORTFOLIO_SYNC_AVAILABLE = False

try:
    from api.trade_import import router as trade_import_router
    TRADE_IMPORT_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Trade Import import failed: {e}")
    TRADE_IMPORT_AVAILABLE = False

try:
    from api.realtime_prices import router as realtime_prices_router
    REALTIME_PRICES_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Real-time Prices import failed: {e}")
    REALTIME_PRICES_AVAILABLE = False

try:
    from api.advanced_pnl import router as advanced_pnl_router
    ADVANCED_PNL_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Advanced P&L import failed: {e}")
    ADVANCED_PNL_AVAILABLE = False

# Include API routes
app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(portfolio_router, prefix="/api", tags=["Portfolio"])
app.include_router(trades_router, prefix="/api", tags=["Trades"])
app.include_router(pnl_router, prefix="/api", tags=["P&L"])
app.include_router(binance_test_router, prefix="/api", tags=["Binance Testing"])

# Include advanced features if available
if PORTFOLIO_SYNC_AVAILABLE:
    app.include_router(portfolio_sync_router, prefix="/api", tags=["Portfolio Sync"])
    print("✅ Portfolio Sync routes registered")

if TRADE_IMPORT_AVAILABLE:
    app.include_router(trade_import_router, prefix="/api", tags=["Trade Import"])
    print("✅ Trade Import routes registered")

if REALTIME_PRICES_AVAILABLE:
    app.include_router(realtime_prices_router, prefix="/api", tags=["Real-time Prices"])
    print("✅ Real-time Prices routes registered")

if ADVANCED_PNL_AVAILABLE:
    app.include_router(advanced_pnl_router, prefix="/api", tags=["Advanced P&L"])
    print("✅ Advanced P&L routes registered")

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Comprehensive health check endpoint to verify API and all features
    """
    # Check database connectivity
    try:
        from database.connection import SessionLocal
        from sqlalchemy import text
        db_session = SessionLocal()
        # Simple query to test DB
        db_session.execute(text("SELECT 1"))
        db_session.close()
        db_status = "healthy"
        db_error = None
    except Exception as e:
        db_status = "unhealthy"
        db_error = str(e)
    
    # Check Binance connectivity (if available)
    binance_status = "not_configured"
    binance_error = None
    try:
        from services.binance.client import BinanceClientManager
        client = BinanceClientManager()
        # Test connection (this is lightweight)
        binance_status = "healthy" if client.client else "unhealthy"
    except Exception as e:
        binance_status = "unhealthy"
        binance_error = str(e)
    
    # Advanced features health
    features_health = {
        "portfolio_sync": {
            "available": PORTFOLIO_SYNC_AVAILABLE,
            "status": "healthy" if PORTFOLIO_SYNC_AVAILABLE else "unavailable"
        },
        "trade_import": {
            "available": TRADE_IMPORT_AVAILABLE,
            "status": "healthy" if TRADE_IMPORT_AVAILABLE else "unavailable"
        },
        "realtime_prices": {
            "available": REALTIME_PRICES_AVAILABLE,
            "status": "healthy" if REALTIME_PRICES_AVAILABLE else "unavailable"
        },
        "advanced_pnl": {
            "available": ADVANCED_PNL_AVAILABLE,
            "status": "healthy" if ADVANCED_PNL_AVAILABLE else "unavailable"
        }
    }
    
    # Overall status
    overall_healthy = (
        db_status == "healthy" and
        binance_status in ["healthy", "not_configured"] and
        all(f["status"] in ["healthy", "unavailable"] for f in features_health.values())
    )
    
    return {
        "status": "healthy" if overall_healthy else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.version,
        "app_name": settings.app_name,
        "components": {
            "database": {
                "status": db_status,
                "error": db_error
            },
            "binance_api": {
                "status": binance_status,
                "error": binance_error
            },
            "advanced_features": features_health
        },
        "summary": {
            "total_features": len(features_health),
            "available_features": sum(1 for f in features_health.values() if f["available"]),
            "healthy_components": sum(1 for status in [db_status, binance_status] if status == "healthy")
        }
    }

# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint with API information
    """
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.version,
        "docs": "/docs",
        "health": "/health"
    }

# API Info endpoint
@app.get("/api/info")
async def api_info():
    """
    Get API information and available endpoints
    """
    # Core endpoints
    core_endpoints = {
        "health": "/health",
        "docs": "/docs",
        "redoc": "/redoc",
        "auth": "/api/auth",
        "portfolio": "/api/portfolio",
        "trades": "/api/trades", 
        "pnl": "/api/pnl",
        "binance_test": "/api/binance-test"
    }
    
    # Advanced features endpoints
    advanced_endpoints = {}
    
    if PORTFOLIO_SYNC_AVAILABLE:
        advanced_endpoints["portfolio_sync"] = {
            "sync": "/api/portfolio/sync",
            "sync_status": "/api/portfolio/sync/status",
            "enhanced_view": "/api/portfolio/enhanced"
        }
    
    if TRADE_IMPORT_AVAILABLE:
        advanced_endpoints["trade_import"] = {
            "import": "/api/trades/import",
            "analysis": "/api/trades/analysis", 
            "import_status": "/api/trades/import/status"
        }
        
    if REALTIME_PRICES_AVAILABLE:
        advanced_endpoints["realtime_prices"] = {
            "websocket_stream": "/api/prices/stream",
            "current_prices": "/api/prices/current",
            "stream_status": "/api/prices/stream/status",
            "portfolio_watch": "/api/prices/portfolio-watch"
        }
        
    if ADVANCED_PNL_AVAILABLE:
        advanced_endpoints["advanced_pnl"] = {
            "comprehensive": "/api/pnl/comprehensive",
            "summary": "/api/pnl/summary", 
            "performance": "/api/pnl/performance"
        }
    
    return {
        "app_name": settings.app_name,
        "version": settings.version,
        "debug_mode": settings.debug,
        "status": "All systems operational",
        "features": {
            "core_api": bool(len(core_endpoints)),
            "portfolio_sync": PORTFOLIO_SYNC_AVAILABLE,
            "trade_import": TRADE_IMPORT_AVAILABLE,
            "realtime_prices": REALTIME_PRICES_AVAILABLE,
            "advanced_pnl": ADVANCED_PNL_AVAILABLE
        },
        "endpoints": {
            "core": core_endpoints,
            "advanced": advanced_endpoints
        }
    }

# Debug endpoint to test token parsing
@app.get("/api/debug-token")
async def debug_token(request: Request):
    """
    Debug endpoint to see exactly what token is being received
    """
    auth_header = request.headers.get("authorization")
    print(f"🔍 DEBUG - Full Authorization header: '{auth_header}'")
    
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header[7:]  # Remove "Bearer " prefix
        print(f"🔍 DEBUG - Extracted token: '{token}'")
        print(f"🔍 DEBUG - Token length: {len(token)}")
        print(f"🔍 DEBUG - Token segments: {len(token.split('.'))}")
        
        return {
            "received_header": auth_header,
            "extracted_token": token,
            "token_length": len(token),
            "token_segments": len(token.split('.')),
            "first_50_chars": token[:50] if len(token) > 50 else token
        }
    
    return {
        "received_header": auth_header,
        "error": "No Bearer token found"
    }

# Register error handlers
app.add_exception_handler(APIError, api_error_handler)
app.add_exception_handler(RequestValidationError, validation_error_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(SQLAlchemyError, database_error_handler)
app.add_exception_handler(BinanceAPIException, binance_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug"
    )