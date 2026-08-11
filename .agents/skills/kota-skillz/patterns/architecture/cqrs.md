# CQRS (Command-Query Responsibility Segregation) (Tier 3)

## When to Use
- **High-Performance Scaling**: When read and write patterns are radically different.
- **Complex Domain Logic**: When the "Write" model needs complex validation but the "Read" model just needs a flat list.
- **Microservices with Diverse DBs**: When you write to a Relational DB but read from a Search Index (Elasticsearch).

## The Pattern
Split the system into two distinct parts:
1. **Commands**: Operations that change state (Update, Insert, Delete). No data returned (except success/fail).
2. **Queries**: Operations that read state. No state changes allowed.

### Implementation Logic
1. **The Write Store**: Optimized for consistency and normalized data (e.g., PostgreSQL).
2. **The Read Store**: Optimized for speed and denormalized data (e.g., Redis, Elasticsearch, or a materialized view).
3. **Synchronization**: Use events (Choreography) to update the Read Store whenever a Command happens on the Write Store.

## Trade-offs
- **Eventual Consistency**: The Read Store might be slightly behind the Write Store.
- **Complexity**: You now have two models and two databases to manage.

## Failure Modes
- **Sync Failure**: The event to update the Read Store is lost, causing the UI to show old data forever.
- **Over-Engineering**: Using CQRS for a simple CRUD app where one table would suffice.

## Verification
- **Latency Test**: Compare the response time of a complex "Search" query against the Normalized Write DB vs. the Denormalized Read DB.
- **Consistency Check**: Verify that an update to the Write DB is reflected in the Read DB within X milliseconds.
