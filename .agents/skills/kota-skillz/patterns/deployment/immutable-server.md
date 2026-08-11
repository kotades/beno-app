# Immutable Server (Tier 2)

## When to Use
- **Cloud-Native Applications**: When running on AWS, GCP, or Azure.
- **Scaling Systems**: When you need to spin up 100 identical instances of a service.
- **High Security Environments**: To ensure no one has manually tampered with a running server.

## The Pattern
Instead of updating a running server, you create a new server image (e.g., AMI or Docker image) for every change. You then replace the old servers with the new ones.

### Implementation Logic
1. **Bake the Image**: Include the OS, dependencies, and the service binary in one artifact.
2. **Launch & Replace**: Use a blue/green or canary deployment to swap the old instances with the new ones.
3. **No SSH Access**: Ideally, disable SSH access to production servers to enforce the "no manual changes" rule.

## Trade-offs
- **Baking Time**: Creating a full VM image can take minutes (or longer). Docker reduces this to seconds.
- **Storage**: You end up with many versions of large images.

## Failure Modes
- **Configuration Drift**: Someone logs in and fixes a "quick bug" on a live server. The next deployment overwrites their fix because it wasn't in the image.
- **Slow Rollbacks**: If your image is huge, pulling it to 1000 nodes can take time.

## Verification
- **Drift Test**: Try to make a manual change on a server. Then trigger a "re-deploy." If the change is gone and the server is back to the "known good state," the pattern is working.
- **Bake Pipeline**: Check if the CI pipeline produces a runnable image as its final artifact.
