# URL Frontier (Tier 2)

## When to Use
- **Web Crawlers**: When you need to manage billions of URLs to be crawled while respecting "Politeness" and "Priority."
- **Recursive Ingestion**: When the output of a task (finding a new link) becomes the input for the next task.

## The Pattern
A sophisticated queue system that maintains two sets of sub-queues:
1. **Front Queues (Priority)**: Categorize URLs by importance (e.g., PageRank, update frequency).
2. **Back Queues (Politeness)**: Ensure that only one thread is hitting a specific host at a time, with a delay between requests.

### Implementation Logic
1. **The Prioritizer**: Ranks incoming URLs and puts them into a "Front Queue."
2. **The Queue Selector**: Pulls from Front Queues (weighted by priority) and puts them into "Back Queues."
3. **The Mapping Table**: Maps `hostname` -> `BackQueueID`. 
4. **Worker Threads**: Each thread is assigned to exactly one Back Queue and processes it sequentially.

## Trade-offs
- **Complexity**: Managing 1000s of queues and their mappings is much harder than a single FIFO.
- **Storage**: Requires hybrid storage (Disk for the bulk, Memory for the active buffers).

## Failure Modes
- **Spider Traps**: Infinite URL loops (e.g., `site.com/a/b/a/b...`) that consume all worker resources.
- **DNS Bottleneck**: Every new URL requires a DNS lookup. Use a **DNS Cache** to avoid system-wide stalls.

## Verification
- **Politeness Test**: Monitor the access logs for a single domain. Verify that requests are spaced by the defined delay (e.g., 1 second apart).
- **Priority Test**: Verify that a high-PageRank URL is crawled significantly faster than a random forum post.
