# Schema Evolution Rules (Tier 1)

## When to Use
- **Production APIs**: When you need to update your data model without breaking existing mobile apps or frontend clients.
- **Rolling Upgrades**: When multiple versions of your backend are running simultaneously during a deployment.

## The Pattern
Follow a strict set of rules when modifying schemas to ensure both Backward and Forward compatibility.

### Implementation Logic
1. **Adding Fields**: Always make new fields `optional` or provide a `default value`. This ensures old code can ignore them and new code knows what to do if they are missing.
2. **Removing Fields**: You can only remove a field that was previously `optional`. You must NEVER reuse its tag number or ID.
3. **Renaming Fields**: In binary formats (Protobuf/Thrift), you can rename fields in the code as long as the Tag Number remains the same. In JSON, renaming is a breaking change.
4. **Changing Types**: Be extremely careful. Changing an `int32` to an `int64` is usually safe (widening), but the reverse (narrowing) will truncate data.

## Trade-offs
- **Legacy Weight**: You might have to keep "dead" fields in your code for a long time to support very old clients.
- **Complexity**: The code must handle the "missing data" case for every new field.

## Failure Modes
- **The "Required" Break**: Making a new field `required` is the #1 cause of deployment failures. Old clients won't send it, and the new backend will reject the request.
- **Tag Collision**: Accidentally assigning the same number to two different fields.

## Verification
- **Compatibility Testing**: Run a test suite where the Client is 1 version behind the Server, and another where the Server is 1 version behind the Client.
- **Schema Registry**: Use a tool (like Confluent Schema Registry) to automatically block any schema change that is not backward compatible.
