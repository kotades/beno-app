# Handoff Report: Scraper Strategy for beno.com

## Observation
- Target URLs: `https://www.beno.com/yachts` (Category) and `https://www.beno.com/yachts/solana/93GG63` (Detail).
- The task requires identifying CSS selectors for structural data and media links using Python Playwright, and devising a strategy to download media to `public/assets/` and store structured data in SQLite.
- Due to the agent's `CODE_ONLY` network restriction, live external HTTP requests (e.g., `curl`, Playwright runs against external targets) are prohibited, preventing exact observation of the live DOM structure.

## Logic Chain
1. Since live inspection is blocked by network policy, exact CSS selectors cannot be verified.
2. A generalized Playwright scraping strategy can still be defined:
   - **Playwright Setup**: Use `async_playwright` to launch Chromium, navigate to the target URLs, and wait for network idle to ensure SPA/dynamic content is loaded.
   - **Category Page (`/yachts`)**: Identify yacht cards. A typical selector might be `.yacht-card` or `[data-testid="yacht-item"]`. Extract links (`a[href^="/yachts/"]`), titles, prices, and thumbnail images.
   - **Detail Page (`/yachts/solana/93GG63`)**: Navigate to each extracted link. Identify galleries (e.g., `.gallery img`), pricing sidebars (`.pricing-info`), features list (`.features li`), and route maps.
   - **Media Downloading**: Extract `src` attributes from `<img>` or `<video>` tags. Use Python's `httpx` or `requests` (or Playwright's own routing) to fetch the binary content, hash the URL or use the filename, and save to `public/assets/`.
   - **Database Storage**: Define a SQLite schema using `sqlite3` or an ORM like `SQLAlchemy`. Tables: `yachts` (id, name, price, description), `features` (yacht_id, feature_name), `media` (yacht_id, url, local_path, type). Insert extracted JSON structures into the DB.

## Caveats
- **Exact Selectors Unknown**: The CSS selectors provided above are placeholders. The implementer must manually inspect the live `beno.com` pages or run a local script to determine the actual selectors.
- **Dynamic Content/Anti-Bot**: `beno.com` may employ anti-bot protections or require scrolling to lazy-load images. Playwright's `page.evaluate("window.scrollBy(0, document.body.scrollHeight)")` may be necessary.

## Conclusion
The scraper should be implemented as an asynchronous Python Playwright script that first gathers detail URLs from the category page, then processes each detail page. Media should be downloaded via HTTP clients and saved locally, while structured data is normalized and inserted into a local SQLite database (`db/yachts.db`). The implementer will need to refine the CSS selectors by inspecting the live DOM.

## Verification Method
1. Run the Python Playwright script locally where network access is permitted.
2. Verify that `public/assets/` contains the downloaded images/videos.
3. Use `sqlite3 db/yachts.db "SELECT * FROM yachts;"` to confirm data insertion.
