# Email Provider Switch + Admin Promotion Visibility Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Gmail SMTP with Brevo for reliable email delivery on Vercel, and make admin promotion instantly visible to promoted users via route-change refresh.

**Architecture:** 
- Brevo REST API replaces Gmail SMTP + Resend in booking confirmation route
- Header route-change effect calls AuthContext.refreshAdminState() to re-read localStorage role on every navigation
- BroadcastChannel added for same-browser instant sync (bonus)

**Tech Stack:** Next.js 16 App Router, Brevo API, Firebase Auth, localStorage, BroadcastChannel API

## Global Constraints

- No new dependencies unless absolutely necessary (Brevo uses native fetch)
- All code changes must pass `yarn build` before commit
- Follow existing patterns: API routes in `src/app/api/`, libs in `src/lib/`, context in `src/context/`
- Regular admin permissions already enforced in admin dashboard — no changes needed there
- Vercel environment variables: add `BREVO_API_KEY`

---

### Task 1: Create Brevo Email Library

**Files:**
- Create: `src/lib/brevo.ts`

**Interfaces:**
- Produces: `sendViaBrevo(to: string, subject: string, html: string): Promise<void>`

- [ ] **Step 1: Write the failing test** (manual verification)
  - Create a test script or use existing API test route to verify Brevo sends
  - Expected: Without BREVO_API_KEY, throws "BREVO_API_KEY not configured"
  - Expected: With valid key, returns 200 from Brevo API

- [ ] **Step 2: Implement brevo.ts**
```typescript
// src/lib/brevo.ts
export async function sendViaBrevo(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY not configured');
  
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'BENO Concierge', email: 'noreply@beno.app' },
      to: [{ email: to }],
      subject,
      htmlContent: html
    })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Brevo failed (${res.status}): ${errorText}`);
  }
}
```

- [ ] **Step 3: Verify implementation compiles**
  Run: `yarn build`
  Expected: No TypeScript errors

- [ ] **Step 4: Commit**
```bash
git add src/lib/brevo.ts
git commit -m "feat: add Brevo email library"
```

---

### Task 2: Update Booking Confirmation Route to Use Brevo

**Files:**
- Modify: `src/app/api/booking/confirm/route.ts`

**Interfaces:**
- Consumes: `sendViaBrevo` from `src/lib/brevo.ts`
- Produces: Same Response interface (ok, channel, error)

- [ ] **Step 1: Write the failing test** (manual)
  - Call POST /api/booking/confirm with valid booking payload
  - Expected: Returns `{ ok: true, channel: 'brevo' }` on success
  - Expected: Returns `{ ok: false, error: ... }` on failure

- [ ] **Step 2: Update route.ts**
  - Replace Resend import and sendViaResend with Brevo import and sendViaBrevo
  - Keep Gmail as optional last-resort fallback (or remove entirely per design)
  - Update response channel from 'resend' to 'brevo'

```typescript
// src/app/api/booking/confirm/route.ts
import { NextRequest } from 'next/server';
import { sendViaBrevo } from '@/lib/brevo';
import { sendViaGmail } from '@/lib/smtp';  // Keep for fallback or remove

// ... existing buildHtml function unchanged ...

export async function POST(request: NextRequest) {
  // ... existing body parsing and validation ...
  
  const html = buildHtml(body);
  const subject = `Booking Confirmed — ${body.id} · ${body.serviceName}`;

  // Brevo first — reliable from Vercel
  try {
    await sendViaBrevo(body.guestEmail, subject, html);
    return Response.json({ ok: true, channel: 'brevo' });
  } catch (e) {
    console.error('Brevo failed:', (e as Error).message);
  }

  // Optional: Gmail fallback (comment out if not needed)
  for (const sender of gmailSenders()) {
    try {
      await sendViaGmail({
        fromName: 'BENO Concierge',
        fromEmail: sender.user,
        to: body.guestEmail,
        subject,
        html,
        user: sender.user,
        appPassword: sender.appPassword
      });
      return Response.json({ ok: true, channel: 'gmail', from: sender.user });
    } catch (e) {
      console.error(`Gmail send failed (${sender.user}):`, (e as Error).message);
    }
  }

  return Response.json({ ok: false, error: 'All email channels failed' }, { status: 500 });
}
```

- [ ] **Step 3: Verify build passes**
  Run: `yarn build`
  Expected: No errors

- [ ] **Step 4: Test locally** (if BREVO_API_KEY in .env.local)
  - Trigger booking confirmation
  - Verify email received

- [ ] **Step 5: Commit**
```bash
git add src/app/api/booking/confirm/route.ts
git commit -m "feat: switch booking confirmation email to Brevo"
```

---

### Task 3: Add BREVO_API_KEY to Vercel Environment

**Files:**
- None (Vercel dashboard / CLI)

**Interfaces:**
- N/A

- [ ] **Step 1: Get Brevo API key**
  - Sign up at brevo.com → SMTP & API → API Keys → Create new key
  - Copy the key (starts with `xkeysib-`)

- [ ] **Step 2: Add to Vercel**
  ```bash
  vercel env add BREVO_API_KEY production
  # Paste the key when prompted
  ```
  Or via Vercel Dashboard → Settings → Environment Variables

- [ ] **Step 3: Redeploy**
  ```bash
  vercel --prod
  ```
  Or push to main (auto-deploy)

- [ ] **Step 4: Verify production**
  - Test booking confirmation on production
  - Check Vercel function logs for "Brevo" channel

- [ ] **Step 5: Commit** (no code change, but note in commit)
```bash
git commit --allow-empty -m "chore: add BREVO_API_KEY to Vercel production env"
```

---

### Task 4: Export refreshAdminState from AuthContext

**Files:**
- Modify: `src/context/AuthContext.tsx`

**Interfaces:**
- Produces: `refreshAdminState: () => void` added to AuthContextType and Provider value

- [ ] **Step 1: Write the failing test** (manual)
  - In browser console: `useAuth().refreshAdminState()` should be callable
  - Expected: Function exists and re-evaluates isAdmin from localStorage

- [ ] **Step 2: Update AuthContext.tsx**
  - Add `refreshAdminState: () => void` to AuthContextType interface
  - In Provider, add `refreshAdminState` to context value that calls the internal function with current user email

```typescript
// In AuthContextType interface (line 20-30):
refreshAdminState: () => void;

// In Provider return value (line 132-146):
return (
  <AuthContext.Provider value={{ 
    user, 
    loading, 
    isAdmin, 
    userRole, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    logout, 
    uploadAvatar,
    refreshAdminState: () => refreshAdminState(user?.email)  // ADD THIS
  }}>
    {children}
  </AuthContext.Provider>
);
```

- [ ] **Step 3: Verify build passes**
  Run: `yarn build`

- [ ] **Step 4: Commit**
```bash
git add src/context/AuthContext.tsx
git commit -m "feat: expose refreshAdminState from AuthContext for route-change refresh"
```

---

### Task 5: Call refreshAdminState on Route Change in Header

**Files:**
- Modify: `src/components/Header.tsx`

**Interfaces:**
- Consumes: `refreshAdminState` from `useAuth()`
- Produces: Header re-evaluates admin state on every navigation

- [ ] **Step 1: Write the failing test** (manual)
  - Log in as regular user
  - In another tab, promote user to admin via admin dashboard
  - Click any nav link in user's tab
  - Expected: Concierge Dashboard link appears in hamburger menu

- [ ] **Step 2: Update Header.tsx**
  - Import `refreshAdminState` from useAuth
  - Add call to `refreshAdminState()` in existing route-change effect

```typescript
// Line 27: destructure refreshAdminState
const { user, isAdmin, logout, refreshAdminState } = useAuth();

// Lines 65-67: update route-change effect
useEffect(() => {
  setIsMenuOpen(false);
  refreshAdminState();  // ADD THIS - re-evaluate admin status on navigation
}, [refreshAdminState]);
```

- [ ] **Step 3: Verify build passes**
  Run: `yarn build`

- [ ] **Step 4: Test manually**
  1. Open two browsers (or incognito + normal)
  2. Browser A: Super admin → promote User B to admin
  3. Browser B: User B → click any nav link (Home, Profile, etc.)
  4. Verify: Concierge Dashboard link appears in hamburger menu
  5. Verify: User B can access `/admin/dashboard` and sees regular admin view

- [ ] **Step 5: Commit**
```bash
git add src/components/Header.tsx
git commit -m "feat: refresh admin state on route change for instant promotion visibility"
```

---

### Task 6: (Bonus) Add BroadcastChannel for Same-Browser Instant Sync

**Files:**
- Modify: `src/context/AuthContext.tsx`
- Modify: `src/lib/userManagementStore.ts`

**Interfaces:**
- Produces: Cross-tab instant admin state refresh without navigation

- [ ] **Step 1: Write the failing test** (manual)
  - Open two tabs as same user
  - In tab A (super admin): promote user in tab B
  - Tab B: without navigation, admin link should appear (or after brief delay)

- [ ] **Step 2: Add BroadcastChannel to AuthContext**
  - In AuthProvider, create BroadcastChannel on mount
  - Listen for 'refresh-admin' messages
  - Call `refreshAdminState()` on message

```typescript
// In AuthProvider, add after line 92:
useEffect(() => {
  const channel = new BroadcastChannel('beno-auth');
  const handleMessage = (e: MessageEvent) => {
    if (e.data?.type === 'refresh-admin' && user?.email) {
      refreshAdminState(user.email);
    }
  };
  channel.addEventListener('message', handleMessage);
  return () => channel.close();
}, [user?.email]);

// Export a function to broadcast
const broadcastRefresh = () => {
  if (typeof window !== 'undefined') {
    new BroadcastChannel('beno-auth').postMessage({ type: 'refresh-admin' });
  }
};
// Add to context value: broadcastRefresh
```

- [ ] **Step 3: Call broadcast in userManagementStore**
  - In `notifyUsersChanged()`, also call broadcast

```typescript
// In userManagementStore.ts, update notifyUsersChanged():
function notifyUsersChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('beno-users-changed'));
    // Add broadcast for same-browser instant sync
    new BroadcastChannel('beno-auth').postMessage({ type: 'refresh-admin' });
  }
}
```

- [ ] **Step 4: Verify build passes**
  Run: `yarn build`

- [ ] **Step 5: Test manually**
  - Two tabs, same user
  - Promote in one tab → other tab updates instantly (may need small interaction)

- [ ] **Step 6: Commit**
```bash
git add src/context/AuthContext.tsx src/lib/userManagementStore.ts
git commit -m "feat: add BroadcastChannel for instant cross-tab admin state sync"
```

---

### Task 7: Verify Regular Admin Permissions (No Code Changes)

**Files:**
- Verify: `src/app/admin/dashboard/page.tsx`

**Interfaces:**
- N/A

- [ ] **Step 1: Manual verification**
  1. Log in as promoted admin (not beno@admin.com)
  2. Go to `/admin/dashboard`
  3. Verify "Users & Permissions Control Hub" shows "Read only" in Actions column
  4. Verify no "Make Admin", "Demote", "Delete", or VIP dropdown for any user
  5. Verify beno@admin.com not in user list
  6. Verify chat tab works: can see conversations, reply, delete
  7. Verify bookings tab works: can see all bookings, change status, delete

- [ ] **Step 2: If any permission gaps found, create follow-up task**
  - Expected: Current implementation already correct (lines 70-71, 538, 589-618 in page.tsx)

---

### Task 8: End-to-End Integration Test

**Files:**
- None (manual testing)

**Interfaces:**
- Full flow test

- [ ] **Step 1: Test email flow**
  1. Make a booking on production
  2. Check Vercel logs: `vercel logs <deployment-url> --level info`
  3. Verify "Brevo" channel in response
  4. Verify email received at guest email

- [ ] **Step 2: Test admin promotion flow**
  1. Super admin promotes User X to admin
  2. User X navigates (clicks logo, any link)
  3. Verify Concierge Dashboard appears in Header hamburger
  4. User X accesses `/admin/dashboard`
  4. Verify regular admin view (chat + bookings, no user management)

- [ ] **Step 3: Build and deploy**
  ```bash
  yarn build
  git push origin main
  # or
  vercel --prod
  ```

- [ ] **Step 4: Commit final**
```bash
git add -A
git commit -m "feat: complete email switch to Brevo + admin promotion visibility fix"
```

---

## Self-Review Checklist

- [ ] Spec coverage: All requirements from design doc have tasks
  - Email: Tasks 1-3 ✓
  - Admin promotion visibility: Tasks 4-6 ✓
  - Regular admin permissions: Task 7 ✓
- [ ] No placeholders: All steps have actual code/content
- [ ] Type consistency: `refreshAdminState` signature matches across AuthContext and Header
- [ ] Build passes at each step
- [ ] Dependencies ordered correctly: Brevo lib → route → env → AuthContext export → Header consumption

## Execution Choice

**Plan complete and saved to `docs/superpowers/plans/2026-08-12-email-admin-fixes.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**