#!/usr/bin/env python3
"""
Launcher script for Render deployment.
Directly imports and runs gunicorn to avoid PATH issues.
"""
import os
import sys
from gunicorn.app.wsgiapp import run

if __name__ == '__main__':
    # Get port from environment, default to 8000
    port = os.environ.get('PORT', '8000')
    
    # Set up gunicorn arguments
    sys.argv = [
        'gunicorn',
        '-w', '1',
        '-k', 'uvicorn.workers.UvicornWorker',
        '-b', f'0.0.0.0:{port}',
        'main:app'
    ]
    
    # Run gunicorn
    run()
