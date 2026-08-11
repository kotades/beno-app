# Bounded Context (Tier 1)

## When to Use
- **Microservice Modeling**: When deciding where one service ends and another begins.
- **Legacy Decomposition**: When splitting a monolith into smaller pieces.
- **Domain Modeling**: When the same word (e.g., "Customer") means different things to different departments (e.g., Sales vs. Support).

## The Pattern
Identify boundaries within which a particular domain model is defined and applicable. A microservice should align with one or more Bounded Contexts.

### Implementation Logic
1. **Identify Business Capabilities**: Group functions by what they *do* for the business (e.g., "Inventory Management," "Order Processing").
2. **Define Shared Models**: Identify the data models that stay *inside* the boundary.
3. **Externalize Mappings**: If a "Product" in the Warehouse context needs to talk to "Product" in the Catalog context, use a clear mapping layer (e.g., an ID) rather than sharing the entire object.

## Trade-offs
- **Initial Complexity**: Requires deep domain knowledge and "Event Storming" sessions.
- **Duplication**: You might end up with two "Customer" tables in different DBs, but this is acceptable for the sake of autonomy.

## Failure Modes
- **Leaky Abstractions**: Internal implementation details (like DB schemas) leak into the API, causing tight coupling.
- **God Services**: A service that tries to handle too many contexts becomes a "Distributed Monolith."

## Verification
- **Independence Check**: Can you change the internal schema of Service A without notifying the team for Service B?
- **Team Alignment**: Does one team own the entire Bounded Context?
