# QuietHelp

**Anonymous peer support. No logins. No pressure.**

A real-time anonymous peer support platform that connects people based on their mood. Get matched one-on-one with someone who understands, or join the global chat room.

## What You'll Need

- Java 17+
- Node.js 18+ and npm
- Docker (for the database)

## Quick Start

### 1. Start the database
cd backend
docker-compose up -d

This starts PostgreSQL and Redis in the background.

### 2. Run the backend

cd backend
./mvnw spring-boot:run

Backend runs on `http://localhost:8080`

### 3. Run the frontend
In a new terminal:

cd frontend
npm install
npm run dev

Frontend runs on `http://localhost:3000`
That's it! Open `http://localhost:3000` in your browser and you're ready to go.

## What's Inside
- **Backend**: Spring Boot (Java) with PostgreSQL and Redis
- **Frontend**: Next.js with React and TypeScript

The app uses WebSockets for real-time chat, so messages appear instantly without refreshing.

**Created in Hattiesburg, MS.**
