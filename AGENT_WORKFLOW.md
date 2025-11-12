# AI Agent Workflow Log

## Agents Used
- Cursor Agent (primary)
- GitHub Copilot (inline completions)

## Prompts & Outputs
- Scaffolding:
  - Prompt: “Set up repo with `frontend` (React+Vite+TS+Tailwind) and `backend` (Express+TS+Prisma+Postgres); hexagonal folders; add plan.md, README, AGENT_WORKFLOW, REFLECTION; commit stepwise.”
  - Output: Vite app, Express server, prisma schema, seeds, docker compose; docs files.
- Prisma modeling:
  - Prompt: “Create prisma schema with tables routes, ship_compliance, bank_entries, pools, pool_members; add unique(shipId, year) for ship_compliance.”
  - Output: `prisma/schema.prisma`, migrations, `prisma/seed.ts`.
- Backend endpoints:
  - Prompt: “Implement routes endpoints, comparison target 89.3368; compliance CB formula; banking endpoints with validation; pooling greedy allocation with rules.”
  - Output: Express routers for `/routes`, `/compliance`, `/banking`, `/pools`.
- Frontend wiring:
  - Prompt: “Add tabs, Tailwind v4, toast provider, skeletons, dynamic filters, optimistic UI; comparison chart; sidebar with icons.”
  - Output: Pages for Routes/Compare/Banking/Pooling, shadcn-style ui primitives, toast, skeletons, chart.
- Full prompt log: see [`cursor_project_setup_and_planning_instr.md`](./cursor_project_setup_and_planning_instr.md) for the exact prompts used during development.

## Validation / Corrections
- Fixed prisma upsert by adding `@@unique([shipId, year])` in `ship_compliance`.
- Resolved Tailwind v4 PostCSS error by switching to `@tailwindcss/postcss` plugin.
- Fixed React hook import errors (`useEffect`, `useRef`) on Banking/Pooling/Compare pages.
- Improved comparison chart readability: centered groups, grid/ticks, responsive sizing; removed value labels per UX feedback.
- Adjusted compare target display to single-line black/white pill.
- Implemented client-side Pooling validations and disabled button until valid.

## Observations
- Agent accelerated scaffolding, config wiring, and boilerplate.
- Requires careful review for domain rules edge-cases (banking/pooling constraints).
- UI polish benefits from iterative prompts and visual checks (colors, spacing, typography).
- Optimistic UI paths need careful error reversion to avoid stale UI states.

## Best Practices Followed
- Used hexagonal layout to isolate domain from frameworks.
- Kept TypeScript strict and naming clear.
- Incremental commits at each milestone.
- Tests: Vitest unit for CB, Supertest integration for routes (prisma mocked).
- CI: GitHub Actions for install/lint/build/test on both apps.

## Notable Commands / Snippets
- Tailwind v4 PostCSS:
  ```js
  // frontend/postcss.config.js
  import tailwind from '@tailwindcss/postcss';
  import autoprefixer from 'autoprefixer';
  export default { plugins: [tailwind(), autoprefixer()] };
  ```
- Prisma dev flow:
  ```bash
  npx prisma generate
  npm run prisma:migrate
  npm run prisma:seed
  ```

## Follow-ups / TODOs (if time)
- Add frontend unit tests (React Testing Library) for table sorting and optimistic actions.
- Add chart tooltips and line overlay for target.
- Containerize both apps and add a single docker-compose for full stack.


