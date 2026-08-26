# Ministry Map + Check-up

A single-file web app for youth leaders in Josiah Venture, across ~16
countries in Central and Eastern Europe. It merges two things that used to
be separate: the **Ministry Map** (who your students are and how far they
have come) and the **M-Lens check-up** (a 35-statement self-assessment
against JV's Five Phases). The merge exists so the check-up stops asking a
leader for numbers the map already holds.

**Read `DATA-PROTECTION.md` before touching anything that stores a student.**

---

## The framework — get this right, it is the whole point

### Five Challenges of Christ

These are **invitations a leader makes to a student**. Not programmes, not
places, not events, not stages a student "is in". A student's position on
the map is *the furthest invitation they have said yes to*.

| # | Challenge | What it actually means |
|---|-----------|------------------------|
| 1 | Come & See | Come and look at Jesus — nothing is asked of you yet |
| 2 | Repent & Believe | **Turn from your old life and give it to Christ** |
| 3 | Follow Me | Let Jesus lead your whole life |
| 4 | Follow Me & Fish | Come and help reach people still outside |
| 5 | I Am Sending You | Go and lead this somewhere I am not |

**Never write container language.** Not "students sitting at Repent &
Believe", not "camp carries that challenge", not "the only door". Write
about **who has been asked and who has not**. A programme is *where an
invitation tends to get made*, nothing more.

### Five Phases of a disciplemaking ministry

Each phase has a JV training tool. The 35 statements are tagged to the
letters of that tool, so a low letter points at the part of a tool the
leader is skipping — not at a personal failing.

| # | Phase | Tool | Letters | Typical | Aimed at |
|---|-------|------|---------|---------|----------|
| 1 | Preparation | CCE | Character, Calling, Empower | 30 years | Everyone |
| 2 | Foundation | SIX* | Prayer, Relationship, God's Word, Vision, Love, Christ | 1.5 years | Disciples |
| 3 | Ministry Training | TAR | Teach, Act, Reflect | 6–9 months | Workers |
| 4 | Expansion | CPR | Cultivate, Plant, Reap | ongoing | Workers |
| 5 | Leadership Multiplication | REST | Re-structure, Entrust, Support, Train | 1.5 years | Leaders |

The spans trace Jesus' own ministry. Phase 3 is **Ministry Training**, not
"Equipping". Phase 5 is **Leadership Multiplication**.

\* `SIX` is an unverified reading of a hand-drawn diagram. Confirm with Mel.

Your phase is the **first one scoring below 7/10**. Everything before it is
cleared; everything after is not yet your turn.

---

## Voice — who this is written to

**Youth leaders, roughly 18–30, mostly not native English speakers.** Not
Mel, not the build team, not a stakeholder.

- Never reference the app's own history ("the old diagnostic", "we've
  filled them in", "one source, not two").
- Never use internal names for UI. Nobody outside this repo calls the
  stacked bars "the cake".
- Never leak provenance vocabulary: *roster, check-ins, computed, zone 4+,
  snapshot, dashboard.* Say "your map".
- Short sentences. Plain words. A leader should be able to read any line
  aloud to their team without translating it.

### Two wording rules learned the hard way

**Statements take truth labels. Practices take frequency labels.** The
answer scale is *Not yet true of us / Starting / Mostly true /
Consistently true* — correct for a statement, nonsense pinned to a verb.
"Cultivate: Mostly true" is not a sentence. Tool letters read
"You do this most of the time" / "You are not doing this yet".

**A question must never contain its answer.** The coach asks questions
only, never advice, and must not name a month, programme or plan the
leader did not mention. "What stops you asking in November?" is a
recommendation wearing a question mark. "What stops you asking more
often?" is a question. The leader supplies the when and the how.

---

## Numbers — say what would make them wrong

Before any figure ships, state what would falsify it. Two live examples:

- Category scores are shown as **bands, never decimals**. Some letters rest
  on two statements; one click moves them 1.25 points on a ten-point scale.
  The decimal implied a precision the instrument does not have. Every row
  shows its statement count so the resolution is visible.
- The demo roster is **fabricated**, and was edited mid-build to make a
  chart interesting. Nothing derived from it is evidence of anything.

---

## Architecture

Deliberately boring. One HTML file, two Netlify functions, Airtable.

```
index.html                    the whole app: markup, styles, logic
netlify/functions/claude.js   proxies the model; pins the model server-side
netlify/functions/notes.js    workbench notes -> Airtable
netlify.toml                  /api/* redirects, security headers
```

- **No build step.** No framework, no bundler. Publish directory is `.`
- **The browser never holds a key.** Zero direct calls to
  `api.anthropic.com` — check this stays true.
- **Fail closed, loudly.** Deploying without env vars works; the app
  renders and each feature says exactly why it cannot connect.
  `explain()` in `index.html` turns a status code into the actual cause.
- **Never lose the user's input.** A failed note save puts the text and its
  screenshot back in the box.

### Environment

```
ANTHROPIC_API_KEY       server-side only
AIRTABLE_API_KEY        needs data.records:read + :write AND the base added
AIRTABLE_BASE_ID        applBnNxBseAJT5kO
AIRTABLE_NOTES_TABLE    Workbench
```

Env vars are not picked up by a finished build. Always redeploy with
**Clear cache and deploy site**.

### The notes bot

A pencil, bottom-right, on every screen. Box, screenshot, Log it. It tags
the screen automatically. **Resist adding to it** — it has already been cut
back twice from an issue tracker with kinds, states, filters and triage.

---

## Open — real work, in rough priority

1. **The 35 statements are placeholder wording I wrote.** The real ones are
   in `ministrydiagnostic.zip` (Mel), along with which statement maps to
   which tool letter. The mapping is currently my guess; wrong tags produce
   confidently wrong numbers.
2. **No auth.** Any visitor sees everything. Must land before a real
   roster does.
3. **No authorisation.** Every student needs `org_id` / `group_id`,
   filtered **in the function, never the browser.** Do this in the same
   sitting as multi-tenant work, not as a later audit.
4. **No retention policy.** Students who leave never age out; an erasure
   request cannot be satisfied in one action.
5. **Student names go to Anthropic** in the coach prompt. There is a
   toggle; it defaults to on. Mel's decision, not a default to inherit.
6. **Screenshots mostly do not save.** Stored as base64 in a text field,
   capped near 95k characters; a real screenshot is far bigger, so the
   function drops it to a marker. Fix is Airtable attachments.
7. **Students, programmes and check-ups are in-memory demo data.** Wiring
   them to the Ministry Map base is the next real build.

---

## What breaks it, and who fixes it if Mel is away

- Function 500s → a missing env var after a rename or new deploy context.
- Coach and notes both dead, app fine → `ANTHROPIC_API_KEY` expired.
- Notes list empty, app fine → Airtable PAT rotated or base renamed.
- **Wrong group's students appear → stop the deploy.** That is the
  authorisation bug, and it is the one that turns a small app into a
  reportable breach.

John knows the front end. Noah has done the Netlify and Airtable wiring on
the other apps.

---

## Working here

Change things in the smallest way that fixes the problem. Mel pushes back
on over-engineering, and has been right every time so far. When a screen
feels wrong to him it is usually the *words*, not the layout.
