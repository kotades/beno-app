# Secondary Index Partitioning (Local vs Global)

## Context
When data is partitioned by a Primary Key (e.g., `userId`), searching by a different attribute (e.g., `email` or `city`) becomes difficult because the records for a specific "city" are scattered across all partitions.

## 1. Local Index (Document-Partitioned)
Each partition maintains its own secondary index for the documents it holds.

### Mechanism
- **Write**: Fast. You only update the index in the same partition where the data is written.
- **Read**: **Scatter/Gather**. You must query EVERY partition and merge results.

### When to Use
- Most queries include the Partition Key (routing to a single node).
- Write performance is the priority.
- Used by: MongoDB, Cassandra, Elasticsearch (by default).

---

## 2. Global Index (Term-Partitioned)
A separate, partitioned index that covers all data in the cluster.

### Mechanism
- **Write**: Slow/Complex. Updating a document might require a cross-node write to the Global Index node.
- **Read**: Fast. You route directly to the specific node holding the "term" (e.g., the node responsible for `city:Lagos`).

### When to Use
- Read performance on secondary attributes is critical.
- You can tolerate **Eventual Consistency** on the index (asynchronous updates).
- Used by: Amazon DynamoDB (GSI), Riak Search.

---

## Industrial Heuristics
1. **Prefer Local Indexes** if your queries can be restricted to a single partition (e.g., `WHERE userId = 123 AND status = 'active'`).
2. **Use Global Indexes** only for high-traffic search terms that would otherwise trigger expensive cluster-wide broadcasts.
3. **Beware of Tail Latency**: In Scatter/Gather, if 1 node out of 100 is slow, the entire query is slow. This is the **Tail Latency Amplification** effect.
