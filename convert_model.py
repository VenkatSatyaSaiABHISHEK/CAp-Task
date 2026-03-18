#!/usr/bin/env python3
"""
Convert Keras 3.x model to TensorFlow 2.15 compatible format
This reads the h5 file and resaves it in a format compatible with TensorFlow 2.15
"""
import os
import sys

print("Step 1: Installing dependencies...")
# Try to install with available dependencies
try:
    import h5py
    print("  ✓ h5py already installed")
except:
    print("  - Installing h5py...")
    os.system(f"{sys.executable} -m pip install -q h5py")

try:
    import numpy
    print("  ✓ numpy already installed")
except:
    print("  - Installing numpy...")
    os.system(f"{sys.executable} -m pip install -q numpy")

print("\nStep 2: Attempting to load and convert model...")

try:
    # Try with tensorflow first
    import tensorflow as tf
    from tensorflow import keras
    print("  ✓ TensorFlow available")
    
    # Load the model
    model_path = "backend/best_model.h5"
    if not os.path.exists(model_path):
        model_path = "best_model.h5"
    
    if not os.path.exists(model_path):
        print(f"  ERROR: Model file not found at {model_path}")
        sys.exit(1)
    
    print(f"  Loading model from: {model_path}")
    
    # This will load regardless of format
    model = keras.models.load_model(model_path, compile=False)
    print("  ✓ Model loaded successfully!")
    
    print("\nModel info:")
    model.summary()
    
    # Resave in current TensorFlow format
    print("\nStep 3: Resaving model in compatible format...")
    output_path = "backend/best_model_tf215.h5"
    model.save(output_path, save_format='h5')
    print(f"  ✓ Saved to: {output_path}")
    
    # Also save as SavedModel format (more robust)
    output_savedmodel = "backend/best_model_savedmodel"
    model.save(output_savedmodel, save_format='tf')
    print(f"  ✓ Also saved as SavedModel: {output_savedmodel}")
    
    print("\n✅ Conversion successful!")
    print(f"\nNow update backend/main.py to use: {output_path}")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
