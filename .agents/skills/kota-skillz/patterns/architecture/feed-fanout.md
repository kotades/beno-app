# Feed Fan-out (Tier 2)

## When to Use
- **Social Timelines**: When a user needs to see a chronological feed of their friends' activities (e.g., Facebook, Twitter, Instagram).
- **Activity Logs**: When an action by one entity must be propagated to many followers.

## The Pattern
Choose between two strategies based on user follower count:
1. **Push (Fan-out on Write)**: When a post is made, it is immediately written to the "Inbox" cache of every follower.
2. **Pull (Fan-out on Read)**: The feed is aggregated dynamically from the activities of all followed people at the time the user requests it.

### Implementation Logic
1. **The Hybrid Strategy**:
   - **For Normal Users**: Use **Push**. It makes "Read" operations extremely fast (just fetch a pre-built list from Redis).
   - **For Celebrities (High Followers)**: Use **Pull**. Pushing a post to 100 million followers would crash the system (the "Thundering Herd"). Followers of celebrities aggregate the celebrity's posts only when they open their feed.
2. **Inbox Cache**: A Redis Sorted Set (`ZSET`) per user, where `Score = Timestamp` and `Value = PostID`.

## Trade-offs
- **Write Latency**: The "Push" model can make posting slow if a user has many friends.
- **Read Latency**: The "Pull" model makes viewing the feed slow for users following many celebrities.

## Failure Modes
- **Cache Eviction**: If a user's pre-computed feed is evicted from Redis, the system must fallback to a slow "Pull" rebuild.
- **Inconsistency**: A post might appear in Friend A's feed but not Friend B's if the fan-out job fails halfway through.

## Verification
- **Latency Test**: Measure the time to retrieve the feed for a user following 1,000 "Normal" users vs 1,000 "Celebrities."
- **Integrity Test**: Verify that a deleted post is successfully removed from all followers' Inbox Caches.
