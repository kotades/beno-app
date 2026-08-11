# Monotonic Reads (Tier 2)

## When to Use
- **News Feeds / Timelines**: To prevent items from "disappearing" and then "reappearing" when a user refreshes the page.
- **Polls / Vote Counters**: To ensure the count doesn't appear to decrease after a refresh.

## The Pattern
Ensure that once a user has seen a certain version of data, they will never see an "older" version of that data in subsequent requests.

### Implementation Logic
1. **Replica Pinning (Sticky Sessions)**: Route all read requests from a specific User ID to the **same** replica node.
2. **Hashing**: Use `hash(User_ID) % Number_of_Followers` to determine which replica to use.
3. **Failover handling**: If the pinned replica goes down, re-route the user to a different replica, but accept that they might see a one-time "time jump" backward.

## Trade-offs
- **Load Imbalance**: If one "whale" user generates massive traffic, the specific replica they are pinned to might get overloaded.
- **Availability**: If the specific replica assigned to a user goes down, they might experience higher latency while a new one is assigned.

## Failure Modes
- **Reverse Time Jump**: If a user is moved from a "fresh" replica to a "stale" replica, data they previously saw will disappear, causing confusion.

## Verification
- **Refresh Test**: Automate 100 page refreshes for a single user and verify that the data version ID never decreases.
- **Load Balancer Check**: Verify that the routing logic is correctly using the User ID for stickiness.
