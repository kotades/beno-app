# Handoff Report: Stress Test of `scripts/scrape_yachts.py`

## Observation

1. **Cache Collision via Array Index**: In `process_data`, the downloaded images for Solana yachts are named using their array index: `filename = f"{yacht_id}_gallery_{i}.{ext}"`. The `download_image` function uses `os.path.exists(filepath)` to bypass downloading if the file already exists.
2. **SSRF Vulnerability**: `download_image` fetches images via `urllib.request.urlopen` with a 10s timeout. It only validates that the scheme is `http` or `https`, but fails to restrict target IP addresses.
3. **No error checking on Playwright URL fetch limit**: `cards[:4]` truncates to 4 cards, but elements may fail to resolve or disappear, causing `c.get_attribute('href')` to throw exceptions that abort the entire `scrape_live` process.

## Logic Chain

1. **Cache Collision**: 
   - A subsequent scrape run may receive the images in a different order or with new images inserted. 
   - Since `yacht_id` and `i` (the index) are used to generate the filename, `download_image` will falsely detect that the new URL has already been downloaded (because e.g., `93GG63_gallery_0.jpg` exists from the previous run).
   - This results in the local database pointing to old image files for new image URLs, corrupting the image gallery dataset over multiple runs.
2. **SSRF Vulnerability**:
   - The script processes uncontrolled inputs (locators matching `img src` attributes on external pages).
   - A malicious actor could inject an image with `src="http://169.254.169.254/latest/meta-data/"` or another internal IP on the target yacht site.
   - `urlopen` will execute the GET request, potentially exposing internal metadata or interacting with internal endpoints (Server-Side Request Forgery).
3. **Fragile Scraper Loop**:
   - Playwright elements collected via `.all()` become stale if the DOM mutates. The `.get_attribute()` calls do not have resilience against `Node is detached from document` errors, which will crash the scraper entirely since the loop doesn't catch per-card exceptions.

## Caveats
- Due to lack of permissions for executing terminal commands asynchronously during the review environment session, dynamic execution was replaced with static stress-testing and logic tracing. 
- The external Benoyachts website was not actively probed to avoid unauthorized external requests.

## Conclusion
The script contains a critical state-corruption bug in its image caching logic and is vulnerable to SSRF. Furthermore, the web scraping logic is highly susceptible to DOM detachment crashes. 

**Recommended Actions:**
1. Hash the `url` (e.g., MD5/SHA256) to generate the cache filename instead of using the array index `i`.
2. Add SSRF protections by validating the resolved IP address of the URL before opening it.
3. Wrap individual card scraping steps in a `try/except` block to prevent single-element failures from crashing the entire batch.

## Verification Method
To verify the cache collision bug independently:
1. Run `python3 scripts/test_cache_collision.py` (which intercepts `download_image` and simulates two runs with swapped URLs).
2. Observe that the second run does not fetch the new URLs because the index-based filenames already exist.
