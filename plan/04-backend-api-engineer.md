# 4 · Backend / API Engineer

**Mission:** own "the plumbing" — the Next.js server layer, business logic, persistence, and the
contracts the frontend and agent depend on. Turn the schema into working CRUD + workflows.

**Owns:** route handlers / server actions, DB queries (Drizzle), onboarding + import endpoints,
plan/approval workflow, project/team + shared history, auth-lite/session.
**Interfaces with:** Frontend (API contract), AI Engineer (persist plan/lines/exceptions), Tech Lead
(DB conventions, MCP order execution).

| # | Task | Est. | Depends on | Done by |
|---|------|------|-----------|---------|
| 4.1 | **API contract** doc (endpoints/actions, request/response zod types) for onboarding, import, plan, approval, project — freeze with Frontend by Sep 6 checkpoint | 3 h | Tech 1.4 | Sep 5 |
| 4.2 | Lightweight **auth/session + project membership** (business ↔ users). Keep it simple — no heavy IAM | 3 h | 4.1 | Sep 6 |
| 4.3 | **Onboarding CRUD**: business, location, recipes + recipe items, resources, inventory items, safety-stock policies | 5 h | 4.1 | Sep 6 |
| 4.4 | **Import endpoint**: accept pasted text / file upload → store `operational_input` → trigger AI parse (3.1); return parsed result | 3 h | 4.3, AI 3.1 | Sep 7 |
| 4.5 | **Procurement plan API**: create plan (invoke agent), read plan with lines+candidates+exceptions, edit line (swap SKU, change qty), resolve exception, recompute totals | 6 h | AI 3.6 | Sep 8 |
| 4.6 | **Approval workflow**: submit for approval → approve/reject → on approve, hand to Tech Lead's MCP order execution (1.8); write `approval` + `audit_event` | 3 h | 4.5, Tech 1.8 | Sep 9 |
| 4.7 | **Team "needs" + shared project**: members add needs → merge into next plan; shared **purchase history** + basic **stats** endpoints (spend over time, top items, spoilage/over-buy flags) | 5 h | 4.5 | Sep 10 |
| 4.8 | Wire **forecast/suggestions** (AI 3.7) into plan/dashboard responses | 2 h | AI 3.7 | Sep 10 |
| 4.9 | Input validation, error envelopes, pagination, and empty-state seeds so the UI never renders blank/broken | 3 h | 4.5 | Sep 11 |
| 4.10 | Bug bash support: fix API issues QA finds; keep contracts stable during freeze | ~4 h | QA | Sep 12–13 |

**Milestones:** contract frozen (Sep 5) · onboarding + import live (Sep 7) · plan API end-to-end (Sep 8)
· approval + team/history/stats (Sep 10).

**Notes:** all money as `numeric`, all times tz-aware (schema already does this). Every state change
(plan edit, approval, order) writes `audit_event` — it powers both the explainability story and stats.
Coordinate the plan JSON shape with AI #3 and Frontend #5 *once*, then keep it stable.
