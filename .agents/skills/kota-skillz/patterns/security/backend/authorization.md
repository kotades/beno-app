# Access Control Security Patterns (ASVS v4)

**OWASP ASVS Level**: 2
**Attack Surface**: Broken Access Control (OWASP Top 10 #1), IDOR (Insecure Direct Object Reference)

## Core Principle: Least Privilege
Users should have exactly the permissions they need, nothing more.

## Row-Level Ownership Check (Critical)
**The pattern:**
Every request that accesses a resource must verify the user owns it.

```python
# ALWAYS check ownership
async def get_order(order_id: int, current_user: User):
    order = await db.fetch_one(
        "SELECT * FROM orders WHERE id = %s AND user_id = %s",
        order_id, current_user.id
    )
    if not order:
        raise HTTPException(404, "Order not found")
    return order
```

**Never do this:**
```python
# DANGEROUS - No ownership check (IDOR vulnerability)
async def get_order(order_id: int, current_user: User):
    # User could access ANY order by changing order_id
    return await db.fetch_one("SELECT * FROM orders WHERE id = %s", order_id)
```

## Avoid Predictable IDs (ASVS v4.3)
**The pattern:**
Use UUIDs instead of sequential integers for resource IDs.

```sql
-- Use UUID as primary key
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    ...
);
```

**Why?** Integer IDs like `/order/12345` are guessable. UUIDs like `/order/f47ac10b-58cc-4372-a567-0e02b2c3d479` are not.

If you must use integers internally, use a non-guessable approach (signed tokens, separate lookup table) for public-facing URLs.

## JWT Best Practices
- Keep payload small (no sensitive data)
- Set reasonable expiration (15 min for access tokens)
- Use refresh tokens for longer sessions
- Validate signature on every request
- Never log JWT tokens

## Authorization Decision Tree

```text
Is the user authenticated?
  ├─ No → Reject (401 Unauthorized)
  └─ Yes → Does user own this resource?
        ├─ No → Reject (403 Forbidden)
        └─ Yes → Check role/permission
              ├─ Insufficient → Reject (403)
              └─ Sufficient → Allow
```

## Verification Checklist
- [ ] Every resource access checks ownership
- [ ] UUIDs used for public-facing IDs
- [ ] JWT expiration <1 hour
- [ ] No hardcoded credentials or API keys in code
- [ ] Admin endpoints have separate stricter auth
