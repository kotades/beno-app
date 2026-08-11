'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { 
  getMessagesForChannel, 
  sendUserMessage, 
  SUPPORT_CHANNELS, 
  ChatMessage 
} from '@/lib/supportChatStore';

export default function SupportChatPage() {
  const [activeChannelId, setActiveChannelId] = useState('channel-vip');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const activeChannel = SUPPORT_CHANNELS.find(c => c.id === activeChannelId) || SUPPORT_CHANNELS[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setMessages(getMessagesForChannel(activeChannelId));
  }, [activeChannelId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() && !imagePreview) return;

    sendUserMessage(activeChannelId, text, imagePreview || undefined);
    setMessages(getMessagesForChannel(activeChannelId));
    setInputText('');
    setImagePreview(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-24">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-16">
        
        {/* MESSENGER CONTAINER */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[750px]">
          
          {/* SIDEBAR: CHANNEL & AGENT LIST (4 COLS) */}
          <div className="lg:col-span-4 border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-5 border-b border-gray-100 bg-white">
              <span className="text-[10px] font-bold text-[#008B9B] uppercase tracking-wider block mb-1">
                BENO Realtime Support Hub
              </span>
              <h2 className="text-xl font-black text-gray-900">VIP Concierge Desk</h2>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {SUPPORT_CHANNELS.map((ch) => {
                const isActive = ch.id === activeChannelId;
                return (
                  <div
                    key={ch.id}
                    onClick={() => setActiveChannelId(ch.id)}
                    className={`p-4 flex items-center space-x-4 cursor-pointer transition-all ${
                      isActive ? 'bg-white shadow-sm border-l-4 border-[#008B9B]' : 'hover:bg-gray-100/60'
                    }`}
                  >
                    <div className="relative">
                      <img 
                        src={ch.agent.avatar} 
                        alt={ch.agent.name} 
                        className="w-12 h-12 rounded-full object-cover border border-gray-200" 
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-teal-400 border-2 border-white rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{ch.agent.name}</h4>
                        <span className="text-[10px] text-gray-400">{ch.lastMessageTime}</span>
                      </div>
                      <span className="text-[11px] text-[#008B9B] font-bold block mb-1">{ch.name}</span>
                      <p className="text-xs text-gray-500 truncate">{ch.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAIN CHAT AREA (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col bg-white">
            
            {/* CHAT HEADER BAR */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={activeChannel.agent.avatar} 
                    alt={activeChannel.agent.name} 
                    className="w-11 h-11 rounded-full object-cover border border-teal-500" 
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal-400 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">{activeChannel.agent.name}</h3>
                  <span className="text-xs text-teal-600 font-semibold">{activeChannel.agent.role} • Active Online</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="bg-teal-50 text-[#008B9B] text-xs font-bold px-3.5 py-1.5 rounded-full border border-teal-200">
                  🟢 24/7 VIP Concierge Live
                </span>
              </div>
            </div>

            {/* MESSAGE STREAM */}
            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/40">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div 
                    key={msg.id}
                    className={`flex items-end space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                  >
                    {!isUser && (
                      <img 
                        src={msg.senderAvatar} 
                        alt={msg.senderName} 
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0" 
                      />
                    )}

                    <div className={`max-w-[70%] space-y-1 ${isUser ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-baseline space-x-2 px-1">
                        <span className="text-[10px] font-bold text-gray-400">{msg.senderName}</span>
                        <span className="text-[9px] text-gray-400">{msg.createdAt}</span>
                      </div>

                      <div 
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-[#008B9B] text-white rounded-br-none shadow-sm font-medium'
                            : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none font-medium'
                        }`}
                      >
                        {msg.image && (
                          <img src={msg.image} alt="Attachment" className="w-full max-h-60 object-cover rounded-xl mb-2" />
                        )}
                        <span>{msg.body}</span>
                      </div>

                      {!isUser && (
                        <span className="text-[9px] text-teal-600 font-bold block px-1">✓ Seen</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* IMAGE PREVIEW */}
            {imagePreview && (
              <div className="px-6 py-2 bg-gray-100 flex items-center justify-between border-t border-gray-200">
                <span className="text-xs text-gray-700 font-bold">Attachment attached to message</span>
                <button onClick={() => setImagePreview(null)} className="text-xs text-red-600 font-bold">Remove Attachment</button>
              </div>
            )}

            {/* COMPOSER BAR */}
            <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
              <label className="p-2 text-gray-400 hover:text-gray-700 cursor-pointer text-lg">
                📎
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Message ${activeChannel.agent.name}...`}
                className="flex-1 bg-white border border-teal-600 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-500 font-semibold focus:outline-none focus:ring-2 focus:ring-[#008B9B]"
              />

              <button 
                onClick={() => handleSend()}
                className="bg-[#008B9B] hover:bg-[#007684] text-white px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                Send Message
              </button>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
