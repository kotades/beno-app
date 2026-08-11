# Handoff Report: Stress Test for `scrape_yachts.py`

## 1. Observation
- In `scripts/scrape_yachts.py:121-137`, `idx` is initialized to 1. During the loop over `all_imgs` and `all_vids`, `idx` is unconditionally incremented (`idx += 1`) regardless of whether `download_file` succeeds (returns `ok=True`) or fails (returns `ok=False`).
- At line 136, the retry loop success condition is `if idx > 1: success = True; break`.
- In `download_file` (lines 29-41), `requests.get` uses `timeout=10` which only applies to the initial connection, not the read phase in `iter_content`.
- In `get_ext` (lines 19-27), if `mimetypes.guess_extension` fails and the URL has no extension, the script defaults to `.jpg`.

## 2. Logic Chain
- **False Success on Failures**: Because `idx` is incremented on every URL processed, even if `download_file` fails entirely, a yacht with at least one image will result in `idx >= 2`. The script then evaluates `idx > 1` as true, sets `success = True`, and breaks the retry loop. As a result, the scraper silently drops failed downloads without retrying the yacht, reporting success even when zero files were downloaded.
- **Missing Sequential Indices**: Because `idx` increments on failures, if file 2 fails but 1 and 3 succeed, the directory will contain `1.jpg` and `3.jpg`, with `2.jpg` missing. Any downstream script assuming contiguous indices will break.
- **Hanging on Slow Networks**: The `requests.get(timeout=10)` limits only the connection phase. If the server accepts the connection but trickles data at a few bytes per minute, the `iter_content` loop will block indefinitely. A read timeout on the requests object or a manual timeout wrapper on `iter_content` is required to prevent the scraper from hanging forever on slow connections.
- **Video Extension Edge Case**: If a `.mp4` video is served without a clear `Content-Type` header (or if the environment lacks full mimetype mapping) and lacks an extension in its URL, it will be saved as a `.jpg` file due to the indiscriminate fallback in `get_ext`.

## 3. Caveats
- `run_command` timed out waiting for user approval, so these issues were verified via direct code analysis rather than execution of a mock server. The logical flaws are self-evident in the source code.

## 4. Conclusion
The implementation contains a **CRITICAL logic bug** in its retry mechanism that incorrectly flags failed downloads as successful, completely nullifying the retry loop. Additionally, it is vulnerable to hanging indefinitely on slow networks and may mislabel extensionless videos as JPEGs. The file needs to track a count of *successful* downloads to correctly evaluate success and apply an explicit read timeout.

## 5. Verification Method
- **Bug 1 (False Success)**: Modify `download_file` to unconditionally return `False, None` and run the script on a single URL. Observe that the script does not retry and claims success.
- **Bug 2 (Slow Network Hang)**: Start a test server that accepts a request but sends one byte every 60 seconds. Point `scrape_yachts.py` to it. Observe it hanging indefinitely in `iter_content`.
- **Bug 3 (Extension Fallback)**: Provide a URL with no extension and no `Content-Type` header. Observe it being saved as `.jpg`.
