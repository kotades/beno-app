# Broadcast Hash Join (Tier 1)

## When to Use
- **Enriching Events**: When you have a massive stream of "Events" (e.g., Clickstream) and a small table of "Metadata" (e.g., Product Info).
- **Size Constraint**: The small table must fit in the RAM of a single worker node (typically < 2GB).

## The Pattern
Instead of shuffling both datasets over the network, "Broadcast" the small dataset to every worker node. Each worker joins its local partition of the large dataset with the local copy of the small table.

### Implementation Logic
1. **The Small Table**: Read the small table once and build an in-memory Hash Table (e.g., `Map<ProductID, ProductMetadata>`).
2. **The Large Table**: Stream the large table partition-by-partition.
3. **The Join**: For every record in the large table, look up the key in the local Hash Table.
4. **Output**: Emit the joined record immediately.

## Trade-offs
- **Memory Pressure**: If the "Small" table grows beyond the worker's RAM, the process will crash with an OOM (Out of Memory) error.
- **Startup Latency**: Every worker must wait for the small table to be loaded into memory before it can start processing the large table.

## Failure Modes
- **Data Skew**: If the large table has many records for a few keys, some workers will work longer than others, but this is less of an issue than in a Reduce-side join.
- **Network Overhead**: Broadcasting a 1GB table to 1,000 workers consumes 1TB of network bandwidth.

## Verification
- **Size Check**: Before starting the job, check the size of the small table. Abort if it exceeds 75% of the allocated heap.
- **Unit Test**: Mock the small table and verify that the join logic produces the correct enriched records for a sample of the large table.
