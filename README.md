# Water Tank Monitoring System

A full-stack water tank level monitoring and prediction system using machine learning, real-time sensor data, and interactive visualizations.

## 🏗️ Architecture

- **Backend**: FastAPI (Python) with TensorFlow ML model
- **Frontend**: React + Vite with Tailwind CSS
- **Database**: PostgreSQL
- **ML Model**: LSTM-based water level prediction

## 📁 Project Structure

```
├── backend/              # FastAPI server
│   ├── main.py          # Main API with CORS support
│   ├── create_model.py  # ML model training
│   ├── requirements.txt # Python dependencies
│   └── saved_models/    # Trained ML models
├── frontend/            # React + Vite application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Dashboard & Analytics
│   │   ├── api/         # API configuration
│   │   └── hooks/       # Custom React hooks
│   └── package.json     # Node dependencies
└── .env.example         # Environment variables template
```

## 🚀 Quick Start (Development)

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (or SQLite for testing)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

API will run on `http://localhost:8000`

API Docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/status` | System status & health |
| GET | `/api/v1/sensor/latest` | Latest sensor reading |
| GET | `/api/v1/sensor/history` | Sensor data history |
| POST | `/api/v1/predict-water` | Predict water level |
| GET | `/api/v1/model-info` | ML model information |
| GET | `/api/v1/predictions/history` | Prediction history |

## 🌐 Deploying to Render

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed instructions.

### Quick Deploy Steps:

1. **Backend**: 
   - Push code to GitHub
   - Create new Web Service on Render
   - Connect GitHub repo
   - Set environment variables from `.env.example`
   - Deploy

2. **Frontend**:
   - Create new Static Site on Render
   - Connect GitHub repo
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - Set `VITE_API_URL` environment variable to your backend URL

3. **Database**:
   - Use Render PostgreSQL service
   - Update `DB_HOST`, `DB_PORT`, `DB_NAME`, etc in backend

## 📝 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Key Variables:
- `DB_HOST`: Database host (localhost for dev, render.com host for production)
- `DB_PORT`: Database port (5432)
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `VITE_API_URL`: Backend API URL for frontend
- `FRONTEND_URL`: Frontend URL for CORS

## 🎯 Features

✅ Real-time sensor data monitoring
✅ ML-based water level prediction
✅ Historical data visualization
✅ Responsive dashboard
✅ REST API with Swagger documentation
✅ CORS-enabled for cross-origin requests
✅ PostgreSQL data persistence

## 📚 Technologies

**Backend:**
- FastAPI (HTTP framework)
- TensorFlow/Keras (ML)
- Psycopg2 (PostgreSQL adapter)
- Uvicorn (ASGI server)

**Frontend:**
- React 18
- Vite (Build tool)
- Tailwind CSS (Styling)
- Recharts (Charting)
- Lucide React (Icons)

## 🔧 Development

### Run Both Services (Local)

Terminal 1 (Backend):
```bash
cd backend
python main.py
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Build Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📦 Production Build

### Backend
No build needed - runs directly with Python

### Frontend
```bash
cd frontend
npm run build  # Creates dist/ folder
```

## 🚨 Important Notes

⚠️ **Before Production:**
1. Change `allow_origins=["*"]` in backend CORS to specific domains
2. Use environment variables for sensitive data (DB credentials, API keys)
3. Set up proper database with strong passwords
4. Enable HTTPS for all connections
5. Regenerate GitHub token after deployment

## 📞 Support

For issues or questions, check the API documentation at `/docs` or review the code comments.

## 📄 License

This project is part of an academic assessment.

---

**Note**: The ML model (`best_model.h5`) is included in the repository. For production, consider using a dedicated model server.
