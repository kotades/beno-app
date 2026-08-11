# Project: Beno App - Yacht Scraper & Replicator
# Scope: Root

## Architecture
- React frontend
- Playwright scraper and test scripts
- SQLite / JSON data storage (`src/data/yachts_db.json`)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Asset Downloader | Scrape beno.com/yachts for 59 listings, download images/videos to `public/assets/main-yatchs-imgs/` | none | PLANNED |
| 2 | Data Catalog Mapping | Extract metadata (features, prices, specs) to `src/data/yachts_db.json` and map UI | M1 | PLANNED |
| 3 | Playwright Verification | Test structural alignment with >95% similarity | M2 | PLANNED |

## Interface Contracts
### scraper ↔ db
- Output structured JSON / DB records representing yachts

## Code Layout
- `public/assets/main-yatchs-imgs/`
- `src/data/yachts_db.json`
