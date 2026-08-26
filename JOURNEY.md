# The Journey — how Ministry Map got here, and why

This is the design history behind the code: every major decision, what we tried first, what got
rejected, and the reasoning. When a change request seems to contradict something in the app,
check here — the app is full of choices that *look* arbitrary but aren't.

## 1. It started as a report — and the report taught us the product

The project began with a real artifact: the **"Frydlant youth group Ministry Maps" Google Sheet**
(Katka & Boža's group, 30 real students, 2023 data — ages, believer status, tenure, and placement
in JV's older 4-stage language: Evangelism / Growth / Ministry Training / Leadership L1–L4).
We built a static HTML assessment of it. The analysis found the patterns that now drive the whole
product's question engine:

- **The leadership bottleneck** — 6 leadership-ready people, only 1 being developed (L2), L1/L3/L4
  empty. Everything ran on two leaders. "The pipeline ends one person deep."
- **The milk logjam** — 8 of 13 growing believers stuck at "milk," with only a 2×/month rhythm to
  feed them. The fix pairs with the bottleneck: route milk believers to the ready leaders (which IS
  L1 apprenticeship).
- **Event-shaped evangelism** — camp reached 2× the group's size yearly, but there was no regular
  environment to land in, and the "Repent & Believe" column had one person and zero programs.
- **Drifted believers** — 5 believers assessed as Religious/Opposed (Kača: 4 years in, now
  "opposed"). They need re-engagement, not outreach: a different list from non-believers.
- **Tenure vs. position** — the sheet's "years in group" column crossed with stage exposed who had
  stalled (Jindra: 5 years, still milk) vs. who moved fast (Michal: Ministry Training in 1 year).
  Key caveat we always keep: a single snapshot can't show movement — that insight is what demanded
  an app with a check-in log.

## 2. The five challenges won over the four stages

Mel's Ministry Mapping training deck (Jan 2026) places people AND programs in the same five
columns — Jesus's own invitations: **Come & See → Repent & Believe → Follow Me → Fish for
People → I Am Sending You.** We adopted that as the canonical model (the sheet's 4-stage language
maps onto it; the sheet had no explicit "Repent & Believe" bucket, which is exactly why that gap
had been invisible). The training's closing reflection questions ("What do I see? What is our map
saying about our investment? What's one simple next step? Who can we teach this to?") became the
team-discussion feature.

## 3. "This is a boring report" — the shepherd reframe

Mel's pivotal critique: the assessment read like a board report, but the reader is a shepherd.
The rule that came out of it governs everything: **names before numbers.** "62% at milk" became
"Jindra has waited five years for someone to walk beside him." Findings became "Every one of the
30 is waiting for something" — four cards that place every name under what they're waiting for
(ready-to-be-asked / waiting for someone to walk beside them / drifting-waiting-to-be-noticed /
searching-waiting-to-see-the-real-thing), each ending in one concrete personal ask. A second
critique — "too many raw graphs up front" — set the layout law: **synthesis first, evidence one
click deeper** (collapsible detail sections).

## 4. Visual language: rejected and chosen

- **Rejected: emoji zone tiles** ("cheap, not thought through, goofy icons"). Tested three
  replacements; Mel chose **Option C — one continuous road with milestone dots and Jesus's actual
  words as captions** ("Come and you will see" … "As the Father has sent me, I am sending you").
  The theology carries the design. That road is now the brand mark AND the interface.
- **The cake** (Mel's idea): stages as stacked layers built from sub-stages, bottom-up. We tried a
  stylized taper (wide base → narrow top); Mel rejected it — **layer width must equal people**, so
  the group's true shape is visible (Frýdlant bulges at Growth). Empty leadership rungs render as
  dashed ghosts — "the missing candles on top." Lives in the detail section.
- **Colors**: a single deepening-blue ordinal ramp (#86b6ef → #104281), CVD-validated. One hue
  because the five zones are one ordered journey, not five categories.

## 5. Checkboxes → the journey slider (Mel's idea, the product's signature)

Students aren't in buckets; they're at a **continuous 0–100 position on the road** (zones are
bands: 0-24 / 25-49 / 50-74 / 75-94 / 95+). Why it won:

- **The in-between is where ministry happens.** A dot pressing against a milestone is an
  instruction — each milestone has a verb (nearing R&B → "talk & pray with them about believing";
  FM → "invite them into the habits of a disciple"; Fish → "give them someone to serve"; Send →
  "prepare to send them out"). This produces the "Lean in" coach questions, impossible with buckets.
- **Micro-movement keeps leaders coming back** — growth within a zone is visible progress.
- **Theological guardrail**: conversion is a moment, not a gradient. *Approaching* Repent & Believe
  is continuous; *crossing* it is a confirmed event — the app asks "Has X truly repented and
  believed?" before recording it. Never remove this.
- **Reliability**: the dashed ghost dot shows last check-in's position, so the leader answers
  "has she moved since January?" (relative judgment — reliable) not "where is she on 0–100"
  (absolute — noisy).

## 6. From report to practice: the app

Mel's real vision was never a report: it's a **self-assessment youth leaders across 16 countries
take themselves, anytime, that keeps a log and shows movement** — with AI asking good questions.
Structure: onboarding (welcome road → group → people → heart box → reveal) flowing into
Home / Check-in / Movement / Coach. Decisions along the way:

- **The heart box** (Mel's idea, treat as sacred): one free-text box — "Where are you struggling?
  Who's been hard?" It's the qualitative half of the assessment, it's pastoral (writing it is
  itself a debrief), over time it's a journal the coach can quote back ("In September you wrote…"),
  and it's the raw material that makes AI coach questions personal. Asked at onboarding AND at
  every check-in. **Privacy is structural: it feeds only that leader's own coach.**
- **The reveal moment**: after the heart box, "Here they are — your 30." Names on the journey
  before any analysis. Emotional beat, keep it.
- **One app, not many files**: onboarding, map, and dashboard-for-leaders merged after Mel called
  out the confusion of parallel prototypes ("why are there two things going here?").
- **CSV/Excel import**: leaders have rosters; nobody types 30 names. Parser handles European
  semicolon CSVs, quoted names with commas, name-column detection in several languages, and both
  commas and newlines in the paste box (an early bug: a comma-separated line became one person).
- **Check-in ergonomics**: "Stopped coming?" is an explicit labeled button (an earlier 👋 icon sat
  next to other text and invited accidental taps); guidance text sits centered under each slider.
- **Live vs. saved**: moving a slider updates Today immediately (a student "disappearing" after an
  edit was a real reported confusion) — but history only records deliberate saves, marked by an
  unsaved-changes banner. If every drag wrote history, Movement would be noise. Both halves matter.

## 7. The curated home page

A leader's landing page is **curated, never comprehensive**: team (photos eventually), upcoming
events, ONE map summary strip, and "Where to put your time this week" — at most 3 focus items
drawn from the map (celebrate X / go find Y / pray with Z toward a milestone), each with its
"because." The discipline: the home page never shows raw data, only what the data means for this
week. Volunteer leaders have little time; the app's job is aiming it.

## 8. Trust architecture (the adoption make-or-break)

If leaders think JV is grading them, they paint rosy maps and the tool dies. So: the **"not a
report card" promise is on the first screen**; heart notes never aggregate; and the JV dashboard
(`/dashboard.html`) is built on **zones-never-names** — the `/api/aggregate` endpoint computes
per-record transition durations server-side, then discards identities; only counts and medians
leave. The dashboard's headline metric — **median months between milestone crossings** ("how long
does discipleship actually take?") — is a number nobody has ever had for a whole movement, and it
requires zero personal tracking. Country rows should gate at 3+ groups so no group is identifiable.

- **Group codes → accounts**: codes (RIVER-4821) were v0 scaffolding. Mel's call: real sign-in.
  Design agreed: email+password (PBKDF2 in the Leaders table, JWT from the Netlify function),
  codes demoted to co-leader invites, Roles (Leader / JV Staff / Admin) for permission tiers.
  Accounts also make heart notes per-person (Katka's reflections are hers, not the group's).

## 9. Languages

UI chrome is dictionary-translated (`L10N` in index.html — Czech complete, translated by hand,
including the five challenges: Pojď a uvidíš / Čiň pokání a věř / Následuj mě / Rybáři lidí /
Posílám vás, with ČEP-style scripture captions). AI coach content is **not** translated — the AI
writes natively in the leader's language. When localizing further, pull scripture captions from
each language's most-used translation so the first screen feels native, not translated.

## 10. Deliberately not built yet

Program mapping UI (table exists; powers Doorway questions), team photos, password reset (needs
an email service), country gating on the dashboard, and the AI coach itself — the current
`renderCoach` is a rule-based placeholder demonstrating the *kinds* of questions (Celebrate /
Care / Challenge / Lean in / Doorway, each with its "because"). The real one calls Claude through
the Netlify function with the group's movement data + heart-note history, caches to
Check-ins.Coach Questions, and answers in the leader's language.
