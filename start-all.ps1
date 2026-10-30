Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting 4-Hour AI Hackathon Fullstack Workspace" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "[1/3] Starting Backend (Express on port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; npm run dev"

Write-Host "[2/3] Starting AI Service (FastAPI on port 8000)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\ai-service'; python main.py"

Write-Host "[3/3] Starting Frontend Client (React on port 5173)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\client'; npm run dev"

Write-Host ""
Write-Host "All 3 services are launching in separate windows!" -ForegroundColor Green
Write-Host "  Client:     http://localhost:5173"
Write-Host "  Backend:    http://localhost:5000/api/health"
Write-Host "  AI Service: http://localhost:8000/docs"
Write-Host "========================================================" -ForegroundColor Cyan
