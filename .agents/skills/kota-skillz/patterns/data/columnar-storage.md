# Columnar Storage (Tier 2)

## When to Use
- **Big Data Analytics**: When you have trillions of rows and need to aggregate (SUM, AVG) over a few specific columns.
- **Log Analysis**: When you have "wide" records (100+ fields) but only query 2-3 at a time.

## The Pattern
Store each column's data in its own separate file or block on disk, rather than storing whole rows together.

### Implementation Logic
1. **Vertical Partitioning**: Instead of `[ID, Name, Age]`, store all `IDs` in one file, all `Names` in another, and all `Ages` in a third.
2. **Compression**: Because columns often contain repetitive data (e.g., the same product ID appearing a million times), they compress extremely well using techniques like Run-Length Encoding (RLE).
3. **Lazy Loading**: When a query only asks for `SUM(Price)`, the database only reads the `Price` column file, ignoring all other data on disk.

## Trade-offs
- **Write Latency**: Writing a single new row is very slow because the database has to update 100+ different files (one for each column).
- **Not for Lookups**: Finding a single record by ID is much slower than in row-oriented storage.

## Failure Modes
- **Row-wise Access**: If an application tries to use a columnar DB for OLTP-style "Get user by ID" queries, performance will be abysmal.
- **Write Amplification**: Frequent small updates will crash the system; columnar stores require bulk inserts.

## Verification
- **I/O Efficiency**: Compare the MBs read from disk for a specific query. Columnar should read significantly less data than row-oriented for aggregates.
- **Compression Ratio**: Check the disk space usage. Columnar storage should be 5x-10x smaller than raw CSV/JSON.
