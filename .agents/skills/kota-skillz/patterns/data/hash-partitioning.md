# Hash Partitioning (Tier 1)

## When to Use
- **Massive Scalability**: When you have more data than one node can store (Terabytes/Petabytes).
- **Uniform Load Distribution**: When you want to avoid "hot spots" (e.g., all writes hitting the same node because of sequential IDs).

## The Pattern
Use a hash function on the primary key to determine which node/partition should store a record.

### Industrial Implementation Logic
1. **Hash Selection**: Use non-cryptographic, high-distribution hashes (MurmurHash3, FNV-1a).
2. **Compound Keys (The Cassandra Hybrid)**: 
   - Use `(PartitionKey, ClusteringKey)`.
   - Hash only the `PartitionKey` for routing.
   - Store the `ClusteringKey` sorted within the partition.
   - **Result**: Allows efficient range scans *within* a specific context (e.g., all transactions for User A).
3. **Fixed Virtual Partitions**: Create a high number of logical partitions (e.g., 1024) and map them to physical nodes. This decouples data from hardware.

## Trade-offs
- **The Scatter/Gather Tax**: If you don't include the Partition Key in your query, the system must broadcast to ALL nodes. Latency is dictated by the slowest node (Tail Latency Amplification).
- **No Global Range Queries**: Keys are scattered; sorted order is lost globally.

## Failure Modes
- **The "Celebrity" Hotspot**: A single key (e.g., viral user) hits one node.
  - *Fix*: Append a random suffix (0-N) to the hot key and spread it across N partitions.
- **Rebalancing Storm**: Moving data between nodes can saturate the network.
  - *Fix*: Use **Fixed Virtual Partitions** to minimize data movement.

## Verification
- **Skew Audit**: `max_load / avg_load` across nodes should be < 1.2.
- **Query Explain**: Ensure queries are hitting a single partition whenever possible.
