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

> **Suspended, 26 Aug 2026 — the "said yes to" phrasing only.** Mel logged
> a note against the check-up screen: *"For 'said yes,' I don't even know
> what that means. You're not using the language of the tool. You're making
> stuff up here."* Fair — the source instrument just lists people under each
> challenge; "the furthest invitation they have said yes to" was our framing
> layered on top, and it read as invented. The UI now says "how far each has
> come" / "reached", which is closer to the source and plainer to read aloud.
>
> This is provisional — Mel said "drop it for now", not "drop it". The rest
> of the rule still stands: a challenge is still not a place, a programme
> still does not carry one. If the phrasing comes back, it comes back
> because someone decided it, not because this paragraph was skimmed.

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

**The Typical column is not sourced.** Searched 26 Aug 2026: no phase
duration appears anywhere in the M-Lens docx or either spreadsheet. The five
spans came from an unverified chalkboard reading, the same provenance as the
old `SIX` guess, and "ongoing" is not a duration at all. Every place the app
shows a span marks it with the placeholder asterisk. Do not quote these
figures, and do not build anything that scales to them.

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

**Phase, not season.** Decided 26 Aug 2026. The framework is Five Phases,
the tab says phase, the tables say phase — so the app's own copy says phase
everywhere. "Season" survives in exactly two sentences on the Like Jesus
page, both quoted from Mel's own text ("five distinct phases, or seasons"
and "What season your ministry is in"). That is where the synonym gets
introduced; it is not a second name to use afterwards. The app had drifted
into "what season you are in" on the report while the tab beside it said
Five Phases.

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

### Where the line falls, and why it holds

Activation is **signing up for coaching** with the national organisation.
It is free. It is a person, not a form.

The open tier can tell a leader **what is true of his ministry**. It
cannot tell him **who**. Every open-tier insight is about the group — your
phase, your weakest part, nobody is ever sent out to lead, six said yes to
Repent & Believe. What a leader does on Tuesday is have a conversation
with *one student*, and the framework is invitations made to people. So a
map without names can only ever say "someone".

That is why the line is not arbitrary. It is the point where the app stops
being about ministry-in-general and starts being about people — the same
point where coaching starts. **The boundary and the product are the same
boundary.** Anyone tempted to move the line should have to explain why
those two things should come apart.

### Show the blanks

Nothing is withheld. The open tier knows the counts, so it can say
something wholly true about his group with the names missing:

> Three of your students have said yes to helping you reach others.
> None of them has been sent.
>
> **_____ · _____ · _____**

He never gave those names, so nothing is being kept back — but he knows
exactly who they are, and the app has just shown him that it does not.
That gap is the pitch. It needs no persuasion attached.

The same move works once on the coach: his real open-tier question reads
"What stops you from asking more often?" With a map it would read "Vojta,
Anička and Klára said yes months ago — what has stopped you asking them?"
Shown side by side, once, the difference argues for itself.

### The framing, which is also true

**The map is a burden without a coach.** Entering two dozen students and
keeping them current is real work. Done because someone will sit down and
go through it with you, it is worth doing. Done alone it is admin, and he
will stop in three weeks. So never write "sign up to unlock the map".
Write the reason:

> The map is not for us. It's for the conversation you'll have about it.

### The words

At the blanks, once, quietly:

> This is your group as a number. With names, it could tell you who hasn't
> moved since spring.

The ask:

> Would you like someone to walk through this with you? It's free.

### What would kill it

- **"Unlock", "upgrade", "premium", padlocks, greyed-out sections.** The
  audience is 18–30, mostly not native English speakers, in ministry.
  Commercial SaaS language reads as slightly insulting to them.
- **Asking twice.** One moment, maximum relevance, then stop. A second ask
  turns a diagnosis into a sales funnel.
- **An open tier that feels crippled.** If it does not stand alone, the
  whole thing reads as bait. It does stand alone — "nobody is ever sent
  out to lead" is the most confronting thing this app says, and it is
  free.

One sentence, if it is ever needed outside this repo: *the check-up tells
you what is true of your ministry; coaching is where it becomes about
people, and that is where the names live.*

## Architecture

Deliberately boring. One HTML file, two Netlify functions, Airtable.

```
index.html                     the whole app: markup, styles, logic
netlify/functions/claude.js    proxies the model; pins the model server-side
netlify/functions/notes.js     workbench notes -> Airtable
netlify/functions/lib/guard.js the front door both functions call first
netlify.toml                   /api/* redirects, security headers
```

**`guard.js` is not authentication and must never be described as such.**
It checks the request came from this site, rate limits per IP, and caps
model calls per day. A determined person can set an Origin header. It
exists to stop drive-by traffic, to cap what a runaway costs, and to keep
the two functions from drifting apart in what they allow.

Until a real login lands, the gate is **Netlify's site password**, which
does cover function endpoints. If password protection is ever turned off
while the app still has no login, `/api/notes` returns every note in the
base to anyone who asks. That happened once, on 26 Aug 2026, for about a
day.

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

**Decided 26 Aug 2026 by Mel, while Dave was testing.** The panel now also
lists everything logged, newest first, with a tick to mark a note fixed and
a count of what is still open. That is a deliberate exception to the line
above, not a drift back toward the tracker: one tick, no kinds, no filters,
no triage screen. Do not cut it out again on the strength of the old rule.

The tick is optimistic and reconciles — if the save fails it goes back where
it was, so the list never claims something is fixed that Airtable never
heard about. Note text is escaped before it reaches `innerHTML`; a tester
writing "students < 12" would otherwise swallow the rest of the panel.

**No email on new notes, decided 26 Aug 2026.** An automation was built and
then removed — a mail per note is noise when a tester is working through a
screen. The notes live in the base and in the panel; Mel reads them when he
chooses to, or asks Claude to pull the open ones and work through them.
Do not add a per-note notification back without Mel asking for it.

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
