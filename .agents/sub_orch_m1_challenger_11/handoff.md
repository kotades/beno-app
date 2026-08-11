# Handoff Report

## Observation
In `scripts/scrape_yachts.py`, the `process_yacht` function attempts to download all assets for a given yacht page, retrying up to 3 times on failure. During each attempt, it fetches assets from the DOM (`dom_assets`) and API (`api_assets`), recalculates `all_assets = all_imgs + all_vids`, and sets `total_assets = len(all_assets)`. The success condition is checked as `if len(successful_urls) == total_assets and total_assets > 0: success = True; break`.

## Logic Chain
1. `successful_urls` accumulates across attempts.
2. `dom_assets` is re-evaluated on each attempt. If the page loads inconsistently (e.g. fewer images load in the DOM on attempt 2 than attempt 1), `total_assets` will decrease.
3. If on attempt 1 the script discovers 3 assets but only successfully downloads 2 (so `len(successful_urls) = 2`), and on attempt 2 the script only discovers 2 assets (so `total_assets = 2`), the condition `len(successful_urls) == total_assets` evaluates to `2 == 2`, which is `True`.
4. The script marks the download as successful and exits the retry loop, completely ignoring the failed 3rd asset that was discovered in attempt 1.
5. This violates the requirement: "retries don't falsely mark success until all discovered URLs are downloaded". To fix this, all discovered URLs across all attempts should be accumulated into a single global set (e.g., `discovered_urls`), and the success condition should verify against `len(discovered_urls)`.

## Caveats
I was unable to execute the mock server tests due to an unresponsive user permission prompt for `run_command`. However, static analysis of the source code confirms the logic flaw. Partial file deletion on error works correctly because the `os.remove` is triggered in the `except` block of `download_file`.

## Conclusion
The script falsely marks success on retries if the total number of dynamically discovered assets fluctuates between attempts, leading to skipped downloads.

## Verification Method
1. Create a mock Playwright page that returns 3 assets on the first `evaluate()` call, and 2 assets on the second call.
2. Mock `download_file` to fail on one of the 3 assets during the first attempt.
3. Run `process_yacht`. Observe that it exits successfully after attempt 2 without trying to download the failed 3rd asset again.
