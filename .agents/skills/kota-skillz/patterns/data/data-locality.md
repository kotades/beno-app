# Data Locality (Tier 2)

## When to Use
- **Read-Intensive Apps**: When you frequently need to retrieve a large, nested data structure at once.
- **High-Performance Backends**: When disk seeks are the bottleneck.

## The Pattern
Keep related data physically close together on disk to minimize the number of reads needed to serve a request.

### Implementation Logic
1. **Document Storage**: Store a whole profile (Jobs, Education, Info) as one JSON blob. One disk seek fetches everything.
2. **Table Interleaving (Spanner/Oracle)**: Declare that child rows should be stored physically adjacent to parent rows in the database storage engine.
3. **Column-Family (Cassandra)**: Group related columns together so they are stored in the same SSTable.

## Trade-offs
- **Write Overhead**: Updating a small part of a large document usually requires rewriting the entire document.
- **Wasted I/O**: If you only need one small field, but have to load a 1MB document, you waste memory and bandwidth.

## Failure Modes
- **Document Bloat**: Allowing documents to grow indefinitely leads to massive performance degradation over time.
- **Sharding Skew**: If one "local" document is much larger than others, it creates a "hotspot" in a distributed system.

## Verification
- **EXPLAIN ANALYZE**: Check the "Buffer Shared Hit" or "Disk Reads" count. If a single entity requires 10+ reads, you have poor locality.
- **Storage Metrics**: Monitor the average size of your documents/records.
