# Stream Enrichment (Tier 1)

## When to Use
- **Real-time Personalization**: Adding user preferences to an incoming click event to decide which ad to show.
- **Fraud Detection**: Adding historical transaction limits to a new payment event to check for anomalies.
- **Log Augmentation**: Adding human-readable service names to raw IP addresses in a firewall log.

## The Pattern
Join an incoming **Stream** of events with a **Table** of static or slow-changing metadata to produce an enriched stream.

### Implementation Logic
1. **The Fast Stream**: A high-volume event stream (e.g., Kafka topic `raw-events`).
2. **The Local State**: Instead of querying a remote DB for every event, the stream processor maintains a local, partitioned copy of the metadata (e.g., an in-memory Hash Table or a local RocksDB).
3. **The Sync**: The local state is kept up-to-date using Change Data Capture (CDC) from the source database.
4. **The Join**: As each event arrives, look up the metadata in the local store and append it to the event.

## Trade-offs
- **Memory Usage**: Every worker node must have enough RAM/Disk to store its partition of the metadata table.
- **Initialization Time**: When a worker starts, it must "hydrate" its local state from the CDC log before it can process events.

## Failure Modes
- **Stale Metadata**: If the CDC stream lags, events will be enriched with "Old" data.
- **Hydration Failure**: If the metadata log is corrupted, the processor cannot start.

## Verification
- **Hydration Metric**: Measure the time it takes for a new worker to reach "Ready" state (fully hydrated).
- **Data Freshness**: Monitor the timestamp of the latest CDC event applied to the local state.
