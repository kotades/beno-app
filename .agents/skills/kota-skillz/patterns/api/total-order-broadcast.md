# Total Order Broadcast (Tier 2)

## When to Use
- **State Machine Replication**: Keeping multiple database replicas in the exact same state.
- **Log-based Architectures**: Using a log (like Kafka) as the source of truth for all services.
- **Distributed Locks**: Deciding the order in which clients acquired a lock.

## The Pattern
Every node in the system receives the exact same set of messages in the exact same order.

### Implementation Logic
1. **The Log**: All writes go to a central, totally ordered log (e.g., Raft Log or Kafka Topic).
2. **Deterministic Processing**: Each replica reads the log from the beginning and applies the operations.
3. **Consistency**: Since the operations are the same and the order is the same, the resulting state on all replicas will be identical.
   - Example: `[Set A=1, Add A+2, Multiply A*3]`
   - Node 1: `1 -> 3 -> 9`
   - Node 2: `1 -> 3 -> 9`

## Trade-offs
- **Throughput**: The speed of the system is limited by the speed of the single log.
- **Complexity**: Implementing a robust Total Order Broadcast (like Raft or Paxos) is notoriously difficult. Use off-the-shelf tools (etcd, ZooKeeper, Kafka).

## Failure Modes
- **Non-Deterministic Logic**: If the operations in the log rely on the local clock (e.g., `Set time = now()`), the replicas will drift apart.
- **Log Corruption**: If one node loses a message in the sequence, its state will be permanently wrong.

## Verification
- **Checksum Comparison**: Periodically calculate a hash of the database state on all replicas. Verify that the hashes are identical.
- **Sequence Audit**: Ensure every message in the log has a monotonically increasing sequence number (offset).
