# Design: Email Provider Switch + Admin Promotion Visibility Fix

## Overview
Two independent fixes:
1. **Email**: Replace Gmail SMTP + Resend fallback with Brevo (Sendinblue) — free tier, no domain verification needed, works on Vercel
2. **Admin Promotion Visibility**: When super admin promotes a user to admin, that user sees admin capabilities immediately (Concierge Dashboard link in Header) without manual refresh

---

## 1. Email Provider: Brevo (Sendinblue)

### Why Brevo
- **Free tier**: 300 emails/day (9,000/month) — generous for booking confirmations
- **No domain verification required** for testing — uses shared IPs
- **Vercel compatible** — simple REST API, no SMTP/TLS issues
- **Production ready** — can verify domain later for better deliverability

### Implementation
**New file**: `src/lib/brevo.ts`
```typescript
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
  
  if (!res.ok) throw new Error(`Brevo failed (${res.status}): ${await res.text()}`);
}
```

**Update**: `src/app/api/booking/confirm/route.ts`
- Replace Resend → Brevo as primary
- Keep Gmail as last-resort fallback (optional, or remove entirely)
- Same email template (HTML) — no changes needed

**Environment**: Add `BREVO_API_KEY` to Vercel project settings

---

## 2. Admin Promotion Visibility Fix

### Root Cause Analysis
Current reactivity chain:
1. Super admin clicks "Make Admin" → `toggleUserAdminRole()` → localStorage + `beno-users-changed` event
2. **Same window**: `beno-users-changed` fires → `refreshAdminState()` runs ✓
3. **Other tabs**: `storage` event fires → `refreshAdminState()` runs ✓
4. **Other browsers/devices**: **NO EVENT FIRES** → User B never knows ✗

### Solution: Route-Change Refresh + BroadcastChannel

**Minimal, zero-polling approach:**

1. **Header.tsx** already has route-change effect (line 65-67):
   ```typescript
   useEffect(() => { setIsMenuOpen(false); }, []);
   ```
   → Add `refreshAdminState()` call here. Every navigation triggers re-check.

2. **AuthContext.tsx**: Export `refreshAdminState` for Header to call, or add a context method.

3. **BroadcastChannel** for same-browser instant sync (bonus, not required):
   ```typescript
   const channel = new BroadcastChannel('beno-auth');
   channel.postMessage({ type: 'refresh-admin' });
   ```

### Implementation Steps

**AuthContext.tsx** (add export):
```typescript
// Add to context value
refreshAdminState: () => refreshAdminState(user?.email),
```

**Header.tsx** (modify route-change effect):
```typescript
const { refreshAdminState } = useAuth();

useEffect(() => {
  setIsMenuOpen(false);
  refreshAdminState(); // <-- ADD THIS
}, [refreshAdminState]);
```

That's it. User B gets promoted → clicks any link / navigates → Header effect fires → `refreshAdminState()` reads localStorage → `isAdmin` becomes true → Concierge Dashboard link appears.

---

## 3. Regular Admin Permissions (Clarification)

Current code already enforces this in `page.tsx`:
- `isSuperAdmin = user?.email === 'beno@admin.com'`
- User table actions (Make Admin, Delete User, VIP Tier) only render for `isSuperAdmin`
- Regular admins see "Read only" in Actions column

**Capabilities for regular admin:**
- ✅ View all bookings (live Firestore subscription)
- ✅ Change booking status
- ✅ Delete bookings
- ✅ View all conversations
- ✅ Reply to conversations
- ✅ Delete conversations
- ✅ See user list (read-only)
- ❌ Make/Demote admin
- ❌ Delete user accounts
- ❌ Change VIP tiers
- ❌ See beno@admin.com in user list

**No code changes needed** — already implemented correctly.

---

## Acceptance Criteria

### Email
- [ ] Booking confirmation sends via Brevo API
- [ ] No Gmail SMTP timeout errors
- [ ] Works on Vercel production
- [ ] Falls back gracefully if Brevo fails (optional: log error, don't fail booking)

### Admin Promotion Visibility
- [ ] Super admin clicks "Make Admin" on User B
- [ ] User B navigates to any page (or refreshes)
- [ ] Concierge Dashboard link appears in Header hamburger menu
- [ ] User B can access `/admin/dashboard` and sees chat + bookings (regular admin view)
- [ ] User B cannot see user management actions

### Regular Admin Permissions
- [ ] Regular admin cannot see "Make Admin"/"Demote"/"Delete"/VIP dropdown for any user
- [ ] Regular admin sees "Read only" in Actions column
- [ ] beno@admin.com hidden from regular admin user list