'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const articles = [
    {
      slug: 'yacht-charter-guide-global-marina-2026',
      title: 'The Ultimate Guide to Worldwide Superyacht Chartering 2026',
      category: 'yachting',
      categoryLabel: 'Yacht Charter Guide',
      readTime: '6 min read',
      date: 'Aug 08, 2026',
      image: '/assets/home-imgs/new-yacht.webp',
      excerpt: 'Discover secret coastal routes across Miami, Monaco, and Amalfi, optimal booking times, guest capacities, and onboard luxury catering options.',
      featured: true
    },
    {
      slug: 'top-5-scenic-supercar-drives-global',
      title: 'Top 5 Scenic Supercar Drives Worldwide: Mountain & Coastal Routes',
      category: 'supercars',
      categoryLabel: 'Supercar Routes',
      readTime: '5 min read',
      date: 'Aug 02, 2026',
      image: '/assets/home-imgs/Ferrari_296_GTS_.webp',
      excerpt: 'Experience the finest twisting asphalt, desert sweeps, and mountain hairpins designed for maximum performance in a Ferrari or Lamborghini.',
      featured: false
    },
    {
      slug: 'tourist-driving-license-rules-global',
      title: 'International Tourist Driving License Guide for Supercar Rentals',
      category: 'guides',
      categoryLabel: 'Driving Rules',
      readTime: '4 min read',
      date: 'Jul 26, 2026',
      image: '/assets/home-imgs/Chevrolet_Corvette_Stingray_C8.webp',
      excerpt: 'Everything visitors need to know about international driving permits, passport verification, toll systems, and driving rules worldwide.',
      featured: false
    },
    {
      slug: 'buggy-desert-safari-tips-global',
      title: 'Desert Buggy Safari: Gear, Safety & Dune Driving Techniques',
      category: 'buggies',
      categoryLabel: 'Off-Road Thrills',
      readTime: '4 min read',
      date: 'Jul 19, 2026',
      image: '/assets/home-imgs/Polaris_RZR_XP_1000cc__2_seate.webp',
      excerpt: 'Mastering the 1000cc Polaris RZR in red dunes. Essential safety advice, footwear recommendations, and sunset photo spots.',
      featured: false
    },
    {
      slug: 'private-jet-vs-first-class-global',
      title: 'Private Jet Charter vs First Class: Cost & Convenience Breakdown',
      category: 'aviation',
      categoryLabel: 'Private Aviation',
      readTime: '7 min read',
      date: 'Jul 10, 2026',
      image: '/assets/home-imgs/new-private-jets.webp',
      excerpt: 'An in-depth comparison of airport wait times, private FBO terminal access, custom scheduling, and pricing for transcontinental travel.',
      featured: false
    }
  ];

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  const featuredArticle = articles.find(a => a.featured);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-3">
            BENO Lifestyle & Guides
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 mb-4">
            The Beno Journal
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Insider guides, supercar route recommendations, yacht party planning tips, and worldwide luxury lifestyle stories.
          </p>
        </div>

        {/* FEATURED ARTICLE HERO */}
        {featuredArticle && (
          <Link
            href={`/blogs/${featuredArticle.slug}`}
            className="group relative block w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-12"
          >
            <img 
              src={featuredArticle.image} 
              alt={featuredArticle.title} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 text-white max-w-4xl">
              <div className="flex items-center space-x-3 mb-3">
                <span className="bg-[#008B9B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Featured Story
                </span>
                <span className="text-xs text-gray-300 font-medium">{featuredArticle.readTime} • {featuredArticle.date}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 group-hover:text-teal-300 transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-300 line-clamp-2 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
            </div>
          </Link>
        )}

        {/* CATEGORY FILTERS */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {[
            { id: 'all', label: 'All Stories' },
            { id: 'yachting', label: 'Yacht Life' },
            { id: 'supercars', label: 'Supercars & Drives' },
            { id: 'guides', label: 'Driving Rules & Travel' },
            { id: 'buggies', label: 'Off-Road Thrills' },
            { id: 'aviation', label: 'Private Jets' },
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

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blogs/${article.slug}`}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    {article.categoryLabel}
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-xs text-gray-400 font-semibold mb-2">
                    {article.readTime} • {article.date}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-[#008B9B] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center text-xs font-bold text-[#008B9B] group-hover:underline">
                <span>Read Full Article</span>
                <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
