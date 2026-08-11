# Visual Hierarchy & Layout (Refactoring UI)

**Source**: Refactoring UI — Adam Wathan & Steve Schoger
**When to use**: Every component, every page. Hierarchy is the single most important factor in making something "look designed."

---

## Core Axiom
> "When everything in an interface is competing for attention, it feels noisy and chaotic. Visual hierarchy is the most effective tool you have for making something feel 'designed.'"

---

## 1. Hierarchy Through Weight, Color, and Size

**Don't rely on font size alone.** Use all three levers:

| Lever | Primary Content | Secondary Content | Tertiary Content |
|:---|:---|:---|:---|
| **Color** | Dark (near-black) | Medium grey | Light grey |
| **Weight** | 600-700 (bold) | 400-500 (normal) | 400 (normal) |
| **Size** | Larger | Base | Slightly smaller |

**Principle**: "Emphasize by de-emphasizing." If the main element doesn't stand out, don't try to make it louder — make everything *else* quieter.

---

## 2. Button Hierarchy Pyramid

Every page has actions at three levels:

```
┌─────────────────────────┐
│   PRIMARY ACTION        │  → Solid, high-contrast background
│   (One per page)        │
├─────────────────────────┤
│   SECONDARY ACTIONS     │  → Outline style or low-contrast bg
│   (2-3 per page)        │
├─────────────────────────┤
│   TERTIARY ACTIONS      │  → Styled as plain links
│   (Seldom used)         │
└─────────────────────────┘
```

**Destructive actions**: Don't make them red by default. Use secondary/tertiary treatment on the initial screen, then use the big-red-bold style on the **confirmation dialog** where it IS the primary action.

---

## 3. Label Strategy

| Situation | Approach |
|:---|:---|
| Data format is self-evident (email, phone, price) | **No label needed** |
| Context makes it obvious (job title under a name) | **No label needed** |
| Can combine into natural language | **"12 left in stock"** instead of "Stock: 12" |
| Data is scannable on a dashboard | **De-emphasize the label** (smaller, lighter, thinner) |
| User is scanning FOR the label (spec sheets) | **Emphasize the label** (darker color) |

---

## 4. Spacing Rules

### The "Too Much → Remove" Method
> Start with WAY too much white space. Then remove it until you're happy.

This is the opposite of the default behavior (add minimum spacing until it stops looking bad). The result is always a cleaner, more professional feel.

### The Proximity Principle
> "Whenever you're relying on spacing to connect a group, always make sure there's MORE space around the group than within it."

**Common violations**:
- Form labels equidistant from the field above and below (which label belongs to which field?)
- Section headings with equal spacing above and below (floating in limbo)
- List items with spacing equal to line-height (items don't feel grouped)

### Don't Fill the Screen
- If you only need 600px, use 600px. Don't stretch to fill 1400px.
- Use `max-width` to cap element sizes, let them shrink naturally.
- **Think in columns**: If a narrow form feels lost on a wide page, split supporting text into a separate column instead of widening the form.

---

## 5. Grid Philosophy

> "Grids are overrated. Don't be a slave to the grid."

- **Sidebars**: Use fixed width (not % columns). Let main content flex.
- **Components**: Use `max-width`, not percentage widths.
- **Proportional sizing doesn't scale**: Headlines at 2.5x body text on desktop may need to be 1.5x on mobile. Let things scale independently.
- **Button padding is NOT proportional to font size**: Larger buttons need more generous padding; smaller buttons need proportionally tighter padding.

---

## 6. Creating Depth Without Shadows

Even "flat" designs need depth. Three techniques:

1. **Color-based depth**: Lighter = closer (raised), darker = farther (inset).
2. **Solid shadows**: Short, vertically offset, no blur. Maintains flat aesthetic.
3. **Overlapping elements**: Offset cards across section boundaries, extend elements beyond parents.

### Overlapping Images
Give overlapping images an "invisible border" that matches the background color to prevent clashing.

---

## 7. Finishing Touches Checklist

When a design is "done" but feels plain:

- [ ] Replace bullet points with semantic icons (checkmarks, padlocks, arrows).
- [ ] Promote decorative elements (enlarge quote marks, use brand colors).
- [ ] Add colorful accent borders (top of cards, active nav, alert sides, under headlines).
- [ ] Decorate backgrounds (color changes, subtle gradients max 30° hue diff, repeating patterns).
- [ ] Design empty states with illustrations and clear CTAs (never show a blank table).
- [ ] Replace borders with box-shadows, background colors, or extra spacing.
- [ ] Custom-style checkboxes and radio buttons with brand colors.
- [ ] Consider selectable cards instead of boring radio button stacks.
