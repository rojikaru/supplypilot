# 1 · Tech Lead — Infra, MCP & Agent Runtime

**Mission:** keep the repo shippable, own the Silpo MCP connection + AI runtime, and unblock everyone.
You already built the schema and MCP zod schemas — now make them run end-to-end.

**Owns:** deployment, env/secrets, MCP client, AI SDK runtime, DB migrations, code review, CI check.
**Interfaces with:** everyone (you review PRs), AI Engineer (shared agent runtime), Backend (DB access).

| # | Task | Est. | Depends on | Done by |
|---|------|------|-----------|---------|
| 1.1 | Freeze env + secrets: OpenRouter key, Silpo MCP endpoint/creds, DB URL (dev+prod), Vercel/Railway wiring; document in `.env.example` | 2 h | — | Sep 4 |
| 1.2 | Stand up the **Silpo MCP client** via `@ai-sdk/mcp` + `@modelcontextprotocol/sdk`; smoke-test each tool (catalog/products/cart/orders/location) against the `mcp-schemas/*` zod types; capture sample responses to `fixtures/` | 5 h | 1.1 | Sep 5 |
| 1.3 | Pick + wire the model via OpenRouter (tool-calling capable); shared `lib/ai.ts` runtime + a thin `agent()` helper the AI Engineer builds on | 3 h | 1.2 | Sep 5 |
| 1.4 | DB access layer conventions + seed script (demo business, recipes, inventory, product candidates) so UI/agent devs have data on day one | 3 h | — | Sep 5 |
| 1.5 | CI: GitHub Action running `bun run check` on PRs; branch protection on `main` | 1.5 h | — | Sep 5 |
| 1.6 | Reconcile `origin/frontend` with `main` (it predates `mcp-schemas`) — rebase/merge so the designer/frontend start clean; set up shadcn baseline | 2 h | — | Sep 5 |
| 1.7 | **MCP product-matching service**: given a resource + qty, query Silpo catalog/products, return ranked candidates → persist `product_candidate` rows | 5 h | 1.2, 1.4 | Sep 7 |
| 1.8 | **Cart/order execution** via MCP on plan approval, behind a feature flag; safe **mock mode** if live ordering is gated (judges must see it work either way) | 4 h | 1.7, Backend 4.5 | Sep 9 |
| 1.9 | Ongoing: PR review, merge conflicts, keep deploy green; env parity dev↔prod | ~1.5 h/day | — | daily |
| 1.10 | Perf/cost guardrails on the agent: token/tool-call limits, timeouts, the "eclair за 4600" price-cap sanity check | 2 h | 3.x | Sep 11 |
| 1.11 | Demo hardening: seeded prod data, fallback fixtures if MCP is flaky live, rehearse the happy path | 3 h | all | Sep 13 |

**Milestones:** MCP smoke-tested & model wired (Sep 5) · product matching persists candidates (Sep 7)
· approval→order works or mocks cleanly (Sep 9) · demo path bulletproof (Sep 13).

**Risks you own:** MCP auth/rate limits (mitigate with cached fixtures), live-ordering being sandboxed
(mock mode), model cost blowups (caps in 1.10). Decide by **Sep 7** whether live ordering is feasible.
