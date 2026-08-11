export type UserRole = 'user' | 'admin';
export type VIPTier = 'Silver' | 'Gold' | 'Platinum' | 'Black Diamond';

export interface ManagedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  vipTier: VIPTier;
  photoURL?: string;
  createdAt: string;
}

const LOCAL_USERS_KEY = 'beno_managed_users';

const INITIAL_SEED_USERS: ManagedUser[] = [];

export function getManagedUsers(): ManagedUser[] {
  if (typeof window === 'undefined') return INITIAL_SEED_USERS;
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(INITIAL_SEED_USERS));
      return INITIAL_SEED_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SEED_USERS;
  }
}

export function toggleUserAdminRole(userId: string): ManagedUser[] {
  const current = getManagedUsers();
  const updated = current.map(u => {
    if (u.id === userId) {
      const newRole: UserRole = u.role === 'admin' ? 'user' : 'admin';
      return { ...u, role: newRole };
    }
    return u;
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteUserAccount(userId: string): ManagedUser[] {
  const current = getManagedUsers();
  const updated = current.filter(u => u.id !== userId);

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function updateUserVIPTier(userId: string, newTier: VIPTier): ManagedUser[] {
  const current = getManagedUsers();
  const updated = current.map(u => u.id === userId ? { ...u, vipTier: newTier } : u);

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function registerOrUpdateUser(email: string, name?: string, role: UserRole = 'user'): ManagedUser {
  const current = getManagedUsers();
  const existing = current.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    if (email.toLowerCase() === 'beno@admin.com') {
      existing.role = 'admin';
    }
    return existing;
  }

  const newUser: ManagedUser = {
    id: `usr-${Date.now()}`,
    email,
    name: name || email.split('@')[0],
    role: email.toLowerCase() === 'beno@admin.com' ? 'admin' : role,
    vipTier: email.toLowerCase() === 'beno@admin.com' ? 'Black Diamond' : 'Silver',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [...current, newUser];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
  }
  return newUser;
}
