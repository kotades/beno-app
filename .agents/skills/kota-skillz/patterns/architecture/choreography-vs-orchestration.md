# Choreography vs. Orchestration (Tier 1)

## When to Use
- **Multi-step Business Processes**: e.g., Order -> Payment -> Shipping -> Notification.
- **Distributed Systems**: When you want to avoid a single point of failure in business logic.

## The Patterns

### 1. Orchestration (The Conductor)
A central "brain" service manages the flow by making synchronous or asynchronous requests to other services.
- **Pros**: Easy to track process state, easy to visualize the flowchart in one place.
- **Cons**: "God Service" syndrome, high coupling, brittle if the brain service goes down.

### 2. Choreography (The Ballet)
Services emit events (e.g., `OrderPlaced`) and other services react to them (e.g., Payment service sees `OrderPlaced` and starts work).
- **Pros**: High decoupling, services can be added/removed without changing the producer, highly resilient.
- **Cons**: Process state is "implicit" and harder to monitor, requires distributed tracing.

## Implementation Logic (Choreography)
1. **Emit Events**: Producer says "X happened."
2. **Subscribe**: Consumers listen for "X" and perform their specific task.
3. **Chain**: Consumer might emit "Y happened" when done, triggering the next service.

## Trade-offs
- **Monitoring**: Orchestration is easier to monitor with a single dashboard. Choreography requires a "Monitoring Service" that listens to all events to reconstruct the flow.

## Failure Modes
- **The Event Storm**: A loop of events causing services to trigger each other infinitely.
- **The Invisible Process**: No one knows how an order actually gets fulfilled because the logic is scattered across 10 services.

## Verification
- **Scalability Test**: Add a "Welcome Gift" service. If you can do it by just subscribing to `CustomerCreated` without touching the Customer service, you have successful Choreography.
