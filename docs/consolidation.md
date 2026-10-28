# Website consolidation — 2026-10-28

## Sources

- Live document root: `root@187.77.48.10:/var/www/html/danhausch-com/`.
- Home assets: `assets/site-20261016T001007Z/`.
- About/privacy assets: `assets/site-20261015T230105Z/`.
- Diagnostic API: `/opt/agplace-form/app.py`; existing deployment config is in `ops/`.
- Avenor repository: `danielharagao/avenor-website`; main at `9e3281c` (full revision below).
- Old Danhausch mentoring site: parent Git history, ending at `b0e9365` before this consolidation.

`live-import-manifest.json` records SHA-256 hashes of every imported public file as it existed on the server. The server homepage hash matched the public HTTPS response. `_staging/` is a preview artifact and is excluded; both dated live asset directories are retained because live pages reference them.

## Deliberate changes from the live snapshot

- Add BA career mentoring to the products catalog, with a WhatsApp inquiry link and no invented price.
- Remove a trailing blank line from the imported catalog CSS.
- Make product navigation links relative to this website so local review stays local.
- Replace the old GitHub Pages deployment workflow with validation only; production remains on Nginx.
- Add development dependencies, automated validation, backend contract tests and hosting documentation.
- Remove the superseded mentoring pages and their assets from the current tree; historical commits retain them.

The live home already contained the Avenor qualification sequence, adapted to Danhausch with a visitor-confirmed WhatsApp handoff. That controller is imported unchanged. It retains objective → annual revenue → timeline → decision authority → investment → contact/consent → review. The disabled preview-only final button from Avenor main is not substituted for the working live handoff.

The diagnostic API is imported unchanged. No environment files, credentials, diagnostic PDFs or visitor data are included, and no production submissions were made during validation.

## Avenor preservation

Before retiring the separate repository, all its branch tips and reachable Git history were copied into this repository under `archive/avenor/*`. The bare mirror and a verified Git bundle were also saved outside the working tree in `/Users/danielh.aragao/orca/backups/danhausch-consolidation-20261028/`, together with a full live-site snapshot and GitHub repository, issue and PR metadata. There were no open Avenor issues or pull requests at capture time.

Archived source revisions:

```text
feat/compact-site-pages a9d58ee93a30ca61ae846c40cb3a08c286e609fc
feat/execution-capacity-funnel 3a75f26b3320a1f484ec98663e3848308913410d
fix/balanced-brand-copy aab20e8007019227cebe825dbb2a31c3ef764752
main 9e3281cb114ef9cff06a37ad64e9771d4311d264
```

The archive branches preserve source history; they are not deployment branches. The repository default remains `master`.
