# Change Data Capture (CDC) (Tier 1)

## When to Use
- **Cache Invalidation**: Keeping Redis/Memcached in sync with your SQL database without manual `DEL` commands in app code.
- **Search Indexing**: Automatically pushing database updates to Elasticsearch/Solr.
- **Analytics/ETL**: Streaming data from production OLTP to a data warehouse (BigQuery/Snowflake) in near real-time.

## The Pattern
Instead of "Dual Writes" (writing to DB and Cache simultaneously), write ONLY to the database. A separate process monitors the database's replication log and streams changes to downstream systems.

### Implementation Logic
1. **The Source**: A database with a replication log (e.g., Postgres WAL, MySQL Binlog).
2. **The Capture Agent**: A tool like Debezium or Maxwell that reads the log and produces events.
3. **The Message Bus**: An append-only log (Kafka/Kinesis) that stores the change events in order.
4. **The Consumers**: Downstream services (Search, Cache, Warehouse) that read the log and apply updates.

## Trade-offs
- **Consistency**: Downstream systems are "Eventually Consistent." There is a slight delay (usually < 1s).
- **Complexity**: Requires running and monitoring a CDC agent (e.g., Debezium) and a message bus (Kafka).

## Failure Modes
- **Log Overflow**: If the CDC agent stops, the database log might grow until it fills the disk.
- **Schema Evolution**: If you add a column to the DB, the downstream consumers might break if they don't handle the new format.

## Verification
- **Lag Monitoring**: Monitor the "Offset Lag" between the DB head and the consumer position.
- **Drift Audit**: Periodically compare a sample of records in the DB and the Search Index to ensure they match.
