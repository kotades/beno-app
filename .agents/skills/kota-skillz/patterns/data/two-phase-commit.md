# Two-Phase Commit (2PC) (Tier 2)

## When to Use
- **Heterogeneous Consistency**: When you must update a Database AND a Message Queue atomically (e.g., "Deduct balance" AND "Send confirmation email").
- **Financial Integrity**: When moving money between two different physical databases.

## The Pattern
Use a **Coordinator** to ensure all participants either commit together or roll back together.

### Implementation Logic
1. **Phase 1: Prepare**
   - The Coordinator sends a "Prepare" request to all participants.
   - Each participant checks if it *can* commit (e.g., valid constraints, enough disk space).
   - If yes, it writes the data to a temporary log and replies "YES." **It now promises to commit if asked.**
2. **The Commit Point**
   - If ALL participants said "YES," the Coordinator writes a "Commit" record to its own log. This is the moment of no return.
3. **Phase 2: Commit**
   - The Coordinator sends a "Commit" request to all participants.
   - If a participant fails, the Coordinator retries the "Commit" request forever until it succeeds.

## Trade-offs
- **Performance**: Very slow due to multiple network round-trips and `fsync` calls on every node.
- **Availability Risk**: If the Coordinator dies during Phase 2, participants are "In-Doubt" and keep their row locks held until the Coordinator recovers.

## Failure Modes
- **Orphaned Locks**: If the Coordinator's disk fails, participants might hold locks forever, requiring manual intervention.
- **Amplify Failures**: If 1 out of 10 nodes is down, the whole transaction fails.

## Verification
- **Simulate Coordinator Crash**: Kill the coordinator process immediately after it sends "Prepare" but before "Commit." Verify that participants hold their locks.
- **Retry Logic Check**: Ensure the coordinator automatically retries the commit command upon restart.
