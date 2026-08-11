# Bulkhead (Tier 2)

## When to Use
- **Shared Resources**: When one service calls multiple downstream services.
- **Thread Exhaustion Prevention**: When you want to ensure a slow Service A doesn't steal all the threads needed to call a fast Service B.

## The Pattern
Isolate resources for different parts of the system. If one part fails, the others can still function because they have their own dedicated resources.

### Implementation Logic
1. **Thread Pool Isolation**: Use a separate thread pool for every downstream service.
2. **Limit Concurrent Calls**: Limit the number of threads for Service A to 10. If Service A is slow, it can only hang 10 threads.
3. **Database Isolation**: Don't share connection pools between different services.

## Trade-offs
- **Overhead**: Managing multiple thread pools or connection pools uses slightly more memory.
- **Sizing**: You have to "guess" the right number of threads for each bulkhead.

## Failure Modes
- **The "Global Pool" Trap**: Using a single global HTTP client or database pool. One slow query kills everything.
- **Resource Starvation**: Setting a bulkhead too small, causing valid requests to be rejected even when the system is healthy.

## Verification
- **Stress Test**: Overload one downstream service. Verify that the calling service can still successfully call *other* healthy downstream services without latency.
- **Metric Check**: Monitor the "Pool Saturation" for each bulkhead.
