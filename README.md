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

### Backend
1. Copy env:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Start Postgres:
   ```bash
   docker compose -f backend/docker-compose.yml up -d
   ```
3. Install and migrate:
   ```bash
   cd backend
   npm install
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
  - `npm run dev` – start dev server
  - `npm run build` – build TypeScript
  - `npm run test` – run tests
  - `npm run prisma:migrate` – run migrations
  - `npm run prisma:seed` – seed database
- Frontend:
  - `npm run dev` – start Vite dev server
  - `npm run build` – build app
  - `npm run test` – run tests

## Testing
- Backend: unit (core use-cases), integration (HTTP via Supertest)
- Frontend: unit (use-cases/components)

## Notes
- In conflicts between earlier chat guidance and the brief, the brief takes precedence.


