'use client';

import { useState, useEffect, useRef } from 'react';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { subscribeToUserConversations, subscribeToConversation, conversationId, ConversationMessage } from '@/lib/firestoreSync';
import { createMessage, isParticipant } from '@/lib/chatStore';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const [threads, setThreads] = useState<ConversationMessage[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [showNew, setShowNew] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const myEmail = user?.email?.toLowerCase() ?? '';

  // List of all threads I'm in
  useEffect(() => {
    if (!myEmail) return;
    const unsub = subscribeToUserConversations(myEmail, setThreads);
    return unsub;
  }, [myEmail]);

  // Live messages for active thread
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    const unsub = subscribeToConversation(activeConvId, setMessages);
    return unsub;
  }, [activeConvId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#008B9B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Sign in to message</h1>
          <p className="text-sm text-gray-500 mb-6">You need an account to start a private conversation.</p>
          <a href="/login" className="inline-block bg-[#008B9B] hover:bg-[#007684] text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all">Sign In</a>
        </div>
      </div>
    );
  }

  // Group threads by conversation id, keep the latest message per thread
  const convMap = new Map<string, ConversationMessage>();
  threads.forEach((m) => {
    const prev = convMap.get(m.conversationId);
    if (!prev || m.createdAt > prev.createdAt) convMap.set(m.conversationId, m);
  });
  const convs = Array.from(convMap.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const openThread = (convId: string) => {
    setActiveConvId(convId);
    setShowNew(false);
  };

  const startNew = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = newRecipient.trim().toLowerCase();
    if (!recipient || !recipient.includes('@')) return;
    const convId = conversationId(myEmail, recipient);
    setActiveConvId(convId);
    setNewRecipient('');
    setShowNew(false);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !activeConvId) return;
    const [a, b] = activeConvId.split('__');
    const recipient = a === myEmail ? b : a;
    createMessage(myEmail, user.displayName || myEmail.split('@')[0], recipient, text);
    setInputText('');
  };

  const otherEmail = activeConvId ? activeConvId.split('__').find((p) => p !== myEmail) || '' : '';
  const activeMsgs = messages.filter((m) => isParticipant(m, myEmail));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-24">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[750px]">
          {/* SIDEBAR: THREADS */}
          <div className="lg:col-span-4 border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-5 border-b border-gray-100 bg-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#008B9B] uppercase tracking-wider block mb-1">
                  BENO Private Messaging
                </span>
                <h2 className="text-xl font-black text-gray-900">Conversations</h2>
              </div>
              <button
                onClick={() => { setShowNew(!showNew); setActiveConvId(null); }}
                className="bg-[#008B9B] hover:bg-[#007684] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
              >
                + New
              </button>
            </div>

            {/* NEW MESSAGE FORM */}
            {showNew && (
              <form onSubmit={startNew} className="p-4 border-b border-gray-100 bg-white space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recipient username or email</label>
                <input
                  type="text"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="guest@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#008B9B]"
                />
                <button type="submit" className="w-full bg-[#008B9B] hover:bg-[#007684] text-white py-2 rounded-xl text-xs font-bold transition-all">
                  Start Conversation
                </button>
              </form>
            )}

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {convs.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-400 font-medium">
                  No conversations yet.<br />Start one by picking a recipient.
                </div>
              )}
              {convs.map((m) => {
                const isActive = m.conversationId === activeConvId;
                const other = m.conversationId.split('__').find((p) => p !== myEmail) || '';
                const time = new Date(m.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                const unread = !m.read && m.senderEmail !== myEmail;
                return (
                  <div
                    key={m.conversationId}
                    onClick={() => openThread(m.conversationId)}
                    className={`p-4 cursor-pointer transition-all ${isActive ? 'bg-white shadow-sm border-l-4 border-[#008B9B]' : 'hover:bg-gray-100/60'}`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{other}</h4>
                      <span className="text-[10px] text-gray-400">{time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate">{m.body}</p>
                      {unread && <span className="w-2 h-2 bg-[#008B9B] rounded-full flex-shrink-0" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAIN CHAT AREA */}
          <div className="lg:col-span-8 flex flex-col bg-white">
            {!activeConvId ? (
              <div className="flex-1 flex items-center justify-center text-center p-8 bg-gray-50/40">
                <div>
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Select a conversation</h3>
                  <p className="text-xs text-gray-500">Pick a thread or start a new private message.</p>
                </div>
              </div>
            ) : (
              <>
                {/* CHAT HEADER */}
                <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#E0F7FC] text-[#008B9B] flex items-center justify-center font-black">
                      {(otherEmail.charAt(0) || '?').toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900">{otherEmail}</h3>
                      <span className="text-xs text-teal-600 font-semibold">Private conversation</span>
                    </div>
                  </div>
                </div>

                {/* MESSAGE STREAM */}
                <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/40">
                  {activeMsgs.length === 0 && (
                    <div className="text-center text-xs text-gray-400 pt-10">Say hello to start the conversation.</div>
                  )}
                  {activeMsgs.map((msg) => {
                    const isMine = msg.senderEmail === myEmail;
                    return (
                      <div key={msg.id} className={`flex items-end space-x-3 ${isMine ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                        <div className={`max-w-[70%] space-y-1 ${isMine ? 'text-right' : 'text-left'}`}>
                          <div className="flex items-baseline space-x-2 px-1">
                            <span className="text-[10px] font-bold text-gray-400">{msg.senderName}</span>
                            <span className="text-[9px] text-gray-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${isMine ? 'bg-[#008B9B] text-white rounded-br-none shadow-sm font-medium' : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none font-medium'}`}>
                            {msg.body}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* COMPOSER */}
                <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white border border-teal-600 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-500 font-semibold focus:outline-none focus:ring-2 focus:ring-[#008B9B]"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-[#008B9B] hover:bg-[#007684] text-white px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
