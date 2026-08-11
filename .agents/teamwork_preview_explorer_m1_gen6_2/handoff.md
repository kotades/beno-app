# Strategy for scripts/scrape_yachts.py

## 1. Observation
- `scripts/scrape_yachts.py` line 250 names images by index: `filename = f"{yacht_id}_gallery_{i}.{ext}"`.
- `download_image` only validates URL scheme (lines 56-58) but makes an unvalidated request to any host provided in `url` (line 66).
- In `scrape_live`, the `for c in cards[:4]:` loop (lines 86-91) and other loops over Playwright locators (like `images`, `texts`, `features`) do not have `try/except` blocks, so an element detachment exception crashes the entire scraper batch.

## 2. Logic Chain
- The index-based naming means if the source website changes the order of images, the local cache will incorrectly reuse the old images under the new index because the filename still matches, causing corrupted/mismatched visual assets. Hashing the URL directly creates content-addressable filenames that avoid these collisions.
- The `download_image` function accepts any HTTP/HTTPS URL and issues a GET request to it. Since the image sources are scraped dynamically, an attacker who controls `img src` on the page could point it to internal addresses (e.g., `http://169.254.169.254` or internal network IPs). Restricting to known domains like `beno.com` and `cloudfront.net` mitigates SSRF.
- Playwright elements can detach from the DOM at any point during iteration due to single-page app frameworks re-rendering the page. Adding `try/except` around element state queries allows the scraper to gracefully skip detached elements instead of failing the whole batch.

## 3. Caveats
- For SSRF protection, the exact Cloudfront domains or other CDNs used by Beno might be broader than just `.cloudfront.net`. If they use another CDN, it might get blocked and we may need to expand the allowlist.
- If Playwright elements detach too frequently, we might skip a lot of data. A more robust solution might involve re-querying the DOM if elements are detached, but a `try/except` is sufficient to prevent batch crashes.

## 4. Conclusion
- Modify `process_data` to import `hashlib` and name gallery images using a hash of the URL, for example: `url_hash = hashlib.sha256(url.encode()).hexdigest()[:16]` and `filename = f"{yacht_id}_gallery_{url_hash}.{ext}"`. Do the same for the hero image to be safe.
- Modify `download_image` to parse `urllib.parse.urlparse(url).hostname` and verify that the hostname either exactly matches `beno.com` or `cloudfront.net`, or ends with `.beno.com` or `.cloudfront.net` before downloading.
- Add a `try/except Exception as e:` block inside the body of the `for c in cards[:4]:`, `for img in images:`, `for t in texts:`, and `for f in features:` loops in `scrape_live` to continue processing the next item if the current one throws an error.

## 5. Verification Method
- Run `python scripts/scrape_yachts.py` and ensure the script completes without crashing.
- Check `db/cloned_beno_db.sqlite` and `public/assets/` to ensure gallery images have hash-based names (e.g. `93GG63_gallery_abcdef1234567890.jpg`).
- Run a test call to the download function in python: `python -c "from scripts.scrape_yachts import download_image; print(download_image('http://169.254.169.254/latest/meta-data/', 'test.jpg'))"` and ensure it rejects the SSRF attempt and returns `None`.
