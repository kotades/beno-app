# Leader Election (Tier 2)

## When to Use
- **Single-Leader Databases**: Picking which node handles writes (e.g., Failover in Postgres).
- **Job Schedulers**: Ensuring only one node runs a Cron job (to avoid double-billing/emailing).
- **Resource Allocation**: Deciding which node "Owns" a specific hardware device or network port.

## The Pattern
Use a linearizable, fault-tolerant coordination service (like ZooKeeper or etcd) to elect a single leader and maintain its status.

### Implementation Logic
1. **The Ephemeral Key**: Each candidate node tries to create a key (e.g., `/app/leader`) with an "Ephemeral" flag.
2. **First-Wins**: The first node to create the key becomes the leader. Others "Watch" the key for changes.
3. **The Heartbeat**: The leader must maintain an active connection (session) to the coordination service.
4. **Automatic Failover**: If the leader crashes, the session expires, the ephemeral key is automatically deleted, and one of the "Watchers" immediately tries to create the key to become the new leader.
5. **Fencing**: The new leader is given a new "Fencing Token" to ensure the old leader (if it was just paused) cannot perform any more actions.

## Trade-offs
- **Dependency**: Your system now depends on a 3-node or 5-node ZooKeeper cluster. If that cluster dies, your whole app dies.
- **Latency**: Electing a new leader takes time (Heartbeat timeout), causing a brief period of unavailability.

## Failure Modes
- **Split Brain**: If the coordination service is not linearizable, it might tell two nodes they are both leaders.
- **Network Partition**: A leader might be disconnected from the cluster but still able to reach the internet. It might keep trying to "Lead" while a new leader is elected.

## Verification
- **Kill Test**: Kill the leader process. Verify that a follower takes over within X seconds.
- **Network Isolation Test**: Block all traffic to the leader. Verify that it steps down as leader once it realizes it can't reach the quorum.
