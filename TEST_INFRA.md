# E2E Test Infra: Beno Yachts Clone

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Category Page UI & Video Banner | ORIGINAL_REQUEST R3 | 5      | 5      | ✓      |
| 2 | Category Page Yacht Cards Grid | ORIGINAL_REQUEST R3 | 5      | 5      | ✓      |
| 3 | Detail Page 1+4 Image Gallery | ORIGINAL_REQUEST R4 | 5      | 5      | ✓      |
| 4 | Detail Page Sticky Pricing Sidebar | ORIGINAL_REQUEST R4 | 5      | 5      | ✓      |
| 5 | Detail Page Feature Icon Grid | ORIGINAL_REQUEST R4 | 5      | 5      | ✓      |
| 6 | Detail Page Route Map | ORIGINAL_REQUEST R4 | 5      | 5      | ✓      |

## Test Architecture
- Test runner: Playwright (`npx playwright test`)
- Pass/Fail semantics: All tests must pass with exit code 0.
- Directory layout: `tests/e2e/`

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | User browses yachts, views one | F1, F2, F3 | Medium |
| 2 | User interacts with gallery and sidebar | F3, F4 | Medium |
| 3 | User examines route map and features | F5, F6 | Medium |

## Coverage Thresholds
- Tier 1: ≥5 per feature
- Tier 2: ≥5 per feature (where boundaries exist)
- Tier 3: pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios
