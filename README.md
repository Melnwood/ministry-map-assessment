# Ministry Map + Check-up

Merge prototype. The Ministry Map (live roster, five invitations, movement
over time) with the M-Lens check-up (Five Phases instrument) built in as a
module, so the check-up stops asking a leader for numbers the map already
holds.

**Read `DATA-PROTECTION.md` first.** This app holds religious-belief data
about named minors. That is not a footnote.

## Deploy

Netlify > Add new site > **Import an existing project** > GitHub >
`Melnwood/ministry-map-assessment`.

- Build command: **leave blank**
- Publish directory: **`.`**
- Functions directory is set by `netlify.toml`; do not override it.

Then Site configuration > Environment variables, add all four from
`.env.example`, then Deploys > Trigger deploy > **Clear cache and deploy
site** (env vars are not picked up by an already-finished build).

The site deploys fine without the keys. It fails closed: the app renders,
the notes bot says why it cannot save, and the coach reports it cannot
connect. Nothing breaks silently.

Local: `npx netlify dev` from this folder, which serves the functions too.
Opening `index.html` directly also works, but `/api/*` will 404 and the bot
will tell you so.

### The Airtable token

At airtable.com/create/tokens the token needs **both**:

- scopes `data.records:read` and `data.records:write`
- the **Ministry Map — Workbench** base explicitly added under Access

Right scopes with no base added returns 403. Airtable shows a PAT once.

## Airtable — Workbench table

**Already created:** base `applBnNxBseAJT5kO` ("Ministry Map — Workbench"),
table `Workbench`, in Mel's Workspace. Set `AIRTABLE_BASE_ID` to that id.

It is deliberately a *separate* base from Ministry Map: build notes are not
ministry data, and mixing them would put dev chatter in the same base as
student records.

Fields, for reference:

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
