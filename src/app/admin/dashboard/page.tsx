'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import AdminGuard from '@/components/AdminGuard';
import { 
  getBookings, 
  getBlockedTimes, 
  updateBookingStatus, 
  addBlockedTime, 
  getEngineMetrics, 
  SERVICE_PROVIDERS, 
  BookingRecord, 
  BlockedTime 
} from '@/lib/bookingEngine';
import { 
  SUPPORT_CHANNELS, 
  getMessagesForChannel, 
  sendAdminAgentReply, 
  ChatMessage 
} from '@/lib/supportChatStore';
import { syncChatMessageToFirestore, subscribeToAllBookings, syncBookingStatusToFirestore, deleteBooking } from '@/lib/firestoreSync';
import { formatCurrency } from '@/lib/currency';
import { 
  getManagedUsers, 
  toggleUserAdminRole, 
  deleteUserAccount, 
  updateUserVIPTier, 
  ManagedUser, 
  VIPTier 
} from '@/lib/userManagementStore';

export default function ConciergeDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);
  const [metrics, setMetrics] = useState<any>({ totalRevenue: 0, confirmedCount: 0, pendingCount: 0, totalBookings: 0, blockedSlotsCount: 0 });
  const [activeTab, setActiveTab] = useState<string>('all');

  // Admin Support Desk state
  const [activeAdminChannelId, setActiveAdminChannelId] = useState<string>('channel-vip');
  const [adminMessages, setAdminMessages] = useState<ChatMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState<string>('');
  const adminMessagesEndRef = useRef<HTMLDivElement>(null);

  // Block date form state
  const [blockService, setBlockService] = useState('arya-yacht');
  const [blockProvider, setBlockProvider] = useState('sp-marine');
  const [blockDate, setBlockDate] = useState('2026-08-25');
  const [blockSlot, setBlockSlot] = useState('15:30');
  const [blockReason, setBlockReason] = useState('Scheduled Maintenance & Inspection');

  const refreshData = () => {
    setBookings(getBookings());
    setBlockedTimes(getBlockedTimes());
    setMetrics(getEngineMetrics());
    setAdminMessages(getMessagesForChannel(activeAdminChannelId));
    setManagedUsers(getManagedUsers());
  };

  useEffect(() => {
    refreshData();
  }, [activeAdminChannelId]);

  useEffect(() => {
    const unsub = subscribeToAllBookings((firestoreBookings) => {
      setBookings(firestoreBookings);
      setMetrics(getEngineMetrics());
    });
    return unsub;
  }, []);

  useEffect(() => {
    adminMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [adminMessages]);

  const handleStatusChange = (id: string, status: BookingRecord['status']) => {
    updateBookingStatus(id, status);
    syncBookingStatusToFirestore(id, status);
    refreshData();
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteBooking = async (bk: BookingRecord) => {
    if (!window.confirm(`Delete booking ${bk.id} (${bk.guestName})? This cannot be undone.`)) return;
    setDeletingId(bk.id);
    try {
      await deleteBooking(bk.id);
      refreshData();
    } catch (e) {
      console.error('Delete failed:', e);
      window.alert('Failed to delete booking. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAdminRole = (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'User' : 'Admin';
    if (confirm(`Are you sure you want to change user role to ${nextRole}?`)) {
      toggleUserAdminRole(userId);
      refreshData();
    }
  };

  const handleDeleteUserAccount = (userId: string, userEmail: string) => {
    if (confirm(`Are you sure you want to delete user account (${userEmail})? This action cannot be undone.`)) {
      deleteUserAccount(userId);
      refreshData();
    }
  };

  const handleVIPChange = (userId: string, tier: VIPTier) => {
    updateUserVIPTier(userId, tier);
    refreshData();
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    addBlockedTime(blockService, blockProvider, blockDate, blockSlot, blockReason);
    refreshData();
    alert(`Inventory slot on ${blockDate} (${blockSlot}) has been locked.`);
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;

    const newMsg = sendAdminAgentReply(activeAdminChannelId, adminReplyText);
    syncChatMessageToFirestore(newMsg);
    setAdminMessages(getMessagesForChannel(activeAdminChannelId));
    setAdminReplyText('');
  };

  const activeAdminChannel = SUPPORT_CHANNELS.find(c => c.id === activeAdminChannelId) || SUPPORT_CHANNELS[0];

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
                onClick={refreshData}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-3 rounded-2xl border border-white/20 transition-all active:scale-95 flex items-center space-x-2"
              >
                <span>🔄 Refresh Realtime Engine</span>
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
              <span className="text-xs font-bold text-gray-400 uppercase">Locked Maintenance Slots</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-gray-900">{metrics.blockedSlotsCount}</span>
                <span className="text-xs text-gray-500 font-medium block mt-1">Inventory Lockouts</span>
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
                <p className="text-xs text-gray-500 mt-0.5">Reply to guest chat inquiries in real-time across all 4 concierge divisions.</p>
              </div>

              {/* CHANNEL SELECTOR TABS */}
              <div className="flex space-x-2 overflow-x-auto scrollbar-hide py-1">
                {SUPPORT_CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveAdminChannelId(ch.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeAdminChannelId === ch.id
                        ? 'bg-[#008B9B] text-white shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {ch.name}
                  </button>
                ))}
              </div>
            </div>

            {/* CHAT MESSAGES & REPLY TERMINAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[420px]">
              
              {/* ACTIVE CHANNEL INFO (4 COLS) */}
              <div className="lg:col-span-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={activeAdminChannel.agent.avatar} 
                      alt={activeAdminChannel.agent.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-teal-600 shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-base text-gray-900">{activeAdminChannel.agent.name}</h4>
                      <span className="text-xs text-teal-600 font-bold block">{activeAdminChannel.agent.role}</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Division:</span>
                      <span className="font-bold text-gray-900">{activeAdminChannel.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Status:</span>
                      <span className="font-bold text-teal-600">🟢 Online & Responding</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 leading-relaxed italic">
                  * Note: Admin replies sent from this dashboard stream live directly to guest widgets and the /chat portal.
                </div>
              </div>

              {/* MESSAGE FEED & COMPOSER (8 COLS) */}
              <div className="lg:col-span-8 flex flex-col justify-between border border-gray-200 rounded-2xl overflow-hidden bg-white">
                
                {/* FEED */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-gray-50/50">
                  {adminMessages.map((msg) => {
                    const isAdminAgent = msg.sender === 'agent';
                    return (
                      <div 
                        key={msg.id}
                        className={`flex items-end space-x-2.5 ${isAdminAgent ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                      >
                        <img 
                          src={msg.senderAvatar} 
                          alt={msg.senderName} 
                          className="w-7 h-7 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        />

                        <div className={`max-w-[75%] space-y-1 ${isAdminAgent ? 'text-right' : 'text-left'}`}>
                          <div className="flex items-baseline space-x-2 px-1">
                            <span className="text-[10px] font-bold text-gray-500">{msg.senderName}</span>
                            <span className="text-[9px] text-gray-400">{msg.createdAt}</span>
                          </div>

                          <div 
                            className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold ${
                              isAdminAgent
                                ? 'bg-[#008B9B] text-white rounded-br-none shadow-xs'
                                : 'bg-white text-gray-900 border border-gray-200 shadow-xs rounded-bl-none'
                            }`}
                          >
                            {msg.image && (
                              <img src={msg.image} alt="Attachment" className="w-full max-h-40 object-cover rounded-lg mb-2" />
                            )}
                            <span>{msg.body}</span>
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
                    placeholder={`Reply as ${activeAdminChannel.agent.name}...`}
                    className="flex-1 bg-white border border-teal-600 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-500 font-semibold focus:outline-none focus:ring-2 focus:ring-[#008B9B]"
                  />
                  <button
                    type="submit"
                    className="bg-[#008B9B] hover:bg-[#007684] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    Send Admin Reply
                  </button>
                </form>

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
                View registered users, elevate admin access, promote VIP tiers, or delete user accounts.
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
                {managedUsers.map((u) => {
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
                          isAdminRole 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-teal-50 text-[#008B9B] border border-teal-200'
                        }`}>
                          {isAdminRole ? '🛡️ Admin' : '👤 VIP Guest'}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <select
                          value={u.vipTier}
                          onChange={(e) => handleVIPChange(u.id, e.target.value as VIPTier)}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
                        >
                          <option value="Silver">Silver</option>
                          <option value="Gold">Gold</option>
                          <option value="Platinum">Platinum</option>
                          <option value="Black Diamond">Black Diamond</option>
                        </select>
                      </td>

                      <td className="py-4 px-3 text-gray-500 font-medium">{u.createdAt}</td>

                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
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
                        </div>
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
                      <th className="py-3 px-3">Actions</th>
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
                        <td className="py-4 px-3">
                          <button
                            onClick={() => handleDeleteBooking(bk)}
                            disabled={deletingId === bk.id}
                            className="bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all border border-red-100 disabled:opacity-50"
                          >
                            {deletingId === bk.id ? 'Deleting…' : '🗑 Delete'}
                          </button>
                        </td>
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

            {/* BLACKOUT DATES & MAINTENANCE LOCKER (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Inventory Lock Engine</h3>
                  <p className="text-xs text-gray-500">Block asset dates/slots for maintenance or private VIP use.</p>
                </div>

                <form onSubmit={handleAddBlock} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target Service</label>
                    <select
                      value={blockService}
                      onChange={(e) => setBlockService(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#008B9B]"
                    >
                      <option value="arya-yacht">Arya Luxury Flybridge Yacht</option>
                      <option value="lamborghini-huracan">Lamborghini Huracán EVO</option>
                      <option value="gulfstream-g650">Gulfstream G650ER Jet</option>
                      <option value="single-kayak">Single Kayak (Water Sports)</option>
                      <option value="jebel-jais-rally">Jebel Jais Supercar Rally</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Provider Division</label>
                    <select
                      value={blockProvider}
                      onChange={(e) => setBlockProvider(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#008B9B]"
                    >
                      {SERVICE_PROVIDERS.map((sp) => (
                        <option key={sp.id} value={sp.id}>{sp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Lock Date</label>
                      <input 
                        type="date"
                        value={blockDate}
                        onChange={(e) => setBlockDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#008B9B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Lock Slot</label>
                      <select
                        value={blockSlot}
                        onChange={(e) => setBlockSlot(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#008B9B]"
                      >
                        <option value="09:00">09:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="15:30">03:30 PM</option>
                        <option value="18:00">06:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Lockout Reason</label>
                    <input 
                      type="text"
                      required
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="E.g. Scheduled Engine Overhaul"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#008B9B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-[#008B9B] text-white py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95"
                  >
                    🔒 Lock Inventory Slot
                  </button>
                </form>
              </div>

              {/* ACTIVE BLOCKED TIMES LIST */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
                <h4 className="text-sm font-bold text-gray-900">Active Inventory Lockouts ({blockedTimes.length})</h4>
                <div className="space-y-2">
                  {blockedTimes.map((blk) => (
                    <div key={blk.id} className="bg-red-50/70 border border-red-100 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold text-red-900">
                        <span>{blk.serviceId}</span>
                        <span>{blk.date} @ {blk.slotTime}</span>
                      </div>
                      <p className="text-red-700 text-[11px]">{blk.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </main>

        <Footer />
      </div>
    </AdminGuard>
  );
}
