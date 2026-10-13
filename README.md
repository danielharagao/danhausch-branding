# Avenor website

Buildless website for the existing GitHub Pages repository. Serve the repository root with any static web server. No runtime packages, secrets or external form services are required for this preview.

## Current scope

- Balanced brand positioning: intelligence in motion, more time for business growth, improved operations and execution capacity. Strategy, engineering and applied intelligence are described through practical services and applications; technology remains a means.
- Original hero line morph and Complexidade → Clareza → Movimento scroll narrative preserved.
- Complete PT-BR/EN interface; only language preference is stored in localStorage. Monetary ranges remain explicitly BRL in both languages.
- Five qualification questions, contact capture, consent and review/scheduling preview. Answers remain in page memory only. Submission is disabled and no appointment is booked.
- Semantic radio groups, labels, keyboard navigation, focus indicators, announced errors, responsive layouts and reduced-motion narrative.
- Controller and privacy contact reflect details supplied by the owner. No invented credentials, endpoints, contact destinations or calendar links.

## Deferred integrations — owner decision required

The owner explicitly requested UI first and integrations later. Before enabling collection, define:

1. Backend/service account and lead destination. GitHub Pages provides static hosting only. Do not put private credentials in frontend code.
2. Approved calendar provider/link and whether confirmed lead submission precedes scheduling.
3. Retention period, processor disclosure, legal basis and privacy notice review. The contact authorization is specific to this request; marketing permission must be separate.
4. Optional analytics destination. Current `avenor:analytics` CustomEvents contain only event name, step number and language. They contain no contact details and are not sent remotely. These are instrumentation hooks, not measured production analytics.

A connected backend must validate all fields and canonical option values server-side, limit body size, restrict origins, apply rate limiting and anti-abuse controls, support idempotency, keep secrets server-side, minimize stored data, enforce retention/deletion and avoid logging contact data. The interface must handle pending, retryable error and confirmed-success states based on actual server responses; only confirmed success may reveal the real scheduler. No simulated success state is included in this preview.

## Validation

Run `node --check app.js`, `node --check effects.js`, and `node --check content.js`.

With Playwright installed, run `node tests/browser.cjs`. The test starts and closes its own localhost server and uses synthetic data. It checks 1440px, 390px and 320px viewports, overflow, original SVG effects, required fields, language switching without answer loss, disabled submission, reload persistence and reduced-motion content. Screenshots are saved under `/tmp`.

## Release

Review and merge the pull request only when the desired preview/release scope is approved. No change to the repository's Pages configuration is included. The integrations above remain required for a real end-to-end lead funnel.
