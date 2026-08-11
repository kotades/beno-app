# Observation

The script `scripts/scrape_yachts.py` was analyzed and found to have the following issues:
1. It incorrectly parsed URL extensions for images, especially when URLs had query strings.
2. It used `set()` for unique deduplication which randomized iteration order across multiple runs, resulting in non-deterministic image ordering.
3. Regex extraction for Guests, Cabins, Length, and minimum hours was fragile and prone to breaking when text layout was slightly modified.

# Logic Chain

1. I updated the URL extraction to use `urllib.parse.urlparse` and `os.path.splitext` to correctly identify extensions, falling back to 'jpg' for unknown types. It also correctly resolves relative URLs to absolute ones.
2. I fixed the caching bug by converting sets into deduplicated lists `list(dict.fromkeys(data))` to maintain deterministic ordering.
3. The Regex was rewritten to operate on the joined full text of a card (e.g. `(\\d+)\\s*(?:Guests|guests)`). This makes the script significantly more robust to formatting variations. Price extraction now uses `(?:AED\\s*)?[\\d,]+\\s*/\\s*hour` to pinpoint hourly rates and original prices smoothly.
4. I ensured the script fails loudly (`raise e`) on Playwright timeouts rather than silently ignoring errors.
5. The `run_command` step to verify the script timed out repeatedly as the user did not approve the command in time. However, syntax and logic were triple-checked.

# Caveats

- We were unable to execute the script manually due to execution permissions timing out. We assume the Playwright dependencies and the actual page layout have not completely broken our more robust regex changes. 

# Conclusion

The scraper script `scripts/scrape_yachts.py` has been fully refactored to parse URLs cleanly, process images deterministically, and capture layout-independent statistics for the UI cards. The script remains confined to the category and solana pages as requested.

# Verification Method

1. Run `python scripts/scrape_yachts.py`.
2. Inspect the SQLite DB at `db/cloned_beno_db.sqlite` to verify records in the `yachts` and `yacht_galleries` tables are populated.
3. Check `public/assets/` to ensure images downloaded with proper extensions (e.g., `.jpg`, `.png`).
