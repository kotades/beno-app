# Fault Tolerance vs. Failure (Tier 1)

## When to Use
- **Every Distributed System**: Assume parts will fail.
- **Critical Path**: When a failure in a dependency should not crash the whole system.

## The Pattern
Distinguish between a **Fault** (a component deviating from spec) and a **Failure** (the whole system stops working). Build mechanisms that prevent faults from becoming failures.

### Implementation Logic
1. **Redundancy**: Use RAID for disks, multi-node clusters for services.
2. **Graceful Degradation**: If a non-critical service fails, return a partial result or a cached version.
3. **Deliberate Fault Injection**: Use tools like "Chaos Monkey" to kill processes randomly to ensure fault-tolerance logic actually works.

## Trade-offs
- **Complexity**: Adding fault tolerance code increases the complexity of the codebase.
- **Performance**: Redundancy and monitoring add overhead.

## Failure Modes
- **Poor Error Handling**: The fault-tolerance code itself has a bug (most common cause of cascading failures).
- **Silent Failures**: A fault occurs but is not logged, leading to difficult debugging later.

## Verification
- **Chaos Engineering**: Can the system survive a `kill -9` on any process?
- **Load Testing + Outage**: Does the system stay up when a dependency is unplugged?
