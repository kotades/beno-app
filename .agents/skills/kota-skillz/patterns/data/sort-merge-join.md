# Sort-Merge Join (Tier 2)

## When to Use
- **Massive Datasets**: When both sides of the join are too large to fit in memory (e.g., Joining 10TB of User Logs with 5TB of Purchase History).
- **No Indexing**: When the input data is unsorted and unindexed.

## The Pattern
Partition and sort both datasets by the join key. Once sorted, a single pass over both datasets can perform the join with minimal memory.

### Implementation Logic
1. **Partitioning**: Split both datasets into `P` partitions based on a hash of the join key (e.g., `UserID % P`).
2. **Sorting**: Sort each partition by the join key.
3. **Merging**: For each partition `i`:
   - Open a pointer to the sorted `UserLog_i` and `Purchase_i`.
   - Iterate through both. If keys match, emit a joined record. If one key is smaller, advance that pointer.
   - This requires only the current record from each side to be in memory.

## Trade-offs
- **Heavy I/O**: Sorting requires writing data to disk (spilling) if it doesn't fit in RAM.
- **Network Shuffle**: Moving all data across the network to the correct partition is a major bottleneck.

## Failure Modes
- **Linchpin Keys (Skew)**: If a single user has 10 million logs, one reducer will be overloaded and slow down the entire job (The "Celebrity" problem).
- **Disk Space**: The job might fail if the intermediate disk space is not large enough to hold the sorted partitions.

## Verification
- **Skew Monitoring**: Measure the execution time of each reducer. If one is 10x slower than the average, alert for data skew.
- **Integration Test**: Run the join on a 1% sample of the data and verify the count of joined records against a SQL reference query.
