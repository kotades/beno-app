# Read-Your-Writes Consistency (Tier 1)

## When to Use
- **Social Media Apps**: When a user posts a comment/status and expects to see it immediately upon refreshing.
- **E-commerce**: When a user adds an item to a cart and then views the cart page.

## The Pattern
Ensure that a user always sees the most recent data they themselves have submitted, even if the system uses asynchronous replication.

### Implementation Logic
1. **Leader Routing**: When a user views a resource they *own* (e.g., their own profile), always route the read to the **Leader** database.
2. **Timestamp Tracking**: Store the timestamp of the user's last write in their session (or a cookie). If a read request comes within X seconds of that timestamp, route it to the Leader.
3. **Replication Lag Check**: Check the lag of a follower. If `Follower.Lag < User.LastWriteTime`, the follower is safe to read from. Otherwise, wait or route to the Leader.

## Trade-offs
- **Leader Load**: If many users are actively writing, the Leader might become a bottleneck for reads.
- **Complexity**: The application layer must track "Who owns what" or "When did the last write happen."

## Failure Modes
- **Cross-Device Lag**: A user writes on their phone (Leader) and immediately checks their laptop (routes to a stale Follower).
- **Session Loss**: If the user's session is cleared, they lose the "Last Write" metadata and see stale data.

## Verification
- **User Experience Testing**: Simulate 500ms of replication lag and verify that the user still sees their own updates.
- **Routing Logic Audit**: Ensure that `GET /my-profile` is hitting the Leader while `GET /someone-else` is hitting a Follower.
