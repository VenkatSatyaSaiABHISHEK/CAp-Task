import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        port=int(os.getenv('DB_PORT', 5432)),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        sslmode=os.getenv('DB_SSLMODE', 'require')
    )
    return conn

def seed_sensor_data():
    """Insert sample sensor data for testing"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Create table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sensor_data (
                id SERIAL PRIMARY KEY,
                distance FLOAT NOT NULL,
                temperature FLOAT NOT NULL,
                water_percentage FLOAT NOT NULL,
                water_liters FLOAT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                entry_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insert test data
        test_data = [
            (45.5, 28.3, 65.4, 327, datetime.now()),
            (42.1, 27.8, 62.1, 310, datetime.now()),
            (48.3, 29.1, 70.5, 352, datetime.now()),
            (50.0, 30.0, 75.0, 375, datetime.now()),
            (40.0, 26.5, 55.0, 275, datetime.now()),
        ]
        
        for distance, temp, water_pct, water_liters, timestamp in test_data:
            cursor.execute('''
                INSERT INTO sensor_data 
                (distance, temperature, water_percentage, water_liters, timestamp)
                VALUES (%s, %s, %s, %s, %s)
            ''', (distance, temp, water_pct, water_liters, timestamp))
        
        conn.commit()
        print("✓ Sample data inserted successfully!")
        
        # Verify
        cursor.execute('SELECT * FROM sensor_data ORDER BY id DESC LIMIT 1')
        result = cursor.fetchone()
        if result:
            print(f"✓ Latest record: Distance={result[1]}, Temp={result[2]}°C, Water={result[3]}%")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    seed_sensor_data()
