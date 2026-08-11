# Handoff Report: `total_assets` Shrinking Logic Bug

## Observation
In `scripts/scrape_yachts.py`, the `process_yacht` function attempts to download all assets for a given yacht with a retry mechanism (lines 108-163).
- Outside the retry loop, `successful_urls = set()` is initialized to track successful downloads across all attempts (line 104).
- Inside the retry loop, `dom_assets` are extracted and combined with `api_assets` into `all_assets`. 
- `total_assets` is then calculated dynamically on each attempt as `total_assets = len(all_assets)` (line 132).
- The script iterates over the current attempt's `all_assets` to download files (line 137).
- At the end of the attempt, the success condition is evaluated as: `if len(successful_urls) == total_assets and total_assets > 0:` (line 156).

## Logic Chain
1. The `all_assets` list is built entirely from the DOM and network state of the *current* page load/attempt.
2. If the page loads inconsistently (e.g. fewer DOM images load on attempt 2 compared to attempt 1), `len(all_assets)` and thus `total_assets` will be smaller on the second attempt.
3. `successful_urls` retains all successful downloads from prior attempts.
4. If attempt 1 found 10 assets but only 8 downloaded successfully, `len(successful_urls)` becomes 8. If attempt 2 only loads 8 assets from the DOM, `total_assets` becomes 8.
5. The script checks `if len(successful_urls) == total_assets` (8 == 8). This evaluates to `True`, breaking out of the loop and marking the yacht as fully successful.
6. Consequently, the 2 failed assets from attempt 1 are never retried or recorded as failed, because the script stops checking them (they were not in attempt 2's `all_assets`).

## Caveats
- Relying on `len(successful_urls) >= len(all_discovered_urls)` assumes that we only ever track unique URLs. A `set()` or deduplicated list is perfect for `all_discovered_urls`.
- We must ensure that the retry loop attempts to download *all* discovered assets, not just the ones found in the current attempt's DOM. Iterating over `all_discovered_urls` during the download phase is necessary to actually retry missing assets.

## Conclusion
The script falsely marks a yacht as successful when a subsequent retry finds fewer assets in the DOM than previous attempts. To fix this, `all_discovered_urls` must be accumulated across all attempts, and both the download loop and the success condition must reference this master collection.

**Proposed Fix Strategy**:
1. Initialize `all_discovered_urls = []` (or an ordered set equivalent) outside the retry loop.
2. Inside the loop, after computing `all_assets` for the current attempt, append any new URLs to `all_discovered_urls`.
3. Set `total_assets = len(all_discovered_urls)`.
4. Iterate `for asset_url in all_discovered_urls:` to download files, ensuring assets from earlier attempts are retried even if they didn't appear in the current DOM.
5. Update the success condition to `if len(successful_urls) >= total_assets and total_assets > 0:`.

## Verification Method
- Make the code changes as proposed.
- Simulate an incomplete page load on attempt 2 (e.g., mock `page.evaluate` to return fewer assets). 
- Verify that the script still attempts to download the missing assets from attempt 1 and does not incorrectly exit the retry loop.
- Run `python scripts/scrape_yachts.py` to ensure it continues to scrape correctly without breaking.
