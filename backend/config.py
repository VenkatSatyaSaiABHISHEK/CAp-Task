"""
Configuration for ML Model and Data Preprocessing
Easily adjust these values based on your actual sensor ranges
"""

# Water Activity Classes - Predicted by Activity Recognition Model
ACTIVITY_CLASSES = [
    'no_activity',      # Tank idle, no water usage
    'filling',          # Tank being refilled from source
    'flush',            # Toilet flush or direct release
    'washing_machine',  # Washing machine consuming water
    'geyser'            # Water heater/geyser usage
]

# ===== TANK CONFIGURATION =====
# Your IoT Device Specifications
TANK_HEIGHT_CM = 192        # Total tank height in cm
TANK_CAPACITY_LITERS = 2000  # Total tank capacity in liters

# Feature ranges for MinMaxScaler normalization
# Calibrated for your tank specifications (192cm × 2000L)
FEATURE_RANGES = {
    'distance': {
        'min': 0,      # Full tank distance (sensor at top of 192cm tank)
        'max': 192,    # Empty tank distance (192cm from sensor to bottom)
        'description': 'Ultrasonic sensor distance reading (cm)',
        'unit': 'cm'
    },
    'temperature': {
        'min': 15,     # Minimum temperature in °C
        'max': 40,     # Maximum temperature in °C
        'description': 'Ambient temperature reading',
        'unit': '°C'
    },
    'water_percent': {
        'min': 0,      # Minimum water percentage
        'max': 100,    # Maximum water percentage
        'description': 'Water tank fill percentage',
        'unit': '%'
    },
    'minute': {
        'min': 0,      # Minimum minute (0-59)
        'max': 59,
        'description': 'Minute of the hour (0-59)',
        'unit': 'min'
    },
    'hour': {
        'min': 0,      # Minimum hour (0-23)
        'max': 23,
        'description': 'Hour of the day (0-23)',
        'unit': 'hour'
    }
}

# ML Model Configuration
ML_MODEL_CONFIG = {
    'model_path': 'best_model.h5',
    'model_type': 'GRU',
    'input_features': 5,
    'input_timesteps': 1,
    'description': 'GRU Neural Network for water level prediction',
    'version': '1.0'
}

# Data Preprocessing Configuration
PREPROCESSING_CONFIG = {
    'scaler_type': 'MinMaxScaler',
    'feature_range': (0, 1),  # Normalize to 0-1 range
    'handle_out_of_range': 'clip',  # Options: 'clip', 'scale', 'error'
}

# How to handle values outside the defined ranges:
# 'clip': Force values to stay within min-max range
# 'scale': Allow scaler to extrapolate beyond range
# 'error': Raise an error if value is outside range

def get_feature_range(feature_name):
    """
    Get min-max range for a feature
    Usage: min_val, max_val = get_feature_range('distance')
    """
    if feature_name not in FEATURE_RANGES:
        raise ValueError(f"Unknown feature: {feature_name}")
    return (FEATURE_RANGES[feature_name]['min'], 
            FEATURE_RANGES[feature_name]['max'])

def get_all_feature_ranges_dict():
    """
    Get all features as a dict for MinMaxScaler
    Returns: {'distance': (5, 50), 'temperature': (15, 40), ...}
    """
    return {
        name: (config['min'], config['max']) 
        for name, config in FEATURE_RANGES.items()
    }

def print_feature_ranges():
    """Print all feature ranges in a readable format"""
    print("\n" + "="*60)
    print("ML MODEL FEATURE RANGES")
    print("="*60)
    for feature_name, config in FEATURE_RANGES.items():
        min_val = config['min']
        max_val = config['max']
        unit = config['unit']
        desc = config['description']
        print(f"\n{feature_name.upper()}")
        print(f"  Range: [{min_val}, {max_val}] {unit}")
        print(f"  Description: {desc}")
    print("\n" + "="*60)
    print("⚠️  If your sensors read values OUTSIDE these ranges,")
    print("   update the ranges in config.py and restart the server!")
    print("="*60 + "\n")

if __name__ == "__main__":
    print_feature_ranges()
