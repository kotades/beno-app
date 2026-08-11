# Bloom Filters (Tier 2)

## When to Use
- **Log-Structured Systems**: To speed up reads for keys that don't exist.
- **Distributed Caches**: To check if a value exists in a remote cache before making a network call.

## The Pattern
Use a probabilistic, memory-efficient data structure to tell you if an item is **definitely not** in a set.

### Implementation Logic
1. **The Bitset**: Create a fixed-size array of bits (all 0s initially).
2. **Hashing**: Pass a key through multiple hash functions. Each function gives a position in the bitset.
3. **Writing**: Set the bits at those positions to 1.
4. **Querying**: If **any** of the bits at those positions are still 0, the key is **definitely not** there. If they are all 1, the key **might** be there.

## Trade-offs
- **False Positives**: Sometimes it says a key is there when it isn't (forcing a disk read).
- **No False Negatives**: It will never say a key isn't there if it actually is.
- **Memory**: The larger the bitset, the lower the false positive rate.

## Failure Modes
- **Saturation**: If you add too many items to a small Bloom filter, every bit becomes 1, and the filter becomes useless (it says "maybe" for everything).
- **No Deletion**: You cannot remove an item from a standard Bloom filter (you'd have to clear it and rebuild it).

## Verification
- **False Positive Rate**: Monitor how many times the filter says "Maybe" but the disk says "Not found."
- **Memory Usage**: Ensure the filter fits in RAM.
