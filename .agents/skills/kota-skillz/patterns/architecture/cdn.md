# Content Delivery Network (CDN) (Tier 1)

## When to Use
- **Global User Base**: When users in Europe are experiencing high latency for a site hosted in the US.
- **Heavy Static Assets**: When images, videos, or JS/CSS files are consuming too much bandwidth on your origin servers.

## The Pattern
Use a network of geographically dispersed servers to deliver static content. When a user requests a file, the CDN routes them to the server closest to them.

### Implementation Logic
1. **Push vs Pull**: 
   - **Pull**: CDN fetches the file from your server (Origin) on the first request and caches it.
   - **Push**: You upload the files to the CDN proactively.
2. **TTL (Time to Live)**: Set an expiration time for files. After TTL expires, the CDN refreshes the file from the origin.
3. **Invalidation**: Use APIs or "Object Versioning" (e.g., `style.css?v=2`) to force a refresh when you update a file.

## Trade-offs
- **Cost**: CDN providers charge for bandwidth.
- **Stale Content**: If your TTL is too long and you don't use versioning, users might see old styles/images.

## Failure Modes
- **Origin Overload**: If the CDN fails (or TTL expires on millions of files at once), all traffic hits your origin server, potentially crashing it.
- **DNS Latency**: The extra step of resolving the CDN domain.

## Verification
- **Geography Test**: Use a tool like `cURL` from different global regions (via VPN/Proxies). Compare the `X-Cache` header and response time.
- **Purge Test**: Update an image. Run a CDN "Purge." Verify that the new image appears globally immediately.
