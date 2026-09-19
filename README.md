# Campus Sound Notes

A campus listening project built with React, TypeScript and Leaflet. GitHub Pages serves the website; a school Qualtrics survey collects observations. The public map reads a dated, de-identified JSON snapshot.

Live website: https://yueyaow7-10969.github.io/campus-sound-notes/

## Run locally

Use Node.js 24 or later.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

## Connect the survey

Follow `qualtrics/SETUP.md`. Publish the survey and enter its anonymous HTTPS URL in `public/site-config.json`. Do not put account credentials or API tokens in this file. A missing URL produces an honest unavailable state and blocks release checks.

The site embeds the actual survey and always offers a direct link. Qualtrics owns form validation, submission storage and the confirmation message. The site does not infer successful submission from iframe events. Guest submission must be verified with a separate browser session after configuration.

The place step offers **Use my location**. Only a participant's click starts a one-time browser permission request. Coordinates, accuracy and capture time are stored as explicit Qualtrics embedded data. Place names remain required for context. Participants can remove the device coordinates or use the eight place presets when location is unavailable. See `qualtrics/SETUP.md` for the five required embedded fields and script installation.

## Update observations

1. Export complete Qualtrics responses as CSV using text labels and the configured question tags. Keep raw exports in the ignored `private-data/` directory.
2. Prepare a private review worksheet:

```sh
npm run data:prepare -- private-data/export.csv private-data/review.csv
```

3. Review place names and notes for personal details, verify consent, remove QA/duplicate entries, resolve Other locations manually, check SGT times and retain existing public IDs across updates. Valid device coordinates take priority over presets; a blank location capture falls back to the selected preset. Resolve any `location_issue` (including accuracy over 100 m) before publication. Preset coordinates are approximate outdoor starting points. Use the location description to refine them where needed. Set `publish` to `yes` only for reviewed rows. Keep `kind` as real or explicitly authorized hypothetical; test records are never public.
4. Produce a reproducible snapshot using an explicit update time:

```sh
npm run data:publish -- private-data/review.csv 2026-09-19T12:00:00+08:00
npm test
npm run build
npm run check:release
```

Only allowlisted public fields are emitted. Coordinates are rounded to three decimals (approximately 100 m). Empty nature answers are not zero; clear/dominant proportions exclude missing/unsure. Equal-sized circles with fewer than three valid notes have no proportion colour. Real and hypothetical data remain separate.

The 19 September 2026 snapshot contains five explicitly authorized **hypothetical** assignment submissions (CSN-HYP-001–005), each submitted to Qualtrics and checked against its saved response. Select **Data → Hypothetical** in Explore to view them. The Real notes view remains empty. Their assumed observation date is 18 September 2026 (SGT); coordinates are approximate public-place presets. Six earlier QA responses are excluded. Each area has only one note, so Soundscape retains its uncoloured small-sample markers. The snapshot was generated from the authored records and backend field checks, not from a downloaded Qualtrics CSV.

## Publish on GitHub Pages

The release directory contains a clean copy of this source and a `docs/` directory containing the compiled website. In repository Settings → Pages choose Deploy from a branch, main, /docs. This uses the course-style branch publishing workflow and requires no deployment key. After each update run the local build, release check and packaging script, commit the refreshed source and docs, and verify the public site.

For a Pages project URL, relative Vite assets and hash routing work under the repository path. Reload an observation detail URL to test this.

Raw survey exports, private review files, original course materials, local paths, old application configuration and Git history must not be uploaded. The release script uses an explicit file allowlist. Keep the old hosted site until the new site and an anonymous survey submission pass verification.

## Attribution

Map tiles © OpenStreetMap contributors, https://www.openstreetmap.org/copyright. Leaflet is used under its BSD license. Botanical artwork and the interface are project design assets.
