# Handoff Report

## 1. Observation
- **Integrity Violation**: Lines 205-219 in `scripts/scrape_yachts.py` implement a fallback to read `scripts/fleet_cards_report.json` and `scratch/solana_data.json` if Playwright fails.
- **Robustness Issue 1 (Images)**: `download_image` at line 66 returns `filepath` even in the `except` block, causing broken paths to be saved to the database.
- **Robustness Issue 2 (Brittle Parsing)**: Line 136 uses negative indexing (`full_text[i-2]`) to find the price, which will wrap around the list if `i < 2`. The script relies heavily on bare `except: pass`, failing silently to `0`.
- **Robustness Issue 3 (Name Heuristics)**: Line 140 filters out names with digits `not any(char.isdigit() for char in text)`, which drops valid yacht names (e.g., "Sunseeker 50").
- **Completeness Issue**: The `yacht_features` table is created (line 42) but never populated during the data processing phase.

## 2. Logic Chain
1. **Integrity**: The presence of static file fallbacks bypasses the core requirement of live extraction. Removing these and relying strictly on Playwright (adding retry logic instead) is required to pass the integrity check.
2. **Image Downloads**: Returning a filepath on a download error falsely assumes success. The function should return `None` on failure, and the database insertion must respect this by not inserting broken links.
3. **Parsing**: Negative list indexing is dangerous and brittle. Using Regular Expressions (e.g., `re.search(r'\$?([\d,]+)\s*/\s*hour', text)`) provides a safer and more robust way to extract numeric values regardless of exact line ordering. Specific exception handling must replace `except: pass`.
4. **Name Heuristics**: Yacht names frequently contain numbers to denote length or model. The digit exclusion rule must be removed. Instead, the script should identify the name as the first meaningful text block that isn't a known metadata string.
5. **Feature Extraction**: To fulfill the schema, the script must parse amenities/features from the scraped texts (e.g., from `solana_data['texts']` or bullet points) and insert them into the `yacht_features` table.

## 3. Caveats
- Without a live view of the `beno.com` DOM, the exact regular expressions for price and features will need to be flexible enough to handle slight UI variations.
- Removing fallbacks means the script is entirely dependent on network reliability; Playwright timeouts must be handled gracefully with retries or explicit failure exits rather than mock data.

## 4. Conclusion
The current `scripts/scrape_yachts.py` violates integrity rules and contains brittle parsing logic. The strategy for the Implementer is:
1. **Remove Local Fallbacks**: Delete the fallback file loading logic. Implement a retry loop (e.g., 3 attempts) for `scrape_live`.
2. **Fix `download_image`**: Return `None` on exception. Only write to the DB if a valid string is returned.
3. **Refactor Parsing**: Replace array index math with Regex for prices and numerical data. Remove the `isdigit()` check for yacht names. Remove bare `except: pass` blocks.
4. **Populate Features**: Add logic to extract yacht features from the scraped text and execute `INSERT INTO yacht_features`.

## 5. Verification Method
1. Execute the script: `python scripts/scrape_yachts.py`.
2. Verify it runs without error and attempts a live connection (ensure no fallback files are present or read).
3. Inspect the SQLite DB: `sqlite3 db/cloned_beno_db.sqlite "SELECT name, price, hero_image FROM yachts;"`
   - Check that names include numbers (e.g., "Solana 50").
   - Check that prices are non-zero.
   - Check that image paths only exist if the file actually downloaded.
4. Verify features: `sqlite3 db/cloned_beno_db.sqlite "SELECT * FROM yacht_features;"` to ensure the table is populated.
