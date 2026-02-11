@echo off
REM Start Postgres + Redis, then run the backend.
REM Fixes: FATAL: database "quiethelp" does not exist
cd /d "%~dp0"

echo Starting Postgres and Redis (docker-compose)...
docker-compose up -d

echo Waiting for Postgres to be ready...
timeout /t 5 /nobreak > nul

echo Running Spring Boot backend...
call mvn spring-boot:run
