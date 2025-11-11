# Project Plan — FuelEU Maritime Compliance Platform

This plan tracks milestones, tasks, and commit checkpoints. In case of conflict between earlier chat requirements and the assignment brief, the brief takes precedence.

## Milestones

1) Repository scaffolding and documentation
- Create baseline repo with `/frontend` and `/backend`
- Add AGENT_WORKFLOW.md, README.md, REFLECTION.md
- Add plan.md (this file), .editorconfig, .gitignore
- Commit: "chore: repo scaffold with docs and configs"

2) Frontend scaffold (React + TS + Vite + Tailwind)
- Vite React TS app in `/frontend`
- Tailwind setup (config, postcss, base styles)
- Hexagonal structure: `src/core/{domain,application,ports}`, `src/adapters/{ui,infrastructure}`, `src/shared`
- Basic routing with four tabs: Routes, Compare, Banking, Pooling
- Commit: "feat(frontend): scaffold app with tailwind and hexagonal structure"

3) Backend scaffold (Express + TS + Prisma)
- Express app in `/backend`
- Hexagonal structure: `src/core/{domain,application,ports}`, `src/adapters/{inbound/http,outbound/postgres}`, `src/infrastructure/{db,server}`, `src/shared`
- Prisma init + schema per brief
- Commit: "feat(backend): scaffold express server with hexagonal layout"

4) Database and Prisma
- docker-compose with Postgres
- `.env` and `.env.example` for `DATABASE_URL`
- Prisma migrations for tables: routes, ship_compliance, bank_entries, pools, pool_members
- Seed five routes; one baseline = true
- Commit: "chore(db): postgres compose, prisma migrate + seed"

5) Backend endpoints
- Routes: GET /routes, POST /routes/:id/baseline, GET /routes/comparison
- Compliance: GET /compliance/cb?shipId&year, GET /compliance/adjusted-cb?shipId&year
- Banking: GET /banking/records?shipId&year, POST /banking/bank, POST /banking/apply
- Pools: POST /pools with allocation rules
- Commit: "feat(api): implement routes, compliance, banking, pooling"

6) Frontend integration
- Infrastructure API client for endpoints
- UI tables and forms per tab; compare chart
- Disable actions as specified; error handling
- Commit: "feat(frontend): connect APIs and build dashboard tabs"

7) Testing
- Backend unit tests: ComputeComparison, ComputeCB, BankSurplus, ApplyBanked, CreatePool
- Integration tests via Supertest
- Frontend unit tests for core use-cases and components
- Commit: "test: add unit and integration tests"

8) Tooling and CI
- ESLint/Prettier shared configs
- Husky pre-commit hooks (lint, type-check)
- GitHub Actions: install, build, lint, test for both apps
- Commit: "chore(ci): add GitHub Actions and tooling"

9) Documentation polish
- README: overview, architecture, setup/run, tests, screenshots or examples
- AGENT_WORKFLOW.md: prompts, outputs, validation, observations
- REFLECTION.md: lessons and improvements
- Commit: "docs: finalize documentation"

## Tracking
- Use commit messages at each milestone and significant step.
- Keep TypeScript strict, clear naming, and hexagonal separation as non-negotiables.
- Prefer small, incremental commits aligning with the evaluation checklist.


