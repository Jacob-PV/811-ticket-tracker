@echo off
echo Starting 811 Ticket Tracker Backend...
echo.

REM Activate virtual environment
call venv\Scripts\activate

REM Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
