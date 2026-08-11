# Next.js Performance & Architecture (Tier 1 - 2024/2025)

## Core Strategies

### 1. Partial Prerendering (PPR)
- **Philosophy**: Instant static shell + streamed dynamic content.
- **Rule**: Wrap dynamic components in `<Suspense>` boundaries. Next.js will serve the static parts from CDN immediately.

### 2. Incremental Static Regeneration (ISR)
- **Logic**: `fetch(url, { next: { revalidate: 3600 } })`.
- **Best Practice**: Use **On-Demand Revalidation** via `revalidateTag()` for instant updates when data changes in the DB, rather than waiting for a timer.

### 3. Server Components (RSC) by Default
- **Rule**: Only use `'use client'` at the leaves of your component tree (buttons, inputs, state-heavy interactive parts). 
- **Benefit**: Zero-bundle-size logic and direct DB access.

## Data Fetching Best Practices
- **Parallel Fetching**: Use `Promise.all([data1, data2])` to avoid waterfalls.
- **Request Memoization**: Next.js automatically caches duplicate `fetch` calls in the same render pass.

## Quality Gates
- **No Waterfalls**: Ensure components don't wait for each other to fetch data unless strictly necessary.
- **Lighthouse Scores**: Core Web Vitals (LCP, FID, CLS) must stay in the green.
- **Bundle Size**: Monitor `_app.js` size. Avoid importing massive libraries (e.g., Moment.js) on the client.

## Selection Logic
- IF "Content changes per-user" -> **PPR + Streaming**.
- IF "Content is global but updates" -> **ISR**.
- IF "Content is highly interactive" -> **Client Components**.
