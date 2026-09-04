# 8 · Combined Timeline & Dependencies (Sep 4 → Sep 14)

Legend: **TL**=Tech Lead · **PR**=Product/Research · **AI**=AI/Agent · **BE**=Backend · **FE**=Frontend
· **UX**=Designer · **MK**=Marketing

## Day-by-day

| Date | TL (1) | PR (2) | AI (3) | BE (4) | FE (5) | UX (6) | MK (7) |
|------|--------|--------|--------|--------|--------|--------|--------|
| **Sep 4 Thu** — kickoff | env/secrets (1.1) | interview table (2.1) | read schema/MCP; plan parser | read schema | branch setup | — | — |
| **Sep 5 Fri** | MCP smoke-test + model + seed + CI + frontend rebase (1.2–1.6) | +interviews, use case (2.2–2.3) | prep parser | **API contract (4.1)** | wait on shell | flows + start design system (6.1) | — |
| **Sep 6 Sat** ⭐ | (buffer/review) | **cut backlog → scope freeze (2.4)** | **parser (3.1)** | auth + onboarding CRUD (4.2–4.3) | app shell (5.1) | **design system + all wireframes (6.2–6.3)** | brand+mascot (7.1) |
| **Sep 7 Sun** | **product matching (1.7)** | — | **decompose + net req (3.2–3.3)** | import endpoint (4.4) | onboarding + import UI (5.2–5.3) | — | — |
| **Sep 8 Mon** ⭐ | — | **ROI model (2.5)** + demo data (2.6) | **Silpo matching orch (3.4)** | **plan API (4.5)** | agent progress (5.4) | hi-fi hero screens (6.4) | storyboard prep |
| **Sep 9 Tue** | approval→order/mock (1.8) | originality note (2.9) | **exceptions + agent loop (3.5–3.6)** | approval workflow (4.6) | **plan editor + exceptions (5.5–5.6)** | mascot/brand (6.5) | **storyboard (7.2)** |
| **Sep 10 Wed** | — | **pitch script (2.7)** + rubric (2.8) | forecast + ROI numbers (3.7–3.8) | team/history/stats (4.7–4.8) | approve/order + team/stats (5.7–5.8) | remaining hi-fi (6.6) | interview clips (7.4) |
| **Sep 11 Thu** 🧊 FEATURE FREEZE | perf/cost caps (1.10) | — | guardrails (3.9) | validation/empty states (4.9) | suggestions surfacing (5.9) | pair polish (6.7) | **animation assets (7.3)** |
| **Sep 12 Fri** | demo hardening start | — | eval on demo scenario (3.10) | bugfix (4.10) | polish (5.10) + bugfix | design QA (6.8) | **demo capture (7.5)** + deck (7.7) |
| **Sep 13 Sat** | **demo path bulletproof (1.11)** | **dry-run + Q&A (2.10)** | (support) | bugfix (4.10) | demo polish (5.11) | demo visuals (6.9) | **final video (7.6)** |
| **Sep 14 Sun** 🏁 | live support | **submit logistics (2.11)** | live support | live support | live support | on call | **submit assets (7.8)** |

⭐ = checkpoint day · 🧊 = feature freeze · 🏁 = deadline

## Two hard checkpoints
- **Sep 6 EOD** — *Contracts frozen:* data model (done) + **API contract (4.1)** + **wireframes (6.3)**
  + **MVP scope (2.4)**. Nothing structural changes after this without lead sign-off.
- **Sep 11 EOD** — *Feature freeze:* a working happy path exists (import → plan → approve → order).
  Sep 12–14 is bugfix, polish, demo capture, pitch only.

## Critical path (the chain that gates the demo)
```
env/MCP (1.1–1.2) → parser (3.1) → decompose+netreq (3.2–3.3) → product matching (1.7→3.4)
→ plan API (4.5) → plan editor UI (5.5) → approve→order (4.6/1.8/5.7)
→ working happy path (Sep 11) → demo capture (7.5) → final video (7.6) → submit (7.8)
```
Anything on this chain slipping delays the video. Protect it: Tech Lead + AI + Backend + one Frontend
prioritise the chain over side features; #6/#7 pre-build everything that doesn't need the live app.

## Key cross-dependencies
- **Everyone → 4.1 API contract + 6.3 wireframes** (Sep 6). Freeze once, then build in parallel.
- **AI 3.4 needs TL 1.7** (product matching service).
- **FE 5.5 needs BE 4.5 + AI plan shape**; agree the plan JSON once on Sep 8.
- **MK 7.5/7.6 need a working happy path by Sep 11** and **PR 2.5 ROI numbers** for on-screen figures.
- **Live ordering decision (TL, by Sep 7):** if Silpo ordering is sandboxed, ship **mock mode** so the
  demo is deterministic.

## Descope ladder (drop top-down if behind on Sep 8/10)
1. Behavioural profiling / psychological patterns → cut (backlog).
2. Advanced stats charts → single summary card.
3. Forecast/suggestions (3.7) → static heuristic, no history dependency.
4. Live MCP ordering → mock mode only.
5. Team "needs" merge (4.7) → single-user mode (solo-founder businesses still demo fine).

**Never cut:** import → agent plan → Silpo product matching → editable plan → approve. That's the story.
