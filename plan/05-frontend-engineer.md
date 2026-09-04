# 5 · Frontend Engineer

**Mission:** build the UI that makes the agent legible and the demo delightful. The team's explicit
fear: "don't become 'go to the site, pick from a dropdown'." Make it feel like an assistant, not a form.

**Owns:** Next.js app UI (App Router), shadcn components, onboarding flow, dashboard, plan editor,
approvals, project/team, history/stats views. Pair tightly with the Designer (#6).
**Interfaces with:** Designer (wireframes/design system), Backend (API contract), AI Engineer (plan shape,
streaming agent progress), Tech Lead (shadcn baseline on the reconciled `frontend` branch).

| # | Task | Est. | Depends on | Done by |
|---|------|------|-----------|---------|
| 5.1 | App shell + navigation + shadcn/Tailwind v4 theme (Silpo-flavoured), layout, toasts, loading/empty states | 4 h | Tech 1.6, Designer 6.2 | Sep 6 |
| 5.2 | **Onboarding wizard**: create business/project → add recipes (& single resell items) → enter/upload stock & docs. Frictionless, notebook-like quick add | 6 h | 5.1, API 4.3, Designer | Sep 7 |
| 5.3 | **Import screen**: paste text / upload file → show parsed order, let user correct → "Build plan" | 3 h | API 4.4 | Sep 7 |
| 5.4 | **Agent progress view**: stream the agent's steps (parsing → decomposing → matching → flagging) so it *feels* autonomous | 3 h | AI 3.6 | Sep 8 |
| 5.5 | **Plan editor (hero screen)**: line list with required/stock/net, matched Silpo product + alternates, price, total & ROI badges; swap SKU, edit qty, inline | 7 h | API 4.5, Designer | Sep 9 |
| 5.6 | **Exceptions panel** ("problems tab" feel): grouped by severity, one-click resolve with options; the summary-of-decisions view | 4 h | 5.5, AI 3.5 | Sep 9 |
| 5.7 | **Approve & order** flow: review → approve → order confirmation (live or mock); success state with savings | 3 h | API 4.6 | Sep 10 |
| 5.8 | **Project / team view**: members' needs, shared **purchase history** + **stats** charts (spend, top items, over-buy/spoilage flags) | 5 h | API 4.7 | Sep 10 |
| 5.9 | **Suggestions/forecast surfacing**: subtle "buy ~X ahead / ходовий / короткий термін / bonus alternate" hints in plan + dashboard | 3 h | AI 3.7, API 4.8 | Sep 11 |
| 5.10 | Responsive polish (phone browser), mascot/empty-state art hookup, micro-interactions, accessibility pass | 4 h | 6.x | Sep 12 |
| 5.11 | Bug bash fixes + demo-path polish with real seed data | ~4 h | QA, 2.6 | Sep 12–13 |

**Milestones:** shell + onboarding (Sep 7) · plan editor + exceptions (Sep 9) · approve/order + team/stats
(Sep 10) · polished demo path (Sep 13).

**Notes:** the **plan editor** is where you win or lose — spend your best hours there. Use optimistic UI
+ streaming to sell autonomy. Keep the JSON contract with #3/#4 fixed after Sep 8; render defensively
against partial/streaming data.
