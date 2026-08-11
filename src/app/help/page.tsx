'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      id: 0,
      category: 'requirements',
      question: 'What documents are required to rent a supercar or vehicle?',
      answer: 'For Domestic Residents: State / National Driver’s License + Photo ID. For International Tourists: Passport + Home Country Driving License. (Drivers from EU, USA, UK, GCC, Canada, Australia, and select countries do not require an International Driving Permit).'
    },
    {
      id: 1,
      category: 'yachts',
      question: 'Are captain, crew, fuel, and soft drinks included in Yacht Charters?',
      answer: 'Yes! Every BENO yacht charter comes complete with a Coast Guard certified captain, professional crew, fuel for your planned route, ice, mineral water, and complimentary soft drinks.'
    },
    {
      id: 2,
      category: 'booking',
      question: 'Is security deposit required and how is it processed?',
      answer: 'Supercar rentals require a pre-authorization security deposit (typically USD $500 - $1,500 depending on vehicle tier) to cover potential traffic fines or toll charges. Deposits are automatically released back to your card within 14 to 21 days.'
    },
    {
      id: 3,
      category: 'cancellation',
      question: 'What is BENO’s cancellation and rescheduling policy?',
      answer: 'We offer free cancellation and 100% refund up to 48 hours prior to your scheduled reservation time. Rescheduling dates is free of charge subject to vehicle availability.'
    },
    {
      id: 4,
      category: 'delivery',
      question: 'Can BENO deliver a supercar directly to my hotel or Airport VIP Terminal?',
      answer: 'Absolutely! We offer 24/7 doorstep delivery across all luxury hotels, private villas, and airport VIP terminals across Miami, NY, LA, London, Monaco, and Paris. Our driver will meet you upon arrival.'
    },
    {
      id: 5,
      category: 'buggies',
      question: 'Do I need prior experience or a license to ride Dune Buggies or Off-Road Rallies?',
      answer: 'No prior license or off-road experience is required for desert buggy safaris! All drivers receive full safety briefings, and expert guides escort your group across the dunes.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HEADER & SEARCH BAR */}
        <div className="bg-gradient-to-r from-[#121621] via-gray-900 to-[#008B9B] rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-12 text-center relative overflow-hidden">
          <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-3">
            BENO Support Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
            How Can We Help You?
          </h1>

          {/* SEARCH INPUT */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search questions (e.g. driving license, security deposit, yacht routes)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-900 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-[#008B9B]"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'requirements', label: 'Driving License & Requirements' },
            { id: 'yachts', label: 'Yacht Charter Rules' },
            { id: 'booking', label: 'Security Deposits & Payments' },
            { id: 'cancellation', label: 'Cancellations & Refunds' },
            { id: 'delivery', label: 'Hotel & Airport Delivery' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#008B9B] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ ACCORDION LIST */}
        <div className="max-w-4xl mx-auto space-y-4 mb-16">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-6 text-left font-bold text-gray-900 text-base flex justify-between items-center hover:text-[#008B9B] transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className={`w-8 h-8 rounded-full bg-teal-50 text-[#008B9B] flex items-center justify-center text-sm font-bold transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-50 mt-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border border-gray-100">
              No matching questions found. Contact our 24/7 Concierge for instant assistance.
            </div>
          )}
        </div>

        {/* STILL HAVE QUESTIONS BOX */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-900 to-[#121621] rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-bold mb-1">Still need help with your reservation?</h3>
            <p className="text-xs text-gray-300">Our VIP concierge desk is available 24/7 on WhatsApp or phone.</p>
          </div>
          
          <Link
            href="/contact"
            className="bg-[#008B9B] hover:bg-teal-400 text-white hover:text-gray-900 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap shadow-md"
          >
            Speak to Support
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
