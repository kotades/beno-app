# Circuit Breaker (Tier 1)

## When to Use
- **Synchronous Downstream Calls**: When calling any service over the network.
- **Cascading Failure Prevention**: To stop a slow/failing service from bringing down the entire system.

## The Pattern
Wrap the call to a downstream service in a "Circuit Breaker" object. It monitors for failures. If failures exceed a threshold, it "trips," and all subsequent calls fail immediately (returning a default value or error) without actually making the network request.

### Implementation Logic
1. **Closed State**: Normal operation. Requests go through. Failures are counted.
2. **Open State**: After X failures, the circuit trips. Requests fail fast. This gives the downstream service time to recover.
3. **Half-Open State**: After a timeout, the circuit allows a few "test" requests. If they succeed, the circuit closes. If they fail, it stays open.

## Trade-offs
- **Complexity**: You need to decide what to return when the circuit is open (e.g., a "Cache" value or an error message).
- **Monitoring**: You need a dashboard (like Hystrix Dashboard) to see which circuits are open.

## Failure Modes
- **The "Sensitive Trigger"**: Setting the threshold too low, causing the circuit to trip during minor network blips.
- **The "Silent Failure"**: Returning a default value (e.g., an empty list) that makes the user think everything is fine when it's actually broken.

## Verification
- **Chaos Test**: Kill a downstream service. Verify that the upstream service's circuit trips and its threads don't hang.
- **Recovery Test**: Bring the downstream service back up. Verify that the circuit eventually closes and traffic resumes.
