# Rebalancing Strategies (Cluster Evolution)

## The Problem
As a system grows, you add nodes. If your partitioning is `hash(key) % N`, changing N requires moving nearly all data. This is unacceptable for industrial systems.

## 1. Fixed Virtual Partitions (The Gold Standard)
Create a large, fixed number of logical partitions (e.g., 1024) regardless of the number of nodes.

### Mechanism
- **Initial State**: 10 nodes, each owns ~100 partitions.
- **Scaling**: Add Node 11. It "steals" ~9 partitions from each of the 10 nodes.
- **Result**: Only ~1/11th of the data moves. No global re-hashing.
- **Used by**: Riak, Cassandra, Elasticsearch, Couchbase.

## 2. Dynamic Partitioning (The B-Tree Approach)
Partitions are split or merged automatically based on size thresholds.

### Mechanism
- When a partition exceeds a size (e.g., 10GB), it splits into two.
- One half is migrated to another node.
- **Advantage**: Adapts to data volume automatically.
- **Used by**: HBase, RethinkDB, MongoDB.

---

## Operational Heuristics
1. **Manual vs Automatic**: Fully automatic rebalancing is dangerous. It can cause a "Cascading Failure" (a slow node is mistaken for dead, triggering a massive data move that kills other nodes).
2. **Human in the Loop**: Prefer systems where rebalancing is *calculated* automatically but *triggered* manually by an operator.
3. **Pre-splitting**: On day one, create an initial set of partitions based on expected key distribution to avoid the "Cold Start" problem (where all writes hit a single node until the first split).
