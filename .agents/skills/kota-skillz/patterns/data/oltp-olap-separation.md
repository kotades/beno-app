# OLTP vs. OLAP Separation (Tier 1)

## When to Use
- **Production Systems**: When your application has real-world users (OLTP) and also needs business reporting (OLAP).
- **Scale-up Phase**: When complex SQL queries start slowing down your user-facing API.

## The Pattern
Strictly separate your "Transaction" database (for users) from your "Analytics" database (for reports). Use an ETL process to sync them.

### Implementation Logic
1. **OLTP (Online Transaction Processing)**: Use Postgres, MySQL, or MongoDB. Optimized for low-latency writes and single-record lookups.
2. **OLAP (Online Analytical Processing)**: Use BigQuery, Snowflake, Redshift, or ClickHouse. Optimized for scanning millions of rows and calculating aggregates.
3. **ETL (Extract, Transform, Load)**: A background process that periodically (e.g., every hour) or continuously streams data from OLTP to OLAP.

## Trade-offs
- **Staleness**: The Analytics database is always slightly behind the Production database.
- **Cost**: You have to pay for and maintain two different database systems.

## Failure Modes
- **Production Impact**: Running a massive `SUM()` or `JOIN` on the OLTP database locks tables and crashes the app for users.
- **ETL Failure**: The pipeline breaks, and business analysts start making decisions based on old, incorrect data.

## Verification
- **Query Latency**: Monitor p99 on the OLTP side. If it spikes during reporting hours, the separation is failing.
- **Data Lag**: Measure the time difference between a record being created in OLTP and appearing in OLAP.
