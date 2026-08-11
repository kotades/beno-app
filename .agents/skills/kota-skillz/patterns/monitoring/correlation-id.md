# Correlation ID (Tier 1)

## When to Use
- **Distributed Tracing**: When a single user request triggers a chain of calls across multiple microservices.
- **Debugging**: When you need to find "What exactly happened to Request X?" in a pile of millions of log lines.

## The Pattern
Generate a unique ID (GUID/UUID) at the edge of the system (e.g., at the API Gateway or the first service). Pass this ID in the headers of every subsequent downstream call.

### Implementation Logic
1. **Generate at Entry**: `X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000`.
2. **Propagate**: Every service that receives the ID must include it in the headers when calling the next service.
3. **Log**: Include the ID in every log statement: `[550e8400...] INFO Order processed`.

## Trade-offs
- **Instrumentation**: You must update all your HTTP clients and logging frameworks to handle the ID.
- **Log Volume**: Adding a GUID to every log line increases log size slightly.

## Failure Modes
- **The "Broken Chain"**: One service in the middle forgets to pass the ID, making it impossible to trace the request further.
- **Non-Standard Headers**: Using `X-Trace-Id` in one service and `Correlation-Id` in another.

## Verification
- **Trace Test**: Search your central log aggregator (ELK/Splunk) for a single Correlation ID. You should see a "Story" of the request across all involved services.
- **Header Check**: Use a tool like Zipkin or Jaeger to visualize the spans and ensure the ID is present in all of them.
