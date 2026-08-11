# Database Security Patterns (ASVS v5, v6, v8)

**OWASP ASVS Level**: 2
**Attack Surface**: SQL Injection (SQLi), Data Breach, Privilege Escalation

## SQL Injection Prevention (ASVS v5.3)
**The rule: NEVER concatenate strings to build SQL queries.**

```python
# DANGEROUS - SQL injection vulnerability
query = f"SELECT * FROM users WHERE name = '{user_input}'"

# SAFE - Parameterized query
query = "SELECT * FROM users WHERE name = %s"
await db.execute(query, (user_input,))
```

**AI prompt:** "Always use parameterized queries/prepared statements. Never concatenate user input into SQL strings."

## Least Privilege Database Access
Create separate database users per application layer:
- **App user**: Only needed tables (no DROP/CREATE)
- **Migration user**: DDL privileges (separate from app)
- Never use root/admin account for the application runtime.

Example PostgreSQL setup:
```sql
-- App user (can only SELECT/INSERT/UPDATE on specific tables)
CREATE USER app_user WITH PASSWORD 'strong_password';
GRANT SELECT, INSERT, UPDATE ON orders, users TO app_user;

-- Migration user (can modify schema)
CREATE USER migration_user WITH PASSWORD 'strong_password';
GRANT ALL ON ALL TABLES IN SCHEMA public TO migration_user;
```

## Encryption at Rest (ASVS v8.1)
- Encrypt sensitive data: PII, credentials, payment info
- Use AWS RDS encryption or similar provider feature
- Encrypt backups as well

## Secrets Management (ASVS v6.4)
Never hardcode secrets:

```python
# DANGEROUS
API_KEY = "sk-abc123def456"

# SAFE - Environment variable
API_KEY = os.environ.get("API_KEY")

# BETTER - Secrets manager (AWS Secrets Manager, HashiCorp Vault)
api_key = await secrets_manager.get_secret("api-key")
```

## Connection Security
- Enforce TLS/SSL for database connections
- Use certificate validation
- Rotate database credentials regularly

## Verification Checklist
- [ ] All queries use parameterized statements (no string concatenation)
- [ ] Application database user has minimal privileges
- [ ] No hardcoded secrets in codebase
- [ ] Database connections use TLS
- [ ] Secrets scanned for in version control (use git-secrets or truffleHog)
