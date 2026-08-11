# Handoff Report: Analysis and Strategy for `scripts/scrape_yachts.py`

## 1. Observation
- **Image Extension Parsing**: In `scripts/scrape_yachts.py:224`, the image extension is extracted using `ext = url.split('.')[-1]`, followed by a fallback `if len(ext) > 4: ext = 'jpg'`. This fails to correctly parse extensions from URLs with query parameters (e.g., `image.jpg?v=123`).
- **Caching Mismatch Bug**: In `scripts/scrape_yachts.py:222` and `:233`, lists of images and features are deduplicated using `set(...)`. Since sets are unordered in Python, the loop index `i` (used to generate filenames like `_gallery_{i}`) is non-deterministic, causing the script to download images under different names on subsequent runs.
- **Brittle Regex Extractions**: In `scripts/scrape_yachts.py:143-150` and `:197`, data is extracted using `re.search(r'(\d+)', text)`. This blindly grabs the first sequence of digits in a string, which can easily capture irrelevant numbers (such as a year or model number) instead of the actual guest or cabin count. Pricing logic (`scripts/scrape_yachts.py:155-161`) relies on brittle exact matches after string replacement.

## 2. Logic Chain
- Because `url.split('.')` retains query parameters, it produces invalid file extensions when saving to disk. Using `urllib.parse.urlparse` to isolate the `path` component before extracting the extension solves this issue robustly.
- Because `set()` iterates in an unpredictable order, the indices assigned to gallery images change across executions, breaking the local file cache. Using an order-preserving deduplication method (like `list(dict.fromkeys(...))` or sorting) guarantees stable filenames and prevents the caching mismatch.
- Because the current regex simply looks for any digit `(\d+)`, it lacks context and is highly brittle. Tying the regex to the target keyword (e.g., `r'(?i)(\d+)\s*guests?'`) ensures the correct number is extracted even if other numbers exist in the string, preventing silent data corruption or failures.

## 3. Caveats
- No caveats regarding the scraping scope. The script intentionally hardcodes the `solana/93GG63` detail page, as crawling all yachts is not required for this milestone.
- The proposed regex improvements are robust against text content variations, but web scraping remains inherently vulnerable to major DOM structure changes.

## 4. Conclusion
**Implementation Strategy for `scripts/scrape_yachts.py`**:
1. **Fix Extension Parsing**: Import `urllib.parse` and replace `url.split('.')[-1]` with `os.path.splitext(urllib.parse.urlparse(url).path)[1]`. Strip the leading dot and provide a fallback if the extension is missing.
2. **Fix Caching Mismatch**: Replace the `set(solana_data.get('images', []))` and `set(solana_data.get('features', []))` iterations with deterministic, order-preserving deduplication, such as `list(dict.fromkeys(...))`.
3. **Strengthen Regex Extractions**: Update the regex patterns to explicitly bind the numeric extraction to the context keyword (e.g., `re.search(r'(?i)(\d+)\s*guests?', text)` and `re.search(r'(?i)minimum\s*rental\s*hours.*?(\d+)', text)`). Overhaul the price extraction to use `re.findall(r'\b\d{1,3}(?:,\d{3})*\b', text)` to capture formatted currencies reliably.
4. **Maintain Scope Constraint**: Keep the scraping scope restricted entirely to the category page (`/yachts`) and the Solana detail page (`/yachts/solana/93GG63`). Do not introduce general crawler logic.

## 5. Verification Method
1. Run `python scripts/scrape_yachts.py`.
2. Inspect `public/assets/` to verify that gallery images have valid extensions (`.jpg`, `.png`) without trailing query parameters (e.g., no `.jpg?v=123`).
3. Run the script a second time and check the console/logs to verify no new gallery images are downloaded (confirming the cache is stable).
4. Inspect the SQLite database (`db/cloned_beno_db.sqlite`) to confirm `guests`, `cabins`, `price`, and `minimum_hours` fields contain the correct extracted integers.
