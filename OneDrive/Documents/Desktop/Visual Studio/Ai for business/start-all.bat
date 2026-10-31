@echo off
echo ========================================================
echo  Starting 4-Hour AI Hackathon Fullstack Workspace
echo ========================================================

echo [1/3] Starting Backend (Express on port 5000)...
start "Backend - Express" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo [2/3] Starting AI Service (FastAPI on port 8000)...
start "AI Service - FastAPI" cmd /k "cd /d "%~dp0ai-service" && python main.py"

echo [3/3] Starting Frontend Client (React on port 5173)...
start "Client - Vite React" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo All 3 services are launching in separate windows!
echo - Client:     http://localhost:5173
echo - Backend:    http://localhost:5000/api/health
echo - AI Service: http://localhost:8000/docs
echo ========================================================
