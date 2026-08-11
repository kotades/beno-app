# Strategy for scripts/scrape_yachts.py

## Observation
1. In `scripts/scrape_yachts.py`, line 250 uses `filename = f"{yacht_id}_gallery_{i}.{ext}"` to name image files. This relies on the array index (`i`), which causes cache collisions and corrupted downloads if the source ordering of images changes between runs. Line 194 similarly uses a static name `f"{yacht_id}_hero.{ext}"`.
2. In `scripts/scrape_yachts.py`, line 54 `download_image(url, filename)` only validates that the URL scheme is HTTP/HTTPS (line 56) but does not validate the host domain. This allows the script to fetch arbitrary external domains or IP addresses based on `img src` tags, resulting in an SSRF vulnerability.
3. In `scripts/scrape_yachts.py`, loops that iterate over Playwright locators (e.g., lines 86-91 for cards, 103-106 for images, 108-112 for texts, and 114-118 for features) perform asynchronous element interactions like `await c.get_attribute()` and `await c.inner_text()`. There is no `try/except` block inside these loops, meaning an element detachment exception will crash the entire scraping batch.

## Logic Chain
1. **Cache Collision Fix**: Deriving the image filename from a SHA-256 hash of the image URL will ensure idempotency and uniqueness. Even if the array ordering changes, the filename mapped to a specific image URL will remain the same, solving the cache collision issue.
2. **SSRF Fix**: `download_image` must parse the domain of the requested URL and ensure it belongs to an allowed list of domains (e.g., ending with `beno.com` or `cloudfront.net`). If the `parsed_url.hostname` is not in the allowlist, the download should be aborted.
3. **Fragility Fix**: By wrapping the body of the `for` loops in the `scrape_live` function with a `try...except Exception as e:` block, any exceptions caused by element detachment can be caught. The script can then log the error and use `continue` to proceed to the next element, rather than terminating the whole process.

## Caveats
1. The exact CloudFront distributions used by Beno are not explicitly listed in the script; an allowlist checking `endswith('.cloudfront.net')` should be broad enough to encompass them.
2. Using SHA-256 hashes for filenames removes the human-readable naming convention (`93GG63_gallery_0.jpg`), but this is acceptable for robust internal asset management.
3. If elements are frequently detached, the script may miss some data silently; logging the exceptions is important to monitor the health of the scraper.

## Conclusion
The implementer should update `scripts/scrape_yachts.py` with the following changes:
1. Import `hashlib` and replace index-based and static image naming with SHA-256 hashes of the URL string in both hero and gallery image downloads (lines 194 and 250).
2. Introduce a hostname allowlist check in `download_image` (around line 59) to prevent SSRF (e.g. `if not (hostname.endswith('beno.com') or hostname.endswith('cloudfront.net')):`).
3. Wrap the content of the `for` loops over Playwright elements in `scrape_live` (e.g., `for c in cards`, `for img in images`, `for t in texts`, `for f in features`) with `try...except` blocks that catch errors, log them, and `continue`.

## Verification Method
1. Run `python scripts/scrape_yachts.py` to ensure it executes without syntax errors.
2. Check `db/cloned_beno_db.sqlite` and `public/assets/` to ensure images are successfully downloaded and filenames are SHA-256 hashes.
3. Add a dummy test URL (e.g. `http://example.com/test.jpg`) to the scraper's image list and verify that the SSRF allowlist blocks the download.
4. The script should complete successfully without crashing, verifying that element iteration is robust.
