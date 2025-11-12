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

## Features
- Frontend
  - Left sidebar dashboard with tabs: Routes, Compare, Banking, Pooling
  - Tailwind v4 styling, Inter font, responsive layout
  - Toasts (bottom-right), skeleton loaders, empty states
  - Dynamic filter selects:
    - Routes: vesselType, fuelType, year from `/routes/filters`
    - Banking: shipId, year from `/banking/filters`
    - Pooling: year from `/routes/filters`
  - Optimistic UI:
    - Set Baseline button updates instantly
    - Banking bank/apply previews update instantly
    - Pooling previews `cb_after` and validates rules client-side
  - Compare:
    - Capitalized headers
    - Target pill (black/white)
    - Bar chart (baseline vs routes) that resizes to available space

- Backend
  - Hexagonal ports/adapters; Express inbound HTTP; Prisma outbound Postgres
  - Routes: Get all, set baseline, comparison
  - Compliance: Compute CB and adjusted CB
  - Banking: Records, bank, apply, filters
  - Pools: Create pool with validations and greedy allocation
  - Prisma schema + seeds for five routes (one baseline)

## API Overview
- `GET /routes` — list with optional query `vesselType`, `fuelType`, `year`
- `GET /routes/filters` — `{ vesselTypes, fuelTypes, years }`
- `POST /routes/:id/baseline` — set baseline
- `GET /routes/comparison` — `{ baseline, comparisons[], target }`
- `GET /compliance/cb?shipId&year` — compute/store CB
- `GET /compliance/adjusted-cb?shipId&year` — adjusted CB (banked applied)
- `GET /banking/filters` — `{ shipIds, years }`
- `GET /banking/records?shipId&year` — bank/apply entries
- `POST /banking/bank` — body `{ shipId, year, amount }`
- `POST /banking/apply` — body `{ shipId, year, amount }`
- `POST /pools` — body `{ year, members: [{ shipId, cb_before }] }`

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

### Tailwind v4 note
This project uses Tailwind v4. PostCSS config is at `frontend/postcss.config.js` and uses `@tailwindcss/postcss` + `autoprefixer`. Global styles and CSS theme tokens live in `src/index.css`.

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

## Troubleshooting
- Postgres port in use: stop local Postgres or change docker-compose port mapping.
- Tailwind not applying: ensure `frontend/postcss.config.js` has `@tailwindcss/postcss` and restart dev server.
- CORS/API URL: set `VITE_API_URL=http://localhost:4000` in `frontend/.env` if hosting differs.

## Notes
- In conflicts between earlier chat guidance and the brief, the brief takes precedence.


