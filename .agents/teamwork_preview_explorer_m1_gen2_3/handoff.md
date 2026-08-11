# Handoff Report

## 1. Observation
- **Integrity Violation**: Lines 205-219 in `scripts/scrape_yachts.py` explicitly load local JSON artifacts (`scripts/fleet_cards_report.json`, `scratch/solana_data.json`) when `cards_data` or `solana_data` are empty. The `scrape_live` function also silently catches exceptions (lines 105-106).
- **Silent Failures in Downloads**: `download_image` (lines 64-66) catches exceptions and returns the intended `filepath` anyway, leading to database entries for non-existent image files.
- **Brittle Data Extraction**: 
  - Price parsing relies on strict negative index offsets: `price = int(full_text[i-2].replace(',', ''))` (line 136), causing bugs if the trigger text is early in the list.
  - Bare `except: pass` blocks swallow all parsing errors, defaulting values to 0.
  - Name parsing heuristic strictly excludes any text with numbers: `not any(char.isdigit() for char in text)` (line 140), dropping valid yacht names.
- **Incomplete Schema Usage**: `yacht_features` table is created (line 42) but never populated in `process_data`.

## 2. Logic Chain
- **Integrity**: To comply with the `development` integrity mode, the local file fallbacks must be completely removed. If the Playwright script fails or times out, it should either retry (e.g., using a backoff loop) or fail loudly by raising the exception. Faking data bypasses end-to-end verification.
- **Robustness (Downloads)**: `download_image` should return `None` (or raise an exception) if the download fails. The calling code must check for `None` before inserting the local path into the database.
- **Robustness (Parsing)**: Relying on relative line indices (`i-2`) is extremely fragile. The strategy should switch to Regular Expressions (regex) to extract numbers from strings matching price patterns (e.g., currencies), or iterate through the list maintaining context state. Bare exceptions must be replaced with specific ones (e.g., `ValueError`) and logged.
- **Robustness (Name Extraction)**: The `isdigit()` filter should be removed. Instead, the yacht name can often be reliably extracted as the first prominent text element before specifications (Guests, Cabins) or by specifically targeting the appropriate HTML tags (e.g., `<h3>` or `<h2>` within the card).
- **Completeness**: The Solana detail page contains feature lists. These should be extracted during `scrape_live` and inserted into the `yacht_features` table in `process_data`.

## 3. Caveats
- No code implementation is provided here per the read-only constraints.
- We assume the Beno website DOM structure has not changed drastically and the necessary data (prices, names, features) is still exposed in the scraped text/HTML.

## 4. Conclusion
The script `scripts/scrape_yachts.py` must be refactored to remove all fake data fallbacks, enforcing genuine live scraping. Error handling must be tightened up to avoid silent failures (especially in image downloads and data casting), and data extraction logic needs to shift from brittle array-index offsets to regex or robust state-based parsing. Additionally, `yacht_features` must be populated.

## 5. Verification Method
1. Ensure `scripts/fleet_cards_report.json` and `scratch/solana_data.json` are deleted or ignored.
2. Run `python scripts/scrape_yachts.py` and ensure it executes without reading local fallbacks.
3. Query `db/cloned_beno_db.sqlite` using `sqlite3` to verify:
   - `price` > 0 for parsed yachts.
   - `yacht_features` table contains rows.
   - Image paths in `hero_image` and `yacht_galleries` correspond to actual files in `public/assets/`.
   - `name` fields correctly capture yacht names even if they contain numbers.
