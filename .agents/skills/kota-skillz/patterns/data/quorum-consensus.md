# Quorum Consensus (Tier 2)

## When to Use
- **Distributed Databases**: When you need to balance read/write latency with data consistency (e.g., Cassandra, DynamoDB).
- **Tunable Consistency**: When different operations need different safety levels (e.g., "Critical User Profile Update" vs "Non-critical Feed Scroll").

## The Pattern
Define three parameters:
- **N**: Total number of replicas.
- **W**: Minimum number of nodes that must acknowledge a **Write**.
- **R**: Minimum number of nodes that must acknowledge a **Read**.

### Implementation Logic
1. **Strong Consistency**: Set `W + R > N`. Usually `N=3, W=2, R=2`. This ensures that every read overlaps with at least one updated node.
2. **Fast Writes**: Set `W=1, R=N`. Good for high-throughput data where you don't mind slow reads.
3. **Fast Reads**: Set `R=1, W=N`. Good for data that is read frequently but rarely updated.

## Trade-offs
- **Latency**: Higher `W` or `R` values mean waiting for the slowest replica in the quorum.
- **Availability**: If `W` or `R` nodes are down, the operation fails, even if some nodes are alive.

## Failure Modes
- **Sloppy Quorum Risk**: Using "Hinted Handoff" (writing to a non-designated node when the target is down) can lead to temporary inconsistency.
- **Clock Drift**: While not directly affecting Quorum, it can affect "Last Write Wins" resolution during conflict.

## Verification
- **Partition Test**: Kill `N - W + 1` nodes. Verify that writes fail.
- **Stale Read Test**: Set `W+R <= N`. Perform a write to `Node A`, then immediately read from `Node B`. Verify that you might see the old value.
