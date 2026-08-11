# Handoff Report: Scrape Yachts Analysis & Strategy

## 1. Observation
- **Image URL Extensions**: In `scripts/scrape_yachts.py` (lines 224-225), the script extracts image extensions using `ext = url.split('.')[-1]`. If the URL has query parameters like `image.png?v=123`, this evaluates to `png?v=123`, and because its length is > 4, it incorrectly falls back to `jpg`.
- **Caching Mismatch**: In lines 222 and 233, `set()` is used to deduplicate images and features (`set(solana_data.get('images', []))`). Since sets are unordered in Python, the iteration order is non-deterministic, causing filename indexing (`yacht_id_gallery_{i}`) to shuffle on every run.
- **Brittle Regex Extractions**:
  - In lines 142-150, `re.search(r'(\d+)', text)` is used to find guests, cabins, and length. This will blindly grab the first number in the text, even if it's unrelated (e.g., an age limit).
  - In line 157, `re.match(r'^[\d,]+$', prev_text)` is used for price extraction, which technically matches strings containing only commas (e.g., `,`), relying entirely on catching a `ValueError` during `int()` conversion.
  - In line 195, description extraction relies on checking `if 'masterpiece' in t.lower() or 'charter experience' in t.lower()`, which is highly specific and likely to break if the text changes slightly.
  - In lines 197-203, minimum hours extraction splits by `:` and then runs another loose `\d+` regex.
- **Scope limitation**: Lines 80-81 and 88-89 correctly hardcode the category page and the specific Solana detail page (`https://www.beno.com/yachts/solana/93GG63`), as requested by the user prompt constraints.

## 2. Logic Chain
- The image extension parsing must be decoupled from the query string. Using `urllib.parse.urlparse(url).path` before splitting handles this safely.
- The cache busting is directly caused by the random order of `set()`. Replacing `set(list)` with `list(dict.fromkeys(list))` preserves the original insertion order while removing duplicates, ensuring consistent filenames and cache hits.
- The regex extractions frequently fail or capture incorrect data because they lack context-awareness. Tying the numeric extraction to the adjacent keyword (e.g., `re.search(r'(\d+)\s*guests', text, re.I)`) prevents false positives.
- Description extraction should avoid hardcoding marketing fluff words. It can instead rely on text block length or natural structure.
- Fixing these issues directly addresses Reviewer 1 and Challenger 2 feedback.

## 3. Caveats
- No code was implemented in this turn as the task requested a strategy and analysis only.
- Description extraction heuristics (like picking the longest string) might accidentally capture unrelated boilerplate if the page layout changes, but it is vastly superior to hardcoding specific marketing words.

## 4. Conclusion
The script's failures stem from naive string manipulation and non-deterministic deduplication. 
**Strategy for the new implementation:**
1. **URL Extensions**: Import `urllib.parse` and use `os.path.splitext(urllib.parse.urlparse(url).path)[1].strip('.')` to reliably isolate the extension.
2. **Caching**: Replace `set(iterable)` with `list(dict.fromkeys(iterable))` in the loops for images and features to maintain deterministic ordering.
3. **Regex Hardening**: 
   - Update `guests`, `cabins`, and `length` to use bounded regexes: `re.search(r'(\d+)\s*(?:guests|cabins|ft|m|length)', text, re.I)`.
   - Update price matching to require at least one digit: `re.match(r'^\d[\d,]*$', prev_text)`.
   - Extract minimum hours using a single clean regex: `re.search(r'minimum rental hours\D*(\d+)', t, re.I)`.
   - Redefine description extraction to pick the longest text block over a certain length (e.g., `len(t) > 50`) rather than looking for "masterpiece".
4. **Scope**: Keep the Playwright navigation exactly as-is, focusing on the category list and `93GG63`.

## 5. Verification Method
- Execute the updated `scripts/scrape_yachts.py`.
- Run the scraper multiple times and verify that the `public/assets/` directory does not redownload or rename images (hash/cache should hit).
- Verify the SQLite database `db/cloned_beno_db.sqlite` contains accurate values for guests, cabins, length, and minimum hours.
- Verify image paths in the database end with correct extensions (not `.jpg` defaults for `.png?v=...` URLs).
