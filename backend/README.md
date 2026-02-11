# QuietHelp Backend

## Run the backend

**Option 1 – One command (recommended)**  
Starts Postgres + Redis, then the app:

```bash
./start.sh          # macOS/Linux (chmod +x start.sh if needed)
# or
start.cmd           # Windows
```

**Option 2 – Manual**

1. Start Postgres and Redis:
   ```bash
   docker-compose up -d
   ```
2. Wait a few seconds, then run:
   ```bash
   mvn spring-boot:run
   ```

Requires **Docker** for Postgres and Redis. API: http://localhost:8080
