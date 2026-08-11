# Write-Optimized Storage (LSM-Trees) (Tier 1)

## When to Use
- **High Write Throughput**: When the system must handle a massive firehose of incoming data (e.g., logging, sensor data, messaging).
- **Embedded Databases**: When you need a lightweight but powerful key-value store (LevelDB, RocksDB).

## The Pattern
Use a **Log-Structured Merge-Tree** to turn random writes into sequential writes for maximum throughput.

### Implementation Logic
1. **Memtable**: Buffer incoming writes in a balanced in-memory tree (Red-Black or AVL).
2. **SSTable**: When the memtable reaches a size limit (e.g., 4MB), flush it to disk as a sorted, immutable file.
3. **Background Merging**: Periodically merge multiple SSTables into one, discarding old versions of keys (Compaction).
4. **WAL (Write Ahead Log)**: Append every write to a raw log before adding to the memtable to ensure crash recovery.

## Trade-offs
- **Read Latency**: A read might have to check the memtable and several SSTables before finding the result.
- **Write Amplification**: The background compaction process uses disk I/O and CPU, which can occasionally slow down incoming writes.

## Failure Modes
- **Compaction Lag**: If writes come in faster than the background process can merge, the number of SSTables explodes and reads become extremely slow.
- **Crash Recovery**: If the WAL is corrupted, the data in the memtable is lost.

## Verification
- **Write Throughput Benchmark**: Measure the maximum writes per second. LSM-trees should significantly outperform B-trees here.
- **Bloom Filter Check**: Ensure the Bloom Filter is active to prevent unnecessary disk reads for missing keys.
