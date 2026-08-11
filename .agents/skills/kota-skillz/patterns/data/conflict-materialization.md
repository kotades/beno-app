# Conflict Materialization (Tier 3)

## When to Use
- **Phantom Prevention**: When you need to lock a "Range" of time or space that doesn't currently exist in the database (e.g., booking an empty slot).
- **Legacy Databases**: When your database doesn't support true `SERIALIZABLE` isolation.

## The Pattern
Create concrete "Locking Rows" in a dedicated table to represent abstract slots, turning a "Phantom" problem into a standard "Row Lock" problem.

### Implementation Logic
1. **The Lock Table**: Create a table `time_slots (room_id, start_time)`.
2. **Pre-population**: Insert rows for every room and every 15-minute slot for the next 365 days.
3. **The Transaction**:
   ```sql
   BEGIN TRANSACTION;
   -- 1. Lock the slot concretely
   SELECT * FROM time_slots 
   WHERE room_id = 123 AND start_time = '2023-10-01 12:00'
   FOR UPDATE;
   -- 2. Check if booking already exists in the real 'bookings' table
   -- 3. If no, INSERT INTO bookings ...
   COMMIT;
   ```

## Trade-offs
- **Data Bloat**: You are creating millions of rows just to act as locks.
- **Model Pollution**: You are mixing "Concurrency Control" with your "Business Data."

## Failure Modes
- **Missing Slots**: If you forget to pre-populate slots for next year, the system will allow double-bookings because there's no row to lock.
- **Lock Granularity**: If a user wants to book 1 hour but you only have 15-minute slots, you must lock 4 rows, which increases the chance of deadlock.

## Verification
- **Double-Booking Simulation**: Run two parallel requests for the same room/time. Verify that one blocks until the other finishes.
- **Slot Coverage Audit**: Ensure that the `time_slots` table is regularly updated with future dates.
