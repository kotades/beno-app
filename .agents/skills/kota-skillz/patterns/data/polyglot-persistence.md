# Polyglot Persistence (Tier 1)

## When to Use
- **Complex Architectures**: When a single database cannot efficiently handle all access patterns (e.g., search, relational, and real-time).
- **Industrial Scale**: When you need SQL for transactions but NoSQL for high-volume logs or Graph DBs for social connections.

## The Pattern
Instead of forcing all data into one database, use the model that best fits each sub-component of your system.

### Implementation Logic
1. **Relational (Postgres/MySQL)**: Use for structured data, many-to-many relationships, and anything requiring strict ACID compliance.
2. **Document (MongoDB/CouchDB)**: Use for "self-contained" documents (e.g., user profiles, resumes) where data forms a natural tree structure.
3. **Graph (Neo4j/Dgraph)**: Use for highly interconnected data (e.g., social graphs, recommendation engines).
4. **Search Index (Elasticsearch/Solr)**: Use for full-text search and complex filtering that SQL handles poorly.

## Trade-offs
- **Operational Complexity**: You now have to maintain, backup, and monitor multiple types of databases.
- **Data Synchronization**: You must ensure data is kept in sync across stores (e.g., updating the search index when the SQL database changes).

## Failure Modes
- **Sync Lag**: The search index becomes "stale" and shows old data because the sync process is slow.
- **Distributed Inconsistency**: A write succeeds in the SQL DB but fails in the NoSQL store, leaving the system in a fragmented state.

## Verification
- **Audit Scripts**: Regularly run scripts that compare a random sample of records across different stores to ensure they match.
- **Latency Benchmarks**: Compare the p99 latency of a join-heavy query in SQL vs. the same query in a Graph DB.
