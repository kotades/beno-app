'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  getMessagesForChannel, 
  sendUserMessage, 
  SUPPORT_CHANNELS, 
  ChatMessage 
} from '@/lib/supportChatStore';

interface LiveSupportWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveSupportWidget({ isOpen, onClose }: LiveSupportWidgetProps) {
  const [activeChannelId, setActiveChannelId] = useState('channel-vip');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = SUPPORT_CHANNELS.find(c => c.id === activeChannelId) || SUPPORT_CHANNELS[0];

  useEffect(() => {
    if (isOpen) {
      setMessages(getMessagesForChannel(activeChannelId));
    }
  }, [isOpen, activeChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() && !imagePreview) return;

    sendUserMessage(activeChannelId, text, imagePreview || undefined);
    setMessages(getMessagesForChannel(activeChannelId));
    setInputText('');
    setImagePreview(null);
  };

  const handleQuickChip = (query: string) => {
    handleSend(query);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-[520px]">
      
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-teal-950 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={activeChannel.agent.avatar} 
              alt={activeChannel.agent.name}
              className="w-10 h-10 rounded-full object-cover border border-teal-400"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal-400 border-2 border-gray-900 rounded-full" />
          </div>

          <div>
            <h4 className="font-bold text-sm leading-snug">{activeChannel.agent.name}</h4>
            <span className="text-[10px] text-teal-300 font-semibold block">{activeChannel.agent.role} • Online</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link 
            href="/chat"
            onClick={onClose}
            className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-bold px-2.5 py-1 rounded-full transition-all border border-white/20"
            title="Open Fullscreen Support Desk"
          >
            Full Desk ↗
          </Link>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>
      </div>

      {/* CHANNEL SELECTOR PILLS */}
      <div className="flex space-x-1.5 p-2 bg-gray-50 border-b border-gray-100 overflow-x-auto scrollbar-hide text-[11px] font-bold">
        {SUPPORT_CHANNELS.map(ch => (
          <button
            key={ch.id}
            onClick={() => setActiveChannelId(ch.id)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              activeChannelId === ch.id
                ? 'bg-[#008B9B] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {ch.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* MESSAGES FEED */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
        
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id}
              className={`flex items-end space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
            >
              {!isUser && (
                <img 
                  src={msg.senderAvatar} 
                  alt={msg.senderName} 
                  className="w-7 h-7 rounded-full object-cover border border-gray-200 flex-shrink-0" 
                />
              )}

              <div className={`max-w-[80%] space-y-1 ${isUser ? 'text-right' : 'text-left'}`}>
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#008B9B] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Attachment" className="w-full h-32 object-cover rounded-xl mb-2" />
                  )}
                  <span>{msg.body}</span>
                </div>
                <span className="text-[9px] text-gray-400 font-semibold block px-1">{msg.createdAt}</span>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* QUICK INQUIRY CHIPS */}
      <div className="px-3 py-1.5 bg-white border-t border-gray-100 flex items-center space-x-1.5 overflow-x-auto scrollbar-hide">
        {[
          '🛥️ Yacht Charter',
          '🏎️ Supercar Rates',
          '✈️ Jet Quote',
          '🏎️ Supercar Rally'
        ].map((chip) => (
          <button
            key={chip}
            onClick={() => handleQuickChip(chip)}
            className="text-[10px] bg-gray-100 hover:bg-[#008B9B] hover:text-white text-gray-700 font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* IMAGE PREVIEW BAR */}
      {imagePreview && (
        <div className="p-2 bg-gray-100 flex items-center justify-between border-t border-gray-200">
          <span className="text-xs text-gray-600 font-bold">Image attached</span>
          <button onClick={() => setImagePreview(null)} className="text-xs text-red-500 font-bold">Remove</button>
        </div>
      )}

      {/* COMPOSER INPUT */}
      <div className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
        <label className="text-gray-400 hover:text-gray-700 cursor-pointer p-1.5">
          📷
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask BENO VIP Concierge..."
          className="flex-1 bg-white border border-teal-600 rounded-xl px-3 py-2.5 text-xs text-gray-900 placeholder:text-gray-500 font-semibold focus:outline-none focus:ring-2 focus:ring-[#008B9B]"
        />

        <button 
          onClick={() => handleSend()}
          className="bg-[#008B9B] hover:bg-[#007684] text-white p-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
        >
          Send
        </button>
      </div>

    </div>
  );
}
