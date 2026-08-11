# Client-Side Storage Security

**OWASP ASVS Level**: 2
**Attack Surface**: Token theft, XSS escalation, PII exposure

## Never Store Sensitive Data in localStorage/sessionStorage
- No authentication tokens (JWTs)
- No PII (Personally Identifiable Information)
- No payment info
- No secrets

**Why?** Any JavaScript on the page (including third-party scripts) can read `localStorage`. An XSS vulnerability immediately becomes a complete account compromise if tokens are stored here.

## Secure Cookie Storage (Backend setting)
Store tokens in cookies so the frontend code never needs to touch them directly.

```python
# Python backend example
response.set_cookie(
    "session_id",
    value=session_id,
    httponly=True,    # Not accessible via JavaScript (XSS protection)
    secure=True,      # HTTPS only (MITM protection)
    samesite="Strict" # Prevents CSRF
)
```

## For Mobile Apps (iOS/Android)
- **iOS**: Store tokens in Keychain (not UserDefaults)
- **Android**: Use EncryptedSharedPreferences
- Never hardcode salts, secrets, or API keys in the app binary

## In-Memory Only Storage Pattern
If you absolutely must handle a token client-side (e.g., OAuth popup flow), store it in memory, not on disk.

```javascript
// Store sensitive data in memory only (not persistent)
let sessionToken = null;

// On page refresh, re-authenticate or use a HttpOnly refresh cookie
// The token lives only until the browser tab closes
```

## Verification Checklist
- [ ] No tokens/secrets in `localStorage` or `sessionStorage`
- [ ] Cookies use `HttpOnly` and `Secure` flags for auth tokens
- [ ] Mobile apps use secure OS-level storage APIs (Keychain/EncryptedSharedPreferences)
- [ ] No hardcoded credentials or API keys in frontend code
