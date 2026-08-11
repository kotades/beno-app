# Home Page Link Routing + Custom 404 — Design

**Date:** 2026-08-11
**Status:** Approved

## Problem

Public home-page links either lead nowhere or point at non-existent routes:

- The **"Our Services" tiles** (Yacht Charter, Car Rental, Heli Tours, Desert Buggy Rentals, Watersport Activities, Private Jet Charter) are `<div>`s with `cursor-pointer` but **no link** — clicking does nothing.
- Wrong-route typos: buggy section links use `/buggies-rental` (no such route); blogs link uses `#`.
- No-destination links: "See All Partners" and "Read all review on Google maps" use `href="#"`.

## Fix

### 1. `src/app/page.tsx` — fix dead links

**A. "Our Services" tiles (lines 45-60):** add a `route` field to each tile and wrap the tile `<div>` in `<Link>`:

| Tile | Route |
|---|---|
| Yacht Charter | `/yacht-rental` |
| Car Rental | `/rent-a-car` |
| Heli Tours | `/aerials` |
| Desert Buggy Rentals | `/buggies` |
| Watersport Activities | `/water-activities` |
| Private Jet Charter | `/private-jet` |

**B. Wrong-route typos:**
- `:277` "View All" (Buggy section) → `/buggies`
- `:286` buggy card → `/buggies`
- `:374` "View All Blogs →" → `/blogs`

**C. No-destination links → new pages:**
- `:319` "See All Partners" → `/partners`
- `:362` "Read all review on Google maps" → `/reviews`

### 2. New `/partners` page — `src/app/partners/page.tsx`

- Reads `section_11` assets from `src/data/home_db.json` (partner logos: Sustainable City, Mandarin Oriental, Right Jet, Omniyat, Bâoli, Al Habtoor Palace, DoubleTree, Emirates Palace, J1 Beach, JA Resorts, …)
- Header + responsive logo grid, grayscale → color on hover (matches home section styling)
- Same layout shell: header, `Footer`, teal `#008B9B` accent

### 3. New `/reviews` page — `src/app/reviews/page.tsx`

- Reuses the 3 review cards from the home page (serek2137, Osman Jusufi, Sean)
- Matches home review-card styling (avatar initial, 5-star, name, date, body)

### 4. Custom 404 — `src/app/not-found.tsx`

Next.js `not-found` convention — auto-handles any unknown route. Branded:
- BENO logo wordmark
- "Page not found" heading
- Short message + links to home and services
- Matches site styling

## Out of Scope

- No new data models, no new dependencies.
- Yacht/car "View All" links already correct — untouched.
- Home hero/section content unchanged.

## Verification

- `npm run build` passes (should be 25 static pages: +2 new + 404).
- Manual: click each of the 6 service tiles → correct route; buggy/blogs links land; `/partners`, `/reviews` render; a nonsense URL (`/nope`) shows the branded 404.
