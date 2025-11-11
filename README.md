# FuelEU Maritime — Compliance Platform (Assignment)

This repository implements a minimal Fuel EU Maritime compliance module per the assignment brief, using a hexagonal architecture across frontend and backend.

## Tech Stack
- Frontend: React + TypeScript + TailwindCSS (Vite)
- Backend: Node.js + TypeScript + Express + Prisma (PostgreSQL)
- Architecture: Hexagonal (Ports & Adapters / Clean Architecture)

## Repository Structure
```
frontend/
backend/
plan.md
README.md
AGENT_WORKFLOW.md
REFLECTION.md
```

Each app uses a hexagonal layout:
```
src/
  core/
    domain/
    application/
    ports/
  adapters/
    ui/                # frontend only
    infrastructure/
      # frontend: api clients
      # backend: inbound/http and outbound/postgres
  infrastructure/      # backend only
  shared/
```

## Requirements Coverage
See `plan.md` for milestone tracking and `AGENT_WORKFLOW.md` for AI usage.

## Setup
Prerequisites:
- Node.js 20+
- Docker + Docker Compose

### Environment
- Backend requires `backend/.env`:
  ```bash
  DATABASE_URL="postgresql://fueluser:fuelpass@localhost:5432/fueleu?schema=public"
  PORT=4000
  ```
- Frontend can point to backend via `VITE_API_URL` (optional). Defaults to `http://localhost:4000`:
  ```bash
  echo "VITE_API_URL=http://localhost:4000" > frontend/.env
  ```

### Backend
1. Create env file `backend/.env` with:
   ```bash
   DATABASE_URL="postgresql://fueluser:fuelpass@localhost:5432/fueleu?schema=public"
   PORT=4000
   ```
2. Start Postgres:
   ```bash
   docker-compose -f backend/docker-compose.yml up -d
   ```
3. Install, generate client, migrate, and seed:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npm run prisma:migrate
   npm run prisma:seed
   npm run dev
   ```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Scripts (summary)
- Backend:
  - `npm run prisma:migrate` – run migrations
  - `npm run prisma:seed` – seed database
  - `npm run dev` – start dev server
  - `npm run build` – build TypeScript
  - `npm run test` – run tests
- Frontend:
  - `npm run dev` – start Vite dev server
  - `npm run build` – build app
  - `npm run test` – run tests

## Testing
- Backend (Vitest + Supertest):
  ```bash
  cd backend
  npm test
  ```
  Integration tests mock Prisma to avoid a live DB; unit tests cover CB math.
- Frontend: placeholder (can be added with Vitest/RTL as needed).

## Notes
- In conflicts between earlier chat guidance and the brief, the brief takes precedence.


