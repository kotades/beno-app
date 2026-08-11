# API Security Patterns (ASVS v13)

**OWASP ASVS Level**: 2
**Attack Surface**: Denial of Service (DoS), Server-Side Request Forgery (SSRF), Data Exposure

## Rate Limiting (DoS Protection)
**Essential for all public APIs** to prevent brute force and resource exhaustion.

```python
# Python/FastAPI example with slowapi
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/login")
@limiter.limit("5 per minute")
async def login(request):
    # Rate limited to 5 attempts/minute
    pass
```

**Default rate limits:**
- Login/OTP endpoints: 5-10 per minute
- General API: 100-1000 per minute (based on endpoint computational cost)
- Admin endpoints: Even stricter limits

## Input Size Limits
Prevent payload-based DoS by restricting request body size.

```python
# FastAPI example
from fastapi import File, Form

@app.post("/api/upload")
async def upload(file: bytes = File(max_length=10_000_000)):  # 10MB limit
    pass

@app.post("/api/comment")
async def comment(content: str = Form(max_length=2000)):  # 2K char limit
    pass
```

## SSRF Protection (ASVS v12.6)
Server-Side Request Forgery occurs when attackers trick your server into making requests to internal resources (e.g., AWS metadata service, internal DBs).

**Prevention:**
- Validate and sanitize all URLs from user input
- Maintain an allowlist of domains your server can request
- Block internal IP ranges (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)

```python
import ipaddress
import socket
from urllib.parse import urlparse

def validate_url(url: str):
    parsed = urlparse(url)
    host = parsed.hostname
    ip = socket.gethostbyname(host)
    
    # Block internal IPs
    if ipaddress.ip_address(ip).is_private:
        raise ValueError("Internal URLs not allowed")
```

## API Security Headers
Ensure your API responses don't leak data or invite sniffing:
- `X-Content-Type-Options: nosniff`
- `Cache-Control: no-store` (for responses with sensitive data)

## Verification Checklist
- [ ] Rate limiting applied to all public endpoints
- [ ] Input size limits configured globally or per-route
- [ ] SSRF protections in place for any feature making external HTTP requests
- [ ] No sensitive data in URL parameters (since URLs are logged in access logs)
- [ ] API versions support a deprecation notice period
