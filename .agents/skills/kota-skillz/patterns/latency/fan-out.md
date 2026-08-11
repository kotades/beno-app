# Hybrid Fan-out (Twitter Pattern)

## When to Use
- **Social Timelines / News Feeds**: When read-to-write ratio is extremely high.
- **Notification Systems**: When data needs to be pushed to many recipients.

## The Pattern
Balance the work between **Write-time (Fan-out)** and **Read-time (Merge)**.

### Implementation Logic
1. **The Normal Case**: When a user posts, push the update to the caches (timelines) of all their followers (Push model).
2. **The "Celebrity" Case**: For users with millions of followers, do NOT fan out on write. Instead, fetch their posts only when a follower reads their timeline (Pull model).
3. **The Hybrid**: Merge the results from the Push cache and the Pull query at the moment of request.

## Trade-offs
- **Complexity**: Managing two different paths (push vs pull) is harder than one.
- **Consistency**: The timeline cache must be kept in sync with the source of truth.

## Failure Modes
- **Celebrity Bottleneck**: Failing to switch to "Pull" for high-follower users causes massive write spikes and latency.
- **Cache Invalidations**: A deleted post must be purged from millions of timeline caches.

## Verification
- **Stress Test**: Post a tweet from a user with 10k followers vs 1M followers. Monitor latency.
- **Data Integrity**: Verify that a post deleted by the author disappears from the followers' feeds within the SLA (e.g., 5 seconds).
