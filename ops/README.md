# Existing production hosting

These files document the configuration captured during the 2026-10-28 consolidation. They are not automatically applied.

- Host: `187.77.48.10` (`srv1399783`).
- Static root: `/var/www/html/danhausch-com`.
- Active Nginx config: `/etc/nginx/sites-available/danhausch.com.conf`.
- HTTP redirects to HTTPS; certificate provisioning is managed outside this repository.
- `/form/api/` proxies to `127.0.0.1:5094`, the `agplace-form.service` diagnostic API.
- Backend code location: `/opt/agplace-form/app.py`.
- Existing service environment: `/etc/agplace-form.env` (never copy into Git).
- Generated diagnostic PDFs: `/var/lib/agplace-form/pdfs` (not source code).

`nginx-danhausch.conf` and `agplace-form.service` are the captured configuration. The service currently uses the server's existing Python environment. `backend/diagnostic/requirements.txt` records its installed Flask, Pillow and Gunicorn versions. Reproducing the service elsewhere requires provisioning its Python environment, directories, fonts and SMTP settings; installing these config files alone is insufficient.

## Local backend checks

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r backend/diagnostic/requirements.txt
.venv/bin/python -m unittest discover -s tests -p 'test_backend.py'
```

The backend tests mock PDF generation and email sending. They do not contact SMTP or production.

The API source is imported unchanged. Its operational behavior and existing validation are preserved, rather than redesigned as part of the website migration. No credentials or existing PDF data are included. The home qualification flow is independent and opens WhatsApp after review; the separate `/form/` page posts to this diagnostic API.

## Deployment boundary

This consolidation does not modify production files or restart services. A future release should back up the document root, run validation, copy only public website files (not `.git`, dependencies, tests, `backend`, `ops` or docs), preserve unrelated live routes and assets, and verify the public pages and backend proxy. The dated asset paths are retained to match the live site's references; changes to those assets should include cache-version updates when preparing a deployment.
