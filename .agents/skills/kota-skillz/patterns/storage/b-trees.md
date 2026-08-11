# Read-Optimized Storage (B-Trees) (Tier 1)

## When to Use
- **Relational Databases**: The standard for Postgres, MySQL, and SQL Server.
- **Stable Read Patterns**: When you need predictable read latency and efficient range queries.

## The Pattern
Organize data into a balanced tree of fixed-size pages (typically 4KB) that map directly to disk blocks.

### Implementation Logic
1. **Branching Factor**: Each node (page) contains many keys (often hundreds), meaning the tree is "shallow" (log N height).
2. **In-place Updates**: Unlike LSM-trees, B-trees overwrite pages on disk when data is updated.
3. **Balancing**: If a page is full, it is split into two; if it is too empty, it is merged.

## Trade-offs
- **Write Performance**: Each write requires a random disk seek and potentially several page updates (if the tree needs rebalancing).
- **Fragmentation**: Overwriting pages can lead to "holes" in the data file over time.

## Failure Modes
- **Partial Writes**: If a crash occurs while a page is being overwritten, the page becomes corrupted (mitigated by using a "Write Ahead Log" or "Shadow Paging").
- **Lock Contention**: Since pages are updated in-place, multiple threads might fight for access to the same page.

## Verification
- **Read Latency**: Benchmark p99 for single-key lookups. B-trees should be very fast and consistent.
- **Index Depth**: Monitor the "height" of the tree. A well-designed B-tree for millions of records should be only 3-4 levels deep.
