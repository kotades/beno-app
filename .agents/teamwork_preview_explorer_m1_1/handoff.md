# Observation
- Target URLs: `https://www.beno.com/yachts` and `https://www.beno.com/yachts/solana/93GG63`.
- Due to network mode (`CODE_ONLY`) restrictions preventing live requests, analysis relies on existing investigation scripts (`scripts/investigate_fleet_cards.js`, `scratch/fetch_solana.py`) and cached data (`scratch/solana_data.json`).
- `scripts/investigate_fleet_cards.js` extracts yacht cards using `a[href*="/listings/yacht"], a[href*="/yachts/"]`, parsing child `img` tags for media and `h3`, `h4`, `p`, `span` for titles and specs.
- `scratch/fetch_solana.py` extracts the detail page by grabbing `h1` for title, all `img` tags (filtering for src containing `yacht` or `solana`), and structural text from `p`, `h2`, `h3`, `li`, `span` tags.
- Cached data in `scratch/solana_data.json` reveals the presence of structured labels like "Route Details", "Minimum Rental Hours", and CloudFront URLs for images.
- `PROJECT.md` specifies saving assets to `public/assets/` and data to a SQLite DB.

# Logic Chain
1. **Playwright Extraction Strategy**: Python Playwright is needed to render JS-heavy content. The scraper should use `async_playwright()`, load the target URLs, wait for `domcontentloaded`, and add a fixed sleep (e.g., 3-5 seconds) to ensure pricing and dynamic galleries hydrate before querying the DOM.
2. **CSS Selectors for Structural Data**:
   - *Yacht Cards (Category Page)*: `a[href*="/listings/yacht"], a[href*="/yachts/"]`
   - *Card Image*: `img` (inside the card locator)
   - *Card Details (Pricing/Specs)*: `h3`, `p`, `span` (inside the card locator)
   - *Detail Page Title*: `h1`
   - *Detail Galleries (Media Links)*: `img` (filter `src` attributes containing `cloudfront.net`, `yacht`, or `solana`)
   - *Detail Features, Routes, Pricing*: `p`, `h2`, `h3`, `li` (Filter by `inner_text()` containing key phrases like "Route Details:", "Minimum Rental Hours", "AED", "Guests", etc.)
3. **Media Download Strategy**:
   - The script should gather all valid `src` URLs into a set to avoid duplicates.
   - Use `httpx` or `aiohttp` to download the binary content asynchronously.
   - Save the files to the local directory `public/assets/`, naming them cleanly (e.g., `<yacht_id>_gallery_<index>.jpg`).
   - The scraper must transform the scraped CloudFront URLs to the new local paths (`/assets/...`) before storing them in the DB.
4. **SQLite Storage Strategy**:
   - Connect to the DB using Python's built-in `sqlite3` module.
   - Create relational tables: `yachts` (id, title, description, price, local_hero_image_path), `yacht_galleries` (yacht_id, local_image_path), and `yacht_features` (yacht_id, feature_name).
   - Use `INSERT OR REPLACE` statements to populate the DB with the structured dicts from Playwright.

# Caveats
- I am operating in a `CODE_ONLY` restricted mode, meaning these selectors could not be verified against the *live* DOM today and rely entirely on the cached investigation scripts present in the repository. If Beno updated their DOM structure recently, the scraper might require adjustments.
- Some specific dynamic selectors (like exact pricing nodes) may require precise filtering since they might share generic tags (`p` or `span`).

# Conclusion
The Playwright Python scraper should target generic anchors and image tags used in Beno's React app, cross-referenced with text-content matching to reliably extract unstructured data. The media download step must happen before DB insertion so that the DB holds only local `public/assets/` paths. A relational SQLite schema should be configured for the extracted data.

# Verification Method
1. Run the completed Python scraper script using Playwright.
2. Check `public/assets/` to confirm images were downloaded.
3. Open the SQLite database (e.g. using `sqlite3 db/cloned_beno_db.sqlite`) and execute `SELECT * FROM yachts;` to verify structured data insertion.
