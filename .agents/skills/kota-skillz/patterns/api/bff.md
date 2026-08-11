# Backend for Frontends (BFF) (Tier 2)

## When to Use
- **Multi-Platform Apps**: When you have Web, iOS, and Android clients with different data needs.
- **Chatty Interfaces**: When a mobile app needs to make 20 calls to different microservices to render one screen.

## The Pattern
Create a specific backend service for each frontend. The BFF acts as an aggregator and translator between the frontend and the downstream microservices.

### Implementation Logic
1. **One BFF per UI**: Mobile BFF, Web BFF, Third-party BFF.
2. **Aggregation**: The BFF calls multiple microservices and merges the results into a single payload for the UI.
3. **Tailored Payloads**: Remove fields the UI doesn't need to save bandwidth (critical for mobile).

## Trade-offs
- **Maintenance**: You have more services to maintain.
- **Logic Leakage**: Business logic might leak from the microservices into the BFF. Keep BFFs "anemic" (only aggregation and translation).

## Failure Modes
- **The Generic BFF**: One BFF trying to serve all platforms. This becomes a new monolith.
- **Over-Logic**: Putting complex business rules in the BFF instead of the domain service.

## Verification
- **Bandwidth Test**: Measure the payload size of a Mobile-specific endpoint vs. a Generic endpoint.
- **Latency Test**: Count network round-trips from the device. A BFF should reduce this to 1-2 calls per view.
