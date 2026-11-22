@echo off
echo =====================================================================
echo   MERN Blog Cloud Deployment Helper (Docker Hub & Google Cloud Run)
echo =====================================================================
echo.
set /p DOCKER_USER="Enter your Docker Hub Username: "
if "%DOCKER_USER%"=="" (
  echo Error: Docker Hub username cannot be empty.
  pause
  exit /b 1
)

echo.
echo [1/4] Tagging Docker Images...
docker tag mern-blog-backend:latest %DOCKER_USER%/mern-blog-backend:latest
docker tag mern-blog-frontend:latest %DOCKER_USER%/mern-blog-frontend:latest

echo.
echo [2/4] Logging into Docker Hub...
docker login -u %DOCKER_USER%

echo.
echo [3/4] Pushing Images to Docker Hub...
docker push %DOCKER_USER%/mern-blog-backend:latest
docker push %DOCKER_USER%/mern-blog-frontend:latest

echo.
echo [4/4] Images pushed successfully!
echo   Backend Image  : https://hub.docker.com/r/%DOCKER_USER%/mern-blog-backend
echo   Frontend Image : https://hub.docker.com/r/%DOCKER_USER%/mern-blog-frontend
echo.
echo Now you can trigger the GitHub Actions CD workflow or deploy directly to Cloud Run.
pause
