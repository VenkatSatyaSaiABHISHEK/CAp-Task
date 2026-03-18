#!/usr/bin/env python3
"""
Regenerate ML model compatible with TensorFlow 2.15/Keras 2.15
Run this to create a properly formatted model file
"""
import os
import sys

print("Installing TensorFlow 2.15.0...")
os.system(f"{sys.executable} -m pip install -q tensorflow-cpu==2.15.0")

import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

print("Creating sample ML model with TensorFlow 2.15.0...")

# Create a simple neural network
model = Sequential([
    Dense(64, activation='relu', input_shape=(3,)),  # 3 inputs: distance, temperature, water_percent
    Dense(32, activation='relu'),
    Dense(16, activation='relu'),
    Dense(4, activation='softmax')  # 4 classes: LOW, MEDIUM, HIGH, FULL
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Create sample training data
X_train = np.array([
    [25, 28, 80],  # LOW water
    [20, 30, 60],  # MEDIUM water
    [15, 32, 40],  # HIGH water
    [10, 35, 20],  # FULL water
    [26, 27, 85],  # LOW water
    [18, 31, 55],  # MEDIUM water
    [14, 33, 35],  # HIGH water
    [9, 36, 15],   # FULL water
])

# One-hot encoded labels: [LOW, MEDIUM, HIGH, FULL]
y_train = np.array([
    [1, 0, 0, 0],  # LOW
    [0, 1, 0, 0],  # MEDIUM
    [0, 0, 1, 0],  # HIGH
    [0, 0, 0, 1],  # FULL
    [1, 0, 0, 0],  # LOW
    [0, 1, 0, 0],  # MEDIUM
    [0, 0, 1, 0],  # HIGH
    [0, 0, 0, 1],  # FULL
])

# Train model
print("Training model...")
model.fit(X_train, y_train, epochs=10, verbose=0)

# Save model to both formats for compatibility
model_path_h5 = "backend/best_model.h5"
model_path_savedmodel = "backend/best_model_savedmodel"

# Save as HDF5
model.save(model_path_h5)
print(f"✓ Model saved to {model_path_h5}")

# Also save as SavedModel format (more modern)
model.save(model_path_savedmodel)
print(f"✓ Model also saved to {model_path_savedmodel}")

print(f"✓ Model expects 3 inputs: [distance, temperature, water_percent]")
print(f"✓ Model outputs 4 classes: [LOW, MEDIUM, HIGH, FULL]")
print(f"\nModel info:")
model.summary()
