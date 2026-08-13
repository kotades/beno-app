import homeDb from '@/data/home_db.json';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function HomePage() {
  const heroSection = homeDb.sections.find(s => s.id === 'section_1');
  const yachtsSection = homeDb.sections.find(s => s.id === 'section_2');
  const carsSection = homeDb.sections.find(s => s.id === 'section_4');
  const brandsSection = homeDb.sections.find(s => s.id === 'section_5');
  const buggiesSection = homeDb.sections.find(s => s.id === 'section_9');
  const partnersSection = homeDb.sections.find(s => s.id === 'section_11');
  const blogsSection = homeDb.sections.find(s => s.id === 'section_15');
  const faqSection = homeDb.sections.find(s => s.id === 'section_16');
  const footerSection = homeDb.sections.find(s => s.id === 'section_18');

  // Helper to extract clean video
  const heroVideo = heroSection?.assets.find(a => a.type === 'video')?.src;

  return (
    <main className="min-h-screen bg-black w-full overflow-hidden text-white font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[600px] lg:h-[750px] flex flex-col justify-center items-center overflow-hidden">
        {heroVideo ? (
          <video src={heroVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        ) : (
          <img src={heroSection?.assets[0]?.src} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay for readability */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 mt-16 text-center xl:text-left xl:max-w-[1920px] mx-auto xl:px-24">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-tight">
            Rent Luxury Vehicles Worldwide
          </h1>
          <p className="mt-4 text-lg md:text-xl font-medium tracking-wide text-white">
            Yachts • Cars • Buggies • Helicopters • Water Sports
          </p>
        </div>
      </section>

      {/* 2. OUR SERVICES (Image 2) */}
      <section className="bg-white py-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1920px] mx-auto xl:px-8">
           <h2 className="text-2xl md:text-3xl font-bold text-teal-800 mb-6">Our Services</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Yacht Charter', img: '/assets/home-imgs/new-yacht.webp', route: '/yacht-rental' },
                { title: 'Car Rental', img: '/assets/home-imgs/new-car.webp', route: '/rent-a-car' },
                { title: 'Heli Tours', img: '/assets/home-imgs/new-new-helicopter.webp', route: '/aerials' },
                { title: 'Desert Buggy Rentals', img: '/assets/home-imgs/new-buggy.webp', route: '/buggies' },
                { title: 'Watersport Activities', img: '/assets/home-imgs/new-water-sports.webp', route: '/water-activities' },
                { title: 'Private Jet Charter', img: '/assets/home-imgs/new-private-jets.webp', route: '/private-jet' },
              ].map((service, i) => (
                <Link href={service.route} key={i} className="group relative h-56 md:h-64 rounded-xl overflow-hidden cursor-pointer shadow-md block">
                   <img src={service.img} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                   <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center text-white">
                      <span className="text-xl md:text-2xl font-medium tracking-wide">{service.title}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                   </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* 3. YACHTS SECTION (Image 3) */}
      {yachtsSection && (
        <section className="py-12 bg-white text-black px-4 sm:px-8 lg:px-16">
          <div className="max-w-[1920px] mx-auto xl:px-8">
            <div className="flex justify-between items-end mb-6 pb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-teal-800">Luxury Yacht Rental Worldwide</h2>
              <Link href="/yacht-rental" className="text-teal-700 font-bold hover:underline text-sm uppercase tracking-wide">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Arya', meta: '10 Guests | 2 Cabins | 42 Length', price: '1,300', oldPrice: '2,000', discount: '35 % off' },
                { name: 'Cali', meta: '10 Guests | 3 Cabins | 45 Length', price: '975', oldPrice: '1,500', discount: '35 % off' },
                { name: 'Jude', meta: '27 Guests | 3 Cabins | 74 Length', price: '3,250', oldPrice: '5,000', discount: '35 % off' },
                { name: 'Julia', meta: '21 Guests | 3 Cabins | 64 Length', price: '1,950', oldPrice: '3,000', discount: '35 % off' },
              ].map((yacht, idx) => (
                <Link href={`/yacht-rental`} key={idx} className="group flex flex-col cursor-pointer border border-transparent hover:shadow-lg rounded-xl transition-all pb-4">
                  <div className="relative h-[220px] w-full rounded-xl overflow-hidden bg-gray-200 shadow-sm mb-3">
                    <img src={yachtsSection.assets[idx]?.src || '/assets/home-imgs/Main_Image.webp'} alt={yacht.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-teal-800 text-white text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide">Premium</div>
                    {/* Red gift box icon */}
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 shadow-md">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                    </div>
                  </div>
                  <div className="px-1 space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                       <span>{yacht.meta}</span>
                       <span className="flex items-center text-teal-500">5/5 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></span>
                    </div>
                    <h3 className="text-[17px] font-semibold text-gray-800">{yacht.name}</h3>
                    <div className="text-[15px]">
                       <span className="font-extrabold text-gray-900 mr-2">${yacht.price}</span>
                       <span className="text-gray-400 line-through text-xs">${yacht.oldPrice}</span>
                       <span className="text-gray-500 text-sm"> /day</span>
                    </div>
                    <div className="inline-block bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">{yacht.discount}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. LARGE FEATURE BANNER (Image 4) */}
      <section className="py-8 bg-white px-4 sm:px-8 lg:px-16">
         <div className="max-w-[1920px] mx-auto xl:px-8">
            <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-xl">
               <video src="https://d19r6u3d126ojb.cloudfront.net/BENO_YACHTS_AT_MARSA_DESKTOP_v2_a64199e22d.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
               <div className="absolute bottom-8 left-8 text-white">
                  <p className="text-sm uppercase tracking-widest font-semibold mb-2 opacity-90">Luxury yachts</p>
                  <h3 className="text-3xl md:text-5xl font-bold flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-10 md:w-10 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     Docked In Style At Exclusive Global Marinas
                  </h3>
               </div>
            </div>
         </div>
      </section>

      {/* 5. SUPER CARS SECTION (Image 5) */}
      {carsSection && (
        <section className="py-12 bg-white text-black px-4 sm:px-8 lg:px-16">
          <div className="max-w-[1920px] mx-auto xl:px-8">
            <div className="flex justify-between items-end mb-6 pb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-teal-800">Supercar Rental Worldwide</h2>
              <Link href="/rent-a-car" className="text-teal-700 font-bold hover:underline text-sm uppercase tracking-wide">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Chevrolet Corvette Stingray C8', meta: '2 Seats | 2 Doors | 1 Bags', price: '899', oldPrice: '1,300', discount: '30 % off', img: '/assets/home-imgs/Chevrolet_Corvette_Stingray_C8.webp' },
                { name: 'Ferrari 296 GTS', meta: '2 Seats | 2 Doors | 1 Bags', price: '2,999', oldPrice: '5,500', discount: '45 % off', img: '/assets/home-imgs/Ferrari_296_GTS_.webp' },
                { name: 'Ferrari F8 Spider', meta: '2 Seats | 2 Doors | 1 Bags', price: '2,499', oldPrice: '4,200', discount: '40 % off', img: '/assets/home-imgs/Ferrari_F8_Spider_.webp' },
                { name: 'Lamborghini Huracan EVO Spyder', meta: '2 Seats | 2 Doors | 1 Bags', price: '2,199', oldPrice: '3,200', discount: '31 % off', img: '/assets/home-imgs/Lamborghini_Huracan_EVO_Spyder.webp' },
              ].map((car, idx) => (
                <Link href={`/rent-a-car`} key={idx} className="group flex flex-col cursor-pointer border border-transparent hover:shadow-lg rounded-xl transition-all pb-4">
                  <div className="relative h-[220px] w-full rounded-xl overflow-hidden bg-gray-200 shadow-sm mb-3">
                    <img src={car.img} alt={car.name} className="absolute inset-0 w-full h-full object-cover" />
                    {/* Red gift box icon */}
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 shadow-md">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                    </div>
                  </div>
                  <div className="px-1 space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-500 font-medium border-b border-gray-100 pb-2">
                       <span>{car.meta}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-gray-800 line-clamp-1">{car.name}</h3>
                    <div className="text-[15px]">
                       <span className="font-extrabold text-gray-900 mr-2">${car.price}</span>
                       <span className="text-gray-400 line-through text-xs">${car.oldPrice}</span>
                       <span className="text-gray-500 text-sm"> / day (200 km)</span>
                    </div>
                    <div className="inline-block bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">{car.discount}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. POPULAR BRANDS (Image 6) */}
      <section className="py-12 bg-white text-center px-4 sm:px-8 lg:px-16 border-t border-gray-100">
         <div className="max-w-[1920px] mx-auto xl:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-teal-800 mb-10 text-left">Popular Worldwide Luxury Car Brands</h2>
            <div className="flex overflow-x-auto gap-8 pb-4 border-b border-t border-gray-100 py-6 scrollbar-hide">
               {[
                 { name: 'Audi', img: '/assets/home-imgs/Audi_logo.svg' },
                 { name: 'Bentley', img: '/assets/home-imgs/Bentley_logo.webp' },
                 { name: 'BMW', img: '/assets/home-imgs/BMW_logo.svg' },
                 { name: 'Cadillac', img: '/assets/home-imgs/Cadillac_logo.svg' },
                 { name: 'Dodge', img: '/assets/home-imgs/Dodge_logo.webp' },
                 { name: 'Ferrari', img: '/assets/home-imgs/Ferrari_logo.webp' },
                 { name: 'Ford', img: '/assets/home-imgs/Ford_logo.webp' },
                 { name: 'GMC', img: '/assets/home-imgs/GMC_logo.webp' },
                 { name: 'Lamborghini', img: '/assets/home-imgs/Lamborghini_logo.webp' },
                 { name: 'Mazda', img: '/assets/home-imgs/Mazda_logo.webp' },
                 { name: 'Mclaren', img: '/assets/home-imgs/Mclaren_logo.webp' },
                 { name: 'Mercedes', img: '/assets/home-imgs/Mercedes_logo.svg' },
                 { name: 'Peugeot', img: '/assets/home-imgs/Peugeot_logo.webp' },
                 { name: 'Porsche', img: '/assets/home-imgs/Porsche_logo.webp' },
               ].map((brand, idx) => (
                  <div key={idx} className="flex-shrink-0 flex flex-col items-center justify-center min-w-[80px]">
                     <img src={brand.img} alt={brand.name} className="h-12 w-auto mb-4 object-contain" />
                     <span className="text-sm font-medium text-gray-700">{brand.name}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. JBR KIOSK (Image 7) */}
      <section className="bg-[#222222] pt-12 pb-6 px-4 sm:px-8 lg:px-16">
         <div className="max-w-[1920px] mx-auto xl:px-8">
            <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl">
               <video src="https://d19r6u3d126ojb.cloudfront.net/JBR_KIOSK_DESKTOP_7b0487481f.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/20" />
               <div className="absolute bottom-8 left-8 text-white z-10">
                  <p className="text-sm tracking-widest font-semibold mb-2">Worldwide Concierge Kiosk</p>
                  <h3 className="text-2xl md:text-4xl font-bold">Rent Your Next Thrill & Adventure</h3>
               </div>
            </div>
         </div>
      </section>

      {/* 8. LUXURY CARS SECTION (Image 8) */}
      <section className="bg-[#222222] text-white pb-12 pt-6 px-4 sm:px-8 lg:px-16">
         <div className="max-w-[1920px] mx-auto xl:px-8">
            <div className="flex justify-between items-end mb-6 pb-2">
              <h2 className="text-2xl md:text-3xl font-bold">Luxury Car Rental Worldwide</h2>
              <Link href="/rent-a-car" className="text-white font-bold hover:underline text-sm uppercase tracking-wide">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Audi A6 Full Option', meta: '5 Seats | 4 Doors | 2 Bags', price: '249', oldPrice: '', discount: '', img: '/assets/home-imgs/Audi_A6_Full_Option.webp' },
                { name: 'Cadillac Escalade Black', meta: '7 Seats | 4 Doors | 4 Bags', price: '999', oldPrice: '', discount: '30 % off', img: '/assets/home-imgs/Cadillac_Escalade_Black.webp' },
                { name: 'Cadillac Escalade White', meta: '7 Seats | 4 Doors | 4 Bags', price: '1,199', oldPrice: '', discount: '33 % off', img: '/assets/home-imgs/Cadillac_Escalade_White.webp' },
                { name: 'Chevrolet Tahoe Black', meta: '7 Seats | 4 Doors | 4 Bags', price: '599', oldPrice: '', discount: '', img: '/assets/home-imgs/Chevrolet_Tahoe_Black.webp' },
              ].map((car, idx) => (
                <Link href={`/rent-a-car`} key={idx} className="group flex flex-col cursor-pointer border border-transparent hover:shadow-2xl rounded-xl transition-all pb-4">
                  <div className="relative h-[220px] w-full rounded-xl overflow-hidden bg-gray-800 shadow-sm mb-3">
                    <img src={car.img} alt={car.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 shadow-md">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                    </div>
                  </div>
                  <div className="px-1 space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-400 font-medium border-b border-gray-700 pb-2">
                       <span>{car.meta}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-white line-clamp-1">{car.name}</h3>
                    <div className="text-[15px]">
                       <span className="font-extrabold text-white mr-2">${car.price}</span>
                       <span className="text-gray-400 text-sm"> / day (250 km)</span>
                    </div>
                    {car.discount && <div className="inline-block bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full mt-1">{car.discount}</div>}
                  </div>
                </Link>
              ))}
            </div>
         </div>
      </section>

      {/* 9. DOUBLE BANNERS (Image 9) */}
      <section className="bg-[#222222] py-6 px-4 sm:px-8 lg:px-16">
         <div className="max-w-[1920px] mx-auto xl:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative h-[250px] md:h-[350px] rounded-2xl overflow-hidden shadow-lg group">
               <video src="https://d19r6u3d126ojb.cloudfront.net/SUPERCARS_BANNER_976512ac0b.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/40" />
               <div className="absolute bottom-6 left-6 text-white z-10 pointer-events-none">
                  <p className="text-sm font-semibold mb-1 opacity-90">Supercars</p>
                  <h3 className="text-2xl md:text-3xl font-bold">Your Dream Drive Awaits!</h3>
               </div>
            </div>
            <div className="relative h-[250px] md:h-[350px] rounded-2xl overflow-hidden shadow-lg group">
               <video src="https://d19r6u3d126ojb.cloudfront.net/SUV_BANNER_3dd3e13ea6.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/40" />
               <div className="absolute bottom-6 left-6 text-white z-10 pointer-events-none">
                  <p className="text-sm font-semibold mb-1 opacity-90">SUV Cars</p>
                  <h3 className="text-2xl md:text-3xl font-bold">Conquer The Off-Road</h3>
               </div>
            </div>
         </div>
      </section>

      {/* 10. BUGGIES SECTION (Image 10) */}
      <section className="bg-[#222222] text-white py-12 px-4 sm:px-8 lg:px-16">
         <div className="max-w-[1920px] mx-auto xl:px-8">
            <div className="flex justify-between items-end mb-6 pb-2">
              <h2 className="text-2xl md:text-3xl font-bold">Buggy & Desert Rally Rental Worldwide</h2>
              <Link href="/buggies" className="text-white font-bold hover:underline text-sm uppercase tracking-wide">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'CFMoto 450cc Quad Bike', meta: '1 Seater', price: '390', discount: '50 % off', img: '/assets/home-imgs/CFMoto_450cc_Quad_Bike.webp' },
                { name: 'Polaris RZR XP 1000cc (2 seater)', meta: '2 Seater', price: '845', discount: '50 % off', img: '/assets/home-imgs/Polaris_RZR_XP_1000cc__2_seate.webp' },
                { name: 'Polaris-RZR XP 1000cc (4 seater)', meta: '4 Seater', price: '900', discount: '50 % off', img: '/assets/home-imgs/Polaris_RZR_XP_1000cc__4_seate.webp' },
                { name: 'KTM Dirt Bike Adventure: Thrill in the ...', meta: '1 Seater', price: '715', discount: '37 % off', img: '/assets/home-imgs/KTM_Dirt_Bike_Adventure__Thril.webp' },
              ].map((buggy, idx) => (
                <Link href={`/buggies`} key={idx} className="group flex flex-col cursor-pointer border border-transparent hover:shadow-2xl rounded-xl transition-all pb-4">
                  <div className="relative h-[250px] w-full rounded-xl overflow-hidden bg-[#E29864] shadow-sm mb-3">
                    <img src={buggy.img} alt={buggy.name} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90" />
                  </div>
                  <div className="px-1 space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-400 font-medium border-b border-gray-700 pb-2">
                       <span>{buggy.meta}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-white line-clamp-1">{buggy.name}</h3>
                    <div className="text-[15px] text-gray-400 text-center">
                       <span className="line-through text-xs mr-1">${buggy.price}</span>
                       <span className="text-sm">/day</span>
                    </div>
                    <div className="inline-block bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full mt-1">{buggy.discount}</div>
                  </div>
                </Link>
              ))}
            </div>
         </div>
      </section>

      {/* 11. PARTNERS (Image 11) */}
      <section className="bg-white py-16 text-center px-4 sm:px-8 lg:px-16">
         <div className="max-w-[1920px] mx-auto xl:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Our Partners</h2>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 mb-8">
               <img src="/assets/home-imgs/Beno_x_Jumeirah_Group_beno_par.webp" className="h-8 md:h-12 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
               <img src="/assets/home-imgs/Beno_x_D_MARIN_beno_partner_lo.webp" className="h-8 md:h-12 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
               <img src="/assets/home-imgs/BENO_X_DUBAI_WORLD_TRADE_CENTR.webp" alt="BENO Global Trade Partner" className="h-8 md:h-12 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
               <img src="/assets/home-imgs/Beno_x_Dubai_Economy_and_Touri.webp" alt="BENO Global Tourism Partner" className="h-8 md:h-12 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
               <img src="/assets/home-imgs/Beno_x_EET_Destination_Managem.webp" className="h-8 md:h-12 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
               <img src="/assets/home-imgs/Beno_x_Leisure_Marine_Associat.webp" className="h-8 md:h-12 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
            </div>
            <Link href="/partners" className="text-teal-700 font-bold hover:underline text-sm tracking-wide">See All Partners</Link>
         </div>
      </section>

      {/* 12. REVIEWS (Image 12) */}
      <section className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-16">
         <div className="max-w-[1920px] mx-auto xl:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">What people say about us?</h2>
               <div className="flex items-center space-x-4">
                  <div className="text-teal-800 font-black text-2xl tracking-tighter">BENO</div>
                  <div className="flex items-center border-l border-gray-300 pl-4">
                     <span className="font-bold text-gray-800 text-lg mr-2">Reviews (210)</span>
                     <span className="text-yellow-400 flex text-lg">★★★★★</span>
                     <span className="font-bold text-xl ml-2">4.8</span>
                  </div>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                  { name: 'serek2137', date: '25 February 2026', text: 'Everything was perfect. Professional service, amazing cars and no issues. Special thanks to Kareem. He was incredibly helpful throughout the process and made sure everything was 100%...' },
                  { name: 'Osman Jusufi', date: '16 February 2026', text: 'I had an amazing experience with Ahmed Othman. From the very first moment we met on the street, he treated me not just like a client, but like a brother. He was extremely friendly,...' },
                  { name: 'Sean', date: '6 February 2026', text: 'An absolutely unreal experience hiring the Lamborghini Huracán! From start to finish everything was smooth, professional, and genuinely exciting. The car itself was immaculate...' }
               ].map((review, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                           <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-lg mr-3">
                              {review.name[0].toUpperCase()}
                           </div>
                           <div>
                              <div className="font-bold text-gray-900 text-sm">{review.name}</div>
                              <div className="text-yellow-400 text-xs">★★★★★</div>
                           </div>
                        </div>
                        <div className="text-xs text-gray-400">{review.date}</div>
                     </div>
                     <p className="text-sm text-gray-600 mb-2">{review.text}</p>
                     <button className="text-teal-700 text-sm font-semibold hover:underline">...more</button>
                  </div>
               ))}
            </div>
            <div className="mt-6 text-center md:text-left">
               <Link href="/reviews" className="text-teal-700 font-bold hover:underline text-sm tracking-wide">Read all review on Google maps</Link>
            </div>
         </div>
      </section>


      {/* 7. BLOGS SECTION */}
      {blogsSection && (
        <section className="py-24 bg-gray-50 text-black px-4 sm:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
             <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">To Stay Informed</h2>
              <Link href="/blogs" className="text-blue-600 font-bold hover:underline">View All Blogs →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {blogsSection.assets.slice(0, 2).map((blogImage, idx) => (
                  <div key={idx} className="group relative h-80 rounded-3xl overflow-hidden shadow-xl cursor-pointer">
                     <img src={blogImage.src} alt={blogImage.alt} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                     <div className="absolute bottom-0 left-0 p-8">
                        <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">Guide</div>
                        <h3 className="text-2xl font-bold text-white line-clamp-2">{blogImage.alt.replace("Main Image ", "")}</h3>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. FAQ SECTION */}
      {faqSection && (
        <section className="py-24 bg-white text-black px-4 sm:px-8 lg:px-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Frequently Asked Questions</h2>
            {faqSection.paragraphs.slice(0, 4).map((faq, idx) => (
               <div key={idx} className="bg-gray-50 rounded-2xl p-6 text-left shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-2">{faqSection.headings[idx+1]?.text || "Question"}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq}</p>
               </div>
            ))}
          </div>
        </section>
      )}

      {/* UNIFIED LUXURY FOOTER */}
      <Footer />

    </main>
  );
}
