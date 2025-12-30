# QuietHelp - Privacy-First Anonymous Peer Support

QuietHelp is an MVP for anonymous peer support matching. Users can connect with others experiencing similar feelings without any login or persistent chat storage.

## Architecture

```
┌─────────────┐         WebSocket (STOMP)          ┌──────────────┐
│   Frontend  │◄──────────────────────────────────►│   Backend    │
│  (Vite)     │         REST API                   │ (Spring Boot)│
│  :5173      │◄──────────────────────────────────►│   :8080      │
└─────────────┘                                    └──────┬───────┘
                                                           │
                                    ┌──────────────────────┼──────────────────────┐
                                    │                      │                      │
                                    ▼                      ▼                      ▼
                            ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
                            │    Redis     │      │  PostgreSQL  │      │   WebSocket  │
                            │  (Ephemeral) │      │   (Metrics)  │      │   (STOMP)    │
                            │  :6379       │      │   :5432      │      │              │
                            └──────────────┘      └──────────────┘      └──────────────┘
```

### Key Principles

1. **No Chat Storage**: Chat messages are NOT stored in PostgreSQL. Only ephemeral Redis with TTL.
2. **Anonymous Metrics**: PostgreSQL stores only anonymous event metrics (no message content).
3. **Ephemeral Sessions**: Redis stores matching queues and room mappings with 30-minute TTL.

## Local Setup

### Prerequisites

- Java 17+
- Maven (or use `./mvnw`)
- Node.js 18+
- Docker & Docker Compose

### Step 1: Start Infrastructure

```bash
docker compose up -d
```

This starts:
- Redis on port 6379
- PostgreSQL on port 5432

### Step 2: Configure Backend

The backend reads environment variables with defaults. You can set these in your environment or create a `.env` file:

```env
POSTGRES_URL=jdbc:postgresql://localhost:5432/quiethelp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Step 3: Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### Step 4: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

### REST

- `POST /api/session` - Create a new anonymous session
  - Returns: `{ "sessionId": "uuid" }`

### WebSocket (STOMP)

**Connection**: `ws://localhost:8080/ws`

**Application Destinations** (send to):
- `/app/match.join` - Join match queue
  - Payload: `{ "sessionId": "uuid", "mood": "STRESS|LONELY|BURNOUT|PANIC|OTHER" }`
- `/app/chat.send` - Send chat message
  - Payload: `{ "roomId": "uuid", "senderSessionId": "uuid", "message": "text", "timestamp": "ISO8601" }`

**Topic Subscriptions** (listen to):
- `/topic/match/{sessionId}` - Receive match notifications
  - Payload: `{ "roomId": "uuid", "peerSessionId": "uuid" }`
- `/topic/chat/{roomId}` - Receive chat messages
  - Payload: `{ "roomId": "uuid", "senderSessionId": "uuid", "message": "text", "timestamp": "ISO8601" }`

## Privacy Rules

- ✅ Chat messages stored only in Redis with TTL (auto-delete)
- ✅ PostgreSQL stores only anonymous event metrics
- ✅ No user accounts or authentication
- ✅ No persistent chat history
- ❌ NO chat content in PostgreSQL

## Database Schema

### PostgreSQL (Metrics Only)

```sql
CREATE TABLE metric_events (
    event_id UUID PRIMARY KEY,
    event_type VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL,
    metadata JSONB
);
```

Event types: `SESSION_CREATED`, `MATCH_JOINED`, `MATCH_FOUND`, `CHAT_MESSAGE_SENT`

### Redis (Ephemeral)

- `queue:mood:{MOOD}` - List of session IDs waiting for match
- `room:{roomId}` - Room info (sessionId:peerSessionId)
- `session:room:{sessionId}` - Session to room mapping
- All keys have 30-minute TTL

## Development

### Backend Structure

```
backend/
├── src/main/java/com/quiethelp/backend/
│   ├── config/          # WebSocket, CORS, Redis config
│   ├── controller/       # REST + STOMP controllers
│   ├── model/            # DTOs, entities, enums
│   ├── repository/       # JPA repositories
│   └── service/          # Business logic
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   ├── lib/              # WebSocket client
│   └── App.tsx           # Main app
```

## Troubleshooting

- **Backend won't start**: Check Redis and PostgreSQL are running (`docker compose ps`)
- **WebSocket connection fails**: Verify CORS settings and frontend URL
- **No matches**: Open two browser windows/tabs to test matching

## Notes

This app is not a therapy app. It's like a tinder for frustrated students. You can match with someone like you and chat with them, and after some time those messages are gone. You don't need to login or remember your passwords. It's completely anonymous.
