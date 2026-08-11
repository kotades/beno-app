# Frontend Input Security (ASVS v5)

**OWASP ASVS Level**: 2
**Attack Surface**: Cross-Site Scripting (XSS), Content Injection

## Cross-Site Scripting (XSS) Prevention
**The rule: Never insert user-controlled content directly into the DOM.**

```javascript
// DANGEROUS - XSS vulnerability
element.innerHTML = userInput;

// SAFE - Use textContent
element.textContent = userInput;

// SAFE - Use React (escapes by default)
<div>{userInput}</div>

// SAFE but careful - Sanitize HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

## URL/Input Sanitization
Check for malicious patterns in URLs and inputs:
- `javascript:` protocol handlers
- `data://` or `file://` URIs
- CRLF characters (carriage return, line feed)
- HTML tags in context where not expected

```javascript
function sanitizeInput(input) {
    // Remove dangerous protocols
    return input.replace(/javascript:/gi, '')
                 .replace(/data:/gi, '')
                 .replace(/[\r\n]/g, '');
}
```

## Content Security Policy (CSP) (ASVS v14.4)
The most important frontend security header:

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://trusted-cdn.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://api.yoursite.com;
">
```
*Why CSP matters*: Even if an attacker injects a `<script>` tag, CSP prevents it from executing unless explicitly allowed.

## JSON Building (Critical)
Never build JSON by string concatenation:

```javascript
// DANGEROUS
const json = '{"user": "' + userInput + '"}';

// SAFE - Use native methods
const json = JSON.stringify({ user: userInput });
```

## Verification Checklist
- [ ] No `innerHTML` or `dangerouslySetInnerHTML` with user input without sanitization
- [ ] CSP header configured
- [ ] URL sanitization on all user-provided links
- [ ] JSON built with `JSON.stringify()`, not concatenation
- [ ] Subresource Integrity (SRI) for external scripts (`integrity` attribute on script tags)
