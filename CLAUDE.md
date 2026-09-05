# CLAUDE.md — public site

This is the public repository: a personal blog, plus (later) a page that
visualises travel-time data.

Planning documents live elsewhere. `PLAN.md`, `SPEC.md` and the design system
are deliberately **not** in this repo — they are operational notes, and this
repo is world-readable. If you are working here without them, ask before
inventing structure.

## Stack (decided — do not re-litigate)

| Concern | Choice |
|---|---|
| Framework | Astro (static output, islands for interactivity) |
| Language | TypeScript, strict |
| Hosting | GitHub Pages |
| Backend | None. This site is fully static and makes no API calls. |
| CI/CD | GitHub Actions |
| Charts | Observable Plot |
| Tests | Vitest |

The published dataset ships as static files, so the site makes no API calls at
all: visitors cannot spend quota, no key is needed to run it, and no server is
required anywhere.

## Hard rules

1. **No secrets, no personal location data — ever.** No API keys, coordinates,
   addresses, route names, or raw observations, in any form: source, commit
   messages, test fixtures, screenshots, sample data, image metadata, or
   article text. Published travel-time data is de-identified aggregate only,
   copied in by hand after human review.
2. **Routes appear as "Route A" / "Route B"** with a generic descriptor. Do not
   name a region, town, road, or landmark, and do not add a map.
3. **Strip metadata from any image before committing it** — EXIF can carry GPS,
   timestamps, camera serial numbers and the photographer's name.
4. **No operational or legal reasoning in this repo.** Decisions about legal
   posture, employment, or anything strategic belong in the private notes, not
   in a world-readable file.
5. **Ask before scope changes.** Do not decide alone.

## Definition of done

- `npm run check` passes (typecheck + lint + tests)
- `npm run build` passes
- the change is committed
