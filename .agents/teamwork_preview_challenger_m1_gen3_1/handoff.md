## 1. Observation
In `scripts/scrape_yachts.py`, three significant failure modes exist:

1. **Index-Based Image Caching:** The script names images based on their index `i` from the scraped list (`filename = f"{yacht_id}_gallery_{i}.{ext}"`). In `download_image(url, filename)`, it skips downloading if the filename exists (`if os.path.exists(filepath): return filepath`), ignoring the actual `url`.
2. **File Corruption Cache Poisoning:** In `download_image(url, filename)`, the file is opened for writing (`with ... open(filepath, 'wb') as out_file:`) before or during the network read (`data = response.read()`). Any exception raised by `response.read()` is caught, returning `None`.
3. **Data Loss via `INSERT OR REPLACE`:** `process_data` uses `INSERT OR REPLACE INTO yachts` when processing cards. This replaces the entire row. The subsequent columns `description`, `route_details`, and `minimum_hours` are set to `NULL` because they are not included in the `VALUES` clause. 

## 2. Logic Chain
1. **Index-Based Caching:** If the website reorders its gallery images (e.g., Image B moves to index 0), the script maps Image B's URL to `gallery_0.jpg`. Since `gallery_0.jpg` already exists (containing the old Image A), `download_image` incorrectly assumes success and skips downloading. The cache becomes permanently desynchronized from the live site.
2. **File Corruption:** If a network timeout or connection drop occurs during `response.read()`, the `out_file` is already truncated to 0 bytes on disk. The function exits, leaving a 0-byte file. On all future runs, `os.path.exists` will evaluate to `True`, skipping the download and permanently breaking the image in the UI.
3. **Data Loss:** When the script runs a second time, the `INSERT OR REPLACE` wipes the enhanced data (description, route_details) from the first run. While the script patches this by running an `UPDATE` for `93GG63` immediately after, this approach is fundamentally flawed: if a yacht receives enhanced data but is later removed from the `solana_data` target, its description will be permanently destroyed on the next run.

## 3. Caveats
- Since the environment did not allow successful execution of Python commands (due to a simulated timeout waiting for user permission), the bugs were identified via static analysis and logic tracing rather than live test execution. However, standard Python semantics strongly support these findings.
- The `INSERT OR REPLACE` issue is currently masked for `93GG63` because it is updated immediately in the same run, but it poses a severe risk for any future expansion of the script to other yachts.

## 4. Conclusion
The script contains three critical bugs that will lead to a degraded user experience over time. 
- **CRITICAL**: Network failures permanently corrupt local image files (0-bytes). 
- **HIGH**: Cached images decouple from URLs if the source website changes image ordering.
- **MEDIUM**: Schema logic uses `INSERT OR REPLACE`, creating a fragile data pipeline that can wipe out text fields.

## 5. Verification Method
To verify these bugs independently:
1. **Cache Bug**: Create an arbitrary file named `public/assets/93GG63_gallery_0.jpg`. Run the script. Observe that the script skips downloading the first gallery image and retains the arbitrary file.
2. **Corruption Bug**: Mock `urllib.request.urlopen` or `response.read()` to throw a `socket.timeout`. Run the script. Observe that a 0-byte file is created. Run the script again without the mock; observe that the 0-byte file is preserved and not re-downloaded.
3. **Data Loss Bug**: Manually add a `description` to a random yacht in the `yachts` table (e.g., ID `123`). Run the script so that ID `123` is processed by the cards section but not the `solana` section. Observe that the `description` for `123` is erased.
