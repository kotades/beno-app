# Single Service per Host (Tier 1)

## When to Use
- **All Microservice Architectures**: This is a baseline requirement for autonomy and scaling.
- **Resource-Intensive Services**: When one service needs more RAM/CPU than others.

## The Pattern
Each microservice instance runs on its own isolated host (Virtual Machine or Container).

### Implementation Logic
1. **Isolation**: Service A cannot see Service B's files, memory, or processes.
2. **Resource Limits**: Limit the RAM/CPU of the host so Service A doesn't "steal" resources from other services on the same physical hardware.
3. **Independent Scaling**: If Service A is under load, you spin up more hosts for *only* Service A.

## Trade-offs
- **Cost**: If you use one VM per tiny service, you pay for 50 OS overheads.
- **Management**: You have more "moving parts" (IP addresses, hostnames) to track.

## Failure Modes
- **The Sidecar Trap**: Putting 5 "helper" services on the same host. If one helper crashes the host, the main service goes down too.
- **Dependency Conflict**: Trying to run a Java 8 service and a Java 17 service on the same host.

## Verification
- **Reboot Test**: Reboot the host for Service A. Verify that Service B continues to function normally.
- **Resource Monitor**: Use `top` or `htop` to verify that only one primary service process is running on the host.
