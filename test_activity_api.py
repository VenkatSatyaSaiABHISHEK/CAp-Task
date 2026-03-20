#!/usr/bin/env python3
"""
Test script for Activity Prediction API endpoints
Run after starting the backend: python run.py
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:8001"

def test_activity_prediction():
    """Test the activity prediction endpoint"""
    print("\n" + "="*60)
    print("Testing Activity Prediction API")
    print("="*60 + "\n")
    
    # Test 1: Make activity predictions with different distance values
    print("Test 1: Making activity predictions...")
    test_cases = [
        {"distance": 20.0, "description": "Normal distance"},
        {"distance": 19.5, "description": "Decreasing (filling)"},
        {"distance": 18.8, "description": "Rapid decrease (flush)"},
        {"distance": 22.0, "description": "Stable/no activity"},
    ]
    
    for i, test in enumerate(test_cases, 1):
        try:
            response = requests.post(
                f"{BASE_URL}/api/v1/predict-activity",
                json={
                    "distance": test["distance"],
                    "node_id": "test-node"
                },
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "success":
                    print(f"\n  ✓ Test {i}: {test['description']}")
                    print(f"    Distance: {test['distance']} cm")
                    print(f"    Activity: {data['activity']}")
                    print(f"    Confidence: {data['confidence']*100:.1f}%")
                    print(f"    Diff: {data['features']['diff']}")
                    print(f"    Slope: {data['features']['slope']}")
                else:
                    print(f"\n  ✗ Test {i} failed: {data.get('message')}")
            else:
                print(f"\n  ✗ Test {i} failed with status {response.status_code}")
        except requests.exceptions.ConnectionError:
            print(f"\n  ✗ Cannot connect to API at {BASE_URL}")
            print("    Make sure backend is running: python run.py")
            return False
        except Exception as e:
            print(f"\n  ✗ Test {i} error: {e}")
        
        time.sleep(0.5)  # Small delay between requests
    
    # Test 2: Get activities history
    print("\n\nTest 2: Getting activities history...")
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/activities/history?node_id=test-node&limit=10",
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "success":
                print(f"  ✓ Retrieved {data['count']} activities")
                if data['count'] > 0:
                    print(f"    Sample activity: {data['data'][0]['activity']}")
                    print(f"    Timestamp: {data['data'][0]['created_at']}")
            else:
                print(f"  ✗ Failed: {data.get('message')}")
        else:
            print(f"  ✗ Failed with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("  ✗ Cannot connect to API")
    except Exception as e:
        print(f"  ✗ Error: {e}")
    
    # Test 3: Get latest activity
    print("\nTest 3: Getting latest activity...")
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/activities/latest?node_id=test-node",
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "success":
                if data.get("activity"):
                    print(f"  ✓ Latest activity: {data['activity']['activity']}")
                    print(f"    Confidence: {data['activity']['confidence']*100:.1f}%")
                else:
                    print(f"  ℹ No activities recorded yet")
            else:
                print(f"  ✗ Failed: {data.get('message')}")
        else:
            print(f"  ✗ Failed with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("  ✗ Cannot connect to API")
    except Exception as e:
        print(f"  ✗ Error: {e}")
    
    print("\n" + "="*60)
    print("Testing complete!")
    print("="*60 + "\n")
    return True

if __name__ == "__main__":
    print(f"\nConnecting to API at {BASE_URL}")
    test_activity_prediction()
