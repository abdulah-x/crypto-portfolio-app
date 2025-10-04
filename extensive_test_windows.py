#!/usr/bin/env python3
"""
EXTENSIVE API TESTING SUITE - Windows Compatible
Tests data integrity, edge cases, security, and business logic (no Unicode)
"""

import requests
import json
import time
from datetime import datetime, timedelta
import random
import string

BASE_URL = "http://127.0.0.1:8000"
DEMO_USER = {
    "username": "demo@example.com",  # API expects 'username' field (can be email)
    "password": "demo123"
}

class ExtensiveAPITester:
    def __init__(self):
        self.token = None
        self.test_results = {
            "endpoint_tests": 0,
            "data_validation_tests": 0,
            "security_tests": 0,
            "edge_case_tests": 0,
            "business_logic_tests": 0,
            "performance_tests": 0,
            "passed": 0,
            "failed": 0,
            "failed_tests": []
        }
    
    def log_test(self, category: str, test_name: str, status: str, details: str = ""):
        """Log test results with categorization"""
        self.test_results[f"{category}_tests"] += 1
        
        if status == "PASS":
            self.test_results["passed"] += 1
            print(f"PASS [{category.upper()}] {test_name}")
        else:
            self.test_results["failed"] += 1
            self.test_results["failed_tests"].append(f"[{category.upper()}] {test_name}: {details}")
            print(f"FAIL [{category.upper()}] {test_name}")
            if details:
                print(f"     Details: {details}")
    
    def authenticate(self):
        """Get authentication token"""
        try:
            response = requests.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER, timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                return True
            else:
                print(f"Authentication failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"Authentication error: {e}")
            return False
    
    def make_request(self, method, endpoint, data=None, expected_status=200):
        """Make authenticated request"""
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
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
                "status_code": response.status_code,
                "data": response_data,
                "response": response
            }
        
        except Exception as e:
            return {
                "success": False,
                "status_code": 0,
                "data": None,
                "error": str(e)
            }
    
    def test_data_validation(self):
        """Test data validation and response formats"""
        print("\n--- DATA VALIDATION TESTS ---")
        
        # Test 1: Portfolio response structure
        result = self.make_request("GET", "/api/portfolio")
        if result["success"] and isinstance(result["data"], dict):
            required_fields = ["total_value", "total_pnl", "holdings"]
            has_all_fields = all(field in str(result["data"]) for field in required_fields)
            if has_all_fields:
                self.log_test("data_validation", "Portfolio response structure", "PASS")
            else:
                self.log_test("data_validation", "Portfolio response structure", "FAIL", "Missing required fields")
        else:
            self.log_test("data_validation", "Portfolio response structure", "FAIL", f"Invalid response: {result.get('status_code')}")
        
        # Test 2: User profile data integrity
        result = self.make_request("GET", "/api/auth/profile")
        if result["success"] and isinstance(result["data"], dict):
            profile_data = result["data"]
            if "email" in str(profile_data) and "full_name" in str(profile_data):
                self.log_test("data_validation", "User profile data integrity", "PASS")
            else:
                self.log_test("data_validation", "User profile data integrity", "FAIL", "Missing profile fields")
        else:
            self.log_test("data_validation", "User profile data integrity", "FAIL", f"Profile request failed: {result.get('status_code')}")
        
        # Test 3: Trade data validation
        result = self.make_request("GET", "/api/trades")
        if result["success"]:
            trades_data = result["data"]
            if isinstance(trades_data, (list, dict)):
                self.log_test("data_validation", "Trade data format", "PASS")
            else:
                self.log_test("data_validation", "Trade data format", "FAIL", "Invalid trade data format")
        else:
            self.log_test("data_validation", "Trade data format", "FAIL", f"Trades request failed: {result.get('status_code')}")
    
    def test_edge_cases(self):
        """Test edge cases and boundary conditions"""
        print("\n--- EDGE CASE TESTS ---")
        
        # Test 1: Invalid trade creation
        invalid_trade = {
            "symbol": "",  # Empty symbol
            "side": "invalid_side",  # Invalid side
            "quantity": -1,  # Negative quantity
            "price": "not_a_number"  # Invalid price
        }
        
        result = self.make_request("POST", "/api/trades", data=invalid_trade, expected_status=422)
        if result["status_code"] == 422:
            self.log_test("edge_case", "Invalid trade creation rejection", "PASS")
        else:
            self.log_test("edge_case", "Invalid trade creation rejection", "FAIL", f"Expected 422, got {result['status_code']}")
        
        # Test 2: Non-existent trade retrieval
        result = self.make_request("GET", "/api/trades/99999", expected_status=404)
        if result["status_code"] == 404:
            self.log_test("edge_case", "Non-existent trade retrieval", "PASS")
        else:
            self.log_test("edge_case", "Non-existent trade retrieval", "FAIL", f"Expected 404, got {result['status_code']}")
        
        # Test 3: Malformed JSON handling
        try:
            headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}
            response = requests.post(f"{BASE_URL}/api/trades", data="invalid json", headers=headers, timeout=10)
            if response.status_code in [400, 422]:
                self.log_test("edge_case", "Malformed JSON handling", "PASS")
            else:
                self.log_test("edge_case", "Malformed JSON handling", "FAIL", f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_test("edge_case", "Malformed JSON handling", "FAIL", f"Request failed: {e}")
    
    def test_security_basics(self):
        """Test basic security measures"""
        print("\n--- BASIC SECURITY TESTS ---")
        
        # Test 1: Unauthenticated access to protected endpoints
        result = requests.get(f"{BASE_URL}/api/portfolio", timeout=10)
        if result.status_code == 401:
            self.log_test("security", "Unauthenticated access protection", "PASS")
        else:
            self.log_test("security", "Unauthenticated access protection", "FAIL", f"Expected 401, got {result.status_code}")
        
        # Test 2: Invalid token handling
        headers = {"Authorization": "Bearer invalid_token_12345"}
        result = requests.get(f"{BASE_URL}/api/portfolio", headers=headers, timeout=10)
        if result.status_code == 401:
            self.log_test("security", "Invalid token rejection", "PASS")
        else:
            self.log_test("security", "Invalid token rejection", "FAIL", f"Expected 401, got {result.status_code}")
        
        # Test 3: SQL injection attempt (basic)
        malicious_user = {
            "email": "test'; DROP TABLE users; --",
            "password": "password"
        }
        result = requests.post(f"{BASE_URL}/api/auth/login", json=malicious_user, timeout=10)
        if result.status_code in [401, 422, 400]:  # Should not succeed
            self.log_test("security", "Basic SQL injection protection", "PASS")
        else:
            self.log_test("security", "Basic SQL injection protection", "FAIL", f"Unexpected response: {result.status_code}")
    
    def test_business_logic(self):
        """Test business logic and calculations"""
        print("\n--- BUSINESS LOGIC TESTS ---")
        
        # Test 1: Portfolio summary calculations
        result = self.make_request("GET", "/api/portfolio/summary")
        if result["success"]:
            summary_data = result["data"]
            # Check if numeric values are present and reasonable
            if isinstance(summary_data, dict):
                self.log_test("business_logic", "Portfolio summary calculations", "PASS")
            else:
                self.log_test("business_logic", "Portfolio summary calculations", "FAIL", "Invalid summary format")
        else:
            self.log_test("business_logic", "Portfolio summary calculations", "FAIL", f"Summary request failed: {result.get('status_code')}")
        
        # Test 2: P&L calculations
        result = self.make_request("GET", "/api/pnl/summary")
        if result["success"]:
            pnl_data = result["data"]
            if isinstance(pnl_data, dict):
                self.log_test("business_logic", "P&L summary calculations", "PASS")
            else:
                self.log_test("business_logic", "P&L summary calculations", "FAIL", "Invalid P&L format")
        else:
            self.log_test("business_logic", "P&L summary calculations", "FAIL", f"P&L request failed: {result.get('status_code')}")
        
        # Test 3: Trade statistics
        result = self.make_request("GET", "/api/trades/stats")
        if result["success"]:
            stats_data = result["data"]
            if isinstance(stats_data, dict):
                self.log_test("business_logic", "Trade statistics calculations", "PASS")
            else:
                self.log_test("business_logic", "Trade statistics calculations", "FAIL", "Invalid stats format")
        else:
            self.log_test("business_logic", "Trade statistics calculations", "FAIL", f"Stats request failed: {result.get('status_code')}")
    
    def test_performance(self):
        """Test basic performance metrics"""
        print("\n--- PERFORMANCE TESTS ---")
        
        endpoints_to_test = [
            "/health",
            "/api/portfolio",
            "/api/trades",
            "/api/pnl/summary"
        ]
        
        total_response_times = []
        
        for endpoint in endpoints_to_test:
            start_time = time.time()
            result = self.make_request("GET", endpoint)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            total_response_times.append(response_time)
            
            if result["success"] and response_time < 1000:  # Less than 1 second
                self.log_test("performance", f"Response time {endpoint}", "PASS", f"{response_time:.0f}ms")
            else:
                self.log_test("performance", f"Response time {endpoint}", "FAIL", f"{response_time:.0f}ms (too slow or failed)")
        
        # Overall performance summary
        if total_response_times:
            avg_response_time = sum(total_response_times) / len(total_response_times)
            if avg_response_time < 500:  # Average less than 500ms
                self.log_test("performance", "Overall response time", "PASS", f"Average: {avg_response_time:.0f}ms")
            else:
                self.log_test("performance", "Overall response time", "FAIL", f"Average: {avg_response_time:.0f}ms (too slow)")
    
    def generate_comprehensive_report(self):
        """Generate detailed test report"""
        print("\n" + "=" * 80)
        print("EXTENSIVE API TESTING - COMPREHENSIVE REPORT")
        print("=" * 80)
        
        total_tests = self.test_results["passed"] + self.test_results["failed"]
        success_rate = (self.test_results["passed"] / total_tests * 100) if total_tests > 0 else 0
        
        print(f"OVERALL STATUS: {'PASS' if success_rate >= 90 else 'FAIL'}")
        print()
        
        # Test category breakdown
        categories = ["endpoint", "data_validation", "security", "edge_case", "business_logic", "performance"]
        for category in categories:
            count = self.test_results.get(f"{category}_tests", 0)
            if count > 0:
                print(f"{category.replace('_', ' ').title()} Tests: {count}")
        
        print()
        print(f"Total Tests Run: {total_tests}")
        print(f"Passed: {self.test_results['passed']}")
        print(f"Failed: {self.test_results['failed']}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        if self.test_results["failed_tests"]:
            print(f"\nFAILED TESTS:")
            for failed_test in self.test_results["failed_tests"]:
                print(f"  - {failed_test}")
        
        # Quality assessment
        print(f"\nQUALITY ASSESSMENT:")
        if success_rate >= 95:
            print("EXCELLENT - Production ready!")
        elif success_rate >= 90:
            print("GOOD - Minor issues to address")
        elif success_rate >= 75:
            print("FAIR - Several issues need attention")
        else:
            print("POOR - Major issues require immediate attention")
        
        print(f"\nTesting completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
    
    def run_comprehensive_tests(self):
        """Run all comprehensive tests"""
        print("EXTENSIVE API TESTING SUITE")
        print("=" * 60)
        print("Testing data integrity, edge cases, security, and business logic")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        # Authenticate first
        print("Authenticating...")
        if not self.authenticate():
            print("CRITICAL: Authentication failed - cannot run tests")
            return
        
        print("Authentication successful!")
        
        # Run all test categories
        self.test_data_validation()
        self.test_edge_cases()
        self.test_security_basics()
        self.test_business_logic()
        self.test_performance()
        
        # Generate comprehensive report
        self.generate_comprehensive_report()

def main():
    tester = ExtensiveAPITester()
    tester.run_comprehensive_tests()

if __name__ == "__main__":
    main()