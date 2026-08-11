# Handoff Report

## Observation
- **File**: `scripts/scrape_yachts.py`
- **Location**: Line 62, within the `download_image()` function.
- **Current Code**: 
  ```python
  if not (hostname.endswith('beno.com') or hostname.endswith('cloudfront.net')):
  ```
- **Issue**: The current domain validation uses `.endswith('beno.com')`. This allows any domain that ends with the string `"beno.com"` to bypass the check, such as `hackedbeno.com` or `notbeno.com`. This results in a Server-Side Request Forgery (SSRF) bypass vulnerability.

## Logic Chain
1. The `download_image()` function is responsible for fetching images from remote URLs.
2. The domain validation is intended to restrict fetches to allowed domains (`beno.com` and `cloudfront.net`).
3. Because `endswith('beno.com')` is used, an attacker could supply a URL pointing to `http://hackedbeno.com/payload.png` or `http://malicious-cloudfront.net/payload.png`.
4. The server would make an unauthorized request to the attacker-controlled domain.
5. To properly secure this, the check must ensure that the domain is either exactly the root domain (`beno.com`) or a valid subdomain (which implies it ends with `.beno.com`). The same logic applies to `cloudfront.net`.

## Caveats
- The instructions specified changing the validation for `beno.com` to `hostname == 'beno.com' or hostname.endswith('.beno.com')`. The fix should also be symmetrically applied to `cloudfront.net` (`hostname == 'cloudfront.net' or hostname.endswith('.cloudfront.net')`) to avoid a similar vulnerability there. No other constraints or missing areas were noted.

## Conclusion
The script `scripts/scrape_yachts.py` contains an SSRF vulnerability in the `download_image` function due to insecure hostname validation. The validation logic must be updated to strictly check for the exact domain name or its subdomains.

**Strategy**:
Modify line 62 in `scripts/scrape_yachts.py` to:
```python
is_beno = (hostname == 'beno.com' or hostname.endswith('.beno.com'))
is_cloudfront = (hostname == 'cloudfront.net' or hostname.endswith('.cloudfront.net'))
if not (is_beno or is_cloudfront):
```

## Verification Method
- Execute a Python test that imports `download_image` from `scripts.scrape_yachts` and attempts to download an image from `http://hackedbeno.com/image.png` and `http://hackedcloudfront.net/image.png`. 
- Assert that both function calls return `None` and print the blocked SSRF attempt message.
- Verify that `http://beno.com/image.png` and `http://subdomain.beno.com/image.png` are still permitted.
