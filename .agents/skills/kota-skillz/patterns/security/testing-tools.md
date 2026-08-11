# Security Testing Tools

To verify adherence to the security patterns, utilize these industry-standard testing tools.

## Static Analysis (SAST)
Scan code for vulnerabilities before running or committing.

| Tool | Language | Use |
| :--- | :--- | :--- |
| **Bandit** | Python | Fast security linter for common Python flaws |
| **Semgrep** | Multi-language | Custom rules, incredibly fast, CI/CD friendly |
| **SonarQube** | Multi-language | Full platform for continuous inspection |

## Dependency Scanning (SCA)
Ensure third-party libraries don't introduce vulnerabilities.

| Tool | What it does |
| :--- | :--- |
| **OWASP Dependency-Check** | Finds known, publicly disclosed vulnerabilities (CVEs) in packages |
| **Snyk** | Developer-friendly vulnerability scanning and fix suggestions |
| **Trivy** | Comprehensive scanner for containers, OS packages, and language deps |

## Dynamic Testing (DAST)
Test the running application from the outside.

| Tool | Use |
| :--- | :--- |
| **OWASP ZAP** | Free web app scanner, excellent for API fuzzing and CI/CD integration |
| **Nuclei** | Fast, template-based vulnerability scanning |

## Secrets Detection
Prevent API keys, tokens, and passwords from leaking into source control.

| Tool | What it finds |
| :--- | :--- |
| **TruffleHog** | Deep scans git history for high entropy strings and known key patterns |
| **detect-secrets** | Yelp's pre-commit hook to prevent secrets from entering commits |
| **GitGuardian** | Real-time secret scanning platform |

## Quick Start Commands

```bash
# Scan Python code with Bandit
bandit -r ./src -f json -o security-report.json

# Check Python dependencies
pip install safety
safety check --json > dependency-report.json

# Run OWASP ZAP in automation against an API
zap-api-scan.py -t https://yourapp.com/openapi.json -f openapi -r report.html
```
