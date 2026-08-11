export interface SupportAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Online' | 'In Call' | 'Away';
}

export interface SupportChannel {
  id: string;
  name: string;
  category: string;
  agent: SupportAgent;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ChatMessage {
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

export const SUPPORT_CHANNELS: SupportChannel[] = [
  {
    id: 'channel-vip',
    name: 'BENO VIP General Concierge',
    category: 'General & Member Services',
    agent: {
      id: 'agent-sarah',
      name: 'Sarah Jenkins',
      role: 'VIP Lead Concierge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'Online'
    },
    lastMessage: 'Live Support Ready',
    lastMessageTime: 'Just now',
    unreadCount: 0
  },
  {
    id: 'channel-marine',
    name: 'Marine & Yacht Operations',
    category: 'Yacht Charter & Watersports',
    agent: {
      id: 'agent-omar',
      name: 'Capt. Omar Al Sayed',
      role: 'Marine Operations Master',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'Online'
    },
    lastMessage: 'Marine Operations Desk Active',
    lastMessageTime: 'Just now',
    unreadCount: 0
  },
  {
    id: 'channel-supercar',
    name: 'Supercar Fleet Desk',
    category: 'Supercars & Hypercars',
    agent: {
      id: 'agent-marcus',
      name: 'Marcus Vance',
      role: 'Supercar Fleet Director',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      status: 'Online'
    },
    lastMessage: 'Supercar Fleet Desk Active',
    lastMessageTime: 'Just now',
    unreadCount: 0
  },
  {
    id: 'channel-aviation',
    name: 'Executive Aviation Desk',
    category: 'Helicopters & Private Jets',
    agent: {
      id: 'agent-david',
      name: 'Capt. David Miller',
      role: 'Flight Dispatch Chief',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      status: 'Online'
    },
    lastMessage: 'Executive Aviation Desk Active',
    lastMessageTime: 'Just now',
    unreadCount: 0
  }
];

const LOCAL_MESSAGES_KEY = 'beno_support_chat_messages';

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'channel-vip': [],
  'channel-marine': [],
  'channel-supercar': [],
  'channel-aviation': []
};

export function getStoredChatMessages(): Record<string, ChatMessage[]> {
  if (typeof window === 'undefined') return INITIAL_MESSAGES;
  try {
    const raw = localStorage.getItem(LOCAL_MESSAGES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_MESSAGES;
  }
}

export function getMessagesForChannel(channelId: string): ChatMessage[] {
  const all = getStoredChatMessages();
  return all[channelId] || [];
}

export function sendUserMessage(channelId: string, body: string, image?: string): { userMsg: ChatMessage; replyMsg?: ChatMessage } {
  const all = getStoredChatMessages();
  const currentList = all[channelId] || [];

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const userMsg: ChatMessage = {
    id: `msg-usr-${Date.now()}`,
    channelId,
    sender: 'user',
    senderName: 'VIP Guest',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    body,
    image,
    createdAt: timeStr,
    isSeen: true
  };

  const updatedList = [...currentList, userMsg];
  all[channelId] = updatedList;

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(all));
  }

  return { userMsg };
}

export function sendAdminAgentReply(channelId: string, body: string, customAgentName?: string): ChatMessage {
  const all = getStoredChatMessages();
  const currentList = all[channelId] || [];

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const channelInfo = SUPPORT_CHANNELS.find(c => c.id === channelId);
  const agent = channelInfo?.agent || SUPPORT_CHANNELS[0].agent;

  const adminMsg: ChatMessage = {
    id: `msg-admin-${Date.now()}`,
    channelId,
    sender: 'agent',
    senderName: customAgentName || agent.name,
    senderAvatar: agent.avatar,
    body,
    createdAt: timeStr,
    isSeen: true
  };

  const updatedList = [...currentList, adminMsg];
  all[channelId] = updatedList;

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(all));
  }

  return adminMsg;
}
