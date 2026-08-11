# Autocomplete Trie (Tier 3)

## When to Use
- **Search Boxes**: When providing "type-ahead" suggestions based on prefix matching.
- **Path Routing**: Efficiently matching URL paths to handlers.

## The Pattern
A specialized Trie (Prefix Tree) where each node represents a character. To make it "Industrial Scale," we optimize for read speed by caching the **Top K** results directly in each node.

### Implementation Logic
1. **The Structure**: Each node contains a character, a frequency count (if it's a leaf), and a list of `TopSuggestions`.
2. **Offline Build**: Use an asynchronous pipeline (MapReduce/Spark) to aggregate search logs into `(Query, Frequency)` pairs.
3. **The Optimization**: During the build phase, traverse the Trie and at each node, store the 5 most frequent queries found in its subtree.
4. **The Query**: When a user types "ap", go to the node for "p" under "a" and immediately return its cached `TopSuggestions`. Time complexity: $O(1)$ relative to the number of nodes.

## Trade-offs
- **Memory Consumption**: Storing the top 5 suggestions at *every* node significantly increases the memory footprint of the Trie.
- **Stale Data**: Suggestions are only as fresh as the last build cycle (e.g., weekly or daily).

## Failure Modes
- **Memory Overflow**: If the query space is huge, the Trie might not fit in memory. Use **Trie Sharding** based on the first character (e.g., Server 1 for 'a-m', Server 2 for 'n-z').
- **Long Prefix Latency**: If the prefix length isn't capped, searching for a 100-character string still takes $O(L)$ time. Cap the prefix length at 50 characters.

## Verification
- **Performance Test**: Verify that the query response time is < 100ms for a Trie with 1 million nodes.
- **Relevancy Test**: Verify that the cached suggestions in the "a" node are indeed the most frequent queries starting with "a".
