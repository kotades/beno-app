# Hot Key Salting (Tier 1)

## When to Use
- **Viral Content**: When a single ID (e.g., a celebrity's user ID or a global trending topic) receives 10,000x more traffic than average.
- **Time-series Hotspots**: When you partition by date and today's date becomes the bottleneck for all writes.

## The Pattern
Break a single "Hot Key" into multiple sub-keys by appending a random number (the "Salt") to spread the load across multiple partitions.

### Implementation Logic
1. **Detection**: Identify keys that are exceeding the throughput limits of a single node.
2. **Writing**: Instead of writing to `user_123`, write to `user_123_salt_N` where N is a random number between 1 and 100.
3. **Reading**: To get the full data for `user_123`, you must now read all 100 sub-keys (`user_123_salt_1` through `user_123_salt_100`) and merge the results in the application.

## Trade-offs
- **Read Penalty**: Reads are now 100x more expensive because they require a "Scatter/Gather" across many nodes.
- **Complexity**: The application must know which keys are "salted" and which are not.

## Failure Modes
- **Indiscriminate Salting**: Salting every key will crash read performance for the entire system. Only salt the "Top 0.1%" of keys.
- **Inconsistent Salt Range**: If the writer uses salt 1-10 but the reader looks for 1-100, data will be missing.

## Verification
- **Throughput Monitoring**: Check if the "Hot Node" CPU usage drops after salting is implemented.
- **Correctness Audit**: Ensure that the merge logic for read-scatter/gather correctly handles all salted variations.
