# Critical Rendering Path Optimization

**When to use:** Every page. Always.

**The pattern:**
1. **Inline Critical CSS**: Put above-the-fold styles directly in the `<head>` to avoid an extra RTT (Round Trip Time).
2. **Defer Non-Critical CSS**: Load the rest of the styles using `media="print" onload="this.media='all'"`.
3. **Lazy Load Below-the-Fold**: Add `loading="lazy"` to images and iframes that aren't visible on initial load.
4. **Preconnect to Origins**: Establish early connections to external domains (e.g., Google Fonts, CDN, API).
   - `<link rel="preconnect" href="https://fonts.googleapis.com">`
5. **Preload Hero Image**: Ensure the Largest Contentful Paint (LCP) element is prioritized.
   - `<link rel="preload" as="image" href="hero.webp">`

**Verification:**
- [ ] Lighthouse Performance score > 90.
- [ ] First Contentful Paint (FCP) < 1.5s.
- [ ] Time to Interactive (TTI) < 3.5s.

**When NOT to use:**
- Admin panels (where load speed is secondary to complex data weight).
- Dev environments where hot-reloading is prioritized.

**Failure Mode:**
If you inline too much CSS, the HTML document size exceeds the first congestion window (14KB), leading to a slower Time to First Byte (TTFB).
**Fix**: Limit inlined CSS to ~10KB total.
