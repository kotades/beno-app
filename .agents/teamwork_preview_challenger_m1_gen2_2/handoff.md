# Handoff Report: Stress Testing `scrape_yachts.py`

## 1. Observation
I reviewed `scripts/scrape_yachts.py`. The script uses `playwright` to scrape yacht listings and a specific yacht page, extracting text and image URLs. It downloads images to a local directory and stores the data in a SQLite database. 

I observed the following critical vulnerabilities during static analysis:

**Observation A (Set Unordered Iteration & Cache Poisoning):**
In `process_data`, line 222:
`for i, url in enumerate(set(solana_data.get('images', []))):`
The script iterates over a `set()` of image URLs. Python sets are unordered, and string hashes are randomized per process. The index `i` is used to construct the filename: `filename = f"{yacht_id}_gallery_{i}.{ext}"` (line 226). 
In `download_image` (line 56), the script caches images: `if os.path.exists(filepath): return filepath`.

**Observation B (Fragile Regex for Guests/Cabins):**
In `process_data`, line 142:
```python
if 'Guests' in text or 'guests' in text.lower():
    m = re.search(r'(\d+)', text)
    if m: guests = int(m.group(1))
```
It extracts the *first* number found in the string. If a string is "2 crew and 12 guests", `re.search` matches `2`, setting `guests = 2`.

**Observation C (Fragile Price Extraction):**
Lines 153-167: Prices are extracted by searching previous text nodes for strings that match `^[\d,]+$`. If any other numerical value (like a length or ID) was alone on a line before the price, it will be added to `possible_prices`, leading to incorrect `price` and `original_price` assignments.

## 2. Logic Chain
- **Regarding Observation A:** Because `set()` order is unpredictable across different runs, the URL assigned to index `0` will change. If the file `93GG63_gallery_0.jpg` already exists from a previous run, `download_image` will skip downloading and immediately return the path. This associates the *new* URL with the *old* image content. Over multiple runs, the gallery images will become completely mismatched to their intended URLs.
- **Regarding Observation B:** The script blindly assumes the first integer in a text block mentioning "guests" or "cabins" represents the count. Real-world listings often mention crew count or dimensions in the same sentence, breaking the parser.
- **Regarding Observation C:** By assuming any line containing only digits and commas is a price, the script is highly vulnerable to layout changes or additional numeric metadata (like an arbitrary ID or year "2023" formatted without letters).

## 3. Caveats
- Since the script requires Playwright browsers which might not be installed, and runs against a live external website (`beno.com`), I did not execute it dynamically to prevent network calls and potential timeout/permission issues. The stress testing was performed via static adversarial analysis.
- The layout of the target website is assumed to be variable; if the website never changes its exact text format, the regex bugs might not trigger immediately, though the set iteration bug (A) will trigger on the second run regardless of layout.

## 4. Conclusion
The script `scrape_yachts.py` is critically flawed. 
1. **Critical:** The image downloading logic suffers from a caching mismatch due to unordered `set()` iteration. Repeated runs will corrupt the gallery image mapping.
2. **High:** Data extraction logic is extremely brittle and relies on weak regex that will fail on reasonable variations in listing text (e.g., "2 crew, 12 guests").
3. **High:** Live scraping lacks fallback mechanisms. A single timeout will crash the script, discarding all data instead of gracefully failing or relying on the DB cache.

## 5. Verification Method
1. **Verify Bug A:** Run the script twice. Add a print statement in `process_data` to output `url` and `filename`. Observe that between runs, different URLs are assigned to `_gallery_0.jpg`, but the file is not re-downloaded because of `os.path.exists`.
2. **Verify Bug B:** Modify `scrape_live` to return mock `cards_data` with `fullText: ["2 crew and 12 guests"]`. Run the script and check the SQLite database; `guests` will be `2` instead of `12`.
3. **Verify Bug C:** Add `"2023"` (a year) as a separate text line before the `/ hour` line in the mock data. Observe `orig_price` being set to `2023`.
