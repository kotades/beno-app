# Observation
In `scripts/scrape_yachts.py`, the regex patterns for extracting guests, cabins, and minimum hours are defined using raw strings (`r'...'`) with double backslashes:
- Line 151: `m_guests = re.search(r'(\\d+)\\s*(?:Guests|guests)', full_text_joined, re.IGNORECASE)`
- Line 154: `m_cabins = re.search(r'(\\d+)\\s*(?:Cabins|cabins)', full_text_joined, re.IGNORECASE)`
- Line 214: `m_min_hours = re.search(r'minimum rental hours.*?(\\d+)', all_texts, re.IGNORECASE)`

# Logic Chain
1. In Python, a raw string (`r'...'`) treats backslashes as literal characters rather than escape sequences.
2. Writing `r'\\d+'` produces a string containing exactly two backslashes followed by the letter 'd'.
3. When the `re` module compiles this pattern, it looks for a literal backslash character rather than interpreting `\d` as the digit character class.
4. Consequently, the regular expressions fail to match the digits in the scraped text, leading to `guests`, `cabins`, and `minimum_hours` falling back to their default values (e.g., 0).

# Caveats
No caveats. The issue is strictly contained to the regex string definitions on lines 151, 154, and 214.

# Conclusion
To fix the extraction logic, the regex patterns on lines 151, 154, and 214 must be updated to use single backslashes instead of double backslashes, matching the correct syntax used elsewhere in the script. 
Proposed changes:
- Line 151: `r'(\d+)\s*(?:Guests|guests)'`
- Line 154: `r'(\d+)\s*(?:Cabins|cabins)'`
- Line 214: `r'minimum rental hours.*?(\d+)'`

# Verification Method
1. Ensure the implementer applies the changes to `scripts/scrape_yachts.py`.
2. Run the scraping script: `python scripts/scrape_yachts.py`
3. Inspect the `yachts` table in the generated SQLite database (`db/cloned_beno_db.sqlite`) to confirm that `guests`, `cabins`, and `minimum_hours` contain the correct extracted integer values rather than 0.
