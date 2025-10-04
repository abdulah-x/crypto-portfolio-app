#!/usr/bin/env python3
"""
Windows-Compatible API Test Script
Tests all API endpoints without Unicode characters
"""

import requests
import json
from datetime import datetime

# Base configuration
BASE_URL = "http://127.0.0.1:8000"

# Test user credentials
DEMO_USER = {
    "username": "demo_user",  # API expects 'username' field 
    "password": "demo123",
    "full_name": "Demo User"
}

def test_endpoint(method, endpoint, data=None, headers=None, expected_status=200):
    """Test a single endpoint"""
    url = BASE_URL + endpoint
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=10)
        elif method == "PUT":
            response = requests.put(url, json=data, headers=headers, timeout=10)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers, timeout=10)
        
        success = response.status_code == expected_status
        
        try:
            response_data = response.json()
        except:
            response_data = response.text
        
        return {
            "success": success,
            "status": response.status_code,
            "expected": expected_status,
            "response": response_data,
            "data": response_data
        }
    
    except Exception as e:
        return {
            "success": False,
            "status": 0,
            "expected": expected_status,
            "response": str(e),
            "data": None
        }

def main():
    print("EXHAUSTIVE API ENDPOINT TESTING")
    print("=" * 60)
    
    # Step 1: Get authentication token
    print("\nGetting authentication token...")
    login_result = test_endpoint("POST", "/api/auth/login", data=DEMO_USER)
    
    if not login_result["success"]:
        print("FAILED to login - cannot test protected endpoints")
        return
    
    token = login_result["data"].get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Authentication successful!")
    
    # All endpoints to test
    endpoints = [
        # Health check
        {"method": "GET", "path": "/health", "description": "Health check", "auth": False},
        
        # Authentication endpoints
        {"method": "POST", "path": "/api/auth/register", "description": "User registration", "auth": False, "data": {"email": "newuser@test.com", "password": "newpass123", "full_name": "New User"}},
        {"method": "POST", "path": "/api/auth/login", "description": "User login", "auth": False, "data": DEMO_USER},
        {"method": "GET", "path": "/api/auth/profile", "description": "Get user profile", "auth": True},
        {"method": "PUT", "path": "/api/auth/profile", "description": "Update user profile", "auth": True, "data": {"full_name": "Updated Name"}},
        {"method": "POST", "path": "/api/auth/logout", "description": "User logout", "auth": True},
        {"method": "GET", "path": "/api/auth/logout", "description": "User logout (GET)", "auth": True},
        
        # Portfolio endpoints
        {"method": "GET", "path": "/api/portfolio", "description": "Get portfolio", "auth": True},
        {"method": "GET", "path": "/api/portfolio/summary", "description": "Portfolio summary", "auth": True},
        {"method": "GET", "path": "/api/portfolio/holdings", "description": "Portfolio holdings", "auth": True},
        {"method": "GET", "path": "/api/portfolio/performance", "description": "Portfolio performance", "auth": True},
        
        # P&L endpoints
        {"method": "GET", "path": "/api/pnl", "description": "Get P&L", "auth": True},
        {"method": "GET", "path": "/api/pnl/summary", "description": "P&L summary", "auth": True},
        {"method": "GET", "path": "/api/pnl/details", "description": "P&L details", "auth": True},
        {"method": "GET", "path": "/api/pnl/realized", "description": "Realized P&L", "auth": True},
        {"method": "GET", "path": "/api/pnl/unrealized", "description": "Unrealized P&L", "auth": True},
        
        # Trades endpoints
        {"method": "GET", "path": "/api/trades", "description": "Get trades", "auth": True},
        {"method": "POST", "path": "/api/trades", "description": "Create trade", "auth": True, "data": {"symbol": "BTCUSDT", "side": "buy", "quantity": 0.001, "price": 45000.0, "timestamp": "2024-01-01T12:00:00"}},
        {"method": "GET", "path": "/api/trades/1", "description": "Get trade by ID", "auth": True, "expected": 404},
        {"method": "PUT", "path": "/api/trades/1", "description": "Update trade", "auth": True, "expected": 404, "data": {"quantity": 0.002}},
        {"method": "DELETE", "path": "/api/trades/1", "description": "Delete trade", "auth": True, "expected": 404},
        {"method": "GET", "path": "/api/trades/history", "description": "Trade history", "auth": True},
        {"method": "GET", "path": "/api/trades/stats", "description": "Trade statistics", "auth": True},
        {"method": "POST", "path": "/api/trades/import", "description": "Import trades", "auth": True, "data": {"source": "binance", "data": []}},
        {"method": "POST", "path": "/api/trades/sync", "description": "Sync trades", "auth": True, "data": {"exchange": "binance"}},
        {"method": "GET", "path": "/api/trades/export", "description": "Export trades", "auth": True},
        {"method": "POST", "path": "/api/trades/bulk", "description": "Bulk trade operations", "auth": True, "data": {"trades": []}}
    ]
    
    print(f"\nTesting {len(endpoints)} endpoints...")
    print("-" * 60)
    
    passed = 0
    failed = 0
    results = []
    
    for endpoint in endpoints:
        method = endpoint["method"]
        path = endpoint["path"]
        description = endpoint["description"]
        auth_required = endpoint.get("auth", False)
        data = endpoint.get("data")
        expected_status = endpoint.get("expected", 200)
        
        test_headers = headers if auth_required else None
        result = test_endpoint(method, path, data=data, headers=test_headers, expected_status=expected_status)
        
        results.append({
            "endpoint": endpoint,
            "result": result
        })
        
        if result["success"]:
            print(f"   PASS {method} {path}")
            passed += 1
        else:
            print(f"   FAIL {method} {path} (Status: {result['status']}, Expected: {result['expected']})")
            failed += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Total Endpoints Tested: {len(endpoints)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Success Rate: {(passed/len(endpoints)*100):.1f}%")
    
    if failed > 0:
        print(f"\nFailed endpoints:")
        for item in results:
            if not item["result"]["success"]:
                endpoint = item["endpoint"]
                print(f"   FAIL {endpoint['description']}")
    
    print(f"\nTesting completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

if __name__ == "__main__":
    main()