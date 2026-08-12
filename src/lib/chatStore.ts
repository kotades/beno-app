import { conversationId, syncMessageToFirestore, ConversationMessage } from '@/lib/firestoreSync';

// One-way messaging: user picks a recipient (username/email), gets a private
// 1:1 thread. Messages persist to Firestore under conversation_messages.

export function createMessage(senderEmail: string, senderName: string, recipientEmail: string, body: string): ConversationMessage {
  const msg: ConversationMessage = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    conversationId: conversationId(senderEmail, recipientEmail),
    senderEmail: senderEmail.toLowerCase(),
    senderName,
    body,
    createdAt: new Date().toISOString(),
    read: false
  };
  syncMessageToFirestore(msg); // fire-and-forget
  return msg;
}

export function isParticipant(msg: ConversationMessage, email: string): boolean {
  const e = email.toLowerCase();
  const [a, b] = msg.conversationId.split('__');
  return a === e || b === e;
}
