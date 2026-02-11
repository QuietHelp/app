#!/bin/sh
# Start Postgres + Redis, then run the backend.
# Fixes: "FATAL: database \"quiethelp\" does not exist" and Maven run failure.
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Use "docker compose" (v2) or "docker-compose" (v1)
if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  DCC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DCC="docker-compose"
else
  echo "Error: Docker is required. Install Docker Desktop or docker-compose."
  echo "Then run: docker compose up -d   (from this directory), then: mvn spring-boot:run"
  exit 1
fi

echo "Starting Postgres and Redis ($DCC)..."
$DCC up -d

echo "Waiting for Postgres to accept connections..."
max=30
i=0
until $DCC exec -T postgres pg_isready -U postgres -d quiethelp 2>/dev/null; do
  i=$((i + 1))
  if [ $i -ge $max ]; then
    echo "Postgres did not become ready in time. Check: $DCC logs postgres"
    exit 1
  fi
  sleep 1
done
echo "Postgres is ready."

echo "Running Spring Boot backend..."
exec mvn spring-boot:run
