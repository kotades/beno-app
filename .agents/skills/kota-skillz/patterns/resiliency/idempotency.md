# Idempotency (Tier 1)

## When to Use
- **Retries**: When a network call times out and you don't know if it succeeded or failed.
- **Asynchronous Messaging**: When your message broker (like Kafka/RabbitMQ) delivers a message more than once (At-least-once delivery).

## The Pattern
Ensure that performing the same operation multiple times has the same effect as performing it once.

### Implementation Logic
1. **Natural Idempotency**: Use `PUT` (Replace) or `DELETE` instead of `POST`.
2. **Idempotency Keys**: Require a unique client-generated key (e.g., `Order-ID`) for every mutation.
3. **Check-Then-Act**: Before processing, check if the key has already been processed. If yes, return the previous result.

## Trade-offs
- **Storage**: You need to store the "Processed Keys" for a period of time.
- **Complexity**: Every state-changing API now needs to handle the logic of "Duplicate Detection."

## Failure Modes
- **The "Points Double-Credit"**: Replaying a "Credit Points" request and giving the user twice the points because there was no unique transaction ID.
- **Race Conditions**: Two identical requests hitting two different instances at the same time. Use a distributed lock or unique DB constraint on the Idempotency Key.

## Verification
- **Retry Test**: Send the same `POST` request twice with the same Idempotency Key. Verify that the second response is identical to the first and no duplicate record was created in the DB.
- **Network Failure Test**: Simulate a timeout during the first request, then retry.
