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

# Include API routes
app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(portfolio_router, prefix="/api", tags=["Portfolio"])
app.include_router(trades_router, prefix="/api", tags=["Trades"])
app.include_router(pnl_router, prefix="/api", tags=["P&L"])

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify API is running
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.version,
        "app_name": settings.app_name
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
    return {
        "app_name": settings.app_name,
        "version": settings.version,
        "debug_mode": settings.debug,
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "redoc": "/redoc",
            "portfolio": "/api/portfolio",
            "trades": "/api/trades",
            "pnl": "/api/pnl"
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