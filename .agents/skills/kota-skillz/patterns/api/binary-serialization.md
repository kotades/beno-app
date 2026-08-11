# Binary Serialization (Protobuf/gRPC) (Tier 1)

## When to Use
- **Internal Microservices**: When services talk to each other and need maximum speed and minimum bandwidth.
- **Mobile APIs**: To reduce data usage for users on slow mobile networks.

## The Pattern
Use a schema-based binary format (like Protocol Buffers) instead of JSON for internal data exchange.

### Implementation Logic
1. **The .proto File**: Define your data structures and service methods in a language-neutral schema file.
2. **Field Tags**: Assign each field a unique number (e.g., `string user_name = 1;`). NEVER change these numbers once deployed.
3. **Code Generation**: Use the `protoc` compiler to generate native code (Go, Python, Java) for your application.
4. **Binary Wire Format**: The data is sent as a compact stream of bytes, omitting field names and using variable-length integers for size savings.

## Trade-offs
- **Human Readability**: You cannot "just look" at the raw data in a debugger or network trace (requires a decoder).
- **Tooling Overhead**: You must manage schema files and keep them in sync across all services.

## Failure Modes
- **Tag Reuse**: If you reuse a tag number for a different field, you will corrupt all incoming data.
- **Required Field Trap**: Marking a field as `required` makes it almost impossible to remove later without breaking old clients.

## Verification
- **Network Bandwidth**: Measure the size of a 100-record response in JSON vs. Protobuf. Protobuf is usually 30-50% smaller.
- **Serialization Speed**: Benchmark the CPU time taken to encode/decode large messages.
