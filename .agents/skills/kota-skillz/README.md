<h1 align="center">🧠 Kota Skillz</h1>

<p align="center">
  <strong>The Industrial-Grade Standard Library for AI Coding Agents</strong><br>
  <em>92 architectural patterns · 5 integrated skills · 11 engineering bibles · One CLI command</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.1.3-blue?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/patterns-92-green?style=flat-square" alt="92 Patterns">
  <img src="https://img.shields.io/badge/skills-5-purple?style=flat-square" alt="5 Skills">
  <img src="https://img.shields.io/badge/license-MIT-orange?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square" alt="Node >= 18">
</p>

---

## 🛑 The Problem

The rise of "Vibe Coding" — building software entirely by talking to AI agents like Cursor, Copilot, Windsurf, or Antigravity — has exposed a massive flaw: **AI agents lack architectural context.**

When you tell an AI to "build a login page," it relies on the statistical average of GitHub. The result? Unstyled layouts, insecure sequential IDs, missing Content Security Policy headers, and logic that crumbles under distributed concurrency.

AI doesn't know your architecture. It doesn't know your performance budget. It doesn't know that you need mobile-first design, OWASP compliance, or circuit breakers.

## 🛠️ The Solution

**Kota Skillz** is an **industrial standard library** designed strictly for consumption by Large Language Models. It combines:

- An **execution protocol** (`SKILL.md`) that forces AI agents to use Hermeneutic Reasoning, preventing the "lost in the middle" context window problem.
- A repository of **92 machine-readable architectural patterns** extracted from 11 of the most authoritative software engineering books.
- A **skills ecosystem** of curated third-party tools that extend the agent's capabilities across UI/UX design, code efficiency, database best practices, and video rendering.
- An **automatic learning loop** that captures successes, failures, and debugging insights across sessions.

---

## ⚡ Quick Start

```bash
npx Dayzidee/kota-skillz
```

That's it. This single command pulls the entire Kota Skillz ecosystem — patterns, skills, lockfile — directly into your `.agents/skills/` directory where tools like Cursor, Antigravity, Cline, and Windsurf read them natively.

---

## 📐 Architecture

```text
kota-skillz/
├── SKILL.md                    # Core execution protocol & directory map
├── skills-lock.json            # Version-pinned registry of all integrated skills
│
├── patterns/                   # 92 industrial-grade architectural standards
│   ├── api/                    #   → API design, serialization, idempotency (6)
│   ├── architecture/           #   → CQRS, Bounded Contexts, Stateless Web Tier (15)
│   ├── concurrency/            #   → Rate limiting, distributed locks (1)
│   ├── data/                   #   → Sharding, isolation levels, CDC, ACID (23)
│   ├── deployment/             #   → CI/CD pipelines, immutable servers (3)
│   ├── frontend/               #   → Accessibility, design tokens, CRP (14)
│   ├── latency/                #   → Caching, fan-out, tail latency (3)
│   ├── monitoring/             #   → Correlation IDs, semantic logging (2)
│   ├── resiliency/             #   → Circuit breakers, bulkheads, fencing tokens (12)
│   ├── security/               #   → ASVS Level 2, AuthZ/AuthN, SSRF prevention (8)
│   ├── storage/                #   → LSM Trees, B-Trees, Bloom filters (3)
│   ├── stack/                  #   → Stack-specific optimizations (1)
│   └── testing/                #   → Testing strategies and patterns (1)
│
├── skills/                     # Curated third-party skill integrations
│   ├── ponytail/               #   → "Lazy senior dev" efficiency engine
│   └── ui-ux-pro-max-skill/    #   → AI-powered design system generator
│
├── features/                   # [Learning Module] Architectures of successful features
├── failures/                   # [Learning Module] Root cause analyses of past bugs
├── debugging/                  # [Learning Module] Complex tracing sessions & insights
│
├── instructions/               # Code review & vibe coder directives
├── prompts/                    # Prompt templates for extracting new patterns
├── skeleton/                   # Clean architecture boilerplate blueprint
├── stack/                      # Stack-specific optimizations (Next.js, PostgreSQL)
├── scripts/                    # CLI tooling and automation
└── bin/                        # CLI entry point (kota.js)
```

---

## 📚 The Knowledge Base

The patterns weren't written from scratch. They were extracted from **11 authoritative software engineering bibles**, distilled into dense, machine-readable Markdown that fits inside AI context windows:

### Backend & Data Systems

| # | Source | What It Provides |
|---|--------|-----------------|
| 1 | *Designing Data-Intensive Applications* (Kleppmann) | Replication, partitioning, stream processing |
| 2 | *Building Microservices* (Newman) | Service boundaries, decomposition |
| 3 | *System Design Interview* (Xu) | Scalability heuristics, capacity planning |
| 4 | *Operating Systems: Three Easy Pieces* (Arpaci-Dusseau) | Concurrency primitives, scheduling |
| 5 | *Clean Code* (Martin) | Naming, function design, error handling |
| 6 | *Clean Architecture* (Martin) | Dependency rule, use case boundaries |
| 7 | *The Pragmatic Programmer* (Thomas & Hunt) | DRY, orthogonality, tracer bullets |

### Security

| # | Source | What It Provides |
|---|--------|-----------------|
| 8 | *OWASP ASVS v4.0 Level 2* | Authentication, session, input validation |

### Frontend & UX

| # | Source | What It Provides |
|---|--------|-----------------|
| 9 | *Refactoring UI* (Wathan & Schoger) | Visual hierarchy, design tokens |
| 10 | *Don't Make Me Think* (Krug) | Usability, navigation, cognitive load |
| 11 | *The Design of Everyday Things* (Norman) | Affordances, feedback, constraints |

---

## 🔌 Integrated Skills Ecosystem

Kota Skillz doesn't just provide patterns — it ships a curated ecosystem of third-party skills, each version-pinned in `skills-lock.json`:

| Skill | Source | What It Does |
|-------|--------|-------------|
| **Ponytail** | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | "Lazy senior dev mode" — a 7-rung decision ladder (YAGNI → reuse → stdlib → native → dep → one-liner → minimum) that cuts code output by ~54% while maintaining 100% safety |
| **UI/UX Pro Max** | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | AI-powered design system generator with 67 UI styles, 161 color palettes, 57 font pairings, and 161 industry-specific reasoning rules |
| **Supabase** | [supabase/agent-skills](https://github.com/supabase/agent-skills) | Best practices for Supabase integration — auth, RLS, edge functions |
| **Supabase Postgres** | [supabase/agent-skills](https://github.com/supabase/agent-skills) | PostgreSQL optimization patterns specific to Supabase — indexing, migrations, performance |
| **Remotion** | [remotion-dev/skills](https://github.com/remotion-dev/skills) | Best practices for programmatic video rendering with Remotion |

---

## 🧬 How It Works

### The Execution Protocol

When injected into a project, `SKILL.md` acts as the AI agent's **constitution**. It enforces:

1. **Context Mapping** — Before implementing anything, the agent locates the relevant pattern in `patterns/` and checks `failures/` for past mistakes.
2. **Hermeneutic Reasoning** — The agent forms a hypothesis about the architectural intent, implements the parts, then synthesizes how changes affect the global system.
3. **Quality Gates** — Every implementation must pass: input validation (schema-first), structured logging, idempotency, resiliency (timeouts + retries + circuit breakers), and performance (`EXPLAIN ANALYZE` on every DB query).
4. **The Learning Loop** — After every task, the agent writes what it learned to `features/`, `failures/`, or `debugging/`, building institutional memory across sessions.

### The Pattern Selection Logic

```
1. Identify the primary constraint (Latency | Concurrency | Security | Correctness)
2. Read ALL patterns in that category
3. Select the pattern whose failure mode is least likely in context
4. Justify the choice before writing code
```

### Security (Always On)

Every implementation enforces:
- bcrypt (cost 12+) · HttpOnly + SameSite cookies · Row-level ownership checks
- UUIDs for public IDs · Parameterized queries only · CSP headers
- JWT expiry < 1 hour · No `innerHTML` with user input

### Frontend (Always On)

- Mobile-first (0–640px baseline) · Lighthouse > 90 · LCP < 2.5s
- Semantic HTML · Visible focus indicators · Skeleton loading states
- No `!important` · No pixel fonts · No horizontal scroll on mobile

---

## 🖥️ CLI

| Command | Description |
|:--------|:------------|
| `npx Dayzidee/kota-skillz` | One-command install — downloads patterns + skills into `.agents/skills/` |
| `kota audit` | *(Coming Soon)* Static analysis against QA patterns |

---

## 🔧 Connecting to Your AI IDE

### Cursor
Add to your `.cursorrules`:
```markdown
CRITICAL: Before writing any code, you MUST read the rules in `SKILL.md` and consult the relevant architectural patterns in the `patterns/` directory.
```

### Antigravity / Windsurf / Cline
The skills are automatically discovered from `.agents/skills/` — no additional configuration needed.

### GitHub Copilot
Reference the patterns directory in your Copilot instructions:
```markdown
Always consult .agents/skills/kota-skillz/patterns/ before generating code.
```

---

## 🗺️ Roadmap

| Phase | Status | Milestone | Features |
|-------|--------|-----------|----------|
| **1. Knowledge Core** | ✅ Unlocked | — | 92 patterns, execution protocol, learning loop, CLI |
| **2. The Sentinel** | 🔒 Locked | 100 ⭐ | Proactive audit command, ASVS scanner, AI-diff suggestor |
| **3. Stack Boosters** | 🔒 Locked | 500 ⭐ | Next.js deep-dive, PostgreSQL perf pack, FastAPI patterns |
| **4. The Visualizer** | 🔒 Locked | 1,000 ⭐ | Web dashboard, adherence score, interactive onboarding |
| **5. Agent-Native** | 🔒 Locked | 2,500 ⭐ | MCP server, rule export engine |
| **6. The Registry** | 🔒 Locked | 5,000 ⭐ | Community skill packs, enterprise registries |

---

## 🤝 Contributing

We welcome contributions to expand the pattern library. Patterns must be:

1. **Short and dense** — AI context windows are precious.
2. **Actionable** — provide concrete code examples.
3. **Backed by literature** — cite your sources.

To add a new skill, follow the integration protocol:
1. Clone the repo into `skills/`.
2. Add an entry to `skills-lock.json` with the commit ref.
3. Update `SKILL.md` with a description and link.
4. Create a `SKILL.md` inside the new skill directory.
5. Commit on a feature branch, then merge to main.

---

## 📄 License

MIT
