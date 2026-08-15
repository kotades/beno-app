'use client';

import { useState, useEffect } from 'react';
import { saveBooking, BookingItem } from '@/lib/bookingStore';
import { CURRENCY, formatCurrency } from '@/lib/currency';
import { useAuth } from '@/context/AuthContext';

interface BookingEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  category: string;
  price: number;
  serviceId?: string;
  image?: string;
}

export default function BookingEngineModal({
  isOpen,
  onClose,
  serviceName,
  category,
  price,
  serviceId,
  image
}: BookingEngineModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form States
  const [startDate, setStartDate] = useState('2026-08-20');
  const [startTime, setStartTime] = useState('14:00');
  const [duration, setDuration] = useState('4 Hours');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const [guestName, setGuestName] = useState(user?.displayName ?? '');
  const [guestEmail, setGuestEmail] = useState(user?.email ?? '');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [createdBooking, setCreatedBooking] = useState<BookingItem | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;

  const availableAddOns = [
    { id: 'catering', label: 'Gourmet In-Flight / On-Board Fine Dining', price: 650 },
    { id: 'drone', label: 'GoPro 4K Drone Photography & Video Package', price: 450 },
    { id: 'transfer', label: 'Chauffeur VIP Hotel Transfer (Rolls-Royce / Maybach)', price: 800 },
    { id: 'insurance', label: 'Zero-Deductible Full Comprehensive Coverage', price: 350 },
  ];

  const addOnTotal = selectedAddOns.reduce((acc, currId) => {
    const item = availableAddOns.find(a => a.id === currId);
    return acc + (item ? item.price : 0);
  }, 0);

  const grandTotal = price + addOnTotal;

  const handleToggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      setSelectedAddOns(selectedAddOns.filter(a => a != id));
    } else {
      setSelectedAddOns([...selectedAddOns, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addOnLabels = selectedAddOns.map(id => availableAddOns.find(a => a.id === id)?.label || id);
    
    const newBk = saveBooking({
      serviceName,
      category,
      serviceId,
      startDate,
      startTime,
      duration,
      totalPrice: grandTotal,
      currency: CURRENCY,
      guestName,
      guestEmail,
      guestPhone,
      addOns: addOnLabels,
      notes,
      image
    });

    setCreatedBooking(newBk);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm overflow-y-auto pt-24 pb-8 px-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-6 my-auto max-h-[calc(100vh-7rem)] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 text-xl font-bold"
        >
          ✕
        </button>

        {/* HEADER */}
        <div>
          <span className="text-xs font-bold text-[#008B9B] uppercase tracking-wider block mb-1">
            Beno Reservation Engine • {category}
          </span>
          <h3 className="text-2xl font-black text-gray-900">{serviceName}</h3>
          <p className="text-xs text-gray-500 mt-1">Starting Rate: {formatCurrency(price)}</p>
        </div>

        {/* STEP 1: DATE & ADDONS */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reservation Date</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#008B9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Start Time Slot</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#008B9B]"
                >
                  <option value="09:00">09:00 AM (Morning Slot)</option>
                  <option value="12:00">12:00 PM (Noon Slot)</option>
                  <option value="15:30">03:30 PM (Sunset Prime Slot)</option>
                  <option value="18:00">06:00 PM (Evening Lights Slot)</option>
                </select>
              </div>
            </div>

            {/* ADD-ONS CHECKBOXES */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Enhance Your Experience (Optional Add-ons)</label>
              <div className="space-y-2">
                {availableAddOns.map((addon) => (
                  <label 
                    key={addon.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedAddOns.includes(addon.id)
                        ? 'bg-cyan-50/70 border-[#008B9B] font-bold text-gray-900'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input 
                        type="checkbox"
                        checked={selectedAddOns.includes(addon.id)}
                        onChange={() => handleToggleAddOn(addon.id)}
                        className="rounded text-[#008B9B] focus:ring-[#008B9B]"
                      />
                      <span>{addon.label}</span>
                    </div>
                    <span className="font-bold text-[#008B9B]">+{formatCurrency(addon.price)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* TOTAL SUMMARY */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="text-xs text-gray-500 font-bold">Estimated Grand Total</span>
              <span className="text-xl font-black text-[#008B9B]">{formatCurrency(grandTotal)}</span>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#008B9B] hover:bg-[#007684] text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
            >
              Continue to Guest Details →
            </button>
          </div>
        )}

        {/* STEP 2: GUEST DETAILS & CONFIRM */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input 
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#008B9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (For Booking Confirmation)</label>
              <input 
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#008B9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone / WhatsApp Number</label>
              <input 
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+971 50 000 0000"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#008B9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Special Requests & Dietary Notes</label>
              <textarea 
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special occasion, champagne preferences, or flight notes..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#008B9B]"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold text-xs transition-all"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="w-2/3 bg-[#008B9B] hover:bg-[#007684] text-white py-3.5 rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95"
              >
                Confirm & Guarantee Booking ({formatCurrency(grandTotal)})
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: VIP PENDING PAYMENT WALL */}
        {step === 3 && createdBooking && (
          <div className="text-center space-y-5 py-2">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black border border-amber-200 shadow-sm animate-pulse">
              ⏳
            </div>

            <div>
              <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2 border border-amber-200">
                Reservation Logged • Payment Pending
              </span>
              <p className="text-xs text-gray-500 font-medium">Ticket Token Reference</p>
              <div className="mt-1 inline-flex items-center justify-center space-x-2 bg-gray-900 text-teal-300 font-mono font-black text-2xl px-5 py-2.5 rounded-2xl tracking-wider shadow-inner border border-gray-800">
                <span>{createdBooking.id}</span>
              </div>
            </div>

            {/* VIP INSTRUCTION NOTICE */}
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/70 text-left text-xs space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 font-bold">
                <span>💬 VIP Concierge Next Step:</span>
              </div>
              <p className="text-amber-900/90 leading-relaxed text-[11px]">
                Your booking for <strong>{createdBooking.serviceName}</strong> ({formatCurrency(createdBooking.totalPrice)}) has been created, but payment is pending verification. 
                Please copy your Ticket Token (<strong>{createdBooking.id}</strong>) and send it via the live chat below. A BENO representative will verify your reservation and provide direct payment details.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Guest Name:</span>
                <span className="font-bold text-gray-900">{createdBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date & Slot:</span>
                <span className="font-bold text-gray-900">{createdBooking.startDate} at {createdBooking.startTime}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-500 font-bold">Total Amount Due:</span>
                <span className="font-black text-[#008B9B]">{formatCurrency(createdBooking.totalPrice)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const tokenMsg = `Hello BENO Concierge! I have created a booking reservation. My Ticket Token is: ${createdBooking.id} (${createdBooking.serviceName} - ${formatCurrency(createdBooking.totalPrice)}). Please confirm my order and provide payment details.`;
                  navigator.clipboard.writeText(tokenMsg);
                  window.dispatchEvent(new CustomEvent('open-live-chat'));
                  onClose();
                }}
                className="w-full bg-[#008B9B] hover:bg-[#007684] text-white py-4 rounded-2xl font-bold text-xs text-center flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Copy Ticket Token & Chat with Concierge</span>
              </button>

              <a
                href="/booking/retrieve"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-xs text-center block transition-all"
              >
                View All My Bookings
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
