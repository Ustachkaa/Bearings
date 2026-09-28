@echo off
title Bearings
cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing dependencies (first run only)...
  call npm install --no-audit --no-fund
)

if not exist "client\dist\index.html" (
  echo Building the app (first run only)...
  call npm run build
)

echo.
echo   Bearings is starting on http://localhost:7300
echo   Keep this window open. Close it to stop alerts.
echo.
start "" http://localhost:7300
call npm start
pause
