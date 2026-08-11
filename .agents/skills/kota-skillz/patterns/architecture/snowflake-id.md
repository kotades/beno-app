# Snowflake ID (Tier 1)

## When to Use
- **Distributed Databases**: When you need unique, 64-bit numerical IDs without a centralized "Ticket Server."
- **Time-Ordered Storage**: When you want IDs to be roughly sortable by the time they were created.

## The Pattern
Construct a 64-bit ID from multiple components:
- **1 bit**: Sign bit (always 0).
- **41 bits**: Timestamp (milliseconds since custom epoch).
- **5 bits**: Datacenter ID.
- **5 bits**: Machine ID.
- **12 bits**: Sequence number (incremented for every ID within the same millisecond).

### Implementation Logic
1. **Epoch**: Choose a custom epoch (e.g., your company's founding date) to maximize the 41-bit timestamp life (approx. 69 years).
2. **Worker Setup**: Each worker node is assigned a unique `MachineID` and `DatacenterID` at startup.
3. **Concurrency**: Use a lock or atomic increment for the sequence number. If it reaches 4096 in one millisecond, wait for the next millisecond.

## Trade-offs
- **Clock Dependency**: Highly dependent on system clocks. If the clock moves backward, IDs might collide.
- **Complexity**: Requires careful management of Worker IDs to ensure uniqueness.

## Failure Modes
- **Clock Drift/Rewind**: If NTP synchronizes the clock backward, the generator must wait or throw an error to prevent duplicate IDs.
- **ID Overflow**: After 69 years, the 41-bit timestamp will wrap around.

## Verification
- **Uniqueness Test**: Generate 1 million IDs across 10 machines. Verify zero duplicates.
- **Sortable Test**: Generate IDs at `T=0` and `T=100ms`. Verify that `ID(T=100) > ID(T=0)`.
