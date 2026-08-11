# Caching Principles & Trade-offs (Tier 2 - MIT 6.1800)

## Core Philosophy
Caching is a trade-off between **Latency** and **Correctness**. You are sacrificing data freshness for system speed.

## Locality of Reference
- **Temporal Locality**: If data is accessed now, it will be accessed again soon.
- **Spatial Locality**: If data is accessed, nearby data will likely be accessed.

## Caching Strategies (The Selection Menu)

### 1. Cache-Aside (Lazy Loading)
- **Logic**: Application checks cache. If miss, it reads from DB and updates cache.
- **When to Use**: Read-heavy workloads with data that doesn't change frequently.
- **Failure Mode**: Cache stampede (multiple requests hit the DB at once on a miss).

### 2. Write-Through
- **Logic**: Data is written to the cache and the DB simultaneously.
- **When to Use**: When data consistency is critical and you can tolerate higher write latency.
- **Failure Mode**: Write latency is limited by the slower of the two (the DB).

### 3. Write-Behind (Write-Back)
- **Logic**: Data is written to cache first; DB is updated asynchronously.
- **When to Use**: High-throughput write operations where data loss in a crash is acceptable.
- **Failure Mode**: Data loss if the cache node crashes before flushing to the DB.

## Invalidation Strategies (The Hard Part)
1. **TTL (Time To Live)**: Simplest but leads to stale data.
2. **Event-Driven**: Invalidate cache record when DB record is updated.
3. **Versioned**: Cache keys include a version number (e.g., `user:123:v1`).

## Success Indicators
- **High Cache Hit Ratio**: (> 80%).
- **Low p99 Latency**: Stable performance even during traffic spikes.

## Failure Indicators
- **Stale Data Errors**: Users see old data after an update.
- **Thrashing**: Cache is too small, causing constant evictions and misses.

## Selection Logic
- IF "Speed > Consistency" -> **Write-Behind**.
- IF "Consistency > Speed" -> **Write-Through**.
- IF "Random Access/Read-Heavy" -> **Cache-Aside**.
