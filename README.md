# Ministry Map + Check-up

Merge prototype. The Ministry Map (live roster, five invitations, movement
over time) with the M-Lens check-up (Five Phases instrument) built in as a
module, so the check-up stops asking a leader for numbers the map already
holds.

**Read `DATA-PROTECTION.md` first.** This app holds religious-belief data
about named minors. That is not a footnote.

## Deploy

1. Push this folder to a GitHub repo.
2. Netlify > Add new site > Import an existing project > pick the repo.
   Build command: none. Publish directory: `.`
3. Site settings > Environment variables — add the four from
   `.env.example`. **The build will deploy without them; the coach and the
   workbench will simply fail closed.**

Local: `npx netlify dev` from this folder, which serves the functions too.
Opening `index.html` on its own works, but `/api/*` will 404, so the coach
and workbench will report they cannot connect.

## Airtable — Workbench table

One table, named `Workbench` (or set `AIRTABLE_NOTES_TABLE`):

| Field       | Type              | Notes                                    |
|-------------|-------------------|------------------------------------------|
| `LocalId`   | Single line text  | Client-side id, for matching             |
| `Note`      | Long text         | What Mel wrote                           |
| `Screen`    | Single line text  | Tagged automatically from the view       |
| `Kind`      | Single select     | `bug`, `wording`, `idea`, `question`     |
| `State`     | Single select     | `open`, `doing`, `done`                  |
| `LoggedAt`  | Date (with time)  | Sort field                               |
| `ClaudeRead`| Long text         | The three-part read, when asked for      |
| `Shots`     | Long text         | Base64 screenshots as JSON               |

`Shots` holds images inline rather than as attachments — simpler, and they
never leave the base. Airtable caps a cell near 100k characters; the
function drops oversized images to a marker rather than corrupting the row.

Student and check-up data is **not** in this table. That belongs in the
Ministry Map base, which this prototype does not yet write to.

## Still open

- The 35 statements are placeholder wording. The real ones are in
  `ministrydiagnostic.zip`, along with which statement maps to which tool
  letter (TAR / CPR / REST / CCE / the six of Foundation).
- The Foundation acronym is read as `SIX` from the chalkboard diagram.
  Unverified.
- Students, programmes and check-ups are in-memory demo data. Wiring them
  to the Ministry Map base is the next real build, and the point at which
  `org_id` filtering stops being optional.
