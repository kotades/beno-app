# Handoff Report: Asset Downloader Implementation Strategy

## 1. Observation
- The project `SCOPE.md` requires the M1 Asset Downloader to scrape 59 yacht listings from `beno.com/yachts`, save images/videos to `public/assets/main-yatchs-imgs/[slug]/`, implement 3-per-batch throttling with 1-min delay, 3 retries per page, double-pass media search, sequential file naming, and fallback to placeholders.
- The existing scraper `scripts/scrape_yachts.py` extracts links using `page.locator('a[href*="/listings/yacht"], a[href*="/yachts/"]').all()` but it is hardcoded to slice `[:4]` and places files directly in `public/assets/` using a hash-based naming convention.
- Videos are currently not extracted in the existing script (only `img` tags are searched).

## 2. Logic Chain
To fulfill all requirements, the implementer needs to rewrite/update `scripts/scrape_yachts.py`:
1. **Cleanup**: Start by deleting existing yacht media `import shutil; shutil.rmtree('public/assets', ignore_errors=True)`. Then create `os.makedirs('public/assets/main-yatchs-imgs', exist_ok=True)`.
2. **Link Extraction**: Remove `[:4]`. To ensure all 59 are loaded, implement a scrolling mechanism (e.g. `await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')` in a loop) before evaluating the `a` tags.
3. **Throttling & Batching**: Split the 59 links into chunks of 3 (`[links[i:i+3] for i in range(0, len(links), 3)]`). After processing each chunk, run `await asyncio.sleep(60)`.
4. **Retries**: For each URL in a batch, wrap the page navigation in a `for _ in range(3): try ... except ...` block.
5. **Subfolders & Naming**: Extract the slug from the URL (e.g., `url.split('/')[-1]`), create `public/assets/main-yatchs-imgs/{slug}/`. Keep a counter `idx = 1` and save assets as `{idx}.jpg` or `{idx}.mp4`.
6. **Double-Pass Search**: First pass: Scroll through the detail page to trigger lazy loading. Second pass: query both `img` and `video source` tags.
7. **Placeholder Fallback**: If a download fails after retries, create or copy a dummy file `placeholder.jpg` to the target index.

## 3. Caveats
- As this agent is running in `CODE_ONLY` mode, the exact DOM structure of `beno.com/yachts` (e.g. for pagination vs infinite scroll) could not be verified live. The implementer should adjust the scrolling/loading logic based on live behavior.
- Video extensions may vary (mp4, webm), ensure the downloader infers the correct extension from the URL or headers.

## 4. Conclusion
The implementation strategy is clear. A complete overhaul of the processing loop in `scripts/scrape_yachts.py` is needed to handle batching (3 links/min), subfolder creation (`main-yatchs-imgs/{slug}`), sequential labeling (`1.jpg`), and robust double-pass media extraction including videos.

## 5. Verification Method
1. The implementer should write the code and run `python scripts/scrape_yachts.py`.
2. Verify that `public/assets/main-yatchs-imgs/` contains exactly 59 folders.
3. Inside each folder, check for sequentially named files (`1.jpg`, `2.jpg`, etc.).
4. Verify execution time takes approximately ~20 minutes (since 59 links / 3 per batch = ~20 batches * 1 min delay).
