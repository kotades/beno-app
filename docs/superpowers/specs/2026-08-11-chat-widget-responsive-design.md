# Chat Widget Responsive Fix — Design

**Date:** 2026-08-11
**Status:** Approved

## Problem

The floating live-support chat widget (`src/components/LiveSupportWidget.tsx`) is cut off on small screens:

- **Mobile (375px phones):** widget uses fixed `w-80 sm:w-96` (320/384px). 384px + 24px `right-6` offset = 408px > 375px viewport → clipped at the right edge.
- **Laptop (short viewports):** widget uses fixed `h-[520px]` plus `bottom-24` (96px). On a 768px-tall viewport minus browser chrome (~570px usable), 520 + 96 = 616px > usable height → clipped at the top.

## Root Cause

Fixed width and height with **no viewport ceiling**. Tailwind `w-96` means "exactly 384px always"; `h-[520px]` means "exactly 520px always". Neither can shrink to fit.

## Fix

Viewport-capped sizing on the container element — one class-string change, no JS, no new dependencies.

**File:** `src/components/LiveSupportWidget.tsx` line 61.

**Before:**
```tsx
className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-[520px]"
```

**After:**
```tsx
className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-[min(520px,calc(100dvh-8rem))]"
```

### Changes

| Property | Before | After | Why |
|---|---|---|---|
| Width | `w-80 sm:w-96` | `w-[calc(100vw-3rem)] sm:w-96` | Mobile: viewport minus 1.5rem each side. Tablet/desktop (≥640px): unchanged 384px. |
| Height | `h-[520px]` | `h-[min(520px,calc(100dvh-8rem))]` | Full 520px when there's room; otherwise shrinks to viewport minus 8rem (bottom offset + breathing room). `dvh` tracks the mobile browser URL-bar. |

Positioning (`bottom-24 right-6`) unchanged — widget still floats above the launcher button.

### Behavior matrix

| Viewport | Before | After |
|---|---|---|
| ≥640px wide, ≥768px tall (laptop) | 384×520 card | 384×520 card (unchanged) |
| 375px phone (e.g. iPhone SE) | 408px wide → clipped right | 351px wide → fits |
| Short laptop (~570px usable) | 616px tall → clipped top | 474px tall → fits |
| Mobile with URL-bar showing | same clipping | `dvh` adjusts height |

## Out of Scope

- Launcher button (`Header.tsx:303`) — small pill, no overflow, unchanged.
- Full-screen bottom-sheet mobile layout — explicitly rejected (Option A) in favor of "small floating card everywhere" (Option B).
- Chat page (`/chat`), other components — untouched.

## Verification

- `npm run build` passes.
- Manual: toggle widget at 375px and at a short laptop viewport — no horizontal/vertical cutoff; at ≥768px-tall desktop, renders exactly as before.
