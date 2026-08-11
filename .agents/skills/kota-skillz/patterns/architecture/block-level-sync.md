# Block-Level Sync (Tier 2)

## When to Use
- **Cloud Storage**: When syncing large files (Google Drive, Dropbox) where users often make small edits to large documents.
- **Backup Systems**: To minimize the amount of data transferred over the network.

## The Pattern
Instead of uploading the entire file every time it changes, split the file into smaller **Blocks** (e.g., 4MB). Only upload the blocks that have changed.

### Implementation Logic
1. **The Splitter**: Divide the file into blocks.
2. **The Hasher**: Calculate a unique hash (e.g., SHA-256) for each block.
3. **Delta Detection**:
   - Compare the local block hashes with the hashes stored on the server.
   - If a hash matches, the block is already on the server.
   - If a hash is new, upload only that specific block.
4. **Metadata Update**: Update the file's "Block Map" in the database to point to the new set of hashes.

## Trade-offs
- **Overhead**: Calculating hashes for every block takes CPU time.
- **Metadata Size**: Storing a list of hashes for every file increases database size.

## Failure Modes
- **Hash Collision**: Extremely rare with SHA-256, but in theory, two different blocks could have the same hash.
- **Interrupted Upload**: A file might be in an inconsistent state if only half the new blocks are uploaded. Use **Atomic Metadata Updates** (only update the file version once all blocks are confirmed).

## Verification
- **Bandwidth Test**: Modify 1 byte in a 100MB file. Verify that the network transfer is ~4MB (one block), not 100MB.
- **Integrity Test**: Download the file after a delta sync and verify its checksum against the local version.
