# Danhausch website

Source for `https://danhausch.com`: consulting home, company and professional offerings, product catalog, founder/about page, privacy notice, AI portfolio and diagnostic form.

The repository was consolidated from the live Nginx document root on 2026-10-28. It replaces the old standalone BA mentoring site. BA career mentoring is now a product in `/produtos/`; consulting remains the home page's focus.

## Run and validate

```sh
npm ci
npx playwright install chromium
npm run check
npm test
npm start
```

Open `http://127.0.0.1:8080`. Serve the repository at a domain root: the live site uses root-relative asset and page URLs. Node is used only for development and testing; the website itself is buildless HTML/CSS/JavaScript.

`npm run check` checks JavaScript syntax, internal links, assets, fragments and bilingual translation keys. Browser tests exercise all eight pages at 1440, 390 and 320 pixels; qualification validation, consent, answer preservation, language switching, review, WhatsApp message content, analytics fields, page-memory-only contact data, keyboard controls and reduced motion. Tests use synthetic details and never open WhatsApp, send email or submit the production diagnostic endpoint. Screenshots default to `/tmp/danhausch-browser` (`TEST_ARTIFACTS` overrides the directory).

To use an already installed compatible browser, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its executable path when running `npm test`.

## Qualification flow

The Avenor flow is retained under Danhausch branding:

1. Business objective.
2. Annual revenue, with non-overlapping BRL ranges.
3. Timeline.
4. Decision authority.
5. Investment range.
6. Contact details and explicit contact consent.
7. Review with direct answer editing, followed by a prefilled WhatsApp link.

Only language preference is persisted in localStorage. Answers and contact details remain in page memory. The WhatsApp link opens the message for the visitor to review and send; the site does not claim delivery or book meetings. Local `danhausch:analytics` events contain only event, step and language and have no remote analytics destination.

## Layout

- `index.html`, `sobre.html`, `privacidade.html`: bilingual consulting pages.
- `assets/site-20261028-ux/`: shared navigation, bilingual copy, current styles and qualification controller.
- `assets/site-20261015T230105Z/` and `assets/site-20261016T001007Z/`: retained original live assets.
- `produtos/`, `profissionais/`, `empresas/`, `ai-portfolio/`: catalog and supporting pages; products, professional and business pages support PT-BR/English.
- `landing-pages/ba.html`: BA workshop page for the separate `lp.danhausch.com` host, with an interest list while no session date is confirmed.
- `styles.css`, `assets/img/`: existing catalog styles and photos.
- `form/`: existing diagnostic form, separate from the home qualification flow.
- `backend/diagnostic/`: source for the existing diagnostic email/PDF API.
- `ops/`: captured Nginx and systemd configuration, with deployment notes.
- `docs/consolidation.md`: import provenance and Avenor history preservation.

## Hosting

Production is served by Nginx from `/var/www/html/danhausch-com` on `187.77.48.10`. GitHub Actions runs validation only. Commits and merges do not deploy this site. The old GitHub Pages deployment workflow has been removed.

The `/form/` page also requires the existing `/form/api/` backend proxy. Static local hosting does not provide that API. See [ops/README.md](ops/README.md). The home qualification flow uses WhatsApp and does not depend on it.

Production staging copies, credentials, environment files and visitor data are excluded. Previous versions of the BA mentoring site remain available in this repository's Git history. Avenor branches are preserved under `archive/avenor/*`.

The 2026-10-28 UX changes and deployment scope are documented in [docs/ux-release-20261028.md](docs/ux-release-20261028.md). Email and WhatsApp remain mandatory. Browser checks also cover visible step headings, review edits/cancellation, catalog localization and the undated workshop interest flow.
