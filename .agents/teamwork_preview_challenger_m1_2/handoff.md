## 1. Observation
In `scripts/scrape_yachts.py`, around line 144, the script extracts the image URL and passes it directly to `download_image`:
```python
        # Download hero image
        img_url = card['imgSrc']
        local_hero = ""
        if img_url:
            filename = f"{yacht_id}_hero.jpg"
            local_hero = f"/assets/{filename}"
            download_image(img_url, filename)
```
In `download_image` (line 52), the URL is opened without any validation:
```python
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response, open(filepath, 'wb') as out_file:
```
Additionally, the script handles partial scraping failures incorrectly (line 205):
```python
    if not cards_data:
        print("Playwright failed or timed out. Using local files...")
```
And it uses a bare `except: pass` to swallow list bounds errors during text parsing (line 134):
```python
            elif '/ hour' in text:
                try:
                    price = int(full_text[i-2].replace(',', ''))
                    orig_price = int(full_text[i-1].replace(',', ''))
                except: pass
```

## 2. Logic Chain
1. **LFI/SSRF Vulnerability**: The `urllib.request.urlopen` function natively supports the `file://` protocol. Because `card['imgSrc']` is never validated to ensure it starts with `http` or `https` (unlike the Solana image scraper on line 188 which does `if not url.startswith('http'): continue`), an attacker who can manipulate the target website's DOM or the local fallback JSON can supply `file:///etc/passwd` as the `imgSrc`. The script will read the local file and save its contents into `public/assets/`, thereby exposing local system files to the web server.
2. **State Inconsistency**: If `scrape_live` successfully scrapes 1 or more cards but fails during the Solana scrape (throwing an Exception), it returns a populated `cards_data` but `solana_data = None`. The `main` function only falls back to local JSON for `cards_data` if it is completely empty. As a result, the script will commit incomplete live card data mixed with local Solana fallback data.
3. **Silent Data Corruption**: The price parsing relies on `i-2` and `i-1`. If `'/ hour'` appears too early in the text sequence, this triggers an `IndexError`. Because it's wrapped in a bare `except: pass`, the error is swallowed and the yacht's `price` defaults to `0` without any logging.

## 3. Caveats
Due to execution timeouts in the environment for terminal commands (e.g. `python3`), the LFI vulnerability was confirmed via static analysis of standard library behavior rather than direct execution in this workspace. The SSRF attack assumes the attacker can either compromise `www.beno.com` or tamper with `scripts/fleet_cards_report.json`.

## 4. Conclusion
The script has a **CRITICAL** vulnerability allowing Local File Inclusion (LFI) via `urllib.request` `file://` protocol support. It also suffers from silent failure handling that masks parsing errors and leads to corrupted database state (e.g., zero prices or mixed live/local data).

## 5. Verification Method
1. Modify `scripts/fleet_cards_report.json` to change the first item's `"imgSrc"` to `"file:///etc/passwd"`.
2. Disable internet connection or force the Playwright scrape to fail so it uses the fallback file.
3. Run `python3 scripts/scrape_yachts.py`.
4. Inspect `public/assets/W3jv3Y_hero.jpg` (or the corresponding ID) — it will contain the contents of the `/etc/passwd` file.
5. To test the state inconsistency, add `raise Exception("test")` at line 85 of `scripts/scrape_yachts.py` and observe that the fallback only applies to Solana.
