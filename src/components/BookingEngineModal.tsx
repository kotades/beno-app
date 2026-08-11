'use client';

import { useState } from 'react';
import { saveBooking, BookingItem } from '@/lib/bookingStore';

interface BookingEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  category: string;
  price: number;
  image?: string;
}

export default function BookingEngineModal({
  isOpen,
  onClose,
  serviceName,
  category,
  price,
  image
}: BookingEngineModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Form States
  const [startDate, setStartDate] = useState('2026-08-20');
  const [startTime, setStartTime] = useState('14:00');
  const [duration, setDuration] = useState('4 Hours');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [createdBooking, setCreatedBooking] = useState<BookingItem | null>(null);

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
      startDate,
      startTime,
      duration,
      totalPrice: grandTotal,
      currency: 'AED',
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-6 overflow-y-auto max-h-[90vh]">
        
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
          <p className="text-xs text-gray-500 mt-1">Starting Rate: AED {price.toLocaleString()}</p>
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
                    <span className="font-bold text-[#008B9B]">+AED {addon.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* TOTAL SUMMARY */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="text-xs text-gray-500 font-bold">Estimated Grand Total</span>
              <span className="text-xl font-black text-[#008B9B]">AED {grandTotal.toLocaleString()}</span>
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
                Confirm & Guarantee Booking (AED {grandTotal.toLocaleString()})
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: CONFIRMATION SUCCESS */}
        {step === 3 && createdBooking && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 bg-teal-100 text-[#008B9B] rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-inner">
              ✓
            </div>

            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">Reservation Guaranteed</span>
              <h4 className="text-2xl font-black text-gray-900 mt-1">{createdBooking.id}</h4>
              <p className="text-xs text-gray-500 mt-1">A confirmation summary has been saved to your Beno profile.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Guest:</span>
                <span className="font-bold text-gray-900">{createdBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date & Slot:</span>
                <span className="font-bold text-gray-900">{createdBooking.startDate} at {createdBooking.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Service:</span>
                <span className="font-bold text-gray-900 truncate max-w-[200px]">{createdBooking.serviceName}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-500 font-bold">Total Paid:</span>
                <span className="font-black text-[#008B9B]">AED {createdBooking.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <a
                href="/booking/retrieve"
                className="w-full bg-[#008B9B] hover:bg-[#007684] text-white py-3.5 rounded-2xl font-bold text-xs text-center block transition-all shadow-md"
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
