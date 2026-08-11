# Handoff Report: Stress Test for `scrape_yachts.py`

## 1. Observation
- `run_command` timed out for execution, but static analysis of `scripts/scrape_yachts.py` reveals the logic for retries and edge cases.
- In `download_file`, exceptions during the chunk loop are caught by `except Exception as e:` block. The `filepath` is verified with `os.path.exists(filepath)` and removed via `os.remove(filepath)`.
- If `download_file` fails (returns `False, None`), `process_yacht` skips adding the asset to `successful_urls` and simply continues iterating over the remaining assets in `all_assets`.
- `all_assets` is reconstructed *inside* the retry loop (`for attempt in range(3):`) based on `dom_assets = page.evaluate(...)` and the current state of `api_assets`.
- Success is evaluated using `if len(successful_urls) == total_assets and total_assets > 0:`, where `total_assets = len(all_assets)` for the current attempt.

## 2. Logic Chain
1. **Failed downloads cleanly skipped**: Since a failed download simply prevents `successful_urls.add(asset_url)` from being called and continues the loop, the script correctly skips failed downloads without crashing.
2. **Partial corrupt files deleted on exception**: If an exception occurs after a file is opened (e.g. connection drops during `response.iter_content`), the exception block explicitly attempts to delete `filepath`. This correctly cleans up partial files.
3. **Retries falsely marking success**: 
   - `total_assets` is bound to the number of assets found in the *current* retry attempt. 
   - If Attempt 1 discovers DOM assets `[A, B]` where `A` succeeds and `B` fails, `successful_urls = {A}`.
   - If Attempt 2 reloads the page and only discovers DOM asset `[A]` (e.g. due to DOM load delay, dynamic content, or network variance), `total_assets` becomes `1`.
   - The script will evaluate `len(successful_urls) == total_assets` (which is `len({A}) == 1`), resulting in `True`.
   - It will declare success and terminate, entirely forgetting about the failed asset `B` discovered in Attempt 1.
4. **Retries falsely failing (Bonus)**: 
   - Conversely, if Attempt 1 finds `[A, B, C]` and successfully downloads `A` and `B` (`successful_urls = {A, B}`), but fails `C`.
   - If Attempt 2 finds only `[A, C]`, then `total_assets = 2`.
   - It successfully downloads `C`. Now `successful_urls = {A, B, C}`.
   - The success condition evaluates `len({A, B, C}) == 2`, which is `3 == 2` (`False`). 
   - The script will falsely consider the retry failed and waste all attempts, even though all discovered assets were downloaded.

## 3. Caveats
- Could not execute the test harness using `run_command` due to user permission timeouts, so the findings are based on static code analysis. The logic flaw is transparent from the source code.

## 4. Conclusion
- **Failed downloads and corrupt files**: CORRECTLY handled.
- **Retry Success Logic**: FLAWED. The script evaluates success based on `len(successful_urls) == total_assets` for the current attempt. Since the set of discovered assets (`total_assets`) can change between page reloads, this condition will either falsely mark success (if assets disappear) or falsely fail (if assets disappear but were already successfully downloaded). 
- **Actionable Fix**: The script should maintain a global set of `all_discovered_urls` outside the retry loop, and evaluate success using `successful_urls.issuperset(all_discovered_urls)`.

## 5. Verification Method
- **File to inspect**: `scripts/scrape_yachts.py` line 156.
- **Manual Test**: Run a mock HTTP server that returns two images on the first request (one succeeds, one 404s) and only one image on the second request. The script will incorrectly declare success on Attempt 2.
