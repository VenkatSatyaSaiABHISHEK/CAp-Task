# Rendering on Render.com - Deployment Guide

This guide explains how to deploy both the backend and frontend to Render.com.

## Prerequisites

- GitHub repository with code pushed (✅ Done)
- Render.com account (free tier available)
- PostgreSQL database (can use Render's PostgreSQL service)

---

## Part 1: Deploy PostgreSQL Database

### Step 1: Create PostgreSQL Database
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `water-tank-db`
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: Latest (14+)
   - **Plan**: Free tier for testing
4. Click **Create Database**
5. **Copy** the connection details (you'll need them later)

### Step 2: Get Database Credentials
In your Render dashboard, your database will show:
```
Host: dpg-xxxxx.render-postgres.com
Database: water_tank_db_xxxxx
User: water_tank_user
Password: xxxxxxxx
Port: 5432
```

---

## Part 2: Deploy FastAPI Backend

### Step 1: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Select **"Build and deploy from a Git repository"**
3. Click **"Connect GitHub Account"** and authorize
4. Select repository: `CAP--IIIT`
5. Configure:
   - **Name**: `water-tank-backend`
   - **Branch**: `master`
   - **Root Directory**: `backend` (if using monorepo) or leave empty
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`

### Step 2: Set Environment Variables
In the "Environment" section, add:

```
DB_HOST=dpg-xxxxx.render-postgres.com
DB_PORT=5432
DB_NAME=water_tank_db_xxxxx
DB_USER=water_tank_user
DB_PASSWORD=your_db_password
DB_SSLMODE=require
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Step 3: Deploy
- Click **Deploy**
- Wait 3-5 minutes for deployment
- Copy the backend URL: `https://your-backend-xxxxx.onrender.com`

### Test Backend
```bash
curl https://your-backend-xxxxx.onrender.com/api/v1/status
```

---

## Part 3: Deploy React Frontend

### Step 1: Create Static Site
1. Click **"New +"** → **"Static Site"**
2. Select **"Build and deploy from a Git repository"**
3. Select repository: `CAP--IIIT`
4. Configure:
   - **Name**: `water-tank-frontend`
   - **Branch**: `master`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Step 2: Set Environment Variables
In the "Environment" section, add:

```
VITE_API_URL=https://your-backend-xxxxx.onrender.com
```

This tells your frontend where the backend API is located.

### Step 3: Deploy
- Click **Deploy**
- Wait 2-3 minutes for your site to go live
- Your frontend URL: `https://your-frontend-xxxxx.onrender.com`

---

## Part 4: Connect Frontend to Backend

1. The frontend is already configured to use `VITE_API_URL` environment variable
2. During build, it will use the value you set in Render
3. Test the connection by checking the dashboard - it should show sensor data

---

## Post-Deployment Checklist

- [ ] Database is running and accessible
- [ ] Backend API responds to `/api/v1/status`
- [ ] Frontend loads without errors
- [ ] Frontend connects to backend (no "Disconnected" messages)
- [ ] You can see the dashboard with data
- [ ] Update `.env.example` with production URLs (for documentation)

---

## Common Issues

### 1. **Frontend shows "Disconnected from Backend"**
- Check that `VITE_API_URL` environment variable is set correctly
- Verify backend URL is accessible from frontend
- Backend should have CORS enabled (it is in this project)

### 2. **Database Connection Error**
- Verify database credentials in backend environment variables
- Check that `DB_SSLMODE=require` is set
- Ensure database is in the same region or accessible

### 3. **Frontend Build Fails**
- Ensure `Build Command` is: `npm install && npm run build`
- Check `Publish Directory` is: `dist`
- Make sure `frontend/package.json` exists

### 4. **Backend Crashes on Startup**
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure database connection credentials are correct

---

## Production URLs After Deployment

Update your `.env.example` with these:

```env
VITE_API_URL=https://your-backend-xxxxx.onrender.com
FRONTEND_URL=https://your-frontend-xxxxx.onrender.com
```

---

## Monitoring

- Check logs in Render dashboard under each service
- Monitor database metrics
- Set up alerts for crashes (Render Pro feature)

---

## Database Maintenance

### Create Tables (on first run)
The backend automatically creates tables on startup. Check logs for:
```
[OK] sensor_data table created/exists
[OK] predictions table created/exists
```

### Backup Database
1. Go to your PostgreSQL service on Render
2. Download backups from the "Backups" tab

---

## Updating Code

When you push new code to GitHub:
1. Render automatically rebuilds and redeploys
2. Backend restarts with new code
3. Frontend rebuilds and republishes
4. No manual action needed!

---

## Next Steps

1. ✅ Deploy database
2. ✅ Deploy backend
3. ✅ Deploy frontend
4. ✅ Test everything works
5. 🔄 Make updates and push to GitHub (automatic redeploy)

**Your Water Tank Monitoring System is now LIVE! 🚀**

---

## Troubleshooting Command Line

If needed, you can SSH into backend service (Render Pro only):
```bash
# View recent logs
# Navigate to Render dashboard → Backend Service → Logs

# Monitor status
# Render auto-restarts on crashes
```

---

For more help, visit [Render Docs](https://render.com/docs)
