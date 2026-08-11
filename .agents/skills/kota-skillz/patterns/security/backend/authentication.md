# Authentication Security Patterns (ASVS v2)

**OWASP ASVS Level**: 2 (Default for sensitive data applications)
**Attack Surface**: Credential stuffing, session hijacking, OAuth misconfiguration

---

## Password Storage (ASVS v2.4)

**The pattern:**
- Hash passwords with bcrypt (cost factor 12+).
- Never store or log plaintext passwords.
- No need to add salt manually — bcrypt includes it.

```python
# Python example
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())
```

```typescript
// TypeScript example
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
```

**AI prompt:** "Hash this password using bcrypt with cost factor 12. Never log the raw password."

**Verification:**
- [ ] No plaintext passwords in database
- [ ] No passwords in logs or error messages
- [ ] bcrypt cost factor >= 12

---

## Session Management (ASVS v3.1-3.7)

**The patterns:**
- Destroy session on logout
- Destroy **all active sessions** on password reset
- Set secure, HttpOnly cookies
- Session timeout: 15-30 minutes for sensitive operations
- Use `SameSite=Strict` or `Lax`

```python
# FastAPI/Python example
response.set_cookie(
    "session_id",
    value=session_id,
    httponly=True,     # Not accessible via JavaScript
    secure=True,       # HTTPS only
    samesite="Strict", # Prevents CSRF
    max_age=1800       # 30 minutes
)
```

**Common AI mistake:** Forgetting to invalidate sessions after password reset. Always check this.

---

## Multi-Factor Authentication (ASVS v2.7)

**When to implement:**
- Password resets
- High-value actions (payments, account changes)
- Admin access

**Implementation:**
- TOTP (Google Authenticator) preferred over SMS (SMS is less secure)
- Backup codes for account recovery
- Rate limit verification attempts (max 5 tries, then 15-min lockout)

---

## OAuth2/OpenID Connect (ASVS v2.8)

**Critical requirements:**
- Always use the `state` parameter (prevents CSRF)
- Validate `redirect_uri` against an allowlist
- Never log access tokens
- PKCE (Proof Key for Code Exchange) is mandatory for public clients (SPAs, mobile)

```python
# WRONG - No state parameter
redirect_url = f"https://provider.com/auth?client_id={id}"

# RIGHT - With state parameter
import secrets
state = secrets.token_urlsafe(32)
redirect_url = f"https://provider.com/auth?client_id={id}&state={state}"
```

---

## Verification Checklist
- [ ] All passwords hashed with bcrypt (cost ≥ 12)
- [ ] Session cookies have `Secure` + `HttpOnly` flags
- [ ] Session timeout configured (< 30 min for sensitive ops)
- [ ] OAuth `state` parameter implemented
- [ ] Rate limiting on login attempts (5-10 tries, then 15-min lockout)
- [ ] All active sessions destroyed on password reset
- [ ] No tokens logged in application logs
- [ ] PKCE enforced for all public OAuth clients
