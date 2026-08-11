# Database Sharding (Tier 2)

## When to Use
- **Massive Data Growth**: When a single database server can no longer hold the entire dataset or handle the write volume.
- **Write Heavy Workloads**: When replication (Read Replicas) isn't enough because the "Leader" node is the write bottleneck.

## The Pattern
Split a large database into smaller, independent parts called "Shards." Each shard contains a subset of the data but follows the same schema.

### Industrial Implementation Logic
1. **Sharding Key Selection**: Choose a high-cardinality column (e.g., `user_id`). **Never** shard by sequential data (like `timestamp`) alone.
2. **Request Routing Tier**:
   - **Any Node (Gossip)**: Contact any node; it forwards the request if it doesn't own the data (e.g., Cassandra).
   - **Routing Proxy**: A dedicated tier (e.g., Vitess, Mongos) that routes to shards. Reduces client complexity.
   - **Smart Client**: Client knows the shard map and routes directly. Lowest latency, highest client complexity.
3. **Service Discovery (The Source of Truth)**: Use a coordination service like **ZooKeeper** or **etcd** to maintain the authoritative mapping of partitions to nodes.

## Trade-offs
- **The Join Wall**: Joining data across shards is the "End Boss" of backend engineering. **Heuristic**: If you need to join frequently, move that data into the same shard.
- **Resharding Risk**: Moving shards is expensive. Use **Fixed Virtual Partitions** to mitigate this.

## Failure Modes
- **The Hotspot (Celebrity)**: One shard is crushed by a single high-activity key.
  - *Mitigation*: Multi-tenant sharding or key-salting.
- **Cascading Failure**: Automatic rebalancing that triggers during a load spike, killing the healthy nodes with data transfer overhead.

## Verification
- **Skew Audit**: Monitor `ops/sec` per shard. 
- **Latency Percentiles (P99)**: Check for tail latency spikes caused by cross-shard queries.
