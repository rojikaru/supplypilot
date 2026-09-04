# SupplyPilot — Hackathon Delivery Plan (Sep 4 → Sep 14, 2026)

**Event:** Silpo AI Factory hackathon · **Submission deadline:** Sep 14
**Repo:** `~/supplyagent` (Next.js + Bun + Postgres/Drizzle + Vercel AI SDK + Tailwind v4 + shadcn)
**Deploy:** Vercel (web) / Railway (current preview) · OpenRouter key + vast.ai GPU budget available

## The product in one paragraph

A business imports its usual operational input — a confectionery order, an event plan, a catering
call sheet, or a plain list of goods to resell. **SupplyPilot** decomposes it into required
resources via *recipes*, subtracts on-hand inventory and safety stock, forecasts what will be
needed, and builds a **procurement plan**. Through the official **Silpo MCP server** it matches
each line to real products, checks availability/delivery, proposes substitutions, and surfaces the
decisions that genuinely need a human. The user edits/approves, and the order is placed to their
favourite address. Teams share one project: each colleague adds what they need, and history +
stats help everyone buy smarter.

**Why Silpo wins from this (judging angle — keep hammering ROI):** the agent both *buys from
Silpo* and *forwards forecasted demand to Silpo* — useful for demand planning under wartime
logistics. It brings new B2B customers (catering, small kitchens, shops) that today go to Metro/ATB,
using Silpo's edge: кулінарія + assortment + substitutions.

## What already exists (do NOT rebuild)
- ✅ Full DB schema + migration — `db/schema.ts`
- ✅ Zod schemas for every Silpo MCP tool — `mcp-schemas/*`
- ✅ App scaffold, tooling (`bun check`), deploy pipeline
- ⛔ Missing: import/parse pipeline, recipe→ingredient engine, planning/forecast logic, MCP product
  matching, the agent loop, and the entire UI. `origin/frontend` = UI starting branch.

## MVP scope (must demo on Sep 14)
1. **Onboarding**: create business/project → add recipes (or single resell items) → upload/enter
   current stock & docs.
2. **Import an operational input** (paste text or upload) → parsed to structured order.
3. **Agent builds a procurement plan**: decompose → net requirements → Silpo product matching →
   substitutions/exceptions.
4. **Plan review UI**: editable lines, swap SKUs, resolve exceptions, see estimated cost + ROI.
5. **Approve → place cart/order via MCP** (or a safe mock if live ordering is gated).
6. **Shared project**: team members add needs; shared purchase history + basic stats.
7. **A forecast/suggestion touch** ("buy ~X, ходовий товар / короткий термін").

**Out of scope (backlog):** multi-warehouse, real supplier price feeds beyond Silpo, barcode scan,
full accounting export, offline sync, deep behavioural profiling.

## Team & role files (7)
| # | Role | Owner (from chat) | File |
|---|------|-------------------|------|
| 1 | Tech Lead / Infra & MCP-Agent runtime | You (repo owner) | [01-tech-lead.md](01-tech-lead.md) |
| 2 | Product / Research Lead (no-code) | the "не по коду" member | [02-product-research-lead.md](02-product-research-lead.md) |
| 3 | AI / Agent Engineer | dev | [03-ai-agent-engineer.md](03-ai-agent-engineer.md) |
| 4 | Backend / API Engineer | dev | [04-backend-api-engineer.md](04-backend-api-engineer.md) |
| 5 | Frontend Engineer | dev | [05-frontend-engineer.md](05-frontend-engineer.md) |
| 6 | UX/UI Designer (can also code) | Юлія | [06-ux-ui-designer.md](06-ux-ui-designer.md) |
| 7 | Marketing / Video-Pitch & Brand | Adobe/pitch member | [07-marketing-video-pitch.md](07-marketing-video-pitch.md) |

➡️ Combined day-by-day Gantt & dependencies: **[08-timeline.md](08-timeline.md)**

## Working agreement
- **Discord RD-Lab channel** is the always-on room. Daily short sync + EOD demo (clip/screenshot).
- **Branch per feature** off `main`; PRs must pass `bun run check` (types + lint + format).
- **Two hard checkpoints:** **Sep 6 EOD** — data model + API contracts + wireframes frozen;
  **Sep 11 EOD** — feature freeze, only bugfix/polish after.
- **Golden rule from the team:** don't wait to be told — pick a task, argue with numbers, keep the
  scope cuttable. We have the biggest team on the field; convert that into the sharpest demo.
- Time estimates below assume students working **evenings + full weekends** (~4–6 h/weekday,
  ~8–10 h weekend day). Cut ruthlessly if reality diverges by Sep 8.
