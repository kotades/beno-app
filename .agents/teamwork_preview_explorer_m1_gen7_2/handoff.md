# Handoff Report: SSRF Bypass Vulnerability

## 1. Observation
In the script `scripts/scrape_yachts.py`, specifically at line 62 in the `download_image(url, filename)` function, the domain validation check is implemented as follows:

```python
    hostname = parsed_url.hostname or ""
    if not (hostname.endswith('beno.com') or hostname.endswith('cloudfront.net')):
        print(f"Blocked SSRF attempt, domain not allowed: {hostname}")
        return None
```

The Challenger feedback indicated a High-risk Server-Side Request Forgery (SSRF) bypass vulnerability: the check `hostname.endswith('beno.com')` incorrectly allows attacker domains like `hackedbeno.com`.

## 2. Logic Chain
1. The `str.endswith('beno.com')` method checks if the string ends with exactly the substring `'beno.com'`.
2. A hostname like `hackedbeno.com` ends with `beno.com`, so it bypasses the validation.
3. Since the script subsequently uses `urllib.request.urlopen(req)` to fetch the URL, an attacker could supply a URL pointing to `http://hackedbeno.com/...` and the server will download it, resulting in a Server-Side Request Forgery (SSRF) vulnerability.
4. The correct approach is to ensure that the hostname is exactly `beno.com` OR that it is a subdomain of `beno.com` (which means it must end with `.beno.com`). The same logic should apply to `cloudfront.net`.

## 3. Caveats
- The vulnerability report specifies changing the validation for `beno.com`. We assume `cloudfront.net` should also receive the exact same strict check.
- As requested, no implementation was performed, only analysis.

## 4. Conclusion
The validation in `download_image` is insecure. 
**Strategy for implementer:**
Modify the `if` statement to strictly match the domain or its subdomains. 
Change:
```python
hostname.endswith('beno.com') or hostname.endswith('cloudfront.net')
```
To:
```python
(hostname == 'beno.com' or hostname.endswith('.beno.com')) or (hostname == 'cloudfront.net' or hostname.endswith('.cloudfront.net'))
```

## 5. Verification Method
- **Code Inspection:** Check line 62 in `scripts/scrape_yachts.py` to confirm the condition has been updated.
- **Testing:** Write a simple test script that imports `download_image` and calls it with `http://hackedbeno.com/image.jpg` and `http://hackedcloudfront.net/image.jpg`. Verify that both return `None` and output the block message.
