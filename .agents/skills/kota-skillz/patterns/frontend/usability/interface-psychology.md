# Psychology of Interface Design (Design of Everyday Things)

**Source**: The Design of Everyday Things — Don Norman (Revised & Expanded Edition)
**When to use**: Every UI/UX decision. This is the psychological framework that explains WHY users behave the way they do with interfaces.

---

## The Two Pillars of Good Design

> "Two of the most important characteristics of good design are **discoverability** and **understanding**."

1. **Discoverability**: Can the user figure out what actions are possible, and where/how to perform them?
2. **Understanding**: What does it all mean? What do the controls and settings do?

---

## The Six Fundamental Design Principles

### 1. Affordances
> "An affordance is a relationship between the properties of an object and the capabilities of the agent."

An affordance is NOT a property of an object. It's a **relationship** between the object and the user.
- A chair affords sitting (for a human)
- A button affords pressing
- A slider affords dragging

**For UI**: The question is always — does this element communicate what it can do?
- A raised, shadowed element affords clicking
- A text field with a blinking cursor affords typing
- A handle affords dragging

**Anti-affordances**: Things that prevent interaction (disabled buttons, read-only fields).

### 2. Signifiers
> "Signifiers are of far more importance to designers than are affordances."

Affordances determine what IS possible. **Signifiers communicate** what is possible. They are the perceivable signals.

| Example | Signifier |
|:---|:---|
| A door plate (flat, no handle) | Push |
| A door handle (graspable) | Pull |
| An underlined, colored text | Clickable link |
| A cursor change to pointer | Hoverable/clickable |
| A chevron icon `>` | Expandable/navigable |

**Critical rule**: If an affordance exists but there is no signifier, the user won't discover it. Invisible features are useless features.

### 3. Constraints
Four types that guide users toward correct actions:

| Type | Example |
|:---|:---|
| **Physical** | A USB-C plug can only be inserted one way |
| **Cultural** | Red = danger/stop, Green = success/go |
| **Semantic** | A rearview mirror must face the window |
| **Logical** | If there's only one empty slot left, this piece must go there |

**For UI**: Use constraints to prevent errors:
- Disable the Submit button until all required fields are valid
- Show only valid date ranges in a date picker
- Limit dropdown options to currently valid choices

### 4. Mappings
> "A device is easy to use when the set of possible actions is visible, when controls exploit natural mappings."

**Natural mapping**: The relationship between controls and their effects should be spatially or logically intuitive.

| Good Mapping | Bad Mapping |
|:---|:---|
| Stove knobs arranged like burners | Four knobs in a row for four burners in a grid |
| Volume slider goes up = louder | No spatial relationship between control and effect |
| Scroll down = content moves up | |

**For UI**: Group controls near the things they control. Make the layout of controls mirror the layout of what they affect.

### 5. Feedback
> "Feedback must be immediate: even a delay of a tenth of a second can be disconcerting."

Rules of feedback:
- **Immediate**: < 100ms for user actions
- **Informative**: Tell users WHAT happened, not just THAT something happened
- **Prioritized**: Unimportant info = subtle (color change). Critical alerts = prominent (modal, sound)
- **Not excessive**: Too many alerts → users ignore ALL of them (the "alarm fatigue" problem)

**For UI**:
- Button click → immediate visual state change
- Form submission → loading spinner → success/error message
- Background task → progress indicator
- Error → clear description of what went wrong and how to fix it

### 6. Conceptual Models
> "A conceptual model is an explanation, usually highly simplified, of how something works."

Users build mental models of how systems work. If the **designer's model** matches the **user's model**, the interface feels intuitive.

**For UI**: The interface should communicate its conceptual model through visible structure:
- Files and folders (desktop metaphor)
- Shopping cart (e-commerce metaphor)
- Tabs (filing cabinet metaphor)

**When models clash**: If the user's mental model is wrong, they'll make systematic errors. Fix this by making the correct model visible through better signifiers, not by adding instructions.

---

## The Seven Stages of Action

Norman's framework for understanding how users interact with any system:

```
        ┌─────── GOAL ───────┐
        │  (What do I want?)  │
        └──────┬──────────────┘
    GULF OF    │           GULF OF
   EXECUTION  │          EVALUATION
        │      │              │
   ┌────▼──────▼────┐   ┌────▼──────────┐
   │ 1. Plan         │   │ 5. Perceive   │
   │ 2. Specify      │   │ 6. Interpret  │
   │ 3. Perform      │   │ 7. Compare    │
   └─────────────────┘   └───────────────┘
```

### Gulf of Execution
"How do I make this happen?"
- Can the user figure out what to do? (Discoverability)
- Can they figure out how to do it? (Signifiers, Constraints)

### Gulf of Evaluation
"Did it work? What happened?"
- Can the user see the current state? (Feedback)
- Can they interpret what they see? (Conceptual Model)
- Does the result match their goal? (Understanding)

**Design goal**: Minimize both gulfs. Make actions obvious (close the execution gulf) and make results visible (close the evaluation gulf).

---

## Human Error: It's Always Bad Design

> "Human Error? No, Bad Design."

### Two Types of Errors

| Type | Definition | Example |
|:---|:---|:---|
| **Slips** | Right intention, wrong action | Clicking the wrong button, typo |
| **Mistakes** | Wrong intention, correctly executed | Using the wrong feature because you misunderstand the system |

### Slip Sub-Types
- **Action-based**: Performing the wrong action (clicking Delete instead of Edit)
- **Memory-lapse**: Forgetting a step in a sequence

### Mistake Sub-Types
- **Rule-based**: Applying the wrong rule ("I always click the first option")
- **Knowledge-based**: Lacking the knowledge needed to make the right decision
- **Memory-lapse**: Forgetting the goal or plan

### Design Against Errors
1. **Add constraints**: Make it impossible to do the wrong thing
2. **Add undo**: Let users reverse mistakes easily
3. **Add confirmation**: For destructive actions, require explicit confirmation
4. **Make actions reversible**: "Move to Trash" instead of "Delete Permanently"
5. **Improve discoverability**: If users are making mistakes, the signifiers are insufficient
6. **Use sensible defaults**: Pre-fill forms with the most common values

---

## Summary: The Norman Checklist

When designing or reviewing ANY interface element, ask:

- [ ] **Affordance**: Does it look like what it does? (Button looks pressable, link looks clickable)
- [ ] **Signifier**: Is there a visible indicator of how to use it? (Icon, label, cursor change)
- [ ] **Constraint**: Does it prevent invalid actions? (Disabled states, validated inputs)
- [ ] **Mapping**: Is the control near what it affects? Does the layout match the mental model?
- [ ] **Feedback**: Does it respond immediately and informatively to user actions?
- [ ] **Conceptual Model**: Does the interface communicate how the system works?
- [ ] **Error Prevention**: Are slips and mistakes anticipated and handled gracefully?
