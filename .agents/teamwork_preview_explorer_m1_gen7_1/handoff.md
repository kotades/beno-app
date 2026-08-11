# SSRF Vulnerability Analysis and Strategy

## 1. Observation
In `scripts/scrape_yachts.py`, at line 62, the domain validation for image downloading is implemented as:
```python
    hostname = parsed_url.hostname or ""
    if not (hostname.endswith('beno.com') or hostname.endswith('cloudfront.net')):
```
The Challenger feedback states: "High-risk Server-Side Request Forgery (SSRF) bypass vulnerability in `download_image()`. The domain check `hostname.endswith('beno.com')` allows attacker domains like `hackedbeno.com`."

## 2. Logic Chain
- The current method `endswith('beno.com')` checks if the string ends with `beno.com`.
- A domain like `hackedbeno.com` ends with `beno.com`, thus passing the validation check.
- This allows the `download_image` function to make server-side HTTP requests to arbitrary attacker-controlled domains, resulting in an SSRF vulnerability.
- By tightening the validation to require an exact match (`hostname == 'beno.com'`) or a strict subdomain match (`hostname.endswith('.beno.com')`), attacker-controlled domains like `hackedbeno.com` will be correctly blocked.
- To maintain functionality, the same strict check should likely be applied to the `cloudfront.net` allowed domain (i.e., `hostname == 'cloudfront.net' or hostname.endswith('.cloudfront.net')`).

## 3. Caveats
- I assumed the `cloudfront.net` domain check also needs the same strict validation to prevent similar SSRF bypasses, although the challenger feedback only explicitly mentioned `beno.com`.
- I have not investigated other files for similar SSRF vulnerabilities.

## 4. Conclusion
The SSRF bypass vulnerability is caused by overly permissive domain matching in `download_image()`. 
**Strategy**: Update `scripts/scrape_yachts.py` to use strict domain validation. The validation logic should be changed to:
```python
if not (
    hostname == 'beno.com' or hostname.endswith('.beno.com') or 
    hostname == 'cloudfront.net' or hostname.endswith('.cloudfront.net')
):
```

## 5. Verification Method
- After implementation, test the script using a mocked URL like `http://hackedbeno.com/image.jpg` to ensure it is blocked.
- Verify normal operation by running `python scripts/scrape_yachts.py` and checking if legitimate `beno.com` and `cloudfront.net` images are successfully downloaded.
