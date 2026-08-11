# Serializable Snapshot Isolation (SSI) (Tier 2)

## When to Use
- **Complex Business Rules**: When multiple tables must stay in sync (e.g., "Total salary for department X must not exceed $Y").
- **Write Skew Prevention**: When two transactions might update different objects but violate a global constraint (e.g., The "Doctor on Call" problem).

## The Pattern
Use the `SERIALIZABLE` isolation level in modern databases (like PostgreSQL) to detect and prevent subtle race conditions without the performance penalty of heavy locks.

### Implementation Logic
1. **Application Logic**: Write your transaction assuming you are the only user in the system.
   ```sql
   BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
   -- 1. Read the state
   SELECT count(*) FROM doctors WHERE on_call = true;
   -- 2. Logic: if count >= 2, set me off call
   UPDATE doctors SET on_call = false WHERE name = 'Alice';
   COMMIT;
   ```
2. **Database Tracking**: The DB doesn't block other users. Instead, it tracks which transactions read data that was later changed.
3. **Conflict Detection**: If two doctors try this at once, the DB detects that the "Premise" (count >= 2) was invalidated by a concurrent write.
4. **Abort and Retry**: The DB will return a `40001` error code (Serialization Failure). Your application **must** catch this error and retry the entire transaction.

## Trade-offs
- **Retry Overhead**: The application code becomes more complex because every write must be wrapped in a retry loop.
- **Abort Rate**: If your system has extremely high contention (everyone writing to the same row), SSI will constantly abort, causing worse performance than locking.

## Failure Modes
- **Ignoring the Abort**: If your code doesn't handle the "Serialization Failure" exception, you will lose data updates.
- **Large Read-sets**: If a transaction reads too much data, the DB might "false positive" and abort it even if there was no real conflict.

## Verification
- **Double-Write Test**: Write a script that tries to book the same room from two different threads at the exact same time. Verify that one succeeds and the other fails with a serialization error.
- **Retry Logic Check**: Ensure that the application doesn't just log the error but actually retries the logic up to X times.
