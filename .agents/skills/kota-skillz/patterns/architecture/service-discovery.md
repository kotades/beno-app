# Service Discovery (Tier 1)

## When to Use
- **Dynamic Environments**: When services are spinning up and down with random IP addresses (Cloud/Kubernetes).
- **Auto-scaling**: When you need to load balance across 10 instances that only existed for 5 minutes.

## The Pattern
A central registry where every service "registers" itself upon startup (giving its name, IP, and port). Other services "discover" these addresses by querying the registry.

### Implementation Logic
1. **Self-Registration**: Service A starts up and sends its IP to the Registry (e.g., Consul, Eureka).
2. **Heartbeat**: Service A sends a "heartbeat" every 30 seconds. If it stops, the Registry removes it.
3. **Client-Side/Server-Side Discovery**: 
   - **Client-Side**: The caller asks the registry for a list of IPs and picks one.
   - **Server-Side**: The caller hits a Load Balancer (like an ELB) which handles the registry lookup internally.

## Trade-offs
- **Infrastructure Dependency**: If the Registry goes down, no one can talk to anyone.
- **Network Latency**: Adds one extra call to find the service address.

## Failure Modes
- **Stale Entries**: The Registry thinks a service is alive but it's actually "zombie" (not responding).
- **Split Brain**: Two registries disagreeing on which services are alive.

## Verification
- **Kill Test**: Kill an instance of Service A. Verify that it disappears from the Registry UI within seconds.
- **Scale Test**: Spin up 5 more instances. Verify that the Registry automatically shows all 5 and the Load Balancer starts sending traffic to them.
