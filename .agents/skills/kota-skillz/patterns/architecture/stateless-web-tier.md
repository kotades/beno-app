# Stateless Web Tier (Tier 1)

## When to Use
- **Horizontal Scaling**: When you need to add/remove web servers automatically based on traffic.
- **High Availability**: When a web server crash shouldn't log out your users.

## The Pattern
Move all "State" (session data, profile info, temporary files) out of the web server's memory and into a shared, persistent data store (e.g., Redis, NoSQL, or a Relational DB).

### Implementation Logic
1. **Remove Local Session**: Don't use `HttpSession` or local variables to store user-specific data.
2. **Shared Store**: Every web server connects to a shared "Session Store" (usually Redis for speed).
3. **Identity via Token**: The client sends a token (e.g., JWT) with every request. The web server uses this token to fetch the state from the shared store.

## Trade-offs
- **Latency**: Every request now requires an extra network call to the shared store.
- **Complexity**: You need to manage a separate, highly-available session cluster.

## Failure Modes
- **The "Sticky Session" Trap**: Using the Load Balancer to send a user to the same server every time. If that server dies, the user loses their session.
- **Session Store SPOF**: If the Redis cluster goes down, nobody can log in.

## Verification
- **Kill Test**: Log in on Instance A. Manually kill Instance A. Refresh the page. You should still be logged in (as Instance B picks up the request and fetches the session from Redis).
- **Scale Test**: Add 10 more web servers. Verify that they all can handle user requests immediately without needing to "sync" state.
