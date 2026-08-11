# Industrial-Grade Authentication (Tier 1)

## Core Requirements
- **Protocol**: OpenID Connect (OIDC) over OAuth 2.0.
- **Flow**: Authorization Code Flow with PKCE (Proof Key for Code Exchange) for SPAs/Mobile.
- **Token Format**: JWT (JSON Web Token) for stateless verification.
- **Security**: Asymmetric signing (RS256/ES256), short-lived access tokens, and HttpOnly cookies.

## Architecture
```
Client (Next.js) -> OIDC Flow -> Identity Provider (Auth0/Google) -> JWT Issued
Client (Next.js) -> JWT in HttpOnly Cookie -> Resource API (FastAPI/Node)
Resource API -> Validate JWT Signature (Local Public Key) -> Process Request
```

## Database Schema (Minimal Local Cache)
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    refresh_token_hash TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    revoked_at TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
```

## Quality Gates (Mandatory)
1. **No Local Storage**: Never store JWTs in `localStorage`. Use `httpOnly`, `secure`, `SameSite=Strict` cookies.
2. **Mandatory Validation**:
   - Verify `exp` (expiration).
   - Verify `iss` (issuer) and `aud` (audience).
   - Cryptographic signature check on every request.
3. **PKCE Enforcement**: All public clients (Frontend/Mobile) must use PKCE to prevent code injection.
4. **Minimal Payload**: Only essential claims (`sub`, `roles`) in JWT.

## Patterns to Apply
- **Auth Guard**: Middleware that validates tokens before reaching business logic.
- **Token Rotation**: Refresh tokens must be rotated on every use to detect reuse.

## Failure Indicators
- **High `alg: none` attempts**: Indicates a security scan or attack.
- **XSS Vulnerabilities**: Check if tokens are accessible via `document.cookie`.
- **Clock Skew**: JWT validation failing due to server time drift (apply 5-minute leeway).
