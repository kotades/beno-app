# Consistent Hashing (Tier 2)

## When to Use
- **Horizontal Scaling of State**: When you have many cache servers or sharded databases and need to add/remove them without moving all the data.
- **Distributed Caching**: To minimize cache misses during server membership changes.

## The Pattern
Map both the **Data Keys** and the **Physical Servers** onto a virtual "Hash Ring" (e.g., 0 to 2^160 - 1). A key is stored on the first server found when moving clockwise from the key's position on the ring.

### Implementation Logic
1. **Virtual Nodes**: Assign multiple "Virtual Nodes" (points on the ring) to each physical server. This ensures even distribution and prevents "hotspots" where one server gets too much data.
2. **Lookup**: When a key `K` arrives, hash it to position `P`. Find the smallest server position `S >= P` on the ring.
3. **Rebalancing**: When a new server is added, only the keys between the new server and its anti-clockwise neighbor need to move.

## Trade-offs
- **Complexity**: Implementing the ring and managing virtual nodes is harder than simple modulo hashing.
- **Storage**: You need to store the ring structure in memory on every client or a router.

## Failure Modes
- **Cascade Misses**: If many servers fail at once, the remaining servers might be overwhelmed by the sudden influx of keys.
- **Uneven Load**: If the number of virtual nodes is too small, distribution will be skewed.

## Verification
- **Rehash Test**: Measure the % of keys that change servers when adding a 10th server to a 9-server cluster. It should be ~10%, not ~100%.
- **Uniformity Check**: Verify that the variance in key counts per server is within 5-10% using a large number of virtual nodes.
