# Handoff Report: Beno App Yacht Asset Downloader

## 1. Observation
- **Scope & Requirements**: Based on `SCOPE.md` and `PROJECT.md`, the objective is to build a Python Playwright script that scrapes 59 yacht detail pages from `beno.com/yachts`.
- **Target Links**: Local analysis of `scratch/scraped_yachts_full.json` and existing playground scripts (`scratch/scrape_yachts_assets.py`) shows that target links follow the pattern `https://www.beno.com/yachts/<slug>/<id>`.
- **Implementation constraints** outlined in the prompt:
  - Delete existing yacht images in `public/assets`.
  - Create `public/assets/main-yatchs-imgs`.
  - Create 59 subfolders named after each yacht slug/id.
  - Extract images and videos using a double-pass search.
  - Implement throttling & retries: 3 concurrency per batch, 1-minute delay between batches, 3 retries per page, fallback to placeholders on failure.
  - Download and sequentially label assets (e.g., `1.jpg`, `2.mp4`).

## 2. Logic Chain
- **Link Extraction**: The 59 links can be collected by navigating to `https://www.beno.com/yachts`, scrolling the page to trigger lazy-loaded cards, and querying `a[href*="/yachts/"]` elements within the yacht card containers. The slug and id can be extracted from the URL (`split("/")`).
- **File System Prep**: The script must use `shutil.rmtree()` to clear out `public/assets` (or specifically `public/assets/main-yatchs-imgs`), then use `os.makedirs()` to set up the root directory and the 59 subfolders before downloading.
- **Double-Pass Media Search**: 
  - *Pass 1 (Network Interception)*: Hook into Playwright's `page.on("request")` to capture CDN URLs (`.jpg`, `.mp4`, etc.) loading in the background.
  - *Pass 2 (DOM Parsing)*: Use `page.evaluate()` to scrape `img[src]` and `video > source[src]` elements directly from the DOM after the page loads.
- **Throttling & Retries**: 
  - Split the 59 links into chunks of 3.
  - Process each chunk concurrently with `asyncio.gather()`.
  - Wrap the page navigation and extraction in a `for _ in range(3):` retry block.
  - If all 3 retries fail, generate a placeholder asset (e.g., downloading a default image or creating a placeholder text file) in the respective yacht folder.
  - After each chunk, execute `await asyncio.sleep(60)` to respect the 1-minute delay requirement.
- **Sequential Labeling**: Keep a counter per yacht folder and rename the successfully downloaded streams to `{counter}.{extension}`.

## 3. Caveats
- **Network Mode**: Explored in `CODE_ONLY` network mode. I was restricted from making live HTTP requests to `beno.com`, so the link extraction strategy relies on the static analysis of previous attempts found in the `scratch/` directory.
- **Execution Time**: With 59 links processed in batches of 3 and a 1-minute delay per batch, the final script will take at least 20 minutes to complete.
- **Placeholder Specifics**: The requirement "fallback to placeholders" is slightly ambiguous. The implementer should supply a static local image (e.g., `placeholder.jpg`) to copy into the folder if the download fails.

## 4. Conclusion
Recommend writing a new Playwright script (e.g., `scripts/download_yacht_assets.py`) that strictly adheres to the stated architectural constraints. The script should orchestrate the cleanup, perform the batched asyncio processing with the 60-second delay, employ a double-pass media extraction technique (Network + DOM), and save the sequentially labeled files into the uniquely named subfolders.

## 5. Verification Method
- Execute the completed script: `python scripts/download_yacht_assets.py`.
- Verify that `public/assets/main-yatchs-imgs/` is newly created and contains exactly 59 directories.
- Inside any directory (e.g., `public/assets/main-yatchs-imgs/arya-W3jv3Y/`), verify files are named sequentially (e.g., `1.jpg`, `2.mp4`).
- Check the console logs during execution to confirm the 60-second delay is triggering after every 3 yachts, and that retries fire when a page times out.
