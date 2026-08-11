# Handoff Report: Fixes for scrape_yachts.py Bugs

## Observation
- **Corrupt Partial Files**: In `download_file` (lines 35-37 of `scripts/scrape_yachts.py`), the file is opened in `wb` mode and written chunk by chunk. If an exception occurs during `response.iter_content` (like a stream timeout), the outer `except Exception` catches it, but the partially written file is left on disk.
- **Missing Assets (False Success)**: In `process_yacht` (lines 141-143), the success condition is evaluated as `if successful_downloads > 0: success = True; break`. This means that if 1 asset succeeds but 10 fail, the loop terminates immediately and does not retry the failed assets. Additionally, there is no state kept across the `attempt` loop to prevent re-downloading already successful assets.

## Logic Chain
1. **Fixing Corrupt Partial Files**: To prevent corrupted files from remaining on disk, `download_file` must use a nested `try...except` block around the file streaming/writing process. If an exception is raised, it should check if the `filepath` exists and use `os.remove(filepath)` to delete the incomplete file before propagating the failure.
2. **Fixing Missing Assets**: The retry loop should evaluate success based on all assets. We need to define `total_assets = len(all_imgs) + len(all_vids)` and only set `success = True` and `break` if `successful_downloads == total_assets`.
3. **Preventing Re-downloads on Retry**: We must introduce a `successful_urls = set()` outside the `for attempt in range(3):` loop. During the download loops, if a URL is in `successful_urls`, it should be skipped. 
4. **Stable Filenames**: Because `all_imgs` and `all_vids` are generated from sets (`set(dom_assets['imgs']).union(...)`) and not sorted, their order might change on retry. If the order changes, the sequential `idx` will map to different URLs. We should sort the URLs before iterating, and increment `idx` even for skipped URLs, to guarantee consistent numbering across retries.

## Caveats
- If the page structure changes dynamically on retry, the total number of assets discovered might slightly fluctuate between attempts. Maintaining `successful_urls` by the exact URL string is the safest way to avoid re-downloads, but sorting the lists is necessary for stable `idx` assignment.
- The `handle_response` listener for `api_assets` continues to add to the same set across attempts.

## Conclusion
The recommended fix strategy is:
1. **`download_file`**: Add a try/except block around the `iter_content` stream. In the except block, use `os.remove(filepath)` if the file exists.
2. **`process_yacht`**: 
   - Initialize `successful_urls = set()` before the `attempt` loop.
   - Sort `all_imgs` and `all_vids` to ensure a deterministic order.
   - Loop over the sorted assets. If an asset is in `successful_urls`, increment `idx` and `continue`.
   - On successful download, add the URL to `successful_urls`.
   - Change the loop break condition to `if len(successful_urls) == len(all_imgs) + len(all_vids): success = True; break`.

## Verification Method
1. Introduce a mock exception in `download_file` midway through streaming a specific file, and verify the partial file is removed from disk.
2. Introduce a temporary failure for a subset of assets in `process_yacht` and verify that the retry loop is triggered, previously successful assets are not re-downloaded, and the retry targets the failed assets. Verify the final `success` state is only true when all assets are downloaded.
