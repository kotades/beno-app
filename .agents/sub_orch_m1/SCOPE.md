# Scope: M1 (Asset Downloader)

## Architecture
- Module/package boundaries: Python Playwright script that scrapes 59 yacht detail pages on beno.com and downloads images/videos to `public/assets/main-yatchs-imgs/`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Asset Downloader | Scrape beno.com/yachts for 59 listings, download images/videos to `public/assets/main-yatchs-imgs/` with constraints | none | IN_PROGRESS |

## Interface Contracts
### Asset Downloader ↔ File System
- Delete existing yacht images in `public/assets`.
- Create `public/assets/main-yatchs-imgs`.
- Create 59 subfolders named after each yacht slug/id.
- Extract images and videos.
- Throttling & Retries: 3 per batch, 1-min delay, 3 retries per page.
- Double-pass search.
- Download and sequentially label assets.
