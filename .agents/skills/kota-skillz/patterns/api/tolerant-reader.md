# Tolerant Reader (Tier 2)

## When to Use
- **Evolving APIs**: When you want to add fields to a service response without breaking existing consumers.
- **Microservice Integration**: When multiple teams consume the same data but only care about different parts of it.

## The Pattern
Be conservative in what you send, and liberal in what you accept. A consumer should only extract the fields it needs and ignore everything else.

### Implementation Logic
1. **Explicit Selection**: Instead of deserializing the whole JSON/XML into an object, use XPATH, JSONPath, or specific field picking.
2. **Ignore Unknowns**: Ensure your JSON parser doesn't throw an error when it sees an unknown field.
3. **Minimize Dependencies**: Don't use shared libraries that contain the "Full Data Model." Each consumer defines its own "view" of the data.

## Trade-offs
- **Invisible Bugs**: If a field is renamed, the reader might just see "null" and not complain, leading to silent failures.

## Failure Modes
- **The "Full Object" Trap**: Using a shared JAR/Package that contains the POJO for the response. If the server adds a field, the JAR must be updated, causing coupling.

## Verification
- **Breaking Change Test**: Add a "test_field" to the server response. If the consumer continues to work without any changes, it is a Tolerant Reader.
