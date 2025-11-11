# AI Agent Workflow Log

## Agents Used
- Cursor Agent (primary)

## Prompts & Outputs
- Example 1: Scaffold repo with hexagonal architecture for frontend/backed. Output: generated plan.md and baseline docs.
- Example 2: Create Prisma schema from brief (tables: routes, ship_compliance, bank_entries, pools, pool_members). Output: schema.prisma and seed script.

## Validation / Corrections
- Reviewed schema against brief tables and relationships; adjusted field names and indexes.
- Verified endpoints match brief; added validation for banking/pooling rules.

## Observations
- Agent accelerated scaffolding, config wiring, and boilerplate.
- Requires careful review for domain rules edge-cases (banking/pooling constraints).

## Best Practices Followed
- Used hexagonal layout to isolate domain from frameworks.
- Kept TypeScript strict and naming clear.
- Incremental commits at each milestone.


