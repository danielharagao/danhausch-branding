# UX release — 2026-10-28

Approved scope: implement the live-site UX audit, keeping email and WhatsApp mandatory.

- Six core pages share the Danhausch header, product navigation, accessible mobile menu, footer and navy/cream palette. Product, professional and business content is translated into English with the same persisted language preference as the consulting pages.
- Services follow the home hero, followed by a product entry point. Mobile uses a shorter unpinned hero and a readable three-stage narrative; desktop retains the SVG animation with a shorter scroll track. All existing qualification questions and revenue options are retained.
- Each qualification step scrolls below the fixed header and receives heading focus. Revenue choices are presented in two columns on mobile with full accessible labels. Mobile form actions remain visible while scrolling the form.
- Review has an edit button for each answer. Saving returns directly to review; cancel restores the previous answers. Required email, WhatsApp and consent validation also applies when editing contact details.
- BA career mentoring is an explicit catalog product.
- `landing-pages/ba.html` records the workshop landing page served at `https://lp.danhausch.com/ba`. The source used an undated `next` session. The page now clearly announces that date and time are not set and offers a visitor-confirmed WhatsApp interest-list message. There is no payment-link creation script or enabled checkout for an undated session. Program blocks show elapsed minutes rather than suggesting an already scheduled evening session. Header, footer and English support are shared with the main site.

## Hosting scope

Main site: update only `index.html`, `sobre.html`, `privacidade.html`, `produtos/index.html`, `profissionais/index.html`, `empresas/index.html` and the new immutable `/assets/site-20261028-ux/` directory. Existing dated assets, standalone diagnostic form, API, portfolio, other live routes, visitor data and configuration remain untouched.

Landing-page host: update only `/var/www/html/predictive-history/ba.html`. Keep existing Nginx routing, workshop pages, payment APIs and infrastructure untouched. Before payment can be offered again for BA, a concrete session date and time must be confirmed and shown before the payment action.

Deployment must back up the current document root and original BA landing page, check that target files still match the reviewed baseline, write assets before HTML, and use atomic per-file replacement with rollback on failure. Production smoke tests must use synthetic local-only qualification data and must not send messages, create payment links or submit the diagnostic form.
