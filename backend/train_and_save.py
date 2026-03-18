#!/usr/bin/env python
"""
Quick training script to create model23.h5 in TensorFlow format
Run this to train the model and save it correctly
"""

import os
import sys
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GRU, Dense, Dropout
from tensorflow.keras.optimizers import Adam

print("="*60)
print("WATER TANK MODEL TRAINING")
print("="*60)

# Load dataset
print("\n[1] Loading dataset...")
csv_file = "cleaned_dataset (1).csv"
if not os.path.exists(csv_file):
    print(f"[ERROR] {csv_file} not found!")
    sys.exit(1)

df = pd.read_csv(csv_file)
print(f"[OK] Loaded {len(df)} rows")

# Clean data
print("\n[2] Cleaning data...")
df.columns = ["time", "entry_id", "distance", "temperature", "water_percent", "water_liters"]
df = df[df["distance"] > 0]
df = df.dropna()
df.reset_index(drop=True, inplace=True)
print(f"[OK] {len(df)} rows after cleaning")

# Feature engineering
print("\n[3] Feature engineering...")
df["time"] = pd.to_datetime(df["time"])
df["minute"] = df["time"].dt.minute
df["hour"] = df["time"].dt.hour

# Target variable
df["target"] = df["water_percent"].shift(-1)
df = df.dropna()
print(f"[OK] {len(df)} samples ready")

# Prepare features
X = df[["distance", "temperature", "water_percent", "minute", "hour"]]
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"[OK] Train: {len(X_train)}, Test: {len(X_test)}")

# Normalize
print("\n[4] Normalizing data...")
scaler = MinMaxScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

X_train_reshaped = X_train_scaled.reshape((X_train_scaled.shape[0], 1, X_train_scaled.shape[1]))
X_test_reshaped = X_test_scaled.reshape((X_test_scaled.shape[0], 1, X_test_scaled.shape[1]))
print(f"[OK] Reshaped: {X_train_reshaped.shape}")

# Build model
print("\n[5] Building GRU model...")
model = Sequential([
    GRU(128, return_sequences=True, input_shape=(1, 5)),
    Dropout(0.3),
    GRU(64),
    Dense(32, activation='relu'),
    Dense(1, activation='sigmoid')
])
model.compile(optimizer=Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
print("[OK] Model compiled")

# Train
print("\n[6] Training model...")
history = model.fit(
    X_train_reshaped, y_train, 
    epochs=50, 
    batch_size=32, 
    validation_data=(X_test_reshaped, y_test), 
    verbose=1
)

# Evaluate
loss, mae = model.evaluate(X_test_reshaped, y_test, verbose=0)
print(f"\n[OK] Test Loss: {loss:.6f}, MAE: {mae:.6f}")

# Save in TensorFlow format
print("\n[7] Saving model...")
model.save('model23.h5', save_format='tf')
print("[OK] ✅ model23.h5 saved successfully (TensorFlow format)")

print("\n" + "="*60)
print("NEXT STEPS:")
print("1. Push model23.h5 to GitHub:")
print("   git add backend/model23.h5")
print("   git commit -m 'Update trained model23.h5'")
print("   git push origin master")
print("2. Render will auto-redeploy")
print("="*60)
