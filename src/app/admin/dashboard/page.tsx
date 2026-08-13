'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import AdminGuard from '@/components/AdminGuard';
import {
  BookingRecord
} from '@/lib/bookingEngine';
import {
  subscribeToAllBookings,
  syncBookingStatusToFirestore,
  deleteBooking,
  subscribeToUserConversations,
  subscribeToConversation,
  deleteConversation,
  deleteAllConversations,
  markConversationAsRead,
  ConversationMessage,
  conversationId
} from '@/lib/firestoreSync';
import { createMessage, isParticipant } from '@/lib/chatStore';
import { formatCurrency } from '@/lib/currency';
import { useAuth } from '@/context/AuthContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
  subscribeToAllUsers,
  updateUserRole,
  deleteUserDoc,
  updateUserVIPTier,
  ManagedUser,
  VIPTier
} from '@/lib/userStoreFirestore';

export default function ConciergeDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Custom confirmation dialog state (replaces window.confirm — async, no INP block)
  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    confirmLabel?: string;
    danger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // Lightweight toast for non-blocking success/info messages (replaces window.alert)
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3500);
  };

  const metrics = {
    totalRevenue: bookings
      .filter((b) => b.status === 'Confirmed' || b.status === 'Completed')
      .reduce((acc, b) => acc + (Number(b.totalPrice) || 0), 0),
    confirmedCount: bookings.filter((b) => b.status === 'Confirmed').length,
    pendingCount: bookings.filter((b) => b.status === 'Pending Deposit').length,
    totalBookings: bookings.length
  };

  // Admin Support Desk state
  const ADMIN_EMAIL = 'beno@admin.com';
  // Only the true BENO owner (beno@admin.com) is super admin: can manage users.
  // Regular admins can reply to chats and delete conversations/bookings, but
  // cannot promote/demote/delete other users.
  const isSuperAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;
  const [convThreads, setConvThreads] = useState<ConversationMessage[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [adminMessages, setAdminMessages] = useState<ConversationMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState<string>('');
  const adminMessagesEndRef = useRef<HTMLDivElement>(null);

  
  // All user conversations involving the admin inbox
  useEffect(() => {
    const unsub = subscribeToUserConversations(ADMIN_EMAIL, setConvThreads);
    return unsub;
  }, []);

  // Live messages for the active conversation
  useEffect(() => {
    if (!activeConvId) {
      setAdminMessages([]);
      return;
    }
    const unsub = subscribeToConversation(activeConvId, setAdminMessages);
    return unsub;
  }, [activeConvId]);

  // Live Firestore subscription = single source of truth for bookings (all accounts)
  useEffect(() => {
    const unsub = subscribeToAllBookings(setBookings);
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  useEffect(() => {
    const unsub = subscribeToAllUsers(setManagedUsers);
    return () => unsub();
  }, []);

  useEffect(() => {
    adminMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [adminMessages]);

  const handleStatusChange = (id: string, status: BookingRecord['status']) => {
    syncBookingStatusToFirestore(id, status);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteBooking = (bk: BookingRecord) => {
    setConfirmState({
      title: 'Delete Booking',
      message: `Delete booking ${bk.id} (${bk.guestName})? This cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: async () => {
        setDeletingId(bk.id);
        try {
          await deleteBooking(bk.id);
        } catch (e) {
          console.error('Delete failed:', e);
          showToast('Failed to delete booking. Please try again.');
        } finally {
          setDeletingId(null);
          setConfirmState(null);
        }
      }
    });
  };

  const handleToggleAdminRole = (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'User' : 'Admin';
    setConfirmState({
      title: 'Change User Role',
      message: `Are you sure you want to change user role to ${nextRole}?`,
      confirmLabel: `Make ${nextRole}`,
      onConfirm: async () => {
        await updateUserRole(userId, nextRole.toLowerCase() as 'user' | 'admin');
        setConfirmState(null);
      }
    });
  };

  const handleDeleteUserAccount = (userId: string, userEmail: string) => {
    setConfirmState({
      title: 'Delete User Account',
      message: `Are you sure you want to delete user account (${userEmail})? This action cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: () => {
        deleteUserDoc(userId);
        
        setConfirmState(null);
      }
    });
  };

  const handleVIPChange = (userId: string, tier: VIPTier) => {
    updateUserVIPTier(userId, tier);
    
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    const text = adminReplyText.trim();
    if (!text || !activeConvId) return;
    const [a, b] = activeConvId.split('__');
    const recipient = a === ADMIN_EMAIL ? b : a;
    createMessage(ADMIN_EMAIL, 'BENO Concierge', recipient, text);
    setAdminReplyText('');
  };

  const [deletingConv, setDeletingConv] = useState<string | null>(null);

  const handleDeleteConversation = (convId: string) => {
    const guest = guestEmailOf(convId);
    setConfirmState({
      title: 'Delete Conversation',
      message: `Permanently delete the conversation with ${guest || 'this guest'}? All messages in this thread will be removed and cannot be recovered.`,
      confirmLabel: 'Delete Thread',
      danger: true,
      onConfirm: async () => {
        setDeletingConv(convId);
        try {
          await deleteConversation(convId);
          if (activeConvId === convId) setActiveConvId(null);
          showToast(`Conversation with ${guest} deleted.`);
        } catch (e) {
          console.error('Delete conversation failed:', e);
          showToast('Failed to delete conversation. Please try again.');
        } finally {
          setDeletingConv(null);
          setConfirmState(null);
        }
      }
    });
  };

  const handleDeleteAllConversations = () => {
    const count = convs.length;
    setConfirmState({
      title: 'Delete All Conversations',
      message: `Permanently delete ALL ${count} conversation${count === 1 ? '' : 's'} in the support inbox? This removes every message and cannot be undone.`,
      confirmLabel: 'Delete Everything',
      danger: true,
      onConfirm: async () => {
        setDeletingConv('__all__');
        try {
          await deleteAllConversations();
          setActiveConvId(null);
          showToast('All conversations deleted.');
        } catch (e) {
          console.error('Delete all conversations failed:', e);
          showToast('Failed to delete all conversations. Please try again.');
        } finally {
          setDeletingConv(null);
          setConfirmState(null);
        }
      }
    });
  };

  // Group threads by conversation id, latest message per thread
  const convMap = new Map<string, ConversationMessage>();
  convThreads.forEach((m) => {
    const prev = convMap.get(m.conversationId);
    if (!prev || m.createdAt > prev.createdAt) convMap.set(m.conversationId, m);
  });

  // Compute unread counts per conversation (messages from guest that admin hasn't read)
  const unreadCounts = new Map<string, number>();
  convThreads.forEach((m) => {
    if (m.senderEmail !== ADMIN_EMAIL && !m.read) {
      unreadCounts.set(m.conversationId, (unreadCounts.get(m.conversationId) || 0) + 1);
    }
  });

  const convs = Array.from(convMap.values()).sort((a, b) => {
    // Sort: conversations with unread first, then by latest message time
    const aUnread = unreadCounts.get(a.conversationId) || 0;
    const bUnread = unreadCounts.get(b.conversationId) || 0;
    if (aUnread !== bUnread) return bUnread - aUnread;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const guestEmailOf = (convId: string) => convId.split('__').find((p) => p !== ADMIN_EMAIL) || '';

  // Build user list for sidebar: all managed users (except beno@admin.com for non-super)
  // plus any conversation participants not in managedUsers
  const managedUsersList = managedUsers.filter(u => isSuperAdmin || u.email.toLowerCase() !== ADMIN_EMAIL);
  const convParticipants = new Set(convs.map(m => guestEmailOf(m.conversationId)).filter(Boolean));
  const allUserEmails = new Set([
    ...managedUsersList.map(u => u.email.toLowerCase()),
    ...convParticipants
  ]);
  const activeUserList = Array.from(allUserEmails).map(email => {
    return managedUsersList.find(u => u.email.toLowerCase() === email) || { email, name: email.split('@')[0], role: 'user', vipTier: 'Silver' } as ManagedUser;
  });

  const adminMsgs = adminMessages.filter((m) => isParticipant(m, ADMIN_EMAIL));

  const filteredBookings = activeTab === 'all'
    ? bookings
    : bookings.filter(b => b.status.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
        <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
          
          {/* DASHBOARD TOP BANNER */}
          <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-3">
                Beno Provider Operations Hub
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Service Provider & Concierge Dashboard
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm mt-1">
                Manage incoming luxury reservations, reply to live VIP guest support chats, and block blackout maintenance slots.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {}}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-3 rounded-2xl border border-white/20 transition-all active:scale-95 flex items-center space-x-2"
              >
                <span>🔄 Realtime Active</span>
              </button>
            </div>
          </div>

          {/* METRICS SUMMARY GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Gross Guaranteed Revenue</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-[#008B9B]">{formatCurrency(metrics.totalRevenue)}</span>
                <span className="text-xs text-teal-600 font-bold block mt-1">↑ Active Reservations</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Confirmed Bookings</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-gray-900">{metrics.confirmedCount}</span>
                <span className="text-xs text-gray-500 font-medium block mt-1">Ready for Dispatch</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Pending Deposits</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-amber-500">{metrics.pendingCount}</span>
                <span className="text-xs text-amber-600 font-medium block mt-1">Awaiting Concierge Follow-up</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">All Reservations</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-gray-900">{metrics.totalBookings}</span>
                <span className="text-xs text-gray-500 font-medium block mt-1">Total Booking Entries</span>
              </div>
            </div>

          </div>

          {/* ADMIN LIVE CONCIERGE SUPPORT DESK TERMINAL */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 mb-12 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-black text-[#008B9B] uppercase tracking-wider block mb-1">
                  Realtime Provider Desk
                </span>
                <h2 className="text-2xl font-black text-gray-900">💬 BENO Live Support Terminal</h2>
                <p className="text-xs text-gray-500 mt-0.5">Reply to guest conversations in real-time. Each guest gets a private 1:1 thread.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold px-3.5 py-1.5 rounded-full">
                  {convs.length} Active Conversations
                </span>
                {isSuperAdmin && convs.length > 0 && (
                  <button 
                    onClick={handleDeleteAllConversations}
                    disabled={deletingConv === '__all__'}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all border border-red-100 disabled:opacity-40"
                  >
                    {deletingConv === '__all__' ? 'Deleting…' : '🗑 Delete All'}
                  </button>
                )}
              </div>
            </div>

            {/* CONVERSATION LIST & REPLY TERMINAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[420px]">

              {/* USER LIST & CONVERSATIONS (4 COLS) */}
              <div className="lg:col-span-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-2 py-2">Guests & Conversations</div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-200/60">
                  {allUserEmails.size === 0 && (
                    <div className="p-6 text-center text-xs text-gray-400 font-medium">
                      No guests yet.<br />Users appear here after signing up or messaging.
                    </div>
                  )}
                  {Array.from(allUserEmails).sort().map((guestEmail) => {
                    const convId = conversationId(guestEmail, ADMIN_EMAIL);
                    const convMsg = convMap.get(convId);
                    const isActive = convId === activeConvId;
                    const unread = unreadCounts.get(convId) || 0;
                    const hasConv = !!convMsg;
                    const time = hasConv ? new Date(convMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    const preview = hasConv ? convMsg.body : 'No messages yet — click to start';
                    const managedUser = managedUsersList.find(u => u.email.toLowerCase() === guestEmail);
                    const displayName = managedUser?.name || guestEmail.split('@')[0];

                    return (
                      <div
                        key={convId}
                        onClick={() => {
                          setActiveConvId(convId);
                          markConversationAsRead(convId, ADMIN_EMAIL);
                        }}
                        className={`p-3 cursor-pointer transition-all ${isActive ? 'bg-white shadow-sm border-l-4 border-[#008B9B]' : 'hover:bg-gray-100/70'}`}
                      >
                        <div className="flex items-baseline justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate">{displayName}</h4>
                            <span className="text-[10px] text-gray-400 font-mono truncate">{guestEmail}</span>
                            {unread > 0 && (
                              <span className="flex-shrink-0 bg-[#008B9B] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                {unread}
                              </span>
                            )}
                          </div>
                          {hasConv && (
                            <span className="text-[9px] text-gray-400 flex-shrink-0">{time}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <p className="text-[11px] text-gray-500 truncate">{preview}</p>
                          {hasConv && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConversation(convId);
                              }}
                              disabled={deletingConv === convId}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg transition-all disabled:opacity-40 text-[11px] font-bold flex-shrink-0"
                              title={`Delete conversation with ${guestEmail}`}
                            >
                              {deletingConv === convId ? '…' : '🗑'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MESSAGE FEED & COMPOSER (8 COLS) */}
              <div className="lg:col-span-8 flex flex-col justify-between border border-gray-200 rounded-2xl overflow-hidden bg-white">
                {!activeConvId ? (
                  <div className="flex-1 flex items-center justify-center text-center p-8 bg-gray-50/40">
                    <div>
                      <div className="text-3xl mb-2">💬</div>
                      <h4 className="text-sm font-bold text-gray-800">Select a conversation</h4>
                      <p className="text-[11px] text-gray-500">Choose a guest thread on the left to reply.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* FEED */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-gray-50/50">
                      {adminMsgs.length === 0 && (
                        <div className="text-center text-xs text-gray-400 pt-6">No messages yet in this thread.</div>
                      )}
                      {adminMsgs.map((msg) => {
                        const isAdminAgent = msg.senderEmail === ADMIN_EMAIL;
                        return (
                          <div
                            key={msg.id}
                            className={`flex items-end space-x-2.5 ${isAdminAgent ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                          >
                            <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-600 flex items-center justify-center font-black text-[10px] flex-shrink-0">
                              {(msg.senderName || 'G').charAt(0).toUpperCase()}
                            </div>
                            <div className={`max-w-[75%] space-y-1 ${isAdminAgent ? 'text-right' : 'text-left'}`}>
                              <div className="flex items-baseline space-x-2 px-1">
                                <span className="text-[10px] font-bold text-gray-500">{msg.senderName}</span>
                                <span className="text-[9px] text-gray-400">
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div
                                className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold ${
                                  isAdminAgent
                                    ? 'bg-[#008B9B] text-white rounded-br-none shadow-xs'
                                    : 'bg-white text-gray-900 border border-gray-200 shadow-xs rounded-bl-none'
                                }`}
                              >
                                {msg.body}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={adminMessagesEndRef} />
                    </div>

                    {/* ADMIN COMPOSER */}
                    <form onSubmit={handleSendAdminReply} className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
                      <input
                        type="text"
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        placeholder={`Reply to ${guestEmailOf(activeConvId)}...`}
                        className="flex-1 bg-white border border-teal-600 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-500 font-semibold focus:outline-none focus:ring-2 focus:ring-[#008B9B]"
                      />
                      <button
                        type="submit"
                        className="bg-[#008B9B] hover:bg-[#007684] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
                      >
                        Send Admin Reply
                      </button>
                    </form>
                  </>
                )}
              </div>

            </div>
          </div>

        {/* USERS & PERMISSIONS CONTROL HUB */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 mb-12 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
            <div>
              <span className="text-[10px] font-black text-[#008B9B] uppercase tracking-wider block mb-1">
                Access & User Management
              </span>
              <h2 className="text-2xl font-black text-gray-900">👥 Users & Permissions Control Hub</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isSuperAdmin
                  ? 'Full control: elevate admin access, promote VIP tiers, or delete user accounts.'
                  : 'View-only: regular admins can chat and manage bookings, but cannot modify user accounts.'}
              </p>
            </div>

            <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-full">
              {managedUsers.length} Registered Accounts
            </span>
          </div>

          {/* USER TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-3">User Profile</th>
                  <th className="py-3 px-3">Email Address</th>
                  <th className="py-3 px-3">Current Role</th>
                  <th className="py-3 px-3">VIP Tier</th>
                  <th className="py-3 px-3">Registered Date</th>
                  <th className="py-3 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {managedUsers
                  // Only the BENO super admin can see the beno@admin.com account.
                  .filter((u) => isSuperAdmin || u.email.toLowerCase() !== ADMIN_EMAIL)
                  .map((u) => {
                    const isBenoSup = u.email?.toLowerCase() === ADMIN_EMAIL;
                    const isAdminRole = u.role === 'admin';
                    return (
                      <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={u.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <div className="font-bold text-gray-900">{u.name}</div>
                              <div className="text-[10px] text-gray-400 font-mono">{u.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-3 font-semibold text-gray-800">{u.email}</td>

                        <td className="py-4 px-3">
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                            isBenoSup
                              ? 'bg-gray-950 text-white border border-gray-900'
                              : isAdminRole
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-teal-50 text-[#008B9B] border border-teal-200'
                          }`}>
                            {isBenoSup ? '👑 Super Admin' : isAdminRole ? '🛡️ Admin' : '👤 VIP Guest'}
                          </span>
                        </td>

                        <td className="py-4 px-3">
                          <select
                            value={u.vipTier}
                            onChange={(e) => handleVIPChange(u.id, e.target.value as VIPTier)}
                            disabled={!isSuperAdmin || isBenoSup}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                            <option value="Black Diamond">Black Diamond</option>
                          </select>
                        </td>

                        <td className="py-4 px-3 text-gray-500 font-medium">{u.createdAt}</td>

                        <td className="py-4 px-3 text-right">
                          {isSuperAdmin ? (
                            <div className="flex items-center justify-end space-x-2">
                              {isBenoSup ? (
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">—</span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleToggleAdminRole(u.id, u.role)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                      isAdminRole
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                                        : 'bg-amber-500 hover:bg-amber-600 text-gray-950 font-black shadow-xs'
                                    }`}
                                  >
                                    {isAdminRole ? 'Demote User' : 'Make Admin 🛡️'}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteUserAccount(u.id, u.email)}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                                    title="Delete User Account"
                                  >
                                    🗑️ Delete
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] font-bold text-gray-400">Read only</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

          {/* MAIN DASHBOARD CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* RESERVATIONS MANAGEMENT TABLE (8 COLS) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Reservations Master Table</h3>
                  <p className="text-xs text-gray-500">Live booking entries from all 7 Beno luxury categories.</p>
                </div>

                {/* FILTER TABS */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl text-xs font-bold">
                  {['all', 'confirmed', 'pending', 'cancelled'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                        activeTab === tab
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Ref ID</th>
                      <th className="py-3 px-3">Guest</th>
                      <th className="py-3 px-3">Service & Category</th>
                      <th className="py-3 px-3">Date & Slot</th>
                      <th className="py-3 px-3">Total (USD)</th>
                      <th className="py-3 px-3">Status</th>
                      {isSuperAdmin && <th className="py-3 px-3">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-medium">
                    {filteredBookings.map((bk) => (
                      <tr key={bk.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-3 font-bold text-gray-900">{bk.id}</td>
                        <td className="py-4 px-3">
                          <div className="font-bold text-gray-900">{bk.guestName}</div>
                          <div className="text-[11px] text-gray-400">{bk.guestPhone}</div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="font-bold text-gray-800">{bk.serviceName}</div>
                          <div className="text-[11px] text-[#008B9B] font-bold">{bk.category}</div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="font-bold text-gray-900">{bk.startDate}</div>
                          <div className="text-[11px] text-gray-500">{bk.startTime} ({bk.duration})</div>
                        </td>
                        <td className="py-4 px-3 font-black text-[#008B9B]">
                          {formatCurrency(bk.totalPrice)}
                        </td>
                        <td className="py-4 px-3">
                          <select
                            value={bk.status}
                            onChange={(e) => handleStatusChange(bk.id, e.target.value as any)}
                            className={`text-xs font-bold py-1.5 px-2.5 rounded-xl focus:outline-none cursor-pointer ${
                              bk.status === 'Confirmed'
                                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                : bk.status === 'Pending Deposit'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : bk.status === 'Completed'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Pending Deposit">Pending Deposit</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        {isSuperAdmin && (
                        <td className="py-4 px-3">
                          <button
                            onClick={() => handleDeleteBooking(bk)}
                            disabled={deletingId === bk.id}
                            className="bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all border border-red-100 disabled:opacity-50"
                          >
                            {deletingId === bk.id ? 'Deleting…' : '🗑 Delete'}
                          </button>
                        </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredBookings.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-xs font-medium">
                    No reservations found matching "{activeTab}".
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT RAIL (4 COLS) — reserved for future admin modules */}
            <div className="lg:col-span-4 space-y-6">

          </div>

          </div>

        </main>

        {/* Custom confirmation dialog (async — replaces blocking window.confirm) */}
        {confirmState && (
          <ConfirmDialog
            isOpen={!!confirmState}
            title={confirmState.title}
            message={confirmState.message}
            confirmLabel={confirmState.confirmLabel}
            danger={confirmState.danger}
            onConfirm={confirmState.onConfirm}
            onCancel={() => setConfirmState(null)}
          />
        )}

        {/* Non-blocking toast (replaces window.alert) */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl">
            {toast}
          </div>
        )}

        <Footer />
      </div>
    </AdminGuard>
  );
}
