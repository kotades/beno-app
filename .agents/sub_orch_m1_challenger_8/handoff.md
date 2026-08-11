# Handoff Report

## 1. Observation
- In `scripts/scrape_yachts.py`, the `process_yacht` function attempts to download images and videos.
- Inside the retry loop, `idx` is initialized to 1 (line 121).
- For each `img_url` and `vid_url`, `download_file` is called. If `download_file` returns `False, None`, a failure message is printed, but `idx` is incremented regardless (lines 127, 134).
- After the loops, the script checks `if idx > 1:` (line 136). If true, it sets `success = True` and breaks out of the retry loop.
- In `download_file` (line 31), `requests.get(url, stream=True, timeout=10)` is used, followed by a loop over `response.iter_content` (line 36) without a cumulative timeout.
- In `handle_response` (line 89), the regex `re.findall(r'https?://[^\s"\'}]+', text_data)` extracts URLs directly from raw JSON strings, which may contain escaped forward slashes (e.g., `https:\/\/`).

## 2. Logic Chain
1. Because `idx` is incremented regardless of whether `download_file` succeeds or fails, if any asset URLs are found on the page, `idx` will be greater than 1.
2. This causes `success = True` and breaks the retry mechanism, even if every single download failed (e.g., due to 404s or network errors).
3. The script will leave an empty directory for that yacht and report success, completely defeating the purpose of the 3-attempt retry loop.
4. Furthermore, because `timeout=10` only governs connection and inter-byte read timeouts, a connection that stalls mid-download (or sends data extremely slowly) will cause `iter_content` to hang indefinitely.
5. Finally, parsing raw JSON with regex will include backslashes (`\/`) in the URLs if the JSON escapes them, which will immediately fail the `requests.get` call as an invalid URL.

## 3. Caveats
- Playwright's network interception might catch some of these assets before they hang `requests`, but since `requests` is used to independently download them, the risk remains.
- The regex issue depends on how the Beno backend serializes its JSON. If it doesn't escape forward slashes, it won't fail.

## 4. Conclusion
The current implementation is highly vulnerable to network failures, falsely reporting success and creating empty directories when downloads fail. The retry mechanism is fundamentally broken for asset downloads.

## 5. Verification Method
1. Modify `download_file` to unconditionally `return False, None` (simulating a failed download).
2. Run `scrape_yachts.py` on a single valid yacht URL.
3. Observe that the retry loop does NOT run 3 times, the yacht directory is created but remains empty, and the script does not log "Failed to fetch assets for...".
