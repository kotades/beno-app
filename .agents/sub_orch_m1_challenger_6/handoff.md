# Challenge Report: `scripts/scrape_yachts.py`

## 1. Observation
- `create_placeholder` catches exceptions from `requests.get` but does not create any local file if the request fails.
- `get_ext` defaults to `.jpg` if no `content-type` header is present and the URL lacks an extension.
- `extract_links` does not catch exceptions from `page.goto('https://beno.com/yachts', timeout=60000)`.

## 2. Logic Chain
- **Assumption**: Placeholders are a reliable fallback.
  - **Challenge**: If the network is entirely down, or if the external placeholder domains (`w3schools.com`, `placehold.co`) block the request or timeout, `create_placeholder` fails and prints an error. No local file is ever written. Any process expecting an asset in the yacht's folder will fail because the folder will be empty.
  - **Blast radius**: Yachts failing to download will have completely empty asset folders instead of placeholders.
- **Assumption**: Unrecognized or header-less files can default to `.jpg`.
  - **Challenge**: If a video asset from the API lacks a `.mp4` extension in its URL and lacks a valid `content-type` header (e.g., a blob or generic stream URL), `get_ext` will default to `.jpg`. The system will save a video file as `.jpg`.
- **Assumption**: The main yacht list page is always available.
  - **Challenge**: If `page.goto` in `extract_links` times out, the entire script crashes and terminates.

## 3. Caveats
- Execution of verification scripts was blocked due to user permission timeout on `run_command`, so findings were deduced via static analysis and logic rather than runtime execution.

## 4. Conclusion
The script's resilience is flawed. It relies on external network requests to generate fallback placeholders, which defeats the purpose of a fallback. It should use bundled local placeholder files. Furthermore, its extension guessing can mislabel videos as images if headers are missing.

## 5. Verification Method
- **To test Placeholder Failure**: Disconnect from the internet or point `url` to `http://localhost:9999` in `create_placeholder`, run it, and observe that no file is created on disk.
- **To test Extension Bug**: Call `get_ext("https://example.com/asset", mock_response)` where `mock_response.headers = {}`. It will return `.jpg` even if the asset is intended to be a video.
