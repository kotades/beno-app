# Vector Clocks (Tier 3)

## When to Use
- **Multi-Leader Replication**: When multiple servers can accept writes for the same key simultaneously.
- **Conflict Detection**: When you need to know if two updates happened "concurrently" or if one "caused" the other.

## The Pattern
Every data item is associated with a list of pairs `[ServerID: Version]`. Whenever a server updates the item, it increments its own version number in the list.

### Implementation Logic
1. **Initial Write**: `Data[(ServerA: 1)]`.
2. **Update on A**: `Data[(ServerA: 2)]`.
3. **Update on B (Concurrent)**: `Data[(ServerA: 1), (ServerB: 1)]`.
4. **Comparison**:
   - Version X is an **ancestor** of Y if every counter in X is <= the corresponding counter in Y.
   - If some counters in X are > and others are < than in Y, it is a **conflict** (sibling versions).

## Trade-offs
- **Complexity**: The client must handle the "sibling" versions and merge them (Conflict Resolution).
- **Storage**: The vector clock grows as more servers participate in writes.

## Failure Modes
- **Explosion of Pairs**: In a system with many servers, the clock can become huge. Use "Pruning" (removing old entries) to keep it small, though this loses some accuracy.
- **Clock Drift**: Does not affect Vector Clocks as they use logical counters, not wall-clock time.

## Verification
- **Conflict Test**: Simulate two clients reading Version 1 and writing two different values back to two different nodes. Verify that the next read returns both versions for the client to merge.
- **Causality Test**: Verify that if Client A writes and then Client B reads and writes, the second version is marked as a descendant, not a conflict.
