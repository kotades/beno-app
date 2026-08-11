# Security Headers Configuration (ASVS v14.4)

**OWASP ASVS Level**: 2
**Attack Surface**: Clickjacking, MIME sniffing, CSRF, SSL Stripping

## Essential Headers (Implement ALL)

| Header | Value | What it prevents |
| :--- | :--- | :--- |
| `Content-Security-Policy` | (See input-sanitization.md) | XSS, data injection |
| `X-Frame-Options` | `DENY` or `SAMEORIGIN` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME type sniffing attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Information leakage |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Feature abuse |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | SSL stripping |

## CSRF Protection (ASVS v4.2)
- Use anti-CSRF tokens for state-changing requests
- Set cookie `SameSite=Strict`
- For APIs: require custom header or token

```javascript
// Fetch with CSRF token
fetch('/api/transfer', {
    method: 'POST',
    headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
});
```

## Subresource Integrity (SRI)
When loading libraries from a CDN, add the integrity hash:

```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
        crossorigin="anonymous"></script>
```

## Verification Checklist
- [ ] All security headers present in responses
- [ ] CSP configured (not just "unsafe-inline" everywhere)
- [ ] CSRF tokens on all forms/mutations
- [ ] HSTS preload enabled for production
- [ ] External scripts have SRI hashes
