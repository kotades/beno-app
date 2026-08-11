# Linearizable Quorum Reads (Tier 1)

## When to Use
- **Financial Transactions**: Checking a balance before allowing a withdrawal.
- **Inventory Management**: Checking stock before confirming an order.
- **Critical Configuration**: Reading a global system setting that must be consistent.

## The Pattern
Ensure that a "Quorum Read" actually returns the most recent data by performing "Read Repair" synchronously before returning to the client.

### Implementation Logic
1. **The Quorum Rule**: In a cluster of `N` nodes, write to `W` nodes and read from `R` nodes such that `W + R > N`. (e.g., N=3, W=2, R=2).
2. **The Race Condition**: If a write is in progress, one reader might see the new value while another reader (starting later) sees the old value because they hit different nodes.
3. **The Fix (Synchronous Read Repair)**:
   - Client reads from a quorum.
   - If the nodes return different versions, the client (or coordinator) immediately writes the newest version to the stale nodes.
   - The response is only returned to the application **after** the repair is acknowledged.

## Trade-offs
- **Latency**: Reads are slower because they must wait for multiple nodes and potentially a "Repair" write.
- **Availability**: If `N-R+1` nodes are down, the read will fail entirely, even if the data exists on one node.

## Failure Modes
- **Sloppy Quorums**: If the system uses "Sloppy Quorums" (writing to any available nodes, not just the designated ones), linearizability is lost.
- **Clock Dependency**: If the system uses "Last Write Wins" (LWW) based on timestamps, clock skew can cause the "Repair" to write an older version over a newer one.

## Verification
- **Jepsen Testing**: Use a tool like `Jepsen` to induce network partitions and verify that no client ever reads a "Stale" value after a "Fresh" value has been observed.
- **Quorum Audit**: Ensure that the `R` and `W` values are configured correctly (e.g., `R=QUORUM` in Cassandra).
