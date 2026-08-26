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

| # | Phase | Tool | Scored categories | Typical | Aimed at |
|---|-------|------|-------------------|---------|----------|
| 1 | Preparation | CCE | Call, Character, Empowerment | 30 years | Everyone |
| 2 | Foundation | the six | Relationships, Love, Vision, Jesus, Prayer, Bible | 1.5 years | Disciples |
| 3 | Ministry Training | TAR | **TAR**, Serve, Evangelize, Shepherd | 6–9 months | Workers |
| 4 | Expansion | CPR | **CPR**, Expansion, Team | ongoing | Workers |
| 5 | Leadership Multiplication | REST | **Restructure, Entrust, Support, Train**, Multiplication | 1.5 years | Leaders |

**The tool is not always a breakdown of the phase.** For Preparation,
Foundation and Leadership Multiplication the tool's letters *are* the
scored categories. For Ministry Training and Expansion they are not: the
source scores TAR and CPR each as a **single** category and measures
other things beside them. Write "part", not "letter", for phases 3 and 4.
Bold above = the categories that spell the tool.

The spans trace Jesus' own ministry. Phase 3 is **Ministry Training**, not
"Equipping". Phase 5 is **Leadership Multiplication**. The M-Lens source
itself says "Equipping" and "Multiplication"; Mel's names win, and the
code says so at the `PHASES` definition.

The Foundation six are confirmed — the source docx names them
"Relationships, God's Word, Love, Vision, Christ, Prayer", which is the
same six. `SIX` was never an acronym in the source, just a count.

Your phase is the **first one scoring below 7/10**. Everything before it is
cleared; everything after is not yet your turn.

**The later phases are graded harder, on purpose.** "Mostly true" is worth
8 in Preparation and Foundation but only 6 from Ministry Training on, so a
leader who answers "mostly true" straight down clears Preparation (8.0) and
does not clear Ministry Training (6.0). Confirmed by Mel: the later phases
*are* harder, and the source grades them that way.

Two consequences the code holds to. **Store the answer, not the score** —
`REPORTS[].a` holds 0-3, and `worth(a, phase)` derives the rest, so
retuning the grading never touches stored data. And **a category label
reports what the leader said, never what it was worth** — the same two
clicks must read the same words in every phase. The harder grading belongs
to the phase score alone. `HARDER_FROM` and the `early`/`late` columns in
`SCALE` are the whole mechanism.

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

## Two tiers — open and activated

**Decided 26 Aug 2026 by Mel.** A leader can sign up themselves and start.
A leader passing the link to another leader is the way this is meant to
spread, and nothing should get in the way of that. What gates is not
signing up — it is entering a child's name.

| | Open (self-signup, verified email) | Activated (by JV or the national org) |
|---|---|---|
| The 35-statement check-up | yes | yes |
| Phase, tool, categories, coach | yes | yes |
| **Counts** per challenge | yes | yes |
| Programmes tagged to challenges | yes | yes |
| Change in counts between check-ups | yes | yes |
| **Named students** | **no** | yes |
| Who moved, who is stuck, how long each took | no | yes |
| Feeds JV's key results | no | yes |

**Nothing in the open tier is personal data about a student.** Counts and
programmes describe a ministry, not a person. That is why the open tier
can be genuinely open.

This is not an invention — it is the source instrument's own shape. The
M-Lens docx asks for counts per challenge and for programmes tagged to
challenges, and asks for names in exactly two questions. The open tier is
M-Lens minus those two questions.

Activation is where every decision above attaches: country type assigned,
export shape chosen from it, translated privacy notice in place *before* a
student is entered. It is a person from JV making contact, not a form.

**Voice rule for the open tier.** It must never read as an advert. No
"unlock", no "upgrade", no counting down what they are missing. The app
shows what it can from what it was given and says plainly what it would
need in order to say more — once, quietly, where it is relevant:

> This is your group as a number. With names, it could tell you who has
> not moved since spring.

**The open tier gets better on its own.** Two check-ups' counts give
group-level movement over time without a single name — "you had 6 at
Repent & Believe in March, 9 now." A leader who keeps using it sees more
each time. That is a better reason to stay than any teaser.

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

1. **No auth.** Any visitor sees everything. Must land before a real
   roster does. Shape is decided — see "Two tiers" above: open self-signup
   for the check-up, activation required before a student can be entered.
2. **No authorisation.** Every student needs `org_id` / `group_id`,
   filtered **in the function, never the browser.** Do this in the same
   sitting as multi-tenant work, not as a later audit.
3. **Retention is decided, not built.** Three states — Active, Dormant,
   Left — with 18 months of dormancy before a person confirms the move to
   Left, at which point the identity is deleted and an anonymous journey
   is kept. Full rationale and the trade it makes are in
   `DATA-PROTECTION.md`. Erasure still cannot be satisfied in one action.
4. **Student names go to Anthropic** in the coach prompt. There is a
   toggle; it defaults to on. Mel's decision, not a default to inherit.
5. **Screenshots mostly do not save.** Stored as base64 in a text field,
   capped near 95k characters; a real screenshot is far bigger, so the
   function drops it to a marker. Fix is Airtable attachments.
6. **Students, programmes and check-ups are in-memory demo data.** Wiring
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
