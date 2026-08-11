# Handoff Report

## 1. Observation
- **LFI/SSRF Vulnerability**: In `scripts/scrape_yachts.py` (lines 54-68), the `download_image(url, filename)` function calls `urllib.request.urlopen(req)` without validating the URL scheme. If the scraper encounters a `file://` scheme in the image source, it will read local files, causing a Local File Inclusion (LFI/SSRF) vulnerability.
- **ValueError Crash in Price Parser**: In `scripts/scrape_yachts.py` (lines 158-166), `price` and `orig_price` are parsed using `int(prices_found[-1].replace(',', ''))`. The regex `r'([\d,]+)'` can extract malformed strings (like a standalone comma), which become empty strings when commas are replaced, causing `int("")` to crash with a `ValueError`.

## 2. Logic Chain
- To fix the LFI vulnerability, we must strictly validate the URL scheme in `download_image`. Before downloading, the script should parse the URL with `urllib.parse.urlparse(url)` and explicitly block schemes other than `http` and `https`.
- To fix the `ValueError` crash, the price parser needs resilient error handling. We should modify the price extraction regex to ensure digits are matched (e.g., `r'\d+[\d,]*'`) and wrap the `int()` casts inside a `try...except ValueError:` block. If a cast fails, it should gracefully fall back to a default value (e.g., `0`) instead of crashing the entire script.

## 3. Caveats
- The changes proposed focus purely on the identified crash and security issue. If the scraped website layout changes significantly, Playwright selectors might still fail, though this is outside the scope of the current feedback.

## 4. Conclusion
**Strategy for `scripts/scrape_yachts.py`:**
1. **Secure `download_image`**: Add scheme verification:
   ```python
   parsed_url = urllib.parse.urlparse(url)
   if parsed_url.scheme not in ('http', 'https'):
       print(f"Blocked unsafe URL scheme: {url}")
       return None
   ```
2. **Fix Price Parser Crash**: Ensure the regex extracts valid digits and wrap conversions in a try/except block:
   ```python
   price_match = re.search(r'((?:AED\s*)?[\d,]+\s*(?:AED\s*)?[\d,]*)\s*/\s*hour', full_text_joined, re.IGNORECASE)
   if price_match:
       # Extract numeric groups safely
       prices_found = re.findall(r'(\d+[\d,]*)', price_match.group(1))
       try:
           if len(prices_found) >= 2:
               price = int(prices_found[-1].replace(',', ''))
               orig_price = int(prices_found[-2].replace(',', ''))
           elif len(prices_found) == 1:
               price = int(prices_found[0].replace(',', ''))
       except ValueError:
           # Handle defaults on failure
           pass
   ```

## 5. Verification Method
- **Verify LFI Fix**: Modify the script temporarily to download `file:///etc/passwd`. Ensure `download_image` rejects it and returns `None` instead of reading the local file.
- **Verify Crash Fix**: Run `python scripts/scrape_yachts.py`. Ensure the script successfully runs to completion without raising any `ValueError` during data extraction. Check the SQLite DB to ensure data integrity for prices.
