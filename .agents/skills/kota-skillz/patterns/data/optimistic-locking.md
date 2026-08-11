# Optimistic Locking (CAS) (Tier 1)

## When to Use
- **Low Contention**: When you expect conflicts to be rare (e.g., users editing their own profile).
- **Web Applications**: Where you can't keep a database connection open while the user is typing (The "Disconnected" problem).

## The Pattern
Allow multiple users to read a record, but only allow a write to succeed if the record hasn't changed since it was last read.

### Implementation Logic
1. **Version Column**: Add a `version` or `updated_at` column to your table.
2. **Read**: Fetch the record and its version (e.g., `id=1, version=5`).
3. **Write**: Perform the update with a `WHERE` clause checking the version:
   `UPDATE items SET value='new', version=6 WHERE id=1 AND version=5`
4. **Retry**: If the update returns "0 rows affected," it means someone else changed it. Fetch the new data, merge changes, and try again.

## Trade-offs
- **Application Logic**: The app must handle the "Conflict" case (e.g., asking the user to resolve a merge).
- **No Overhead**: No database locks are held during the "Think Time" (while the user is looking at the screen).

## Failure Modes
- **Starvation**: In high-contention systems, a transaction might keep failing and retrying forever.
- **The "Lost Update"**: If you forget to include the `version` in the `WHERE` clause, you revert to a "Last Write Wins" strategy and lose data.

## Verification
- **Conflict Simulation**: Start two "Edit" sessions for the same record. Save the first one, then try to save the second one. The second should fail with a "Conflict" error.
- **Merge Logic Audit**: Ensure that the application doesn't just "Force Save" on failure, but actually handles the version mismatch.
