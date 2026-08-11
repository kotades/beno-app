# Presence Heartbeat (Tier 1)

## When to Use
- **Real-Time Apps**: When you need to show "Online/Offline" status (e.g., Chat, Gaming, Collaborative Editing).
- **Session Management**: To detect when a user has silently disconnected without a clean "Logout" event.

## The Pattern
Instead of marking a user offline immediately when a WebSocket closes (which happens frequently due to poor network), use a heartbeat mechanism with a grace period.

### Implementation Logic
1. **The Pulse**: The client sends a small "Heartbeat" message to the Presence Server every $X$ seconds (e.g., 5 seconds).
2. **The Store**: The Presence Server updates a Redis key: `presence:user_id` with a TTL (Time-To-Live) of $X + GracePeriod$ (e.g., 30 seconds).
3. **The Check**: A user is considered "Online" if the key exists in Redis. If the TTL expires, Redis automatically deletes the key, and the user is seen as "Offline."

## Trade-offs
- **Latency**: There is a delay (the Grace Period) between a user actually going offline and the system reflecting it.
- **Network Overhead**: Millions of heartbeats per second can be a significant load. Scale the presence servers horizontally.

## Failure Modes
- **False Offlines**: If the user's network is congested, heartbeats might be delayed, causing them to appear offline even if the app is open.
- **Thundering Herd**: If the presence server restarts, millions of clients might try to reconnect and send heartbeats at once. Use **Exponential Backoff** and **Jitter** on the client.

## Verification
- **Network Flap Test**: Disconnect the client for 10 seconds. Verify that the status remains "Online."
- **Timeout Test**: Disconnect the client for 60 seconds. Verify that the status changes to "Offline."
