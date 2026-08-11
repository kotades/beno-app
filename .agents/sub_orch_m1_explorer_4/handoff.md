# Handoff Report: M1 Asset Downloader Fixes

## Observation
I reviewed `scripts/scrape_yachts.py` and confirmed the 7 issues mentioned in the user request:

1. **Over-deletion**: `shutil.rmtree(assets_dir, ignore_errors=True)` on line 96 deletes the entire `public/assets` directory, not just `main-yatchs-imgs`.
2. **Naive Search**: Lines 61-70 claim to do a "First pass" and "Second pass", but it simply scrolls and waits 2 seconds, followed by a single DOM query (`querySelectorAll`). It does not intercept network traffic or check lazy-load state for a true double-pass.
3. **Invalid Placeholders**: `create_placeholder` on line 25-27 simply writes the string `"placeholder"` into files with `.jpg` or `.mp4` extensions.
4. **Placeholder Condition**: Lines 87-90 only create placeholders if no assets were successfully downloaded (`success = False`). Individual failed downloads inside the loop (lines 74, 77) just skip incrementing the index without making a placeholder.
5. **Flaky Timeout**: Lines 36 and 63 use `page.wait_for_timeout(2000)` instead of waiting for a network state or a DOM locator, leading to race conditions on slow networks.
6. **Slug Collisions**: `get_slug` (line 11) falls back to `"unknown"`. Multiple empty paths will resolve to `"unknown"`, causing directory collisions and overwriting files.
7. **Hardcoded Extensions**: Assets are always saved as `.jpg` or `.mp4` (lines 74, 77) regardless of the actual file type or MIME type.

## Logic Chain
- **Issue 1**: Replace `shutil.rmtree(assets_dir)` with `shutil.rmtree(output_dir)` so only the target yacht images folder is wiped.
- **Issue 2**: Implement a true double-pass search. Pass 1: Parse the initial DOM or intercept the API response to find the primary assets. Pass 2: Wait for explicit lazy-loaded elements to attach to the DOM (`img:not([loading="lazy"])`) or track intercepted API JSON payloads.
- **Issue 3**: Replace the `"placeholder"` text with a base64-decoded string of a 1x1 transparent PNG/GIF, and a minimal empty MP4 container, so standard image/video parsers do not crash on corrupted data.
- **Issue 4**: Update the `download_file` loop: if `download_file` returns `False`, call `create_placeholder` for that specific index and increment `idx`.
- **Issue 5**: For infinite scrolling, use `page.wait_for_response()` matching the yacht listing API or use a `locator.wait_for()` on the loader element to hide, rather than a hard 2000ms delay.
- **Issue 6**: In `get_slug`, fallback to `hashlib.md5(url.encode()).hexdigest()[:8]` or a UUID to guarantee uniqueness for empty paths.
- **Issue 7**: In `download_file`, inspect the `Content-Type` header of the `response` or parse the URL with `mimetypes.guess_extension()` / `os.path.splitext` to dynamically append the correct extension (e.g. `.png`, `.webp`, `.webm`).

## Caveats
- Since the exact API endpoints and network requests for Beno's website are not documented here, the specific implementation of network interception (Issue 2 and 5) will require active discovery by the implementer using `page.on('response', ...)` or DevTools.
- Some CDN URLs might not have extensions in the URL path, making `Content-Type` header inspection mandatory.

## Conclusion
The `scrape_yachts.py` script requires architectural refactoring. It currently suffers from data loss risks (Issue 1), flakiness (Issue 5), file corruption/collisions (Issues 3, 6, 7), and incomplete asset retrieval (Issues 2, 4). The implementer should refactor the script using the strategies outlined in the Logic Chain to fulfill the project requirements securely and reliably.

## Verification Method
After implementation, run the following to verify:
1. Ensure a dummy file exists in `public/assets/`, run the script, and check that the dummy file wasn't deleted.
2. Review the script to ensure `page.on('response', ...)` or specific element waiters are used instead of `wait_for_timeout`.
3. Check downloaded placeholders with the `file` command to ensure they are valid image/video formats, not ASCII text.
4. Check the `public/assets/main-yatchs-imgs/` directory to ensure file extensions vary properly (e.g., `.png`, `.webp`) and no `"unknown"` folders overwrite each other.
