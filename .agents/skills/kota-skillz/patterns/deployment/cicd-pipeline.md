# Independent CI/CD Pipeline (Tier 1)

## When to Use
- **Multi-team Environments**: When Team A shouldn't be blocked by Team B's failing tests.
- **Microservices**: To ensure independent release cycles.

## The Pattern
Every microservice has its own dedicated Source Control Repository and its own CI/CD Pipeline.

### Implementation Logic
1. **Repo per Service**: `service-order`, `service-payment`, etc.
2. **Pipeline per Repo**: Commits to `service-order` trigger *only* the order pipeline.
3. **Artifact Repository**: The pipeline publishes a versioned artifact (e.g., `order-v1.2.3.deb`) to a central repository.

## Trade-offs
- **Infrastructure Overhead**: You need to manage many pipeline definitions.
- **Cross-Service Changes**: A feature spanning 3 services requires 3 separate commits and 3 pipeline runs.

## Failure Modes
- **The Monolithic Build**: One pipeline that builds all 50 services. If Service #49 has a flaky test, Service #1 cannot deploy.
- **Lock-step Deployment**: Requiring all services to be deployed at the same version (e.g., v1.0.0 for everything). This is a distributed monolith.

## Verification
- **Commit Test**: Make a change to Service A. Verify that only Service A's pipeline triggers.
- **Independent Versioning**: Verify that Service A is at version `1.5.0` while Service B is at `2.1.0`.
