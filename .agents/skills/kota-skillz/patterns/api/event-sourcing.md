# Event Sourcing (Tier 2)

## When to Use
- **Audit Trails**: When you must know *how* a piece of data reached its current state (e.g., Banking, Medical records).
- **Time Travel**: When you need to view the system state as it was at a specific point in the past.
- **Complex State Transitions**: When the current state is a complex aggregate of many distinct actions.

## The Pattern
The "Source of Truth" is an append-only log of immutable **Events** (facts), not the current state. The current state is a derived view (Projection).

### Implementation Logic
1. **Command Validation**: A user sends a "Command" (e.g., `AddProductToCart`). The app validates it (e.g., Is the product in stock?).
2. **Event Creation**: If valid, the app records an "Event" (e.g., `ProductAddedToCart {id: 123, qty: 1}`).
3. **The Event Store**: An append-only database (e.g., EventStoreDB, or Kafka) that stores these events forever.
4. **Projections**: Background processes read the event log and update a "Read Model" (e.g., a SQL table representing the current Cart).

## Trade-offs
- **Query Complexity**: You cannot "query" an event log directly for the current state without a projection.
- **Storage**: Storing every single action ever taken can consume a lot of space (though storage is cheap).

## Failure Modes
- **Projection Lag**: A user might add an item to their cart and not see it immediately on the "Cart" page.
- **Versioning**: Changing the structure of an event (e.g., adding a field) requires handling all "Old" events in the log forever.

## Verification
- **Replay Test**: Wipe the Read Model and replay the entire event log from offset 0. Verify the final state is identical to the original.
- **Audit Check**: Pick a random record and trace every event in the log that affected it to verify the history makes sense.
