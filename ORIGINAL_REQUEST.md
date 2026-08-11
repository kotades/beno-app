# Original User Request

## Initial Request — 2026-08-07T20:44:56Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Execute the delegated teamwork plan

Clone the `beno.com/yachts` category page and a specific vehicle detail page (e.g. Solana) using Playwright for asset extraction and React for the frontend implementation, matching the provided screenshots exactly.

Working directory: `/home/sanniinuoluwadunsimi/Documents/Sanni Workspace/beno app`
Integrity mode: development (full autonomy to replicate screenshots and functionality)

## Requirements

### R1. Data & Asset Extraction
Write and execute a Python Playwright script to extract all images, videos, texts, and structural data from `https://www.beno.com/yachts` and `https://www.beno.com/yachts/solana/93GG63`. Store the media systematically in the local `public/assets/` directory.

### R2. Dedicated Schema & Database
Create a new, dedicated schema and SQLite database (separate from the existing `cloned_catalog.json`) to store the complex hierarchical data for the Yachts category and the specific detailed views (galleries, features, pricing, routes).

### R3. Category Page Implementation
Build out the UI for the Yachts Category Page, featuring the top video banner section and the comprehensive grid of yacht cards. Ensure the UI dynamically loads the assets extracted in R1 and interfaces with the database in R2.

### R4. Vehicle Detail Page Implementation
Build out the UI for the Listing Detail Page (using Solana as the reference). This includes the complex 1+4 image gallery, sticky pricing/booking sidebar, comprehensive feature icon grid, and the trip destination route map.

## Acceptance Criteria

### Verification & Testing
- [ ] A Playwright test suite must be written and executed to compare the visual structural hierarchy of `localhost:3000/yachts` and `localhost:3000/yachts/solana/93GG63` against the live `beno.com` equivalents.
- [ ] The Playwright tests must verify that JavaScript functionality (image galleries, sticky sidebars, and basic click events) operates identically between the local clone and the production site.
- [ ] `npm run build` must complete successfully with 0 errors.

---
*Next: when approved → delegate via invoke_subagent (see Delegation Protocol)*

## Follow-up — 2026-08-08T04:35:51Z

Implement a multi-agent system to scrape, download, catalog, map, and visually verify 59 yacht detail pages from beno.com into our local React application with a target similarity of 95%.

Working directory: `/home/sanniinuoluwadunsimi/Documents/Sanni Workspace/beno app`
Integrity Mode: development

## Requirements

### R1. Asset Downloader & Folder Structuring
- Delete any existing yacht images in the public assets folder to avoid pollution.
- Create a dedicated folder: `public/assets/main-yatchs-imgs`.
- Create 59 subfolders within `main-yatchs-imgs` named after each yacht slug/id.
- For each of the 59 target links, search and extract all image and video assets.
- **Throttling & Retries**: Process target links in batches of 3, with a 1-minute delay between batches.
- **Failures**: Retry failed page loads up to 3 times. If all 3 attempts fail, fall back to standard template details and placeholder assets.
- Perform a double-pass search (initial + confirmation) to guarantee complete asset capture.
- Download and sequentially label assets, saving them in their respective subfolders.

### R2. Local Data Catalog Mapping
- Extract the scraped metadata (features, prices, specs) and map them into the local database file `src/data/yachts_db.json`.
- Bind each yacht detail view page dynamically to load these newly stored local assets.

### R3. Playwright Structural Verification Loop (Confirmation Auditor)
- Create a Playwright testing script to structurally compare pages on `http://localhost:4000/yachts/[slug]/[id]` against `https://www.beno.com/yachts/[slug]/[id]`.
- **Validation Criteria**: Compare structural elements including `innerText` blocks, image sources, layout hierarchy, and element positions.
- Verify layout similarity, asset orders, spec grids, and sidebar pricing.
- If similarity is below 95%, log the mismatch details and trigger a correction pass (loop).

## Acceptance Criteria

### Verification & Testing
- [ ] 59 subfolders successfully created inside `public/assets/main-yatchs-imgs`.
- [ ] Mapped assets load successfully on localhost routes without breaking existing React components.
- [ ] Playwright structural auditor script runs, validates structural alignment, and achieves a >95% similarity match.
- [ ] `npm run build` compiles with 0 errors.
