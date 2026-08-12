@echo off
title MoodHarmonies Local Full-Stack Application
echo ========================================================
echo   Starting MoodHarmonies Local Backend & Frontend...
echo ========================================================
start "MoodHarmonies Backend (Port 5000)" cmd /c "cd server && npm run dev"
start "MoodHarmonies Frontend (Port 3000)" cmd /c "cd client && npm run dev"
echo.
echo Backend running on  : http://localhost:5000
echo Frontend running on : http://localhost:3000
echo.
