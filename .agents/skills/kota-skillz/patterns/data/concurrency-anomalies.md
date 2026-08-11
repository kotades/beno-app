# Concurrency Anomalies

## Overview
Understanding race conditions is critical for building robust backend systems. Weak isolation levels fail to prevent specific anomalies that can lead to data corruption or business logic failure.

## The Anomaly Catalog

### 1. Dirty Reads
- **Definition**: A transaction reads data written by another uncommitted transaction.
- **Risk**: Decision-making based on data that might later be rolled back.
- **Prevention**: Read Committed level or higher.

### 2. Lost Updates
- **Definition**: Two transactions perform a Read-Modify-Write cycle on the same object. One overwrites the other's changes.
- **Risk**: Increments or partial updates (e.g., wallet balance) are lost.
- **Prevention**: 
    - Atomic update operations (`UPDATE ... SET val = val + 1`).
    - Explicit locking (`FOR UPDATE`).
    - Automatic detection (Postgres Repeatable Read).
    - Compare-and-Set.

### 3. Read Skew (Non-repeatable Read)
- **Definition**: A client sees different parts of the database at different points in time during the same transaction.
- **Risk**: Inconsistent reports or backups.
- **Prevention**: Snapshot Isolation (MVCC).

### 4. Write Skew
- **Definition**: A generalization of Lost Update where transactions update *different* objects based on a shared premise.
- **Example**: Two doctors on call; both check that `count >= 2`, then both leave.
- **Prevention**: Serializable isolation or materializing conflicts.

### 5. Phantoms
- **Definition**: A write in one transaction changes the results of a search query in another.
- **Risk**: Write skew where the "premise" is the absence of a record (e.g., booking a room).
- **Prevention**: Predicate locks or Index-range locks (Next-Key locking).

## Industrial Heuristics
- **Wallet/Financials**: Always use Atomic Writes or `FOR UPDATE` to prevent Lost Updates.
- **Uniqueness/Presence**: If logic depends on `SELECT COUNT(*)` or `NOT EXISTS`, you are vulnerable to Write Skew/Phantoms; use `SERIALIZABLE`.
