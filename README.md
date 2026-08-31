# Kennebec Valley House Music Festival

A public landing page for the free **Kennebec Valley House Music Festival**.

## Event

- **Date:** Sunday, September 20, 2026
- **Hours:** 2:00 PM–8:00 PM (Eastern time)
- **Venue:** Mill Park Pavilion
- **Address:** 1 Water St., Augusta, ME
- **Admission:** Free Event
- **Updates:** [@groovkulcha](https://www.instagram.com/groovkulcha/)

## Visitor actions

The page includes:

- A **Get Directions** button that opens Google Maps for Mill Park Pavilion
- A **Share Event** button that uses native device sharing where available, with a copy-link fallback
- Instagram contact and announcement links

## Separate KVHM backend

This site uses the separate **KVHM Festival Backend** Supabase project, not Resonance Pulse Rewards.

The public page sends limited anonymous event activity to the `festival-activity` endpoint:

- `page_view`
- `directions_click`
- `share_click`
- `instagram_click`

No names, emails, precise location, sharing recipients, or message contents are collected by this feature. The endpoint accepts only the event slug, allowed action name, and an optional referrer domain. It does not provide public read access to event activity.

## Local preview

Open `index.html` directly in a browser, or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages

1. In the GitHub repository, open **Settings** → **Pages**.
2. Select **Deploy from a branch**.
3. Choose `main` and `/ (root)`.
4. Save and wait for GitHub Pages to deploy.

## Future edits

Replace the “DJs to be announced” copy when the lineup is confirmed. The flyer can be added to an `assets/` folder when a repository upload route is available.
