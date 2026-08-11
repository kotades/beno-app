# Tail Latency & Percentiles (p99/p999)

## When to Use
- **User-Facing Services**: Where the experience of the slowest users matters most.
- **Microservices**: Where one slow backend call can slow down the entire end-user request.

## The Pattern
Measure performance using **Percentiles (p50, p95, p99, p999)** rather than averages (means). Optimize for the "Tail" (the slowest requests).

### Implementation Logic
1. **Measurement**: Use algorithms like `HdrHistogram` or `t-digest` to track response time distributions.
2. **SLA/SLO**: Define success as (e.g.) "Median < 200ms AND p99 < 1s".
3. **Parallel Fetching**: If one call is slow, it blocks the whole request. Address "Head-of-Line Blocking".

## Trade-offs
- **Cost**: Reducing p999 is significantly more expensive than reducing p50.
- **Diminishing Returns**: After a certain point, random events (GC pauses, network jitter) make further optimization impossible.

## Failure Modes
- **Averaging Percentiles**: Mathematically incorrect. You must add the histograms, not average the p99 values from multiple servers.
- **Head-of-Line Blocking**: One slow request holds up the queue for everyone else.

## Verification
- **Lighthouse/Real User Monitoring (RUM)**: Monitor what the 99th percentile of real users actually experiences.
- **Load Generation**: Test with a client that sends requests independently of response time (Poisson process).
