# Service Autonomy (Tier 1)

## When to Use
- **Scaling Organizations**: When multiple teams need to move at different speeds.
- **Continuous Delivery**: When you want to deploy a feature without a coordinated "Big Bang" release.

## The Pattern
Each service must be independently deployable, owning its own process and its own data store. Communication happens only over the network via stable APIs.

### Implementation Logic
1. **Isolated Processes**: Every service runs in its own container or VM.
2. **Database per Service**: NO shared databases. If Service A needs data from Service B, it must ask via an API or subscribe to an event stream.
3. **Stable APIs**: Use semantic versioning. Never break a contract without a transition period (coexisting versions).

## Trade-offs
- **Operational Overhead**: Managing 50 databases is harder than managing 1.
- **Data Consistency**: You lose ACID transactions across services. You must embrace "Eventual Consistency."

## Failure Modes
- **Shared Database Trap**: Multiple services writing to the same SQL table. This is the #1 killer of microservice autonomy.
- **The Dependency Hell**: Service A cannot deploy unless Service B is also deployed (Co-deployment).

## Verification
- **Deployment Test**: Try deploying Service A to Production while Service B is down. If Service A fails to start or breaks, autonomy is compromised.
- **Schema Audit**: Ensure no two services share the same DB credentials or connection strings.
