@echo off
echo Starting WAFlow Services...
echo.

cd backend
echo Checking backend database...
call npx prisma db push

echo Starting Backend Server on port 3001...
start cmd /k "npm run start:dev"

cd ../frontend
echo Starting Frontend Server on port 3000...
start cmd /k "npm run dev"

echo.
echo Both servers are starting in new windows!
echo Once they are ready, open http://localhost:3000 in your browser.
pause
