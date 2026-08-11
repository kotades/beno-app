# Notification Worker (Tier 1)

## When to Use
- **Multi-Channel Alerts**: When sending Email, SMS, and Push notifications in parallel.
- **High Volume spikes**: When a single event (e.g., "Breaking News") triggers millions of notifications at once.

## The Pattern
Decouple the notification trigger (API Server) from the delivery (Workers) using a message queue per channel. Use specialized workers to handle the unique protocols of each provider (APNS, FCM, Twilio).

### Implementation Logic
1. **Per-Channel Queues**: Use a dedicated queue for each notification type (e.g., `ios-push-queue`, `sms-queue`). This prevents a slow SMS provider from delaying Push notifications.
2. **Deduplication Sink**: Before sending, check a "Dedupe Cache" (Redis) using an `event_id` to prevent sending the same alert twice.
3. **Retry with Exponential Backoff**: If a third-party API fails, re-queue the message with a delay.

## Trade-offs
- **Delayed Delivery**: Message queues introduce slight latency (Soft Real-Time).
- **In-Order Delivery**: Notifications might be received out of order if workers process messages at different speeds.

## Failure Modes
- **Third-Party Outage**: If APNS goes down, the iOS queue will fill up. Use monitoring to alert when "Queue Length" exceeds a threshold.
- **The "Notification Storm"**: Millions of users receiving the same alert simultaneously can cause a surge in your own backend as they all open the app at once.

## Verification
- **Stress Test**: Trigger 100k notifications. Monitor the "Queue Drain Rate" and "End-to-End Latency."
- **Failure Test**: Simulate a Twilio API failure. Verify that the message is re-queued and retried after a delay.
