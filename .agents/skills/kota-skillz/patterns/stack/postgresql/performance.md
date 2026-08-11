# PostgreSQL Performance & Indexing (Tier 1)

## Core Principle
"An index is a trade-off: fast reads, slow writes." Only index columns used in `WHERE`, `JOIN`, or `ORDER BY` clauses.

## Indexing Strategies

### 1. The B-Tree (Default)
- **Use for**: Equality (=) and Range (<, >, <=, >=) queries.
- **Rule**: Standard for 90% of use cases.

### 2. Composite Indexes (Multi-column)
- **Logic**: Index `(col_a, col_b)`.
- **Constraint**: The "Leftmost Prefix Rule." This index works for `WHERE col_a = ...` or `WHERE col_a = ... AND col_b = ...`, but NOT for `WHERE col_b = ...` alone.

### 3. Partial Indexes
- **Logic**: `CREATE INDEX ... WHERE status = 'active'`.
- **Benefit**: Smaller index size, faster updates. Use for tables where only a small subset of data is frequently queried.

### 4. Concurrent Indexing (Production Rule)
- **Mandatory**: Always use `CREATE INDEX CONCURRENTLY`.
- **Reason**: Prevents table locking during index creation.

## Transaction Isolation Levels (MIT 6.1800)

| Level | Dirty Reads | Non-Repeatable Reads | Phantom Reads |
| :--- | :--- | :--- | :--- |
| **Read Committed** (Default) | No | Yes | Yes |
| **Repeatable Read** | No | No | Yes |
| **Serializable** | No | No | No |

- **Selection Logic**: Use **Read Committed** for 99% of apps. Use **Serializable** only for critical financial ledger balancing where correctness > speed.

## Quality Gates
- Every query in production MUST be checked with `EXPLAIN ANALYZE`.
- Look for `Sequential Scan` on large tables—this is a failure.
- Aim for `Index Scan` or `Index Only Scan`.
