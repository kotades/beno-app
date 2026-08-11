# Observation

The script `scripts/scrape_yachts.py` failed the Gate due to robustness issues. We reviewed the script content using `cat scripts/scrape_yachts.py` and observed the following:

1. **URL Extension Parsing:** At line 175, the script extracts extensions using `ext = url.split('.')[-1]`. For a URL like `image.jpg?v=123`, this produces `jpg?v=123`. The script attempts a naive fix `if len(ext) > 4: ext = 'jpg'`, which forces all query-parameterized URLs to be saved as `.jpg` regardless of their actual type (e.g. `.png`).
2. **Caching Mismatch Bug:** At lines 173 and 183, the script iterates over unordered sets (`set(solana_data.get('images', []))` and `set(solana_data.get('features', []))`). Due to Python's hash randomization across runs, the iteration order changes on every execution, causing `yacht_id_gallery_{i}` to map to different images and invalidating the caching strategy.
3. **Regex Fragility:** 
   - Lines 98-105: The extraction for Guests, Cabins, and Length simply checks for the word's presence, then pulls the first sequence of digits `re.search(r'(\d+)', text)`. If the text contains other numbers before the target metric, it will extract the wrong digit.
   - Lines 108-119: The price extraction relies on scanning `full_text[:i]` for preceding lines that consist entirely of digits and commas `re.match(r'^[\d,]+$', prev_text)`. This is highly sensitive to HTML layout changes (e.g. if a price is placed on the same line as the currency, or has whitespace).
   - Lines 149-155: The `minimum_hours` logic arbitrarily assumes a colon separates the key and value (`parts = t.split(':')`), which will break if the colon is omitted or placed differently.

# Logic Chain

1. **Extension Parsing Fix:** To correctly handle query parameters, the script should parse the URL using `urllib.parse.urlparse` to isolate the path, and then `os.path.splitext` to extract the true extension. For example: `ext = os.path.splitext(urlparse(url).path)[1].strip('.')`. If none exists, default to `jpg`.
2. **Deterministic Iteration Fix:** To maintain caching stability, lists must be deduplicated while preserving order. Instead of `set(data)`, the script should use `list(dict.fromkeys(data))` or `sorted(set(data))`. Order preservation is preferred for images to keep their displayed order.
3. **Robust Regex Extraction Strategy:**
   - Instead of checking for a word and then any digit, regex should explicitly link the number to the keyword. For example: `re.search(r'(\d+)\s*(?:Guests|Cabins)', text, re.IGNORECASE)`.
   - Instead of assuming price is on a separate line, use a broader regex on the full card text to find patterns like `r'(?:AED)?\s*([\d,]+)\s*/\s*hour'`.
   - `minimum_hours` should use `re.search(r'minimum rental hours.*?(\d+)', t, re.IGNORECASE)` to avoid dependency on colons.
4. **Scope Constraint:** The hardcoded URL `https://www.beno.com/yachts/solana/93GG63` should be kept as-is, per reviewer feedback, ensuring the scraper doesn't attempt to index the entire site.

# Caveats

- We assume that `dict.fromkeys()` is sufficient for deduplicating strings (image URLs and feature text).
- The exact layout of the Beno website could still change significantly (e.g. they stop displaying prices per hour), which would require further regex updates. The proposed regexes are more robust but not invincible to complete redesigns.

# Conclusion

To fix the robustness issues in `scripts/scrape_yachts.py`, we need to implement a strategy that:
1. Replaces `url.split('.')[-1]` with `urllib.parse.urlparse(url).path` and `os.path.splitext()` for accurate extension parsing.
2. Replaces `set()` iterations with `list(dict.fromkeys(...))` to ensure consistent ordering across script runs, fixing the caching bug.
3. Updates the regex extractions to explicitly capture digits in context (e.g., `(\d+)\s*Guests`, `AED\s*([\d,]+)`) rather than relying on brittle string splitting or newline assumptions.
4. Retains the explicit target of the category page and the Solana 93GG63 detail page.

# Verification Method

1. Run the updated `scripts/scrape_yachts.py` multiple times consecutively. The `yacht_galleries` and `yacht_features` records in the database should not change order or get re-inserted, verifying the caching fix.
2. Check the `assets/` folder to ensure images downloaded with query parameters have correct extensions (e.g. `.jpg`, `.png`), not `.jpg?v=xxx`.
3. Inspect the database `yachts` table to confirm that `guests`, `cabins`, `length`, `price`, and `minimum_hours` are correctly populated without silent failures.
