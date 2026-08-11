# Handoff Report: Scraper Investigation

## 1. Observation
- The target URLs are `https://www.beno.com/yachts` (Category) and `https://www.beno.com/yachts/solana/93GG63` (Detail).
- The network environment is restricted (`CODE_ONLY`), preventing direct live extraction via HTTP requests during this investigation phase.
- Existing crawler scripts in `scripts/` (e.g., `investigate_fleet_cards.js`, `investigate_services_section.js`) reveal that Beno uses modern SPA (Single Page Application) structuring, likely React/Next.js.
- Previous extraction logic relied on attribute and partial class matching due to dynamically generated class names (e.g., `[class*="card"]`, `a[href*="/yachts/"]`).

## 2. Logic Chain
- **Playwright Navigation**: Since the site is dynamic, Python Playwright is the correct tool. The script must use `page.goto(url, wait_until='networkidle')` to ensure all React components and images are fully hydrated before DOM extraction.
- **Selector Robustness**: Because class names might be hashed (e.g., `.card_1a2b`), using wildcard selectors like `[class*="price"]` or tag-based hierarchy provides the most resilience.
- **Media Strategy**: Extracting the `src` attribute from `img` and `video` tags is straightforward. We need a secondary step to fetch the binary data and save it to `public/assets/`, replacing the original remote URL with the local relative path (`/assets/...`) for the database insertion.
- **Data Persistence**: Python's built-in `sqlite3` module is sufficient for storing structural data. The schema must mirror the UI requirements defined in `PROJECT.md` (galleries, features, pricing, routes).

## 3. Caveats
- Direct access to the live URLs was blocked during investigation; the provided CSS selectors are derived from previous workspace crawler scripts and standard web conventions. They must be validated by the implementer against the live DOM when the Playwright script executes.
- If the site uses anti-scraping protections (e.g., Cloudflare), Playwright may need stealth plugins or specific user-agent headers.

## 4. Conclusion
To implement the data extraction (M1):

**A. CSS Selectors (To Validate)**
- **Yacht Cards (Category)**: `a[href*="/yachts/"], [class*="card"], article`
  - *Title*: `h3, h4, [class*="title"]`
  - *Price*: `[class*="price"]`
- **Gallery (Detail)**: `[class*="gallery"] img, .carousel img, .splide img`
- **Pricing Sidebar (Detail)**: `aside [class*="price"], [class*="sidebar"]`
- **Features (Detail)**: `[class*="feature"] ul li, .specs li`
- **Routes (Detail)**: `[class*="route"], [class*="map"] iframe`
- **Media Links**: `img`, `video > source`

**B. Media Download Strategy**
- For each scraped media URL (images/videos), use the Python `requests` library to download the raw binary.
- Save to `/home/sanniinuoluwadunsimi/Documents/Sanni Workspace/beno app/public/assets/` using a slugified filename or original filename.
- Mutate the scraped JSON object so the `image_url` points to the local path (e.g., `/assets/image.webp`) instead of the CDN.

**C. SQLite Database Strategy**
- **Schema Design**:
  - `yachts` (id, title, category, price, local_asset, description)
  - `yacht_galleries` (yacht_id, local_url)
  - `yacht_features` (yacht_id, feature_text)
- **Execution**: Establish a connection to `db/beno.db`, create tables `IF NOT EXISTS`, and perform `INSERT OR REPLACE` operations to ensure idempotency.

## 5. Verification Method
- **Implementation**: The implementer will write `scripts/scraper.py` using Python Playwright.
- **Test**: Run `python scripts/scraper.py`.
- **Validation**: Verify that `public/assets/` populates with media files, and `db/beno.db` contains the scraped titles, prices, and features. Query the DB using `sqlite3 db/beno.db "SELECT * FROM yachts;"` to confirm.
