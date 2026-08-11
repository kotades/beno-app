# Handoff Report: Analysis of scrape_yachts.py Failures

## Observation
I examined the file `scripts/scrape_yachts.py`.
1. **Cache Collision (Index-based Naming):** In `process_data()`, the gallery image filenames are generated using the array index at line 250: `filename = f"{yacht_id}_gallery_{i}.{ext}"`. The hero image uses a static name at line 194: `filename = f"{yacht_id}_hero.{ext}"`.
2. **SSRF Vulnerability:** The `download_image(url, filename)` function at line 54 checks `if parsed_url.scheme not in ('http', 'https'):` (line 56) but performs no validation on the hostname before passing the URL to `urllib.request.urlopen(req, timeout=10)` (line 67).
3. **Playwright Fragility:** In `scrape_live()`, the script uses `await page.locator(...).all()` and iterates through the resulting element handles in multiple loops (lines 86, 103, 108, 114). During these loops, it calls async methods like `await c.get_attribute('href')` and `await c.inner_text()`. If the page DOM updates dynamically during the loop, these elements become detached, and Playwright throws an exception that crashes the entire script, as there are no `try...except` blocks around the individual element interactions.

## Logic Chain
1. **Cache Collision:** Using array indices for filenames means that if the source website changes the order of images, the new images will overwrite the old ones under the same index filename, corrupting the downloaded assets. Replacing the index with a deterministic hash (e.g., SHA-256) of the image URL ensures that each unique URL maps to a unique, stable filename.
2. **SSRF Mitigation:** The current implementation blindly downloads from any HTTP/HTTPS URL provided in the `img src`. If a malicious URL is injected or scraped (e.g., an internal IP like `169.254.169.254`), the server executing the script will make the request. To prevent Server-Side Request Forgery, we must validate `parsed_url.hostname` against a strict allowlist (e.g., `www.beno.com`, `beno.com`, and known CDNs).
3. **Playwright Fragility:** The `.all()` method fetches a static snapshot of element handles. By the time the async loop processes a later handle, the SPA might have re-rendered, causing a `playwright._impl._api_types.Error: Element is not attached to the DOM`. Wrapping the interior of each `for` loop in a `try...except` block allows the script to simply log the error and `continue` to the next element, maintaining robustness.

## Caveats
- The exact domains to include in the SSRF hostname allowlist are not fully documented in the script. It is assumed that `beno.com` and its subdomains, plus potential CDNs like `cloudfront.net`, are sufficient. 
- Using a full SHA-256 hash for filenames will produce 64-character strings; it may be preferable to truncate the hash (e.g., to 16 characters) to keep filenames manageable.

## Conclusion
The strategy to fix `scripts/scrape_yachts.py` requires three updates:
1. **Hash Filenames:** Import `hashlib`. In `process_data()`, replace `{yacht_id}_gallery_{i}` and `{yacht_id}_hero` with a hash of the image URL: `hashlib.sha256(url.encode('utf-8')).hexdigest()[:16]`.
2. **SSRF Allowlist:** In `download_image()`, extract `parsed_url.hostname` and verify it matches a predefined list of trusted domains (or suffixes) before proceeding with the download.
3. **Robust Element Handling:** In `scrape_live()`, wrap the logic inside the `for c in cards`, `for img in images`, `for t in texts`, and `for f in features` loops with a `try: ... except Exception as e: print(...) continue` block.

## Verification Method
- **Cache Collision:** Reorder the mocked input URLs for a yacht and run the script. Verify that the generated local filenames remain consistent with the URL content, not the order.
- **SSRF:** Inject an internal URL (e.g., `http://127.0.0.1/admin` or `http://169.254.169.254/latest/meta-data/`) into the scraped data and ensure `download_image` rejects it and returns `None`.
- **Playwright Fragility:** Inject a simulated error (e.g., `raise Exception("Mock detached")`) on the second element in the loop and verify that the first and third elements are still successfully extracted.
