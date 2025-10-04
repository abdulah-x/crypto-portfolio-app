#!/usr/bin/env python3
"""
LOAD TESTING SUITE - Windows Compatible
Tests API performance under various load conditions (no Unicode)
"""

import requests
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import statistics
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"
DEMO_USER = {
    "username": "demo@example.com",  # API expects 'username' field (can be email)
    "password": "demo123"
}

class LoadTester:
    def __init__(self):
        self.token = None
        self.results = {
            "response_times": [],
            "success_count": 0,
            "error_count": 0,
            "errors": []
        }
    
    def authenticate(self):
        """Get authentication token"""
        try:
            response = requests.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER, timeout=10)
            if response.status_code == 200:
                self.token = response.json()["access_token"]
                return True
            else:
                print(f"Authentication failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"Authentication error: {e}")
            return False
    
    def single_request(self, endpoint, method="GET", data=None):
        """Make a single timed request"""
        start_time = time.time()
        
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        if data:
            headers["Content-Type"] = "application/json"
        
        try:
            if method == "GET":
                response = requests.get(f"{BASE_URL}{endpoint}", headers=headers, timeout=10)
            elif method == "POST":
                response = requests.post(f"{BASE_URL}{endpoint}", json=data, headers=headers, timeout=10)
            
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            if response.status_code < 400:
                self.results["success_count"] += 1
                self.results["response_times"].append(response_time)
                return {
                    "success": True,
                    "response_time": response_time,
                    "status_code": response.status_code
                }
            else:
                self.results["error_count"] += 1
                self.results["errors"].append(f"HTTP {response.status_code}: {endpoint}")
                return {
                    "success": False,
                    "response_time": response_time,
                    "status_code": response.status_code
                }
        
        except Exception as e:
            end_time = time.time()
            response_time = (end_time - start_time) * 1000
            self.results["error_count"] += 1
            self.results["errors"].append(f"Request error: {str(e)}")
            return {
                "success": False,
                "response_time": response_time,
                "error": str(e)
            }
    
    def concurrent_test(self, endpoint, num_requests=10, num_threads=5):
        """Test endpoint with concurrent requests"""
        print(f"\nTesting {endpoint} with {num_requests} requests using {num_threads} concurrent threads...")
        
        start_time = time.time()
        
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            futures = [executor.submit(self.single_request, endpoint) for _ in range(num_requests)]
            
            completed_requests = 0
            for future in as_completed(futures):
                result = future.result()
                completed_requests += 1
                
                if completed_requests % 5 == 0:  # Progress indicator
                    print(f"  Completed: {completed_requests}/{num_requests}")
        
        end_time = time.time()
        total_time = end_time - start_time
        
        return {
            "total_time": total_time,
            "requests_per_second": num_requests / total_time if total_time > 0 else 0,
            "completed_requests": completed_requests
        }
    
    def stress_test_endpoints(self):
        """Run stress tests on various endpoints"""
        print("API LOAD & STRESS TESTING SUITE")
        print("=" * 60)
        print("Testing API performance under load")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        # Reset results
        self.results = {
            "response_times": [],
            "success_count": 0,
            "error_count": 0,
            "errors": []
        }
        
        # Authenticate
        print("Authenticating...")
        if not self.authenticate():
            print("CRITICAL: Authentication failed - cannot run load tests")
            return
        
        print("Authentication successful!")
        
        # Define test scenarios
        test_scenarios = [
            {
                "name": "Light Load Test",
                "endpoint": "/health",
                "requests": 20,
                "threads": 3,
                "description": "Basic health check under light load"
            },
            {
                "name": "Medium Load Test", 
                "endpoint": "/api/portfolio",
                "requests": 30,
                "threads": 5,
                "description": "Portfolio endpoint under medium load"
            },
            {
                "name": "Heavy Load Test",
                "endpoint": "/api/trades",
                "requests": 50,
                "threads": 8,
                "description": "Trades endpoint under heavy load"
            },
            {
                "name": "Stress Test",
                "endpoint": "/api/pnl/summary",
                "requests": 40,
                "threads": 10,
                "description": "P&L calculations under stress"
            }
        ]
        
        scenario_results = []
        
        for scenario in test_scenarios:
            print(f"\n--- {scenario['name']} ---")
            print(f"Description: {scenario['description']}")
            
            scenario_start_results = {
                "success_count": self.results["success_count"],
                "error_count": self.results["error_count"],
                "response_times_count": len(self.results["response_times"])
            }
            
            test_result = self.concurrent_test(
                scenario["endpoint"],
                scenario["requests"],
                scenario["threads"]
            )
            
            # Calculate scenario-specific metrics
            scenario_successes = self.results["success_count"] - scenario_start_results["success_count"]
            scenario_errors = self.results["error_count"] - scenario_start_results["error_count"]
            scenario_response_times = self.results["response_times"][scenario_start_results["response_times_count"]:]
            
            scenario_result = {
                "name": scenario["name"],
                "endpoint": scenario["endpoint"],
                "total_requests": scenario["requests"],
                "successful_requests": scenario_successes,
                "failed_requests": scenario_errors,
                "requests_per_second": test_result["requests_per_second"],
                "total_time": test_result["total_time"],
                "avg_response_time": statistics.mean(scenario_response_times) if scenario_response_times else 0,
                "min_response_time": min(scenario_response_times) if scenario_response_times else 0,
                "max_response_time": max(scenario_response_times) if scenario_response_times else 0
            }
            
            scenario_results.append(scenario_result)
            
            # Print scenario results
            print(f"  Total Requests: {scenario_result['total_requests']}")
            print(f"  Successful: {scenario_result['successful_requests']}")
            print(f"  Failed: {scenario_result['failed_requests']}")
            print(f"  Success Rate: {(scenario_result['successful_requests']/scenario_result['total_requests']*100):.1f}%")
            print(f"  Requests/Second: {scenario_result['requests_per_second']:.2f}")
            print(f"  Avg Response Time: {scenario_result['avg_response_time']:.0f}ms")
            print(f"  Min Response Time: {scenario_result['min_response_time']:.0f}ms")
            print(f"  Max Response Time: {scenario_result['max_response_time']:.0f}ms")
            
            # Brief pause between scenarios
            time.sleep(2)
        
        # Generate comprehensive report
        self.generate_load_test_report(scenario_results)
    
    def generate_load_test_report(self, scenario_results):
        """Generate comprehensive load test report"""
        print("\n" + "=" * 80)
        print("LOAD TESTING - COMPREHENSIVE REPORT")
        print("=" * 80)
        
        # Overall statistics
        total_requests = sum(scenario["total_requests"] for scenario in scenario_results)
        total_successful = sum(scenario["successful_requests"] for scenario in scenario_results)
        total_failed = sum(scenario["failed_requests"] for scenario in scenario_results)
        overall_success_rate = (total_successful / total_requests * 100) if total_requests > 0 else 0
        
        print(f"OVERALL PERFORMANCE SUMMARY:")
        print(f"Total Requests: {total_requests}")
        print(f"Successful: {total_successful}")
        print(f"Failed: {total_failed}")
        print(f"Overall Success Rate: {overall_success_rate:.1f}%")
        
        # Calculate overall metrics
        if self.results["response_times"]:
            avg_response_time = statistics.mean(self.results["response_times"])
            min_response_time = min(self.results["response_times"])
            max_response_time = max(self.results["response_times"])
            median_response_time = statistics.median(self.results["response_times"])
            
            print(f"\nRESPONSE TIME STATISTICS:")
            print(f"Average Response Time: {avg_response_time:.0f}ms")
            print(f"Median Response Time: {median_response_time:.0f}ms")
            print(f"Min Response Time: {min_response_time:.0f}ms")
            print(f"Max Response Time: {max_response_time:.0f}ms")
        
        # Performance by scenario
        print(f"\nPERFORMANCE BY SCENARIO:")
        print("-" * 50)
        for scenario in scenario_results:
            print(f"{scenario['name']}:")
            print(f"  Endpoint: {scenario['endpoint']}")
            print(f"  RPS: {scenario['requests_per_second']:.2f}")
            print(f"  Success Rate: {(scenario['successful_requests']/scenario['total_requests']*100):.1f}%")
            print(f"  Avg Response: {scenario['avg_response_time']:.0f}ms")
            print()
        
        # Performance assessment
        print(f"PERFORMANCE ASSESSMENT:")
        avg_rps = statistics.mean([scenario["requests_per_second"] for scenario in scenario_results])
        avg_response = statistics.mean(self.results["response_times"]) if self.results["response_times"] else 0
        
        if overall_success_rate >= 98 and avg_response < 200 and avg_rps > 50:
            assessment = "EXCELLENT"
            recommendation = "Production ready! Excellent performance under load."
        elif overall_success_rate >= 95 and avg_response < 500 and avg_rps > 30:
            assessment = "GOOD"
            recommendation = "Good performance. Minor optimizations possible."
        elif overall_success_rate >= 90 and avg_response < 1000 and avg_rps > 20:
            assessment = "FAIR"
            recommendation = "Acceptable performance. Consider optimizations for production."
        else:
            assessment = "POOR"
            recommendation = "Performance issues detected. Optimization required before production."
        
        print(f"{assessment}")
        print(f"Average RPS: {avg_rps:.2f}")
        print(f"Average Response Time: {avg_response:.0f}ms")
        print(f"Recommendation: {recommendation}")
        
        # Error summary
        if self.results["errors"]:
            print(f"\nERRORS ENCOUNTERED ({len(self.results['errors'])}):")
            error_counts = {}
            for error in self.results["errors"]:
                error_counts[error] = error_counts.get(error, 0) + 1
            
            for error, count in error_counts.items():
                print(f"  {error}: {count} times")
        
        print(f"\nLoad testing completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)

def main():
    tester = LoadTester()
    tester.stress_test_endpoints()

if __name__ == "__main__":
    main()