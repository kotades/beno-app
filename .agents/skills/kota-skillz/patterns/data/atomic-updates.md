# Atomic Database Updates (Tier 1)

## When to Use
- **Counters**: Likes, views, stock levels, or balance increments.
- **Concurrent Environments**: When multiple API instances might try to update the same record at the exact same millisecond.

## The Pattern
Use the database's native atomic operations instead of the "Read-Modify-Write" cycle in your application code.

### Implementation Logic
**BAD (Read-Modify-Write):**
1. `val = db.query("SELECT likes FROM posts WHERE id=1")`
2. `new_val = val + 1`
3. `db.execute("UPDATE posts SET likes = $new_val WHERE id=1")`
*Result: If two users click at once, you might get 1 like instead of 2.*

**GOOD (Atomic):**
1. `db.execute("UPDATE posts SET likes = likes + 1 WHERE id=1")`
*Result: The database handles the locking internally. No likes are ever lost.*

## Trade-offs
- **Business Logic Limitation**: You can only perform simple arithmetic or logic that the database engine understands.
- **ORM Pitfall**: Many ORMs (like Hibernate or ActiveRecord) default to the "Bad" pattern unless you explicitly use "Increment" methods.

## Failure Modes
- **Hidden Logic**: Triggers or stored procedures might interfere with the atomic update in unexpected ways.
- **Performance**: High-frequency updates to a single row (the "Hot Key") will still cause a bottleneck because the database must lock that row for every write.

## Verification
- **Concurrency Load Test**: Use a tool like `ab` or `locust` to send 1,000 simultaneous increment requests. Verify that the final count is exactly 1,000.
- **Query Log Audit**: Ensure that the SQL being sent to the database is `SET x = x + 1` and not `SET x = 50`.
