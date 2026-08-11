# State Location Decision Tree

**When to use:** Every time you add state to a component. Ask: "Where does this state belong?"

## Hierarchy (Simplest → Most Complex)

### 1. Local State (`useState`)
- **Use for**: Component-only data (form inputs, toggles, open/close).
- **Signal**: No other component needs this value.

### 2. Prop Drilling (Parent → Child)
- **Use for**: Passing data 2-3 levels deep.
- **Signal**: Only a linear chain of components needs the value.
- **Limit**: Stop at 3 levels. Beyond that, use Context.

### 3. React Context (`useContext`)
- **Use for**: Medium apps, 5+ levels deep, **infrequent** updates (theme, locale, auth).
- **Signal**: Many components need the value, but it changes rarely.
- **Warning**: Context causes **all consumers** to re-render on change. Never use for frequently updating values.

### 4. Lightweight Store (Zustand / Jotai)
- **Use for**: Frequent updates, cross-cutting concerns (cart, notifications, real-time data).
- **Signal**: Context re-renders are causing performance issues.
- **Advantage**: Granular subscriptions — only components using the specific slice re-render.

### 5. Redux Toolkit
- **Use for**: Complex state with undo/redo, time-travel debugging, or highly structured data flows.
- **Signal**: You need middleware, devtools, or state history.
- **Warning**: Overkill for most applications. Default to Zustand first.

## When to Move Up the Chain
| Symptom | Action |
|:---|:---|
| Prop drilling > 3 levels | → Add Context |
| Context re-rendering too often | → Move to Zustand |
| Zustand becomes messy with too many stores | → Consider Redux Toolkit |
| Need offline support / persistence | → Add `zustand/middleware` with `persist` |

## Anti-Patterns to Avoid
- **Global state for everything**: Makes debugging impossible. Keep state as local as possible.
- **Context for frequent updates**: Causes cascade re-renders across the entire tree.
- **Redux for simple form state**: Massive overhead for no benefit.
- **Derived state in stores**: If a value can be computed from other state, compute it — don't store it.
