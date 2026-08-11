# Transaction Isolation Levels

## Overview
Isolation is the "I" in ACID. It ensures that concurrently executing transactions do not interfere with each other. In practice, full serializability is expensive, so databases offer weaker isolation levels with known trade-offs.

## Industrial Heuristics

### 1. Read Committed
- **Guarantee**: No Dirty Reads (you only see committed data) and No Dirty Writes (you only overwrite committed data).
- **Implementation**: 
    - **Dirty Writes**: Prevented by row-level locks.
    - **Dirty Reads**: Prevented by keeping both the old committed value and the new value set by the current writer.
- **Anomaly Vulnerability**: Read Skew (Non-repeatable reads).

### 2. Snapshot Isolation (Repeatable Read)
- **Guarantee**: Each transaction reads from a consistent snapshot of the database from the time it started. Readers never block writers; writers never block readers.
- **Implementation**: Multi-Version Concurrency Control (MVCC). Every row has a `created_by` and `deleted_by` transaction ID.
- **Anomaly Vulnerability**: Write Skew and Phantoms.
- **Use Case**: Standard for read-only long-running queries (backups, analytics) and general OLTP.

### 3. Serializable
- **Guarantee**: The highest isolation level. It guarantees that the result is the same as if transactions were executed one after another.
- **Implementation Strategies**:
    - **Actual Serial Execution**: Single-threaded execution (Redis, VoltDB). Requires stored procedures.
    - **Two-Phase Locking (2PL)**: Shared/Exclusive locks. Writers block readers and vice versa. High performance cost.
    - **Serializable Snapshot Isolation (SSI)**: Optimistic detection of serialization conflicts (Postgres 9.1+).

## Implementation Checklist
- [ ] Determine if the business logic depends on "absence of data" (Phantoms). If yes, use Serializable.
- [ ] For high-concurrency wallet updates, prefer Atomic Operations over Read-Modify-Write.
- [ ] Ensure indexes support Index-Range locks if using 2PL-based serializability.
