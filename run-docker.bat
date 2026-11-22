@echo off
echo ========================================================
echo   Launching MERN Blog Application via Docker Compose
echo ========================================================
echo.
docker-compose up --build -d

echo.
echo Waiting 5 seconds for services to become healthy...
timeout /t 5 /nobreak >nul

echo.
docker-compose ps

echo.
echo ========================================================
echo   Application is now live!
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:5000/api/posts
echo   Health   : http://localhost:5000/health
echo ========================================================
echo.
start http://localhost:3000
pause
