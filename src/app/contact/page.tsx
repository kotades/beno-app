'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'yacht',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-3">
            24/7 Global VIP Concierge Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 mb-4">
            Contact & Support
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Have a question about custom itineraries, luxury fleet availability, or corporate events across Miami, New York, London, Monaco, or Paris? Our team is available 24/7.
          </p>
        </div>

        {/* DIRECT ACTION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <a 
            href="https://wa.me/18002366847" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 p-6 rounded-3xl transition-all flex items-center space-x-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center font-bold text-2xl shadow-md group-hover:scale-110 transition-transform">
              💬
            </div>
            <div>
              <span className="text-xs font-bold text-[#128C7E] uppercase block">WhatsApp Concierge</span>
              <span className="text-sm font-black text-gray-900">+1 (800) BENO-VIP</span>
              <span className="text-[11px] text-gray-500 block">Avg reply: &lt; 2 mins</span>
            </div>
          </a>

          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#008B9B] flex items-center justify-center font-bold text-2xl">
              📞
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase block">24/7 USA & Intl Line</span>
              <span className="text-sm font-black text-gray-900">+1 (305) 555-BENO</span>
              <span className="text-[11px] text-gray-500 block">Toll-Free USA & Worldwide</span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#008B9B] flex items-center justify-center font-bold text-2xl">
              📧
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase block">Email Support</span>
              <h3 className="font-bold text-gray-900 text-sm">Corporate Toll-Free</h3>
              <p className="text-xs text-gray-500 mt-0.5">+1 (800) BENO-VIP</p>
              <p className="text-[11px] text-[#008B9B] font-bold mt-1">Mon-Sun 24/7 Support</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#008B9B] flex items-center justify-center font-bold text-xl shrink-0">
              ✉️
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Direct Email</h3>
              <p className="text-xs text-gray-500 mt-0.5">concierge@beno.com</p>
              <p className="text-[11px] text-[#008B9B] font-bold mt-1">Average response: &lt;15 mins</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#008B9B] flex items-center justify-center font-bold text-xl shrink-0">
              💬
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Live Concierge Chat</h3>
              <p className="text-xs text-gray-500 mt-0.5">Instant WhatsApp / Web</p>
              <Link href="/chat" className="text-[11px] text-[#008B9B] font-bold mt-1 inline-block hover:underline">
                Open Chat Portal →
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#008B9B] flex items-center justify-center font-bold text-xl shrink-0">
              📍
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Global USA HQ</h3>
              <p className="text-xs text-gray-500 mt-0.5">Brickell Ave, Miami FL</p>
              <p className="text-[11px] text-[#008B9B] font-bold mt-1">United States</p>
            </div>
          </div>

        </div>

        {/* MAIN SECTION: FORM + HQ DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* CONTACT FORM */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a VIP Inquiry</h2>
            <p className="text-xs text-gray-500 mb-6">Fill in your request details and our global concierge team will tailor your experience within 15 minutes.</p>

            {submitted ? (
              <div className="bg-teal-50 border border-teal-200 text-teal-900 p-6 rounded-2xl text-center space-y-2">
                <span className="text-4xl block">✨</span>
                <h3 className="font-bold text-lg">Inquiry Received Successfully!</h3>
                <p className="text-xs text-teal-700">Thank you, {formData.name}. A senior luxury concierge Specialist will contact you shortly via email/phone.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-[#008B9B] underline uppercase tracking-wider"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Alexander Wright"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008B9B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="alexander@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008B9B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008B9B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Service Category</label>
                    <select 
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008B9B]"
                    >
                      <option value="Yacht Rental">Yacht Rental & Charters</option>
                      <option value="Supercar Rental">Supercars & Exotic Car Rental</option>
                      <option value="Helicopter Tours">Helicopter Tours & Charters</option>
                      <option value="Off-Road Buggy">Dune Buggy & Off-Road Rally</option>
                      <option value="Water Activities">Watersports & Jet Skis</option>
                      <option value="Private Jet">Private Jet Charter</option>
                      <option value="Other">Custom Corporate Event</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Message / Event Requirements</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Provide preferred dates, guest count, pickup location, or custom request details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008B9B]"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#008B9B] hover:bg-teal-600 text-white font-bold py-4 rounded-xl text-sm transition-all shadow-md uppercase tracking-wider"
                >
                  Submit VIP Inquiry
                </button>
              </form>
            )}
          </div>

          {/* HQ INFORMATION & MAP */}
          <div className="lg:col-span-5 space-y-6 bg-gray-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-800">
            <div>
              <span className="bg-teal-900/60 text-teal-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                Global Headquarters
              </span>
              <h3 className="text-2xl font-bold">BENO Global Corporate HQ</h3>
              <p className="text-xs text-gray-400 mt-1">United States Operating Center</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-xs font-bold text-teal-400 block uppercase mb-1">📍 Primary Address</span>
                <h4 className="font-bold text-white">Miami, Florida (USA)</h4>
                <p className="text-xs text-gray-400 mt-1">1000 Brickell Avenue, Suite 400, Miami, FL 33131, USA</p>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-xs font-bold text-teal-400 block uppercase mb-1">🌍 European & Global Hubs</span>
                <h4 className="font-bold text-white">London, Monaco & Paris</h4>
                <p className="text-xs text-gray-400 mt-1">Mayfair (London) • Port Hercules (Monaco) • French Riviera Marina</p>
              </div>
            </div>

            {/* MAP MOCKUP */}
            <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-800 border border-white/10 flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[radial-[#008B9B]_1px,transparent_1px] [background-size:16px_16px]" />
              <div className="relative text-center p-4">
                <span className="text-3xl block mb-1">🌎</span>
                <span className="text-xs font-bold text-white block">Interactive Map: Global Headquarters & Hubs</span>
                <span className="text-[10px] text-teal-300">Miami • New York • Los Angeles • London • Monaco • Paris</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
