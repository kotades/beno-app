# M1 Asset Downloader Explorer Report

## Observation
1. The current codebase has partial scraping implementations (`scripts/scrape_yachts.py` and `scratch/scrape_yachts_assets.py`). `scrape_yachts.py` only extracts a limited set of cards and downloads assets into a flat folder.
2. `scratch/scrape_yachts_assets.py` uses `window.scrollTo` to trigger lazy-loaded elements and intercepts network requests to find CDN assets.
3. Links to individual yachts follow the format `https://www.beno.com/yachts/<slug>/<id>`.
4. The project requires downloading media for 59 yachts into `public/assets/main-yatchs-imgs/<slug_id>`, replacing any existing images in `public/assets`.

## Logic Chain
1. **Finding the 59 target links**: The main `/yachts` page uses lazy loading. To get all 59 links, a Playwright script must repeatedly scroll to the bottom of the page (`window.scrollTo(0, document.body.scrollHeight)`) and wait for network idle until the count of yacht card links (`a[href*="/yachts/"]`) stabilizes at 59 or stops increasing.
2. **Directory prep**: The script must call `shutil.rmtree('public/assets')` (or equivalent) to clear existing images, then `os.makedirs('public/assets/main-yatchs-imgs')`.
3. **Double-pass extraction**: For each yacht page:
   - **Pass 1 (DOM)**: `page.evaluate()` to collect `src` from `<img>` and `<video>` tags.
   - **Pass 2 (Network)**: Attach `page.on("response", ...)` or `page.on("request", ...)` listeners to capture `.jpg`, `.webp`, `.mp4` URLs loaded dynamically.
4. **Throttling & Retries**: Process the 59 URLs in batches of 3. After each batch, `await asyncio.sleep(60)`. For each page load, use a loop `for _ in range(3)` to retry on `TimeoutError` or network failure. If it fails 3 times, create a dummy placeholder file in the subfolder.
5. **Downloading & Labeling**: Collect the unique media URLs from both passes, download them using `urllib` or `aiohttp`, and save them into `public/assets/main-yatchs-imgs/{slug_id}/` as `image_1.jpg`, `video_1.mp4`, etc.

## Caveats
- Since the environment operates in CODE_ONLY mode, the actual beno.com network responses cannot be verified directly by the explorer.
- The 59 count is assumed based on the prompt's explicit requirement. If the site has more or fewer, the script should be hard-capped or instructed to stop at 59.
- Throttling (1 min per 3 pages) will cause the script execution to take ~20 minutes.

## Conclusion
The implementer should write a new script (e.g., `scripts/download_59_yachts.py`) using Python and Playwright. The script must clear `public/assets`, create the new directory structure, scroll the main page to collect the 59 links, and process them in batches of 3 with a 60s sleep. Each yacht page must be scraped using both DOM evaluation and network interception, with up to 3 retries, saving sequentially labeled files into `slug_id` subfolders.

## Verification Method
Run the implementer's script. 
1. Verify `public/assets/main-yatchs-imgs` is created and other assets in `public/assets` were deleted.
2. Verify there are 59 subfolders inside `main-yatchs-imgs`.
3. Verify files inside the subfolders are sequentially named (e.g., `image_1.jpg`, `video_1.mp4`).
4. Check the script's console output or execution time to confirm the 1-minute batch delay and retry logic is working.
