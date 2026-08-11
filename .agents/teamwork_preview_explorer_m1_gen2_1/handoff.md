# Handoff Report: `scripts/scrape_yachts.py` Failure Analysis & Strategy

## 1. Observation
- **Integrity Violation**: Lines 205-219 in `scripts/scrape_yachts.py` contain fallback logic that loads hardcoded, pre-populated data (`scripts/fleet_cards_report.json` and `scratch/solana_data.json`) when the Playwright scrape fails.
- **Error Swallowing**: Lines 64-66 in `download_image` catch generic exceptions and still return the local `filepath` even if the HTTP download fails, causing invalid paths to be saved in the database.
- **Brittle Data Extraction**: 
  - Lines 124-138 process text into arrays and use rigid offsets (e.g., `full_text[i-2]`) to find price, which causes negative indexing bugs.
  - Line 140 filters out yacht names using `not any(char.isdigit() for char in text)`, inappropriately dropping valid yacht names that contain numbers (e.g., "Solana 63").
  - Multiple `try/except: pass` blocks silently swallow failures, defaulting to `0` without logs.
- **Unpopulated Database Table**: Lines 41-48 create a `yacht_features` table, but `process_data` (Lines 112-196) contains no logic to insert data into it.

## 2. Logic Chain
1. The script bypasses live failures by using fabricated data artifacts, violating the strict `development` integrity requirements.
2. The HTTP download logic assumes success by returning `filepath` regardless of the outcome, polluting the database with broken image paths.
3. The parsing strategy relies on stripping all text into a 1D array (`fullText`) and scanning it sequentially, making the extraction heavily dependent on layout rendering order and extremely fragile. Dropping lines with digits inherently excludes real-world boat naming conventions.
4. The database structure expects feature tags (e.g., WiFi, AC, Bluetooth), but the Playwright extraction and data processor ignore features completely.

## 3. Caveats
- No caveats regarding the constraints. The observations stem directly from reading the implementation. I have not run the script to observe the scraping targets (Beno live site) to map exact DOM selectors. The implementer will need to inspect the live DOM to define the robust selectors recommended below.

## 4. Conclusion & Strategy
To fix the script, the following new strategy must be implemented:

1. **Enforce Integrity & Remove Fabricated Fallbacks**:
   - Completely remove the code blocks loading local `.json` files.
   - Implement retry loops inside `scrape_live` (e.g., up to 3 attempts).
   - Use explicit Playwright waits (`page.wait_for_selector('TARGET_CLASS')`) rather than hardcoded `asyncio.sleep()` statements.
   - If Playwright fails after retries, raise a loud exception. Do not mock success.
2. **Robust Image Downloading**:
   - Modify `download_image(url, filename)` to return `None` upon failure.
   - In `process_data()`, check if the return value is valid before saving the image path to the database.
3. **Resilient Data Extraction**:
   - **DOM-based Extraction**: Rather than parsing `.inner_text().split('\n')`, extract fields using specific Playwright selectors (e.g., `await card.locator('.price-class').inner_text()`).
   - **Regex for Pricing**: If string parsing is necessary, use regular expressions (e.g., `re.search(r'\$?([\d,]+)', text)`) to capture numbers safely instead of relying on array index math like `[i-2]`.
   - **Fix Name Identification**: Remove the `not any(char.isdigit())` check. Instead, pull the name explicitly from the title HTML element (e.g., `<h3>` or `.card-title`).
4. **Implement Feature Extraction**:
   - In `scrape_live`, scrape the amenities/features list from the yacht detail pages (e.g., Solana page).
   - Pass this feature list through to `process_data`.
   - Iterate over the list and explicitly `INSERT INTO yacht_features (yacht_id, feature_name)` for each feature found.

## 5. Verification Method
- **Verify Integrity**: Inspect `scripts/scrape_yachts.py` to confirm no `.json` reads exist. Disconnect the network, run `python scripts/scrape_yachts.py`, and assert that it correctly throws an error instead of passing silently.
- **Verify Robustness**: Run `python scripts/scrape_yachts.py` and query the sqlite database: `sqlite3 db/cloned_beno_db.sqlite "SELECT count(*) FROM yachts WHERE price = 0;"` (should be 0) and `sqlite3 db/cloned_beno_db.sqlite "SELECT count(*) FROM yacht_features;"` (should be > 0).
- **Verify Images**: Check that every `local_image_path` in the DB corresponds to a physically existing file in `public/assets/`.
