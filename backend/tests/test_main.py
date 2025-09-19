from fastapi.testclient import TestClient
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'app'))

from main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "version" in data

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data

def test_api_info():
    """Test the API info endpoint"""
    response = client.get("/api/info")
    assert response.status_code == 200
    data = response.json()
    assert data["app_name"] == "Crypto Portfolio API"
    assert "version" in data

def test_404_handler():
    """Test 404 error handling"""
    response = client.get("/nonexistent-endpoint")
    assert response.status_code == 404
    data = response.json()
    assert data["error"] == "Not Found"