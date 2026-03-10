QuietHelp

Anonymous peer support. No logins. No pressure.

QuietHelp is a real-time anonymous peer support platform that connects people based on their mood. Users can get matched one-on-one with someone who understands or join a global chat room.

The goal is to make it easier for people to talk without the pressure of creating accounts or sharing personal information.

Tech Stack
Frontend
- Next.js
- React
- TypeScript

Backend
- Spring Boot (Java)
- WebSockets for real-time messaging

Infrastructure
- PostgreSQL
- Redis
- Docker

What You'll Need
Before running the project locally, make sure you have:
- Java 17+
- Node.js 18+ and npm
- Docker (used for PostgreSQL and Redis)

Quick Start
1. Start the database
cd backend
docker-compose up -d

This starts PostgreSQL and Redis in the background.

2. Run the backend
cd backend
./mvnw spring-boot:run

Backend will run on:
http://localhost:8080

3. Run the frontend
Open a new terminal:

cd frontend
npm install
npm run dev

Frontend runs on:
http://localhost:3000

Now open http://localhost:3000 in your browser.

Features
- Anonymous peer matching based on mood
- One-on-one real-time chat
- Global chat room
- WebSocket messaging for instant updates
- No login required

Project Structure
quiethelp/
  backend/      Spring Boot API and WebSocket server
  frontend/     Next.js application
  docker/       Database configuration

Why I Built This
QuietHelp started as a way to experiment with real-time systems and anonymous communication. The goal was to build a simple platform where people could talk openly without creating accounts or sharing personal details.

Created in Hattiesburg, MS