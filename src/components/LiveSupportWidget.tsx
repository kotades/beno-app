'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { subscribeToConversation, conversationId, ConversationMessage } from '@/lib/firestoreSync';
import { createMessage, isParticipant } from '@/lib/chatStore';

const ADMIN_EMAIL = 'beno@admin.com';

interface LiveSupportWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveSupportWidget({ isOpen, onClose }: LiveSupportWidgetProps) {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const myEmail = user?.email?.toLowerCase() ?? '';
  const convId = myEmail ? conversationId(myEmail, ADMIN_EMAIL) : null;

  useEffect(() => {
    if (!isOpen || !convId) {
      setMessages([]);
      return;
    }
    const unsub = subscribeToConversation(convId, setMessages);
    return unsub;
  }, [isOpen, convId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !myEmail || !convId) return;
    createMessage(myEmail, user?.displayName || myEmail.split('@')[0], ADMIN_EMAIL, text);
    setInputText('');
  };

  const myMsgs = messages.filter((m) => isParticipant(m, myEmail));

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-[min(520px,calc(100dvh-8rem))]">

      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-teal-950 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-black text-sm">B</div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal-400 border-2 border-gray-900 rounded-full" />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-snug">BENO Concierge</h4>
            <span className="text-[10px] text-teal-300 font-semibold block">VIP Support • Online</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/chat"
            onClick={onClose}
            className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-bold px-2.5 py-1 rounded-full transition-all border border-white/20"
            title="Open Fullscreen Messaging"
          >
            Full Desk ↗
          </Link>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-lg font-bold p-1">
            ✕
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#008B9B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !user ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="text-4xl">💬</div>
          <h4 className="text-sm font-bold text-gray-900">Chat with BENO</h4>
          <p className="text-xs text-gray-500">Sign in to message our concierge team.</p>
          <Link
            href="/login"
            onClick={onClose}
            className="bg-[#008B9B] hover:bg-[#007684] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <>
          {/* MESSAGES FEED */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
            {myMsgs.length === 0 && (
              <div className="text-center text-xs text-gray-400 pt-6">Message our concierge — we reply fast.</div>
            )}
            {myMsgs.map((msg) => {
              const isMine = msg.senderEmail === myEmail;
              return (
                <div key={msg.id} className={`flex items-end space-x-2 ${isMine ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  {!isMine && (
                    <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-600 flex items-center justify-center font-black text-[10px] flex-shrink-0">B</div>
                  )}
                  <div className={`max-w-[80%] space-y-1 ${isMine ? 'text-right' : 'text-left'}`}>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMine
                        ? 'bg-[#008B9B] text-white rounded-br-none shadow-sm'
                        : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'
                    }`}>
                      {msg.body}
                    </div>
                    <span className="text-[9px] text-gray-400 font-semibold block px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* COMPOSER INPUT */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask BENO VIP Concierge..."
              className="flex-1 bg-white border border-teal-600 rounded-xl px-3 py-2.5 text-xs text-gray-900 placeholder:text-gray-500 font-semibold focus:outline-none focus:ring-2 focus:ring-[#008B9B]"
            />
            <button
              onClick={handleSend}
              className="bg-[#008B9B] hover:bg-[#007684] text-white p-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
