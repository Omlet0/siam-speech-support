
@echo off
echo Starting VM Monitoring Backend...
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting server...
call npm run dev
pause
