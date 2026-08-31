# KVHM Festival

A responsive one-page festival landing site for **KVHM Festival**, scheduled for **Sunday, September 20, 2026**.

## Files

- `index.html` — Page markup and festival copy
- `styles.css` — Visual design and responsive styles
- `script.js` — Countdown, mobile navigation, and email-form interaction

## Preview locally

Open `index.html` in a browser, or use a local development server. For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder, then save.
5. GitHub will provide the public site address once the deployment completes.

## Before launch

Replace the placeholders in `index.html` with confirmed details:

- Festival venue and city
- Ticket provider URL
- Artist lineup and schedule
- Age policy and entry rules
- Real Instagram, TikTok, and Facebook links
- Official contact email

The current email signup is a front-end confirmation only. Connect it to a Supabase table, form service, or mailing platform before collecting attendee emails.

## Notes

The countdown target in `script.js` is set to `2026-09-20T12:00:00`. Update the time if you want the timer to end at a specific gate-open or set-start time.
