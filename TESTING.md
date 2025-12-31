# Local Testing Guide for QuietHelp

This guide will help you test the QuietHelp application locally.

## Prerequisites

- Docker and Docker Compose installed
- Java 17+ installed
- Node.js 18+ and npm installed
- Two browser windows/tabs (for testing matching between two users)

## Step 1: Start Docker Services

Start Redis and PostgreSQL using Docker Compose:

```bash
cd backend
docker-compose up -d
```

This will start:
- Redis on port `6379`
- PostgreSQL on port `5433`

Verify services are running:
```bash
docker-compose ps
```

## Step 2: Start Backend Server

```bash
cd backend
./mvnw spring-boot:run
```

Or if you're on Windows:
```bash
cd backend
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`

Wait for the message: "Started BackendApplication in X seconds"

## Step 3: Start Frontend Server

Open a new terminal:

```bash
cd frontend
npm install  # Only needed first time
npm run dev
```

The frontend will start on `http://localhost:3000`

## Step 4: Testing the Flow

### Test Scenario: Two Users Matching

1. **Open two browser windows** (or use incognito mode for the second one)

2. **Window 1 - User 1:**
   - Navigate to `http://localhost:3000`
   - Click "Get Started" button
   - Fill out the form:
     - Select a mood (e.g., "STRESS")
     - Enter age (e.g., 25)
     - Select country (e.g., "United States")
   - After completing the form, you should see **"Looking for someone..."** screen
   - **DO NOT close this window**

3. **Window 2 - User 2:**
   - Navigate to `http://localhost:3000`
   - Click "Get Started" button
   - Fill out the form:
     - Select the **SAME mood** (e.g., "STRESS") - this is important for matching!
     - Enter age (e.g., 30)
     - Select country (e.g., "Canada")
   - After completing the form, you should see **"Looking for someone..."** screen

4. **Match Found:**
   - When both users have selected the same mood, they should both be redirected to the chat room
   - Both windows should now show the chat interface
   - Test sending messages between the two users

### Expected Flow:

```
Landing Page → Click "Get Started"
    ↓
Form Step 1: Select Mood
    ↓
Form Step 2: Enter Age
    ↓
Form Step 3: Select Country
    ↓
Matching Page: "Looking for someone..." (with loading spinner)
    ↓
[Wait for another user with same mood]
    ↓
Chat Room: Both users are matched and can chat
```

## Troubleshooting

### Backend won't start

- Check if ports 8080, 6379, or 5433 are already in use
- Verify Docker containers are running: `docker-compose ps`
- Check backend logs for errors

### Frontend won't start

- Make sure you ran `npm install` in the frontend directory
- Check if port 3000 is already in use
- Verify Node.js version: `node --version` (should be 18+)

### Users not matching

- **Important:** Both users must select the **SAME mood** for matching to work
- Check browser console for WebSocket connection errors
- Verify backend is running and accessible
- Check backend logs for WebSocket connection messages

### WebSocket Connection Errors

- Verify backend is running on `http://localhost:8080`
- Check CORS settings in `backend/src/main/java/com/quiethelp/backend/config/CorsConfig.java`
- Check WebSocket configuration in `backend/src/main/java/com/quiethelp/backend/config/WebSocketConfig.java`

### Database Connection Issues

- Ensure PostgreSQL container is running: `docker-compose ps`
- Check database credentials in `backend/src/main/resources/application.yaml`
- Try restarting containers: `docker-compose restart`

## Testing Different Scenarios

### Test Matching with Different Moods

1. User 1 selects "STRESS"
2. User 2 selects "LONELY"
3. They should NOT match (they'll wait in the queue)

### Test Multiple Users

1. Start User 1 with "STRESS" mood
2. Start User 2 with "STRESS" mood → Should match immediately
3. Start User 3 with "STRESS" mood → Should wait for User 4
4. Start User 4 with "STRESS" mood → Should match with User 3

### Test Form Validation

- Try submitting age less than 13 or greater than 120
- Try submitting without selecting a mood
- Try submitting without entering age
- Try submitting without selecting country

## Stopping Services

```bash
# Stop backend (Ctrl+C in backend terminal)

# Stop frontend (Ctrl+C in frontend terminal)

# Stop Docker services
cd backend
docker-compose down
```

## Clean Start (if something goes wrong)

```bash
# Stop everything
cd backend
docker-compose down -v  # Removes volumes too (clears data)

# Restart
docker-compose up -d
./mvnw spring-boot:run

# In another terminal
cd frontend
npm run dev
```

## Notes

- Matching is based on mood only (same mood = match)
- Age and country are stored for metrics but don't affect matching logic
- Sessions expire after 30 minutes of inactivity
- Chat rooms expire after 30 minutes

