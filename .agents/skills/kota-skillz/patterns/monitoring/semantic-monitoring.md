# Semantic Monitoring (Tier 2)

## When to Use
- **Business Critical Journeys**: When you need to know if "Ordering" is actually working, not just if the CPU is low.
- **Complex Inter-service Logic**: When individual services look healthy but the "system" is failing.

## The Pattern
Run "Synthetic Transactions" (Fake User actions) against the Production environment at regular intervals.

### Implementation Logic
1. **The "Zombie" User**: Create a special user in Production that can perform actions without real-world side effects (e.g., placing an order that doesn't trigger a warehouse pick).
2. **Periodic Execution**: Run a script every 1-5 minutes that logs in, searches for an item, and adds it to the cart.
3. **Alerting**: If the synthetic transaction fails, alert the team immediately. This is the "Highest Signal" alert.

## Trade-offs
- **Cleanup**: You must ensure that "Fake" data doesn't pollute real business reports.
- **Complexity**: Writing tests that can run safely in Production is harder than writing unit tests.

## Failure Modes
- **The "Washing Machine" Incident**: Forgetting to mock the final side effect and accidentally shipping 100 washing machines to the office.
- **Fragile Tests**: If the UI changes and the script fails, you get "Alert Fatigue."

## Verification
- **Outage Simulation**: Temporarily disable a non-critical downstream service. Check if Semantic Monitoring picks up the failure in the end-to-end journey.
- **Dashboard**: Ensure there is a "Big Green/Red Button" on the office wall showing the status of the synthetic transactions.
