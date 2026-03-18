# Water Tank Backend - Render Deployment

A FastAPI-based backend service for real-time water tank monitoring with machine learning predictions. Deployed on Render.

## Features

✅ Real-time sensor data monitoring (distance, temperature, water level)  
✅ LSTM ML model for next-cycle water level prediction (97% accuracy)  
✅ PostgreSQL database for data persistence  
✅ REST API with automatic Swagger documentation  
✅ Production-ready on Render  

## Deployment on Render

### Step 1: Environment Variables

Set these in Render dashboard:

```
DB_HOST=your-postgres-host.com
DB_PORT=5432
DB_NAME=water_tank_db
DB_USER=postgres_user
DB_PASSWORD=your_secure_password
DB_SSLMODE=require
THINGSPEAK_API_KEY=your_thingspeak_key
THINGSPEAK_CHANNEL=your_channel_id
```

### Step 2: Create Render Web Service

1. Go to render.com → New → Web Service
2. Connect GitHub repository
3. Set these settings:
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `bash start.sh`
   - **Port**: `10000`

4. Add environment variables from Step 1

### Step 3: Deploy

Push to GitHub - Render auto-deploys!

## API Endpoints

### GET `/api/v1/status`
Check if API is running and model is loaded
```
Response: {"status": "running", "model_loaded": true, "database": "connected"}
```

### GET `/api/v1/sensor/latest`
Get most recent sensor reading
```
Response: {
  "distance": 20.5,
  "temperature": 28.3,
  "water_percentage": 55.6,
  "water_liters": 11.2,
  "timestamp": "2026-03-18T14:00:00"
}
```

### POST `/api/v1/predict-water`
Predict next water level
```
Request: {
  "distance": 20,
  "temperature": 25,
  "water_percent": 50,
  "minute": 30,
  "hour": 14
}

Response: {
  "status": "success",
  "predicted_water_percent": 85.0,
  "timestamp": "2026-03-18T14:00:00"
}
```

## ML Model

- **Type**: LSTM (Long Short-Term Memory)
- **Training Data**: 343 sensor samples
- **Test Accuracy**: 97% (MAE: 3.12%)
- **Architecture**: LSTM(128) → Dropout(0.3) → LSTM(64) → Dense(32) → Dense(1)
- **File**: `backend/model23.h5`

## Backend Files

```
backend/
├── main.py           # FastAPI application (main code)
├── config.py         # Configuration & feature ranges
├── thingspeak.py     # ThingSpeak integration
├── sync.py           # Data sync helper
├── requirements.txt  # Python dependencies
├── runtime.txt       # Python version (3.11)
├── start.sh          # Render start script
├── Procfile          # Render process definition
└── model23.h5        # Trained LSTM model
```

## Testing Locally

```bash
cd backend
pip install -r requirements.txt
python main.py
```

API available at `http://localhost:10000`  
Swagger docs at `http://localhost:10000/docs`

## Troubleshooting

**Model not loading?**
- Check `model23.h5` exists in backend folder
- Check Render logs for MODEL LOADING section

**Database connection failed?**
- Verify DB credentials in environment variables
- Check PostgreSQL is running and accessible

**API responding with errors?**
- Check backend logs in Render dashboard
- Verify all environment variables are set

## Version Info

- **Backend**: Python 3.11
- **Framework**: FastAPI 0.104+
- **ML Framework**: TensorFlow 2.15
- **Database**: PostgreSQL 12+
- **Deployment**: Render Web Service

---

**Status**: ✅ Production Ready  
**Last Updated**: March 18, 2026  
**Model Performance**: 97% Accurate (3.12% MAE)
