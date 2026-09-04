# 3 · AI / Agent Engineer

**Mission:** own "the brain" — turn an operational input into a correct, Silpo-matched procurement
plan with the right substitutions and human-in-the-loop exceptions. This is the wow of the demo.

**Owns:** input parsing, recipe→ingredient decomposition, net-requirement + safety-stock + forecast
logic, MCP product matching orchestration, substitution/exception generation, the agent tool loop.
**Interfaces with:** Tech Lead (AI runtime `lib/ai.ts`, MCP client, product-matching service),
Backend (persist plan/lines/exceptions), Frontend (plan shape the UI renders).

| # | Task | Est. | Depends on | Done by |
|---|------|------|-----------|---------|
| 3.1 | **Input parser**: paste/upload operational input (order list, event plan, call sheet) → structured `operational_input.parsedJson` (LLM structured output + zod). Handle free text + simple tables | 5 h | Tech 1.3 | Sep 6 |
| 3.2 | **Recipe decomposition engine**: expand `business_order`/recipes → resource requirements, unit-normalize, aggregate; support "resell = single-item recipe" | 5 h | 3.1, seed 1.4 | Sep 7 |
| 3.3 | **Net-requirement calc**: required − on-hand − incoming + safety stock (min_qty / days_coverage / service_level modes) → `procurement_line.netQty` | 3 h | 3.2 | Sep 7 |
| 3.4 | **Silpo product matching orchestration**: for each line call Tech Lead's matching service; rank candidates by fit (unit/package/price), pick default `selectedSku`, keep alternates | 4 h | 3.3, Tech 1.7 | Sep 8 |
| 3.5 | **Substitution & exception logic**: out-of-stock / no exact match / pack-size mismatch / over-buy → generate `exception` rows with options + severity (the "problems tab" idea) | 4 h | 3.4 | Sep 9 |
| 3.6 | **Agent tool loop**: wrap 3.1–3.5 as a Vercel AI SDK agent with tools (parse, decompose, match, flag); stream progress; enforce caps/timeouts from Tech 1.10 | 5 h | 3.4, 3.5 | Sep 9 |
| 3.7 | **Forecast / suggestion touch**: from purchase history + short-expiry + "ходовий товар" heuristic, suggest buy-ahead qty and bonus-earning alternates ("іншу сметану до борщу") | 4 h | 3.3, history | Sep 10 |
| 3.8 | **Cost + ROI numbers in the plan**: total estimated cost, est. time saved, repeat-delivery avoided — feed the UI badges and #2's model | 2 h | 3.4 | Sep 10 |
| 3.9 | Guardrails: price-cap sanity ("no 4600 ₴ eclair"), qty sanity vs recipe proportions (the +2 kg cabbage catch), confidence flags | 2 h | 3.6 | Sep 11 |
| 3.10 | Eval pass on the demo scenario: correctness of decomposition & matching; fix top failures; record a clean run | 3 h | all, 2.6 | Sep 12 |

**Milestones:** parse→decompose works (Sep 7) · matched plan with exceptions (Sep 9) · full agent
loop + forecast (Sep 10) · demo scenario verified (Sep 12).

**Design notes:** deterministic math (net requirements, units) in code — use the LLM for parsing,
matching judgment, substitution reasoning, and suggestions, *not* for arithmetic. Every agent action
writes an `audit_event` so the plan is explainable to judges.
