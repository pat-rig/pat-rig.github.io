# CLAUDE.md — Project context

Read this file, then `PLAN.md`, at the start of every session. Do not start work
before both are read.

## What this is

Two repositories with a deliberate wall between them.

**`commute-logger` (private).** Route configuration with real coordinates, the
scheduled logger, and all raw observations. Never published, never linked.
This is plumbing, not the product.

**`site` (public).** Patrick's blog plus the "Commute Heatmap" app — the actual
portfolio piece. It visualises and explains travel-time data. It contains no
coordinates, no route names, no addresses. Routes appear as "Route A", "Route B"
with a generic descriptor such as "~30 km suburban commute".

The wall is one-directional and manual: an export script in the private repo
produces a de-identified aggregate, and a human copies it into the public repo.
Nothing crosses automatically.

## Stack (decided — do not re-litigate)

| Concern | Choice |
|---|---|
| Framework | Astro (static output, islands for interactivity) |
| Language | TypeScript, strict |
| Hosting | GitHub Pages (v1). Azure Static Web Apps is a deferred option — see Phase 9. |
| Backend | None. The public site is fully static and makes no API calls. |
| CI/CD | GitHub Actions |
| Raw data store | NDJSON committed in the **private** repo. No database. |
| Published data | De-identified JSON committed in the **public** repo |
| Charts | Observable Plot |
| Map | MapLibre GL |
| Tests | Vitest |

Rationale worth preserving: the published dataset ships as static files, so the
public app makes no API calls at all — visitors cannot spend quota, no key is
needed to run the site, and no server is required anywhere. That is why plain
static hosting suffices and why no billing account is involved on the hosting
side.

Note on Actions minutes: public repos get unlimited free GitHub-hosted runner
minutes; private repos get 2,000 Linux minutes/month on the Free plan. The
logger therefore runs **once per hour, batching all due slots**, rather than
every 15 minutes. Roughly 720 minutes/month, comfortably inside the allowance.

## Hard rules

1. **Never commit secrets or personal location data.** The Maps API key lives in
   GitHub Actions secrets. It never appears in client code, committed `.env`, or
   logs. Coordinates, addresses, route names and raw observations never appear
   in the public repo in any form — including in commit messages, test fixtures,
   screenshots, sample data, and article text.
2. **Never call the live Routes API from tests or from `npm run dev` by
   default.** Develop against fixtures in `src/lib/routes-api/fixtures/`. Live
   calls happen only via an explicit script the human runs.
3. **Cost discipline.** Every Routes API request must use a minimal field mask.
   Do not request polylines, traffic-on-polyline, toll info, or anything that
   pushes the call into a higher-priced tier. Duration and distance only.
4. **One task at a time.** Follow the protocol in `PLAN.md`. Do not batch several
   plan items into one commit.
5. **Ask before scope changes.** If a task turns out to need something not in
   `SPEC.md`, stop and write the question into `PLAN.md` under "Open questions"
   rather than deciding alone.

## Definition of done for any task

- `npm run check` passes (typecheck + lint + tests)
- `npm run build` passes
- the change is committed with the task ID in the message
- the checkbox in `PLAN.md` is ticked and the session log updated

## Human-only steps

These are never automated; when a task needs one, stop and ask:
- `gh auth login` (once, at P0.0). Repository creation itself is *not* manual —
  use `gh repo create`.
- creating the Google Cloud project, enabling Routes API, creating the key
- setting API key restrictions in Google Cloud Console
- setting a **per-API daily request quota** in Google Cloud Console — this is the
  only true hard spend cap in the system; the code-level cap in
  `config/logging.json` is defence in depth, not a substitute
- setting a Google Cloud budget alert
- adding secrets to the GitHub repository
- (Phase 9 only) `az login` and Azure subscription selection
