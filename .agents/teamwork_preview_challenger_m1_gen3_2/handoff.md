# Challenge Summary

**Overall risk assessment**: CRITICAL

## Challenges

### [Critical] Local File Inclusion / SSRF via Image URL
- **Observation**: In `process_data`, image URLs scraped from the DOM are passed to `urllib.parse.urljoin('https://www.beno.com', url)`. If the URL has a `file://` scheme, `urljoin` preserves it. The URL is then passed to `download_image`, which uses `urllib.request.urlopen(req)`.
- **Logic Chain**: An attacker or compromised scraped page could inject an `img` tag with `src="file:///etc/passwd"`. `urljoin` will return `file:///etc/passwd`. `urlopen` inherently supports the `file://` protocol, so it will read local files from the server running the scraper and save them to the public `public/assets/` directory.
- **Blast radius**: Allows unauthenticated local file read and exfiltration of sensitive files via the publicly accessible assets folder.
- **Mitigation**: Strictly validate that `url` begins with `http://` or `https://` before attempting to download it.

### [High] Unhandled ValueError in Price Extraction Causes Full Crash
- **Observation**: In `process_data`, the script uses `price_match = re.search(r'((?:AED\s*)?[\d,]+\s*(?:AED\s*)?[\d,]*)\s*/\s*hour', ...)` and then `prices_found = re.findall(r'([\d,]+)', price_match.group(1))`. Finally, `price = int(prices_found[-1].replace(',', ''))`.
- **Logic Chain**: The regex `[\d,]+` matches strings containing only commas (e.g., `,`). If a scraped text contains `AED , / hour`, `prices_found` will be `[',']`. Calling `.replace(',', '')` produces an empty string `''`. Calling `int('')` throws a `ValueError`, which is unhandled in `process_data` and will instantly crash the entire script without saving data.
- **Blast radius**: Complete Denial of Service (DoS) for the scraping task if any card has malformed price data.
- **Mitigation**: Add a `try/except ValueError` block around the integer conversion or tighten the regex to require at least one digit (`\d+[\d,]*`).

### [Medium] UI Element Leakage into Database (DOM Over-matching)
- **Observation**: `solana_data['features']` are extracted using `features = await page.locator('ul > li').all()`.
- **Logic Chain**: This broad CSS selector matches *any* list item on the page, including navigation menus (e.g., "Home", "Contact Us", "Login"), footer links, or breadcrumbs. These non-feature strings are saved to the `yacht_features` table, corrupting the database with UI boilerplate.
- **Blast radius**: Corrupted domain data.
- **Mitigation**: Scope the locator to the specific container of the features (e.g., `page.locator('.features-container ul > li')`).

### [Low] Permanent Cache Staleness and Race Conditions
- **Observation**: `download_image` caches aggressively: `if os.path.exists(filepath): return filepath`. The `filename` is statically generated (e.g., `93GG63_hero.jpg`).
- **Logic Chain**: If a previous scrape failed mid-download, a truncated 0-byte file remains and is forever considered "cached". Additionally, if the upstream yacht image is updated, the script will never download the new image because the static filename already exists locally.
- **Blast radius**: Broken or outdated images displayed to users.
- **Mitigation**: Check file size (e.g., `> 0`), or hash the URL/content to generate cache keys, or use a Last-Modified HTTP header check.

## Caveats
- Playwright scrape execution was not dynamically tested due to lack of an active display/headless environment in this test harness, but statically verified via Python standard library behavior.

## Conclusion
The scraper contains a critical security vulnerability (LFI) and a high-severity DoS vector (ValueError on empty string). It also suffers from data corruption due to over-broad DOM selectors. These must be addressed before running the script on untrusted data.

## Verification Method
1. Create a script that imports `process_data` and mock data containing `imgSrc: "file:///etc/passwd"`. Run it and observe that `/etc/passwd` is copied to `public/assets/`.
2. Create a script that imports `process_data` and mock data containing `fullText: ["AED , / hour"]`. Run it and observe the uncaught `ValueError`.
