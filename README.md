# 🌊 IoT Water Tank Monitoring System

<div align="center">

**Real-time Water Tank Monitoring Dashboard with IoT Integration**

A modern, responsive web application for monitoring water tank levels with live sensor data, beautiful animations, and AI-powered predictions. Built with React.js, FastAPI, and PostgreSQL.

[View Demo](#-screenshots--demos) • [Installation](#-installation) • [API Docs](#-api-reference) • [Deployment](#-deployment)

</div>

---

## 📋 Overview

The Water Tank Monitoring System is an intelligent IoT solution that provides real-time monitoring, visualization, and prediction of water tank levels. It combines modern web technologies with machine learning to deliver actionable insights about water consumption patterns.

### 🎯 Key Capabilities

- **Real-time Monitoring** - Live sensor data updates every 15 seconds
- **Water Level Visualization** - Animated water tank with wave effects
- **Smart Predictions** - AI-powered water level forecasting
- **Responsive Dashboard** - Works seamlessly on desktop, tablet, and mobile
- **Multi-Sensor Support** - Temperature, distance, and water level sensors
- **Production-Ready Backend** - High-performance FastAPI async server
- **Live Status Monitoring** - Connection and system health indicators
- **Cloud Deployment** - Deployed on Render with PostgreSQL (Aiven Cloud)

---

## 📸 Screenshots & Demos

### 1. Dashboard Overview
![Dashboard Home](./Images/Screenshot%202026-03-21%20095453.png)
*Main dashboard showing real-time water tank level with sensor data*

### 2. Water Tank Animation
![Water Tank Indicator](./Images/Screenshot%202026-03-21%20095547.png)
*Interactive water tank visualization with fill animation and wave effects*

### 3. Sensor Readings
![Sensor Data Display](./Images/Screenshot%202026-03-21%20095604.png)
*Real-time sensor measurements (temperature, distance, water level)*

### 4. Status & Indicators
![Status Panel](./Images/Screenshot%202026-03-21%20095615.png)
*System health and connection status indicators*

### 5. Analytics Dashboard
![Analytics View](./Images/Screenshot%202026-03-21%20095627.png)
*Historical data visualization and trends analysis*

### 6. Notifications & Alerts
![Notification Feed](./Images/Screenshot%202026-03-21%20095652.png)
*Real-time alerts and system notifications*

### 7. Mobile Responsive Design
![Mobile View](./Images/Screenshot%202026-03-21%20095722.png)
*Optimized interface for mobile and tablet devices*

### 8. Advanced Settings
![Settings Panel](./Images/Screenshot%202026-03-21%20095808.png)
*System configuration and control interface*

### 9. System Architecture
![Architecture Diagram](./Images/Screenshot%202026-03-21%20100402.png)
*Complete IoT system architecture*

### 10. Backend Monitoring
![Backend Status](./Images/Screenshot%202026-03-21%20100617.png)
*Backend API health and system metrics*

### 11. IoT Device Integration
![IoT Devices](./Images/Screenshot%202026-03-21%20100635.png)
*ESP32/Arduino sensor connectivity and data flow*

### 12. Advanced Analytics
![Data Analytics](./Images/Screenshot%202026-03-21%20100731.png)
*Machine learning predictions and data insights*

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    Frontend (React.js)                           │
│  • Dashboard with Live Updates                                  │
│  • Water Tank Animation                                         │
│  • Analytics & Predictions                                      │
│  • Responsive Mobile Design                                     │
│  Deployed on: Render.com                                        │
└──────────────────────────────┬─────────────────────────────────┘
                               │ HTTP/REST API
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                             │
│  • High-Performance REST API Server                             │
│  • Real-time Data Processing                                    │
│  • ML Model Integration (TensorFlow)                            │
│  • Status Monitoring Endpoints                                  │
│  Deployed on: Render.com (Python 3.11)                         │
└────────────┬─────────────────────────────────┬──────────────────┘
             │                                 │
             ▼                                 ▼
    ┌──────────────────────┐        ┌───────────────────────┐
    │  PostgreSQL Database │        │   ML Models & AI      │
    │   (Aiven Cloud)      │        │  • best_model.h5      │
    │                      │        │  • Water Prediction   │
    │  • Sensor Data       │        │  • Pattern Detection  │
    │  • Historical Data   │        │  • Anomaly Detection  │
    │  • Predictions       │        │  (TensorFlow 2.15)    │
    └──────────────────────┘        └───────────────────────┘
             ▲
             │ Database Queries
    ┌────────┴──────────────────┐
    │   IoT Sensors (ESP32)     │
    │  • Water Level Sensor      │
    │  • Temperature Sensor      │
    │  • Distance Sensor         │
    │                            │
    │  Updates every 15 seconds  │
    └────────────────────────────┘
```

---

## 🏠 Home Page (Dashboard)

### Dashboard Features:

**Header Section:**
- Connected Wi-Fi indicator
- System status badge (Online/Offline)
- Current timestamp
- User account menu

**Main Dashboard Content:**
1. **Water Tank Visualization**
   - Animated water level indicator
   - Real-time fill percentage
   - Wave animation effects
   - Color-coded level status (Safe/Warning/Critical)

2. **Sensor Metrics (Current Values)**
   - 📊 Water Level: XX% (last updated: XX seconds ago)
   - 🌡️ Temperature: XX°C
   - 📏 Distance: XX cm
   - 📡 Signal Strength: XX%

3. **Quick Stats**
   - Today's Average Level
   - Peak Usage Time
   - Minimum Level
   - Total Readings

4. **Activity Feed**
   - Latest sensor readings
   - Prediction alerts
   - System notifications
   - Anomaly detections

5. **Quick Actions**
   - View Full History
   - Run Prediction
   - Export Data
   - Settings

---

## ⚙️ Backend Overview

### Backend Server Details:

**URL:** `https://cap-task.onrender.com` (Production)  
**Local Dev:** `http://localhost:8000`

### Key Backend Features:

1. **REST API Endpoints**
   - Health checks
   - Sensor data endpoints
   - ML prediction endpoints
   - Historical data retrieval

2. **Database Integration**
   - PostgreSQL connection
   - Real-time data storage
   - Historical data management
   - Fast query optimization

3. **Machine Learning**
   - Pre-trained TensorFlow model
   - Water level predictions
   - Pattern recognition
   - Anomaly detection

4. **Error Handling**
   - Comprehensive logging
   - Graceful error responses
   - Status monitoring

---

## 📡 API Reference & Status Endpoint

### Base URL
```
Production: https://cap-task.onrender.com
Local Dev: http://localhost:8000
```

### 🟢 System Status Endpoint

#### Get System Health & Status
```http
GET /api/v1/status
```

**Response (200 OK):**
```json
{
  "status": "running",
  "timestamp": "2026-03-21T10:05:30.123456Z",
  "uptime": 3600,
  "database": "connected",
  "model_loaded": true,
  "version": "1.0.0",
  "environment": "production",
  "features": {
    "ml_predictions": true,
    "sensor_integration": true,
    "real_time_updates": true
  }
}
```

**Status Response Fields:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `status` | string | System operational status | `"running"` |
| `timestamp` | string | Server time (ISO 8601) | `"2026-03-21T10:05:30Z"` |
| `uptime` | integer | Seconds since server start | `3600` |
| `database` | string | Database connection status | `"connected"` |
| `model_loaded` | boolean | ML model availability | `true` |
| `version` | string | API version | `"1.0.0"` |
| `environment` | string | Deployment environment | `"production"` |

---

### Sensor Data Endpoints

#### Get Latest Sensor Reading
```http
GET /api/v1/sensor/latest
```

**Response:**
```json
{
  "water_level": 75,
  "temperature": 28.5,
  "distance": 25,
  "timestamp": "2026-03-21T10:05:30Z",
  "signal_strength": 95,
  "quality": "excellent"
}
```

#### Get Sensor History
```http
GET /api/v1/sensor/history?limit=100&offset=0&hours=24
```

**Query Parameters:**
- `limit` (optional, default: 50) - Records per page
- `offset` (optional, default: 0) - Pagination offset
- `hours` (optional, default: 24) - Historical period in hours

**Response:**
```json
{
  "total_records": 1450,
  "page": 1,
  "per_page": 100,
  "data": [
    {
      "id": 1,
      "water_level": 75,
      "temperature": 28.5,
      "distance": 25,
      "timestamp": "2026-03-21T10:05:30Z"
    },
    {
      "id": 2,
      "water_level": 74,
      "temperature": 28.3,
      "distance": 26,
      "timestamp": "2026-03-21T09:50:30Z"
    }
  ]
}
```

---

### ML Prediction Endpoints

#### Predict Water Level
```http
POST /api/v1/predict-water
Content-Type: application/json

{
  "current_level": 75,
  "temperature": 28.5,
  "hours_ahead": 12
}
```

**Response:**
```json
{
  "predicted_level": 72,
  "confidence": 0.92,
  "risk_level": "normal",
  "timestamp": "2026-03-21T10:05:30Z",
  "factors": {
    "temperature_impact": -1.5,
    "consumption_rate": -2.0,
    "seasonal_effect": 0.5
  }
}
```

**Risk Levels:**
- 🟢 `safe` - Level above 50%
- 🟡 `warning` - Level 20-50%
- 🔴 `critical` - Level below 20%

---

### Complete API Endpoints Reference

| Method | Endpoint | Description | Auth | Response |
|--------|----------|-------------|------|----------|
| **GET** | `/api/v1/status` | System health check | None | 200 JSON |
| **GET** | `/api/v1/sensor/latest` | Latest sensor reading | None | 200 JSON |
| **GET** | `/api/v1/sensor/history` | Historical sensor data | None | 200 JSON |
| **POST** | `/api/v1/predict-water` | Water level prediction | None | 200 JSON |
| **GET** | `/api/v1/predictions/history` | Prediction history | None | 200 JSON |
| **GET** | `/api/v1/model-info` | ML model information | None | 200 JSON |
| **GET** | `/docs` | Interactive Swagger UI | None | HTML |
| **GET** | `/redoc` | ReDoc API documentation | None | HTML |

---

## 📁 Project Structure

```
CAP--IIIT-master/
│
├── backend/                          # FastAPI Backend Server
│   ├── main.py                      # Main FastAPI application & routes
│   ├── config.py                    # Configuration & constants
│   ├── run.py                       # Development server launcher
│   ├── requirements.txt             # Development dependencies
│   ├── requirements-prod.txt        # Production dependencies (+ TensorFlow)
│   ├── ml_training/                 # ML utilities
│   │   └── model_loader.py         # Model loading & inference
│   ├── saved_models/
│   │   └── best_model.h5           # Pre-trained neural network
│   ├── Procfile                     # Render deployment config
│   ├── render-start.sh              # Render startup script
│   └── README.md                    # Backend documentation
│
├── frontend/                         # React.js Frontend Dashboard
│   ├── src/
│   │   ├── App.js                  # Main App component
│   │   ├── index.js                # React entry point
│   │   ├── config.js               # API configuration
│   │   ├── components/             # Reusable React components
│   │   │   ├── Header.js           # Top navigation bar
│   │   │   ├── Navbar.js           # Sidebar navigation
│   │   │   ├── Home.js             # Dashboard main component
│   │   │   ├── WaterLevelIndicator.js  # Tank animation (core)
│   │   │   ├── SensorCard.js       # Sensor data cards
│   │   │   ├── MetricCard.js       # Statistics metrics
│   │   │   ├── AnimatedChart.js    # Chart visualizations
│   │   │   ├── ChatPanel.js        # AI assistant interface
│   │   │   ├── StatusBadge.js      # Status indicators
│   │   │   └── LoadingScreen.js    # Loading animation
│   │   ├── pages/                  # Route pages
│   │   │   ├── Home.js             # Dashboard page
│   │   │   ├── Analytics.js        # Analytics & history
│   │   │   ├── Prediction.js       # ML predictions
│   │   │   ├── History.js          # Data history view
│   │   │   └── Settings.js         # Configuration panel
│   │   ├── hooks/                  # Custom React hooks
│   │   │   └── useSensorData.js   # Sensor data fetching logic
│   │   ├── utils/                  # Utility functions
│   │   │   └── api.js             # API communication layer
│   │   └── styles/                 # CSS stylesheets
│   │       ├── App.css
│   │       ├── Home.css
│   │       ├── MetricCard.css
│   │       └── ...
│   ├── package.json                # NPM dependencies & scripts
│   ├── public/
│   │   └── index.html              # HTML template
│   └── README.md                    # Frontend documentation
│
├── Images/                          # Screenshots & documentation media
│   ├── Screenshot 2026-03-21 095453.png
│   ├── Screenshot 2026-03-21 095547.png
│   └── ... (12 total screenshots)
│
├── README.md                        # This comprehensive README
├── render.yaml                      # Multi-service Render configuration
├── runtime.txt                      # Python version (3.11)
└── .gitignore                      # Git ignore rules (includes model.h5)
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Python** 3.9 or higher
- **Node.js** 16.0.0 or higher
- **PostgreSQL** (local) or PostgreSQL URL (Aiven Cloud)
- **Git** for version control
- **Virtual Environment Tool** (venv, virtualenv, or conda)

### Backend Setup (FastAPI)

```bash
# 1. Clone repository
git clone https://github.com/VenkatSatyaSaiABHISHEK/CAp-Task.git
cd CAP--IIIT-master/backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://user:password@localhost:5432/water_tank
SECRET_KEY=your_secret_key_here_change_in_production
ML_MODEL_PATH=./saved_models/best_model.h5
DEBUG=true
EOF

# 6. Run development server
python run.py
```

✅ **Backend Running at:** `http://localhost:8000`  
📖 **API Docs:** `http://localhost:8000/docs` (Interactive Swagger)  
📚 **ReDoc:** `http://localhost:8000/redoc`

### Frontend Setup (React)

```bash
# 1. Open new terminal window
cd CAP--IIIT-master/frontend

# 2. Install dependencies
npm install

# 3. Create .env.local file
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_VERSION=v1
REACT_APP_REFRESH_INTERVAL=15000
EOF

# 4. Start development server
npm start
```

✅ **Frontend Running at:** `http://localhost:3000`  
🔄 **Auto-reload enabled** on file changes

### Test the Complete System

```bash
# Terminal 1: Backend running
# Terminal 2: Frontend running

# Open browser: http://localhost:3000
# You should see:
# ✅ Dashboard loading
# ✅ Water tank animation
# ✅ Real-time sensor data
# ✅ Status indicators showing "Connected"
```

---

## 🌐 Deployment

### Production Deployment (Render.com)

The project is fully configured for deployment on Render using `render.yaml`

**Current Production Services:**
- **Backend API:** https://cap-task.onrender.com
- **Frontend:** [Your Frontend URL]
- **Database:** PostgreSQL on Aiven Cloud

### Deployment Steps:

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy: Add new features"
   git push origin main
   ```

2. **Go to Render Dashboard:**
   https://dashboard.render.com

3. **Redeploy Backend Service:**
   - Select "cap-task" service
   - Click "Deploy latest commit"
   - Wait 3-5 minutes for build and deployment

4. **Verify Deployment:**
   ```bash
   # Check API status
   curl https://cap-task.onrender.com/api/v1/status
   
   # Should return:
   # {
   #   "status": "running",
   #   "database": "connected",
   #   "model_loaded": true
   # }
   ```

5. **Monitor Logs:**
   - Go to service → Logs tab
   - Check for errors and warnings
   - Verify model loading message

### Environment Variables (Render):

Set these in Render Dashboard → Environment:

```
DATABASE_URL=postgresql://[user]:[pass]@pg-xxxx.aivencloud.com:24446/[database]
SECRET_KEY=[your_secret_key]
ML_MODEL_PATH=./saved_models/best_model.h5
PYTHON_VERSION=3.11
ENVIRONMENT=production
DEBUG=false
```

---

## 🔧 Technology Stack

### Frontend Stack
- **React.js 18** - Modern UI framework with hooks
- **CSS3** - Styling with animations & transitions
- **Axios** - Promise-based HTTP client
- **Chart.js** - Data visualization library
- **Lucide React** - Icon library
- **Node.js & npm** - Runtime & package management

### Backend Stack
- **FastAPI** - Modern Python REST API framework
- **Uvicorn** - High-performance ASGI server
- **SQLAlchemy** - Python ORM for database
- **Psycopg2** - PostgreSQL database adapter
- **TensorFlow 2.15** - Machine learning framework
- **NumPy & Scikit-learn** - Data processing libraries
- **Python-dotenv** - Environment configuration

### Database Stack
- **PostgreSQL** - Relational database
- **Aiven Cloud** - Managed PostgreSQL hosting

### DevOps & Deployment
- **Render.com** - Full-stack cloud platform
- **GitHub** - Version control & CI/CD
- **Docker** - Containerization (optional)
- **Git** - Version management

---

## 🎯 Feature Details

### Real-time Dashboard
✅ Live animated water tank level  
✅ Current sensor readings (temperature, distance, humidity)  
✅ System status & connection indicators  
✅ Last update timestamp  
✅ Quick action buttons  

### Data Analytics
✅ Historical data visualization  
✅ Trend analysis and patterns  
✅ Peak usage detection  
✅ Custom date range filtering  
✅ CSV export functionality  

### AI Predictions
✅ Water level forecasting (12-48 hours)  
✅ Activity pattern recognition  
✅ Anomaly detection alerts  
✅ Risk level assessment  
✅ Confidence scores  

### Responsive Design
✅ Mobile-first approach  
✅ Tablet optimization  
✅ Desktop enhancement (details)  
✅ Touch-friendly controls  
✅ Landscape & portrait support  

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
   ```bash
   Click "Fork" on GitHub
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   ```bash
   # Edit files, test thoroughly
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: Add water level alert system"
   git commit -m "fix: Resolve API timeout issue"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to GitHub repository
   - Click "Compare & pull request"
   - Describe your changes
   - Request review

---

## 📊 Performance & Monitoring

### Recommended Monitoring

1. **Backend Health:**
   - Monitor `/api/v1/status` endpoint
   - Check response time < 200ms
   - Verify `model_loaded: true`

2. **Database Performance:**
   - Monitor query response times
   - Track database connection pool
   - Check free storage space

3. **Frontend Performance:**
   - Monitor page load time
   - Check memory usage
   - Verify animation smoothness

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'tensorflow'`
```bash
Solution: pip install tensorflow-cpu==2.15.0
```

**Problem:** `Database connection refused`
```bash
Solution: Check DATABASE_URL in .env
         Verify PostgreSQL is running
         Test connection: psql $DATABASE_URL
```

**Problem:** Model not loading (`model_loaded: false`)
```bash
Solution: Check if best_model.h5 exists in backend/saved_models/
         Verify TensorFlow is installed
         Check file permissions
```

### Frontend Issues

**Problem:** API connection errors
```bash
Solution: Verify REACT_APP_API_URL in .env.local
         Check backend is running
         Check CORS configuration in backend
```

**Problem:** Water tank animation not showing
```bash
Solution: Clear browser cache (Ctrl+Shift+Del)
         Check console for JS errors (F12)
         Verify sensor data is flowing
```

---

## 📞 Support & Contact

- **Report Issues:** [GitHub Issues](https://github.com/VenkatSatyaSaiABHISHEK/CAp-Task/issues)
- **Email:** abhi31mahi@gmail.com
- **GitHub Profile:** [VenkatSatyaSaiABHISHEK](https://github.com/VenkatSatyaSaiABHISHEK)

---

## 📄 License

This project is provided as-is for educational purposes.

---

<div align="center">

**Made with ❤️ for Smart Water Management**

⭐ If you find this helpful, please consider giving it a star!

Last Updated: March 21, 2026

</div>
