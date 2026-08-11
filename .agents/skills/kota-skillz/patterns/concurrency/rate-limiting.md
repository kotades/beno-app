# Rate Limiting & Concurrency (Tier 1 - Stripe Standard)

## The Token Bucket Pattern
The gold standard for API stability. Allows for short bursts of traffic while enforcing a long-term limit.

### Implementation Logic (Redis)
1. Each user has a "bucket" with a max capacity (e.g., 100 tokens).
2. Tokens refill at a constant rate (e.g., 10 tokens/sec).
3. Each request consumes 1 token.
4. If tokens == 0, return `429 Too Many Requests`.

## Concurrency Control Patterns

### 1. The Semaphore (Limit Simultaneous Work)
- **When to Use**: You have 1000 users, but your AI processing server can only handle 5 requests at a time.
- **Logic**: Wrap the processing logic in a semaphore with `limit=5`.

### 2. Load Shedding (The "Fail Fast" Rule)
- **Logic**: If the system is near 90% CPU or memory, reject non-critical requests (e.g., analytics) to save the critical path (e.g., payments).

## Quality Gates
- **Fail Open**: If the Rate Limiter (Redis) goes down, the API should allow requests, not crash.
- **Header Transparency**: Always return `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `Retry-After`.

## Selection Logic
- IF "User is spamming an endpoint" -> **Token Bucket**.
- IF "Downstream service is slow" -> **Semaphore**.
- IF "System is globally overloaded" -> **Load Shedding**.
