# Design System Tokens (Refactoring UI)

**Source**: Refactoring UI — Adam Wathan & Steve Schoger
**When to use**: Every new project. Define these BEFORE writing any component CSS.

## Core Principle
> "Designing with systems is going to be a recurring theme. Systematize everything."

Don't hand-pick values every time. Define constrained sets once, then choose from them.

---

## 1. Spacing & Sizing Scale

Use a base-16 system with exponential growth. **Never use arbitrary pixel values.**

```css
:root {
  --space-1: 0.25rem;   /* 4px  */
  --space-2: 0.5rem;    /* 8px  */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px — base */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-7: 3rem;      /* 48px */
  --space-8: 4rem;      /* 64px */
  --space-9: 6rem;      /* 96px */
  --space-10: 8rem;     /* 128px */
}
```

**Rule**: Adjacent values must differ by at least 25%. A linear scale (4, 8, 12, 16...) fails at large sizes because the differences become imperceptible.

---

## 2. Type Scale

Hand-crafted, not modular. Avoid `em` units (they compound in nested elements). Use `rem` or `px`.

```css
:root {
  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */
  --text-4xl:  2.25rem;   /* 36px */
  --text-5xl:  3rem;      /* 48px */
}
```

**Typography Rules**:
- **Line length**: 45-75 characters per line (`max-width: 20-35em`).
- **Line height is proportional**: Small text → taller (1.5-2.0). Large headings → shorter (1.0-1.2).
- **Font weights**: Use only 400 (normal) and 600/700 (bold). Never go below 400 for UI text.
- **Letter-spacing**: Tighten for headlines, increase for ALL-CAPS text.
- **Baseline alignment**: When mixing font sizes on one line, align by baseline, not center.

---

## 3. Color System (HSL, Not Hex)

> "Ditch hex for HSL. Colors that look similar should look similar in code."

### Structure: 3 Categories

| Category | Purpose | Shades Needed |
|:---|:---|:---|
| **Greys** | Text, backgrounds, borders, panels | 8-10 shades |
| **Primary** | Buttons, active nav, brand identity | 5-10 shades |
| **Accents** | Semantic states (success, warning, error, info) | 5-10 per color |

### Building a Palette (The "Edges + Fill" Method)
1. **Pick a base** (shade 500): Should work as a button background.
2. **Find the edges**: Darkest (shade 900, for text) and lightest (shade 100, for tinted backgrounds).
3. **Fill the gaps**: 700, 300, then 800, 600, 400, 200.

### Critical HSL Rules
- **Increase saturation** as lightness moves away from 50% (prevents washed-out shades).
- **Rotate hue** to adjust perceived brightness without losing saturation (toward 60°/180°/300° to lighten, toward 0°/120°/240° to darken).
- **Warm greys**: Saturate with yellow/orange. **Cool greys**: Saturate with blue.
- **True black looks unnatural**: Start your darkest grey at HSL(~, ~, 10-15%).

### Accessibility (WCAG)
- Normal text contrast ratio ≥ 4.5:1.
- Large text (≥18px bold / ≥24px) contrast ratio ≥ 3:1.
- **Don't reduce opacity for de-emphasis on colored backgrounds** — hand-pick a color with the same hue instead.
- **Don't rely on color alone**: Always pair with icons, text, or patterns.

---

## 4. Shadow / Elevation Scale

Define 5 levels. Use **two shadows** per element (direct light + ambient occlusion).

```css
:root {
  --shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
  --shadow-md:  0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-lg:  0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-xl:  0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-2xl: 0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04);
}
```

**Rules**:
- Light always comes from above.
- **Raised elements**: Light top edge (inset shadow or top border), dark bottom shadow.
- **Inset elements**: Dark top inner shadow, light bottom edge.
- Use shadows to communicate **interactivity**: Larger shadow on hover (raised), smaller on click (pressed).
- The ambient shadow should **diminish** at higher elevations.

---

## 5. Border Radius

Pick ONE personality and be consistent:
- **Neutral/Professional**: `4px`
- **Playful/Friendly**: `8px-12px`
- **Ultra-playful**: `9999px` (pill shapes)
- **Formal/Serious**: `0px` (sharp corners)

**Never mix** sharp and rounded corners in the same interface.

---

## 6. Anti-Patterns to Avoid

| Anti-Pattern | Fix |
|:---|:---|
| Grey text on colored backgrounds | Hand-pick a same-hue, adjusted color |
| Scaling icons beyond intended size | Wrap in a shaped container with bg color |
| Scaling screenshots down >50% | Use partial screenshots or simplified wireframes |
| Using borders for all separation | Prefer box-shadows, background color differences, or spacing |
| Placeholder images in production | Use real photos (Unsplash) or generated assets |
| Desktop-first design | Always start with mobile (400px canvas) |
| Labels for self-evident data | Combine label + value into natural language ("12 left in stock") |
