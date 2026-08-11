# Mobile-First Breakpoint System

**Standard Breakpoints:**
```css
/* Mobile: 0-640px (Default styles, no query needed) */

/* Tablet: 641px - 1024px */
@media (min-width: 641px) { }

/* Desktop: 1025px - 1280px */
@media (min-width: 1025px) { }

/* Wide: 1281px+ */
@media (min-width: 1281px) { }
```

**The Rule: NEVER use `max-width` queries.** 
Mobile-first means building the base experience for the most constrained environment (mobile) and adding complexity/layers as the screen grows.

**Checklist:**
- [ ] Touch targets > 44px on mobile (prevent "fat finger" errors).
- [ ] Font sizes readable without zoom (min 16px for body).
- [ ] No horizontal scroll on 320px width.
- [ ] Images scale with viewport (`max-width: 100%`).
- [ ] Tables reflow or become scrollable on small screens.

**Failure Mode:**
Desktop-first design results in "cramming" content into mobile, leading to high cognitive load and layout breakage.
**Fix**: Start with a single-column layout and expand to grid/flex columns at the tablet breakpoint.
