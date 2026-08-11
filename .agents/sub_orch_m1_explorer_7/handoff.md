# Handoff Report

## 1. Observation
1. **Critical False Success & Missing Indices**: In `scripts/scrape_yachts.py`, lines 121-134 show `idx += 1` incrementing in both the `all_imgs` and `all_vids` loops regardless of the `ok` variable value returned from `download_file`. Line 136 checks `if idx > 1: success = True`, which falsely passes even if all downloads fail. Unconditional incrementing also creates non-sequential filenames when errors occur.
2. **Hanging Risk**: Line 31 calls `requests.get(url, stream=True, timeout=10)`. A scalar timeout only applies to the initial connection and headers. Reading chunks in `response.iter_content` (line 36) has no explicit read timeout, which can hang indefinitely.
3. **JSON Regex Flaw**: Lines 87-89 read `response.text()` and apply a regex `re.findall(r'https?://[^\s"\'}]+', text_data)`. If the JSON escapes slashes (`https:\/\/`), the extracted URLs will contain backslashes and be invalid.
4. **Extension Fallback**: Line 27 in `get_ext` unconditionally falls back to `ext if ext else '.jpg'`. When an extensionless video URL (without a `content-type` header) is processed, it is assigned `.jpg`.

## 2. Logic Chain
- **Bug 1 & 2**: Moving `idx += 1` inside an `else` block (i.e. `if not ok: ... else: idx += 1`) ensures that the index only advances upon a successful download. This guarantees sequential filenames and accurately reflects whether any asset was successfully downloaded when `idx > 1` is evaluated.
- **Bug 3**: In the `requests` library, passing a tuple `timeout=(connect_timeout, read_timeout)` applies the read timeout to each chunk read. Setting `timeout=(10, 10)` in `requests.get` will prevent `iter_content` from hanging.
- **Bug 4**: Replacing `\/` with `/` in `text_data` before running `re.findall` resolves the JSON escaping issue cleanly.
- **Bug 5**: Passing a `default_ext` argument to `download_file` and `get_ext` allows the caller to specify the expected fallback extension based on context (e.g. `.mp4` for videos and `.jpg` for images). 

## 3. Caveats
- Modifying the signature of `download_file` requires updating the calls in `process_yacht`.
- The JSON regex strategy assumes that replacing `\/` with `/` will not corrupt other valid parts of the JSON body that coincidentally contain `\/`, which is safe here because we only extract `https?://` strings.

## 4. Conclusion
The following fix strategy should be implemented without introducing hardcoded limits or placeholders:
1. Conditionally increment `idx` only when `ok` is True.
2. Update `requests.get(url, stream=True, timeout=10)` to `timeout=(10, 10)`.
3. Unescape forward slashes in JSON strings before running regex: `text_data = response.text().replace('\\/', '/')`.
4. Modify `download_file` and `get_ext` to accept a `default_ext` parameter (defaulting to `'.jpg'`). Update `process_yacht` to pass `default_ext='.mp4'` for the `all_vids` loop and `default_ext='.jpg'` for the `all_imgs` loop.

## 5. Verification Method
After implementation, execute the script on a subset of yachts.
- Check the output directories to verify that files are named sequentially (`1.jpg`, `2.jpg`) without gaps.
- Ensure that video files (particularly those without extensions in their URLs) are correctly saved as `.mp4`.
- Validate that invalid escaped URLs (like `https:\/\/...`) are not being incorrectly processed.
