export type UserRole = 'user' | 'admin';

export type VIPTier = 'Silver' | 'Gold' | 'Platinum' | 'Black Diamond';

export interface UserProfileDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  role: UserRole;
  vipTier: VIPTier;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDocument {
  id: string;
  userId?: string;
  serviceId: string;
  serviceName: string;
  category: 'Yacht' | 'Car' | 'Helicopter' | 'Buggy' | 'Water Sports' | 'Private Jet' | 'Supercar Rally';
  providerId: string;
  startDate: string;
  startTime: string;
  duration: string;
  totalPrice: number;
  currency: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  status: 'Confirmed' | 'Pending Deposit' | 'Completed' | 'Cancelled';
  createdAt: string;
  notes?: string;
  addOns?: string[];
  image?: string;
}

export interface ChatMessageDocument {
  id: string;
  channelId: string;
  sender: 'user' | 'agent';
  senderName: string;
  senderAvatar: string;
  body: string;
  image?: string;
  createdAt: string;
  isSeen: boolean;
}

export interface BlockedSlotDocument {
  id: string;
  serviceId: string;
  providerId: string;
  date: string;
  slotTime: string;
  reason: string;
  createdAt: string;
}
