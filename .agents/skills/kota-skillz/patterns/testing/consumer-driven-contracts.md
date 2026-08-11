# Consumer-Driven Contracts (CDC) (Tier 2)

## When to Use
- **Microservice Integration**: When you want to ensure Service A (Consumer) and Service B (Producer) can still talk to each other without running a heavy E2E test.
- **Independent Teams**: When Team A needs to communicate their requirements to Team B in a verifiable way.

## The Pattern
The consumer defines their expectations of the producer's API in a "Contract" file (e.g., a Pact file). The producer then verifies that their API still meets these expectations in their own CI pipeline.

### Implementation Logic
1. **Define Contract**: Consumer writes a test that specifies: "When I GET `/user/1`, I expect a `200 OK` with a JSON body containing `username`."
2. **Publish Contract**: The test generates a contract artifact (e.g., `user-service-pact.json`).
3. **Verify Contract**: The Producer (User Service) pulls this contract and runs it against their local instance. If they renamed `username` to `user_id`, the test fails.

## Trade-offs
- **Initial Setup**: Requires a "Pact Broker" or a shared artifact location.
- **Collaboration**: Requires teams to talk to each other to define the contracts.

## Failure Modes
- **The "Stale Contract"**: Testing against an old version of the consumer's needs.
- **Mocking Reality**: The producer passes the contract but fails in production due to a real database issue (CDCs only test the *interface*).

## Verification
- **Contract Fail Test**: Rename a field in the Producer's API. Verify that the Producer's CI pipeline fails during the "Contract Verification" stage.
- **Broker Check**: Verify that the Pact Broker shows "Green" for the current versions of both services.
