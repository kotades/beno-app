# Frontend Code Review Checklist

**When to use**: Before every PR that touches frontend code. This is the quality gate.

---

## Accessibility (Critical — WCAG 2.1 AA)

- [ ] Every `<img>` has `alt` text (empty `alt=""` for decorative images)
- [ ] Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] No red/green alone for errors/success (pair with icons or text)
- [ ] All forms have associated `<label>` elements (not just placeholders)
- [ ] All interactive elements are keyboard-focusable with visible focus indicator
- [ ] Modals trap focus inside and close on `Escape`
- [ ] ARIA attributes used correctly (`aria-expanded`, `aria-label`, `role`)
- [ ] Semantic HTML used (`nav`, `main`, `section`, `article`, `header`, `footer`)
- [ ] Headings follow logical hierarchy (single `h1`, no skipped levels)

## Performance (Critical)

- [ ] Images have explicit `width` and `height` attributes (prevents CLS)
- [ ] Images use `loading="lazy"` below the fold
- [ ] No render-blocking resources in `<head>` (defer non-critical CSS/JS)
- [ ] No massive dependencies (lodash full bundle, moment.js → use date-fns)
- [ ] Bundle size < 200KB for initial load (gzipped)
- [ ] Hero image uses `<link rel="preload">`
- [ ] External fonts use `<link rel="preconnect">`
- [ ] Lighthouse Performance > 90, FCP < 1.5s, TTI < 3.5s

## Maintainability (Important)

- [ ] No nested ternary operators (use early returns or extracted functions)
- [ ] Components < 300 lines of code
- [ ] `useEffect` hooks have proper cleanup functions
- [ ] No inline objects/arrays in JSX props (causes unnecessary re-renders)
- [ ] Event handlers wrapped in `useCallback` where needed
- [ ] State placed at the correct level (see State Decision Tree pattern)

## Visual Design (Refactoring UI Standards)

- [ ] All spacing uses design token values (no arbitrary pixel values)
- [ ] Colors use HSL system with defined palette (no random hex codes)
- [ ] Typography uses defined type scale (no one-off font sizes)
- [ ] Visual hierarchy is clear: primary, secondary, tertiary content distinct
- [ ] Empty states designed with illustrations and CTAs (not blank screens)
- [ ] Loading skeletons used for all async data (not just spinners)

## Usability (Krug + Norman)

- [ ] Every page passes the "Trunk Test" (identifiable in 5 seconds)
- [ ] Clickable elements look clickable (signifiers present)
- [ ] Navigation shows "You Are Here" indicator
- [ ] Error messages are specific and actionable (not "Something went wrong")
- [ ] Destructive actions have confirmation dialogs
- [ ] Forms provide real-time validation feedback

## Security (Critical)

- [ ] No `dangerouslySetInnerHTML` without DOMPurify sanitization
- [ ] No user content in `href` or `src` without validation
- [ ] CSRF tokens on form submissions
- [ ] Content Security Policy configured for sensitive pages
- [ ] No secrets in client-side code
