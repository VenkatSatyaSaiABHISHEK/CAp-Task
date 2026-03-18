#!/usr/bin/env python3
"""
Test script to verify h5 weight extraction with nested group handling
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from main import load_ml_model
import numpy as np

print("\n" + "="*60)
print("Testing H5 Weight Extraction")
print("="*60 + "\n")

# Load the model
model = load_ml_model()

if model is None:
    print("[ERROR] Model failed to load")
    sys.exit(1)

print("\n" + "="*60)
print("Testing Predictions with Different Inputs")
print("="*60 + "\n")

# Test cases
from main import preprocess_prediction_input

test_cases = [
    {"name": "Tank EMPTY (5%)", "distance": 45, "temperature": 25, "water_percent": 5, "minute": 30, "hour": 12},
    {"name": "Tank HALF (50%)", "distance": 27.5, "temperature": 25, "water_percent": 50, "minute": 30, "hour": 12},
    {"name": "Tank FULL (95%)", "distance": 7.5, "temperature": 25, "water_percent": 95, "minute": 30, "hour": 12},
]

predictions = []

for test in test_cases:
    print(f"Test: {test['name']}")
    print(f"  Input: distance={test['distance']}cm, temp={test['temperature']}°C, water={test['water_percent']}%, minute={test['minute']}, hour={test['hour']}")
    
    # Preprocess input
    preprocessed = preprocess_prediction_input(
        test['distance'], 
        test['temperature'], 
        test['water_percent'],
        test['minute'],
        test['hour']
    )
    
    # The preprocessed input is shape (1, 5) - need to reshape to (batch_size, timesteps, features)
    # Expected: (1, 1, 5) for batch_size=1, timesteps=1, features=5
    reshaped = preprocessed.reshape(1, 1, 5)
    
    # Make prediction
    prediction = model.predict(reshaped, verbose=0)
    pred_value = prediction[0][0]
    predictions.append(pred_value)
    
    print(f"  Prediction: {pred_value:.4f} ({pred_value*100:.2f}%)")
    print()

# Verify predictions vary by input
print("="*60)
print("ANALYSIS")
print("="*60)
print(f"Prediction values: {[f'{p*100:.2f}%' for p in predictions]}")

# Check if predictions are different (not all the same random value)
if predictions[0] != predictions[1] or predictions[1] != predictions[2]:
    print("[OK] SUCCESS: Predictions vary by input (weights are loaded!)")
else:
    print("[ERROR] FAILURE: Predictions are identical (something is wrong)")

print()
