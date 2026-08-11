# Schema-on-Read vs. Schema-on-Write (Tier 1)

## When to Use
- **Schema-on-Write (Relational)**: When data structure is stable, and you want the database to enforce correctness.
- **Schema-on-Read (NoSQL)**: When data is heterogeneous (many types of objects) or comes from external sources you don't control.

## The Pattern
Choose the schema enforcement level based on how often your data structure changes.

### Implementation Logic
1. **Schema-on-Write**: Traditional `ALTER TABLE` migrations. Best for core business entities (Orders, Users).
2. **Schema-on-Read**: Store data as raw JSON/BSON. The application code handles the versioning (e.g., `if (!user.first_name) { ... }`).
3. **The Hybrid (Postgres JSONB)**: Store core fields in columns and "flexible" fields in a JSONB column. Use GIN indexes for querying inside JSON.

## Trade-offs
- **Enforcement**: Schema-on-write prevents bad data from ever entering the DB. Schema-on-read requires the application to be defensive.
- **Migration Speed**: Changing a schema-on-read system is "instant" (just start writing new fields), but you carry "technical debt" in the reading code forever.

## Failure Modes
- **Data Corruption**: In schema-on-read, a bug in the application can write "junk" data that crashes the reader later.
- **Migration Downtime**: On large MySQL tables, `ALTER TABLE` can lock the database for hours.

## Verification
- **Data Validation Layer**: Even in "schemaless" systems, use a library like Zod or Pydantic to validate data immediately after reading it.
- **Shadow Migrations**: Run the new reading code against a copy of production data to ensure it handles all old record formats.
