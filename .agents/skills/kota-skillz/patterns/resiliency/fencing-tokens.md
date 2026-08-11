# Fencing Tokens (Tier 2)

## When to Use
- **Distributed Locking**: When multiple nodes are competing to perform a task (e.g., being the "Leader" that writes to a central file).
- **Lease-based Systems**: Where a node holds a "Lease" to perform actions for a limited time.

## The Pattern
Protect a shared resource (like a database or file) from a "Stale Leader" by requiring a monotonically increasing token for every write.

### Implementation Logic
1. **The Lock Service**: A central service (like ZooKeeper or etcd) grants a lock AND a **Fencing Token** (an ever-increasing number).
2. **Node Activity**: Node 1 gets the lock with Token `33`. Node 2 gets the lock with Token `34`.
3. **The Resource Check**: The storage server (e.g., the DB) remembers the highest token it has ever seen.
4. **Validation**:
   - Node 1 was paused for 10 seconds. It wakes up and tries to write with Token `33`.
   - The DB sees that it already processed a write from Token `34`.
   - The DB rejects Node 1's write with an error: "Stale Token."

## Trade-offs
- **Backend Support**: The storage service (DB, File System, API) must be updated to track and validate these tokens.
- **Coordination**: Requires a highly available lock service to generate the tokens.

## Failure Modes
- **Token Overflow**: If the token is a 32-bit integer, it might wrap around after 4 billion writes (Use 64-bit).
- **Non-increasing Tokens**: If the lock service fails and resets its counter, multiple nodes might get the same token, causing data corruption.

## Verification
- **Pause Test**: Manually send a `SIGSTOP` to the current leader. Wait for a new leader to take over. Resume the old leader. Verify that its next write is rejected.
- **Token Order Audit**: Check the database logs to ensure the fencing token column is strictly increasing.
