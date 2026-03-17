#!/usr/bin/env python3
"""
Simple launcher for FastAPI app on Render.
Uses uvicorn directly to avoid external command issues.
"""
import os
import uvicorn
from main import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run(
        app,
        host='0.0.0.0',
        port=port,
        log_level='info'
    )
