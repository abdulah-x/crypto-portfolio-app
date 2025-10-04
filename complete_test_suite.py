#!/usr/bin/env python3
"""
COMPLETE API TEST SUITE - Windows Compatible
Runs all comprehensive tests in sequence (no Unicode)
"""

import subprocess
import sys
import time
import os
from datetime import datetime

class CompleteTestSuite:
    def __init__(self):
        self.results = {}
        self.overall_success = True
    
    def run_test_script(self, script_name, test_name):
        """Run a test script and capture results"""
        print(f"\n{'='*80}")
        print(f"RUNNING: {test_name}")
        print(f"Script: {script_name}")
        print(f"{'='*80}")
        
        if not os.path.exists(script_name):
            print(f"ERROR: Test script {script_name} not found!")
            self.results[test_name] = {
                "success": False,
                "error": "Script not found",
                "output": ""
            }
            self.overall_success = False
            return
        
        try:
            # Run the test script
            result = subprocess.run(
                [sys.executable, script_name],
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            success = result.returncode == 0
            
            # Print the output
            if result.stdout:
                print(result.stdout)
            
            if result.stderr:
                print("ERRORS:")
                print(result.stderr)
            
            self.results[test_name] = {
                "success": success,
                "return_code": result.returncode,
                "output": result.stdout,
                "errors": result.stderr
            }
            
            if not success:
                self.overall_success = False
                print(f"WARNING: {test_name} completed with errors")
            else:
                print(f"SUCCESS: {test_name} completed successfully")
        
        except subprocess.TimeoutExpired:
            print(f"ERROR: {test_name} timed out after 5 minutes")
            self.results[test_name] = {
                "success": False,
                "error": "Timeout",
                "output": ""
            }
            self.overall_success = False
        
        except Exception as e:
            print(f"ERROR: Failed to run {test_name}: {e}")
            self.results[test_name] = {
                "success": False,
                "error": str(e),
                "output": ""
            }
            self.overall_success = False
    
    def extract_metrics(self):
        """Extract key metrics from test outputs"""
        metrics = {}
        
        # Extract from basic test
        basic_result = self.results.get("Basic API Endpoint Test")
        if basic_result and basic_result["success"]:
            output = basic_result["output"]
            if "Success Rate:" in output:
                for line in output.split('\n'):
                    if "Success Rate:" in line:
                        metrics["endpoint_success_rate"] = line.split(":")[1].strip()
                        break
            if "Total Endpoints Tested:" in output:
                for line in output.split('\n'):
                    if "Total Endpoints Tested:" in line:
                        metrics["total_endpoints"] = line.split(":")[1].strip()
                        break
        
        # Extract from extensive test
        extensive_result = self.results.get("Extensive API Validation Test")
        if extensive_result and extensive_result["success"]:
            output = extensive_result["output"]
            if "Success Rate:" in output:
                for line in output.split('\n'):
                    if "Success Rate:" in line:
                        metrics["validation_success_rate"] = line.split(":")[1].strip()
                        break
        
        # Extract from load test
        load_result = self.results.get("Load & Performance Test")
        if load_result and load_result["success"]:
            output = load_result["output"]
            if "Average RPS:" in output:
                for line in output.split('\n'):
                    if "Average RPS:" in line:
                        metrics["avg_rps"] = line.split(":")[1].strip()
                        break
            if "Average Response Time:" in output:
                for line in output.split('\n'):
                    if "Average Response Time:" in line:
                        metrics["avg_response_time"] = line.split(":")[1].strip()
                        break
        
        return metrics
    
    def generate_comprehensive_report(self):
        """Generate final comprehensive report"""
        print(f"\n{'='*100}")
        print("COMPLETE API TEST SUITE - FINAL REPORT")
        print(f"{'='*100}")
        
        # Overall status
        overall_status = "PASS" if self.overall_success else "FAIL"
        status_symbol = "SUCCESS" if self.overall_success else "FAILED"
        print(f"OVERALL STATUS: {status_symbol}")
        print()
        
        # Individual test results
        print("TEST SUITE RESULTS:")
        print("-" * 60)
        
        test_status_symbols = {
            "Basic API Endpoint Test": "PASS" if self.results.get("Basic API Endpoint Test", {}).get("success") else "FAIL",
            "Extensive API Validation Test": "PASS" if self.results.get("Extensive API Validation Test", {}).get("success") else "FAIL", 
            "Load & Performance Test": "PASS" if self.results.get("Load & Performance Test", {}).get("success") else "FAIL"
        }
        
        for test_name, status in test_status_symbols.items():
            symbol = "PASS" if status == "PASS" else "FAIL"
            print(f"{symbol}: {test_name}")
        
        print()
        
        # Extract and display metrics
        metrics = self.extract_metrics()
        if metrics:
            print("KEY PERFORMANCE METRICS:")
            print("-" * 40)
            
            if "endpoint_success_rate" in metrics:
                print(f"Endpoint Success Rate: {metrics['endpoint_success_rate']}")
            if "total_endpoints" in metrics:
                print(f"Total Endpoints Tested: {metrics['total_endpoints']}")
            if "validation_success_rate" in metrics:
                print(f"Validation Success Rate: {metrics['validation_success_rate']}")
            if "avg_rps" in metrics:
                print(f"Average Requests/Second: {metrics['avg_rps']}")
            if "avg_response_time" in metrics:
                print(f"Average Response Time: {metrics['avg_response_time']}")
        
        print()
        
        # Recommendations
        print("RECOMMENDATIONS:")
        print("-" * 40)
        
        if self.overall_success:
            if metrics.get("endpoint_success_rate") == "100.0%":
                print("EXCELLENT: All endpoints working perfectly!")
                print("API is production-ready with comprehensive validation")
                print("Consider setting up automated testing pipeline")
                print("Monitor performance metrics in production environment")
            else:
                print("GOOD: Most functionality working correctly")
                print("Address any failing endpoints before production deployment")
        else:
            print("ATTENTION REQUIRED: Some tests failed")
            print("Review failed test details above")
            print("Ensure API server is running on http://127.0.0.1:8000")
            print("Verify demo user exists in database")
            print("Check database connectivity and data integrity")
        
        # Summary of issues
        failed_tests = [name for name, result in self.results.items() if not result.get("success", False)]
        if failed_tests:
            print(f"\nFAILED TESTS ({len(failed_tests)}):")
            for test_name in failed_tests:
                error_info = self.results[test_name].get("error", "Unknown error")
                print(f"  - {test_name}: {error_info}")
        
        print(f"\nComplete testing finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*100}")
    
    def run_all_tests(self):
        """Run all available test suites"""
        print("COMPLETE API TEST SUITE")
        print(f"{'='*80}")
        print("Running comprehensive API testing including:")
        print("  - Basic endpoint functionality")
        print("  - Data validation & business logic")
        print("  - Load testing & performance")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*80}")
        
        # Define test suites
        test_suites = [
            {
                "script": "simple_api_test.py",
                "name": "Basic API Endpoint Test",
                "description": "Tests all endpoints for basic functionality"
            },
            {
                "script": "extensive_test_windows.py", 
                "name": "Extensive API Validation Test",
                "description": "Tests data validation, edge cases, security, business logic"
            },
            {
                "script": "load_test_windows.py",
                "name": "Load & Performance Test", 
                "description": "Tests API performance under various load conditions"
            }
        ]
        
        # Run each test suite
        for i, suite in enumerate(test_suites, 1):
            print(f"\n[{i}/{len(test_suites)}] Starting: {suite['name']}")
            print(f"Description: {suite['description']}")
            
            self.run_test_script(suite["script"], suite["name"])
            
            # Brief pause between test suites (except after the last one)
            if i < len(test_suites):
                print(f"\nPausing 3 seconds before next test suite...")
                time.sleep(3)
        
        # Generate final comprehensive report
        self.generate_comprehensive_report()

def main():
    """Main entry point"""
    if len(sys.argv) > 1 and sys.argv[1] == "--help":
        print("COMPLETE API TEST SUITE")
        print("=" * 50)
        print("Runs comprehensive API testing including:")
        print("  • Basic endpoint functionality")
        print("  • Data validation & business logic")
        print("  • Load testing & performance")
        print()
        print("Prerequisites:")
        print("  • API server running on http://127.0.0.1:8000")
        print("  • Demo user exists in database")
        print("  • All dependencies installed")
        print()
        print("Usage: python complete_test_suite.py")
        return
    
    suite = CompleteTestSuite()
    suite.run_all_tests()

if __name__ == "__main__":
    main()