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

**Decided 26 Aug 2026 by Mel. Not built yet.**

A student is in one of three states, never two:

| State | Name held | On the map | Counted |
|-------|-----------|------------|---------|
| **Active** | yes | yes | yes |
| **Dormant** | yes | listed separately | no |
| **Left** | **deleted** | no | no |

**Dormant is the whole point.** Students drift away and come back — most
often at camp, and camp is yearly. A student who misses one camp and
returns to the next needs about eighteen months. So dormancy runs
**18 months**, which is one full ministry cycle plus the margin to catch
the next one. That is the reason for the number, and it is the answer to
give if a supervisory authority asks. "Two years, it seemed round" is not.

At **Left**, the identity is deleted and an anonymous journey is written:
sequence of challenges, months in each, where they stopped, age band at
joining, how they came. Name, inviter, the leader who knew them and the
free-text note all go. Deleted, not hidden.

**Moving from Dormant to Left is always confirmed by a person.** The app
may ask after 18 months; it must never delete quietly in the background.
Dormancy *is* the grace window — there is deliberately no separate undo.

### The trade this makes, stated plainly

Re-linking a returning student and anonymising them are **mutually
exclusive**. If Honza can be reunited with his old journey, that journey
was never anonymous. So:

- While dormant, he returns and picks up his history intact.
- Once Left, he comes back as a new student, and the movement data counts
  two journeys where there was one person.

Eighteen months of retained religious-belief data about a child with no
current contact is the price of not double-counting returners and not
losing a leader's memory of a student. That is a defensible choice.
Claiming both were possible would not be.

### Still true regardless

- A student or parent asking for erasure must be satisfiable in one
  action, including from historic check-up snapshots. For an **active**
  student that is a full delete — journey included — because the leader
  would re-identify an anonymised record of their own current group on
  sight.
- Historic reports embed roster counts. Counts are fine. Confirm no
  report stores names.
- Article 9(2)(d) covers members and people **in regular contact**. The
  basis for holding someone erodes the longer contact has stopped, which
  is the real reason dormancy has an end at all.

## What leaves for JV International

**Decided 26 Aug 2026 by Mel.** Two export shapes, selected **per
country**, because the organisation is not uniform:

- **Countries that are just JV teams** — no separate legal entity, so JV
  is already the controller and nothing is disclosed outward. These
  export **per-student journeys with the group id**. No inter-entity
  agreement is needed; this is an access-control question, not a legal
  negotiation. Who at JV can read per-student rows must be limited and
  logged.
- **Countries with a national organisation** — separate entity, so the
  transfer is a real disclosure. These export **per-group statistics plus
  per-student journeys with no group id**, which needs no new agreement.
  A national director who wants to sign an Article 26 arrangement can opt
  into the group-linked shape; nobody is pushed.

Neither shape carries a name, an inviter, a leader or the note field.

**The export layer must be per-country configurable from the start.**
That is forced by the org chart, not by a rollout choice.

**How any cross-country figure goes wrong:** computing a movement-wide
statistic over whatever rows are available silently over-represents the
JV-team countries, because those carry richer data. Every JV-wide number
must come from the fields **both** shapes carry, or it is not a JV-wide
number. Say which subset a figure was computed from.

Open, and answerable without code: does JV International have an EU
establishment? Without one, Article 3(2) still applies, Article 27 wants
a designated EU representative, and there is no one-stop-shop — any
national DPA can come directly. And: are there countries with both a
national org and a JV team? If so, whose roster is a student on?

## Who sees which rows

Today: any signed-in leader sees the whole group. That is defensible for
one youth group. It is **not** defensible the moment this is multi-tenant.

- Every student and every check-up needs an `org_id` and a `group_id`.
- Filter on the server, in the Netlify function, never in the browser.
- Check for hardcoded group values before deploying, in the same sitting.

## Who can create a group

**Decided 26 Aug 2026 by Mel.** Self-signup is open, and it grants the
check-up only — 35 statements a leader answers about their own ministry,
plus counts and programmes. No student data of any kind.

**Entering a named student requires the group to be activated** by JV or
the national organisation. This is the safeguarding boundary as much as
the data-protection one: an unverified adult must not be able to create a
private, named list of local minors with notes about each of them. "They
had a link" is not an answer this organisation would want to give.

Activation is also the only point at which these can be established, and
none of them can be applied retroactively:

- which country type the group falls under, and therefore which export
  shape applies
- that a translated privacy notice exists for that country **before** any
  student is entered
- that there is a real, reachable person accountable for the group

An open-tier account must be a verified email, never anonymous — so an
abandoned account can be reached and deleted.

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
