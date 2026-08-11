# Keyboard Navigation Pattern

**Always apply:**
- All interactive elements MUST be focusable (`button`, `a`, `input`, or `tabindex="0"` with appropriate role).
- **Focus indicator MUST be visible**. Never use `outline: none` without a custom focus style.
- Maintain a **logical tab order** that matches the visual layout.
- Provide a **Skip Navigation** link for screen reader and keyboard users.

**Checklist:**
- [ ] Can user reach all features without a mouse?
- [ ] Focus order matches visual order?
- [ ] Modals trap focus inside (preventing "tabbing out" into the background).
- [ ] Dropdowns and menus close on `Escape`.

**Common AI Mistakes:**
- Forgetting `aria-expanded` on toggles/accordions.
- Using `div` as a button without `role="button"` and keyboard event handlers.
- Removing focus outlines for "aesthetic" reasons (UX failure).

**Test Protocol**: Attempt to use the feature using ONLY the `Tab`, `Shift+Tab`, `Space`, and `Enter` keys.
