# Data protection — read before this goes anywhere near a real youth group

This app is the highest-risk thing in the suite. Not because of its code,
but because of what it holds.

## What it holds

Named minors. Age 12–14 upward. Against each name:

- their age band
- how long they have been coming
- **whether they have said yes to giving their life to Christ**
- which leader knows them
- who invited them
- a free-text note about them
- their movement, or lack of it, over months

The third item is the problem. Under GDPR Article 9 that is **special
category data — religious belief — about identifiable children.** It is
the most protected combination the regulation has.

Everything below follows from that.

## Controller vs processor

Each national organisation is the **controller** for its own students.
JV International is a **processor** acting on their instructions, unless
JV is setting the purposes itself — in which case the two are joint
controllers and need a written Article 26 arrangement.

This must be settled per country before rollout, not after. Czech, Polish
and Slovak DPAs will not read a chain of Netlify deploys as an answer.

## Lawful basis — and why consent is likely the wrong one

For Article 9 data the realistic bases are:

- **Article 9(2)(d)** — processing by a not-for-profit body with a
  religious aim, relating solely to its members or people in regular
  contact with it, with no disclosure outside without consent. This is the
  most natural fit and it is why the "no third-party sharing" rule below
  is load-bearing rather than optional.
- **Article 9(2)(a)** — explicit consent. Fragile here: a 13-year-old
  cannot give it alone, and consent obtained by a youth leader from a
  student in their own group is hard to call freely given.

Whichever is chosen, parental authorisation is required for the youngest
band in most member states (the GDPR floor is 13; Czechia sets 15).

## Fields — what is actually needed

- First name + last initial only. Never a full name. **Enforced in the
  intake form.**
- Age **band**, not a date of birth.
- The note field is free text. It is the field most likely to end up
  holding something that should never have been typed. Label it in the UI,
  cap its length, and review it.
- The join date is necessary — it is what makes every duration in the app
  computable — and it is low-risk on its own.

## Retention and deletion

Nothing here has a retention period yet. **This is the largest open gap.**

- Students who leave the group must age out on a defined schedule.
- A student or parent asking for erasure must be satisfiable in one
  action, including from historic check-up snapshots.
- Historic reports currently embed roster counts. Counts are fine.
  Confirm no report stores names.

## Who sees which rows

Today: any signed-in leader sees the whole group. That is defensible for
one youth group. It is **not** defensible the moment this is multi-tenant.

- Every student and every check-up needs an `org_id` and a `group_id`.
- Filter on the server, in the Netlify function, never in the browser.
- Check for hardcoded group values before deploying, in the same sitting.

## Sub-processors

- **Netlify** — hosting. US company; standard contractual clauses apply.
- **Airtable** — student records and workbench notes. US company; SCCs
  apply. Named as a sub-processor in every national agreement.
- **Anthropic** — the coach and workbench read. **A student's first name
  and spiritual status are sent in the prompt today.**

That last one needs a decision before launch, not after. The app has a
"Send student names" toggle; consider whether it should default to off, or
whether names should never leave the browser at all and the coach should
work from counts. The questions get less specific. That is the trade.

## What breaks it, and who fixes it if Mel is unavailable

- **Netlify function 500s** → almost always a missing env var after a
  site rename or a new deploy context. Check Site settings > Environment
  variables. Anyone with Netlify access can fix this.
- **Coach and workbench both dead, app otherwise fine** →
  `ANTHROPIC_API_KEY` expired or over quota. Read-only rest of app keeps
  working; this is not an outage.
- **Notes list empty but app fine** → Airtable PAT rotated or the base was
  renamed. `AIRTABLE_BASE_ID` is the usual culprit.
- **Screenshots stop saving** → a note exceeded the Airtable cell cap. The
  function degrades to a marker instead of failing; nothing is lost but
  the image.
- **Wrong group's students appear** → stop the deploy. This is the
  authorisation bug, and it is the one that turns a small app into a
  reportable breach.

Second pair of hands: John knows the front end. Noah has worked the
Netlify and Airtable wiring on the other apps.
