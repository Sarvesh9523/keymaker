import React from 'react';
import PublicQueryPage from './PublicQueryPage';
import { SITE_DATA } from '../config/siteData';
import WhatsAppIcon from '../components/WhatsAppIcon';
import {
  Phone,
  Star,
  Clock,
  UserCheck,
  Cpu,
  ShieldCheck,
  BadgeIndianRupee,
  Home as HomeIcon,
  CheckCircle,
  Building,
  Key,
  Radio,
  Scissors,
  MapPin,
  Car,
  Bike,
  ThumbsUp,
} from 'lucide-react';

const HomePage = () => {
  const scrollToQueryForm = () => {
    const el = document.getElementById('query-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-x-hidden">
      
      {/* ========================================== */}
      {/* 1. HERO SECTION (#hero)                    */}
      {/* ========================================== */}
      <section id="hero" className="relative bg-gradient-to-b from-slate-100 via-white to-slate-50 py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-8 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Hero Left Content Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500 animate-pulse" />
              {SITE_DATA.operatingHours}
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-blue-950 tracking-tight leading-tight">
              Locked Out? <br />
              <span className="text-yellow-500">We're On Our Way!</span>
            </h1>

            {/* Hindi Tagline Subheading */}
            <div className="space-y-1">
              <p className="text-lg sm:text-2xl font-black text-slate-800 leading-snug">
                कार हो, बाइक हो या घर का ताला – <span className="text-blue-600">समाधान तुरंत!</span>
              </p>
              <p className="text-xs sm:text-base font-bold text-slate-500">
                Gurugram's Most Trusted Locksmith Service
              </p>
            </div>

            {/* 5 Feature Icons Row */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 pt-1 pb-1">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-sm text-left">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[10px] sm:text-[11px] font-black text-blue-950 leading-none">20-30 Min</div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 mt-0.5">Min Arrival</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-sm text-left">
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[10px] sm:text-[11px] font-black text-blue-950 leading-none">Trained</div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 mt-0.5">Professionals</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-sm text-left">
                <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[10px] sm:text-[11px] font-black text-blue-950 leading-none">Latest</div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 mt-0.5">Technology</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-sm text-left">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[10px] sm:text-[11px] font-black text-blue-950 leading-none">Damage Free</div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 mt-0.5">Service</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-sm text-left sm:col-span-1">
                <BadgeIndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[10px] sm:text-[11px] font-black text-blue-950 leading-none">Affordable</div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 mt-0.5">Pricing</div>
                </div>
              </div>
            </div>

            {/* Hero Action Buttons & Google Review Box (Single 3-Column Row on Mobile) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 pt-1 w-full">
              
              {/* Call Now Button */}
              <a
                href={SITE_DATA.callUrl}
                className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-black shadow-md shadow-yellow-500/20 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 transition-all hover:scale-[1.02]"
              >
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-blue-950 flex items-center justify-center text-yellow-300 shrink-0">
                  <Phone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[10px] sm:text-xs md:text-sm font-black leading-tight">Call Now</div>
                  <div className="text-[8px] sm:text-[10px] font-extrabold text-blue-900/80 leading-none truncate">24x7 Support</div>
                </div>
              </a>

              {/* WhatsApp Button */}
              <a
                href={SITE_DATA.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold shadow-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 transition-all hover:scale-[1.02]"
              >
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <WhatsAppIcon className="w-3 h-3 sm:w-4 sm:h-4 fill-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[10px] sm:text-xs md:text-sm font-black leading-tight">WhatsApp</div>
                  <div className="text-[8px] sm:text-[10px] font-semibold text-slate-500 leading-none truncate">Quick Chat</div>
                </div>
              </a>

              {/* Google Rating Box */}
              <div className="bg-white py-2.5 px-1.5 sm:py-3.5 sm:px-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] sm:text-sm text-blue-600 shrink-0">
                  G
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] sm:text-xs font-black text-slate-900">4.7</span>
                    <div className="flex text-yellow-400">
                      <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-yellow-400" />
                      <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-yellow-400" />
                      <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-yellow-400" />
                      <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-yellow-400" />
                      <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="text-[7px] sm:text-[9px] font-bold text-slate-400 truncate">100+ Reviews</div>
                </div>
              </div>

            </div>

          </div>

          {/* Hero Right Visual Graphic Column */}
          <div className="lg:col-span-5 relative flex justify-center pt-4 lg:pt-0">
            
            {/* 24x7 Emergency Glowing Circle Badge */}
            <div className="absolute -top-2 -right-1 sm:-top-4 sm:-right-2 z-20 bg-yellow-400 border-2 sm:border-4 border-white text-blue-950 w-20 h-20 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-center shadow-xl font-black rotate-12">
              <span className="text-base sm:text-xl font-black leading-none">24x7</span>
              <span className="text-[7px] sm:text-[9px] uppercase tracking-wider font-extrabold leading-tight">EMERGENCY<br />SERVICE</span>
            </div>

            {/* Locksmith Hero Image Box */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-t from-blue-950 via-blue-900 to-slate-800 max-w-xs sm:max-w-sm w-full">
              <img
                src="/hero_technician.png"
                alt="KeyMaker Technician"
                className="w-full h-64 sm:h-96 object-cover object-top"
              />

              {/* Overlay Features Card Box */}
              <div className="bg-blue-950 border-t-2 border-yellow-400 p-3.5 sm:p-4 text-white space-y-2.5 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-yellow-400 text-blue-950 flex items-center justify-center font-black shrink-0">
                    <HomeIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-xs sm:text-sm leading-tight">Home Service</div>
                    <div className="text-[10px] sm:text-xs text-yellow-300 font-semibold">हम आपके पास आते हैं</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-yellow-400 text-blue-950 flex items-center justify-center font-black shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-xs sm:text-sm leading-tight">Genuine Parts</div>
                    <div className="text-[10px] sm:text-xs text-yellow-300 font-semibold">100% ओरिजिनल पार्ट्स</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-yellow-400 text-blue-950 flex items-center justify-center font-black shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-xs sm:text-sm leading-tight">Expert Technicians</div>
                    <div className="text-[10px] sm:text-xs text-yellow-300 font-semibold">अनुभवी और प्रोफ़ेशनल</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-yellow-400 text-blue-950 flex items-center justify-center font-black shrink-0">
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-xs sm:text-sm leading-tight">Trusted by 1000+</div>
                    <div className="text-[10px] sm:text-xs text-yellow-300 font-semibold">खुश ग्राहकों का भरोसा</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 2. CATEGORY CARDS SECTION (#services-cards) */}
      {/* ========================================== */}
      <section id="services-cards" className="py-10 sm:py-16 px-2 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
          
          <div className="text-center space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-900 border border-yellow-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
              Locksmith Specialization
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-blue-950 tracking-tight">
              Our Professional KeyMaker Services
            </h2>
            <p className="text-[11px] sm:text-sm font-semibold text-slate-500 max-w-xl mx-auto">
              Select your required key or lock service below for instant assistance and query ticket dispatch.
            </p>
          </div>

          {/* 7 Services Grid Cards (3 Columns Grid on Mobile Screen) */}
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            
            {/* Card 1: Car Key Duplication */}
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between">
              <div>
                <div className="relative h-24 sm:h-36 md:h-44 w-full overflow-hidden bg-slate-200">
                  <img
                    src="/assets/services/car_key.jpg"
                    alt="Car Key Duplication"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-blue-950 text-yellow-400 flex items-center justify-center shadow-lg border-2 border-white">
                    <Car className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                </div>
                <div className="p-2 sm:p-4 text-left space-y-0.5 sm:space-y-1">
                  <h3 className="text-[10px] sm:text-sm md:text-base font-black text-blue-950 leading-tight">Car Key Duplication</h3>
                  <p className="text-[8px] sm:text-xs font-semibold text-slate-500 line-clamp-2">All Car Keys Made & Programmed</p>
                </div>
              </div>
              <div className="p-1.5 sm:p-3 bg-white border-t border-slate-200">
                <button
                  onClick={scrollToQueryForm}
                  className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl font-extrabold text-[9px] sm:text-xs bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <span>Book</span>
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Bike Key Duplication */}
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between">
              <div>
                <div className="relative h-24 sm:h-36 md:h-44 w-full overflow-hidden bg-slate-200">
                  <img
                    src="/assets/services/bike_key.jpg"
                    alt="Bike Key Duplication"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-blue-950 text-yellow-400 flex items-center justify-center shadow-lg border-2 border-white">
                    <Bike className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                </div>
                <div className="p-2 sm:p-4 text-left space-y-0.5 sm:space-y-1">
                  <h3 className="text-[10px] sm:text-sm md:text-base font-black text-blue-950 leading-tight">Bike Key Duplication</h3>
                  <p className="text-[8px] sm:text-xs font-semibold text-slate-500 line-clamp-2">All Bike Keys Made & Duplicated</p>
                </div>
              </div>
              <div className="p-1.5 sm:p-3 bg-white border-t border-slate-200">
                <button
                  onClick={scrollToQueryForm}
                  className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl font-extrabold text-[9px] sm:text-xs bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <span>Book</span>
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Smart Key Programming */}
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between">
              <div>
                <div className="relative h-24 sm:h-36 md:h-44 w-full overflow-hidden bg-slate-200">
                  <img
                    src="/assets/services/smart_key.jpg"
                    alt="Smart Key Programming"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-blue-950 text-yellow-400 flex items-center justify-center shadow-lg border-2 border-white">
                    <Key className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                </div>
                <div className="p-2 sm:p-4 text-left space-y-0.5 sm:space-y-1">
                  <h3 className="text-[10px] sm:text-sm md:text-base font-black text-blue-950 leading-tight">Smart Key Programming</h3>
                  <p className="text-[8px] sm:text-xs font-semibold text-slate-500 line-clamp-2">Push Start / Smart Keys Specialists</p>
                </div>
              </div>
              <div className="p-1.5 sm:p-3 bg-white border-t border-slate-200">
                <button
                  onClick={scrollToQueryForm}
                  className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl font-extrabold text-[9px] sm:text-xs bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <span>Book</span>
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 4: Home Lock Services */}
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between">
              <div>
                <div className="relative h-24 sm:h-36 md:h-44 w-full overflow-hidden bg-slate-200">
                  <img
                    src="/assets/services/home_lock.jpg"
                    alt="Home Lock Services"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-blue-950 text-yellow-400 flex items-center justify-center shadow-lg border-2 border-white">
                    <HomeIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                </div>
                <div className="p-2 sm:p-4 text-left space-y-0.5 sm:space-y-1">
                  <h3 className="text-[10px] sm:text-sm md:text-base font-black text-blue-950 leading-tight">Home Lock Services</h3>
                  <p className="text-[8px] sm:text-xs font-semibold text-slate-500 line-clamp-2">Lock Opening, Repair & Replacement</p>
                </div>
              </div>
              <div className="p-1.5 sm:p-3 bg-white border-t border-slate-200">
                <button
                  onClick={scrollToQueryForm}
                  className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl font-extrabold text-[9px] sm:text-xs bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <span>Book</span>
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 5: Office Lock Solutions */}
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between">
              <div>
                <div className="relative h-24 sm:h-36 md:h-44 w-full overflow-hidden bg-slate-200">
                  <img
                    src="/assets/services/office_lock.jpg"
                    alt="Office Lock Solutions"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-blue-950 text-yellow-400 flex items-center justify-center shadow-lg border-2 border-white">
                    <Building className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                </div>
                <div className="p-2 sm:p-4 text-left space-y-0.5 sm:space-y-1">
                  <h3 className="text-[10px] sm:text-sm md:text-base font-black text-blue-950 leading-tight">Office Lock Solutions</h3>
                  <p className="text-[8px] sm:text-xs font-semibold text-slate-500 line-clamp-2">Office Locks, Cabinets & Access</p>
                </div>
              </div>
              <div className="p-1.5 sm:p-3 bg-white border-t border-slate-200">
                <button
                  onClick={scrollToQueryForm}
                  className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl font-extrabold text-[9px] sm:text-xs bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <span>Book</span>
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 6: Key Cutting & Duplication */}
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between">
              <div>
                <div className="relative h-24 sm:h-36 md:h-44 w-full overflow-hidden bg-slate-200">
                  <img
                    src="/assets/services/key_cutting.jpg"
                    alt="Key Cutting & Duplication"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-blue-950 text-yellow-400 flex items-center justify-center shadow-lg border-2 border-white">
                    <Scissors className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                </div>
                <div className="p-2 sm:p-4 text-left space-y-0.5 sm:space-y-1">
                  <h3 className="text-[10px] sm:text-sm md:text-base font-black text-blue-950 leading-tight">Key Cutting</h3>
                  <p className="text-[8px] sm:text-xs font-semibold text-slate-500 line-clamp-2">All Types of Keys Cut & Duplicated</p>
                </div>
              </div>
              <div className="p-1.5 sm:p-3 bg-white border-t border-slate-200">
                <button
                  onClick={scrollToQueryForm}
                  className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl font-extrabold text-[9px] sm:text-xs bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <span>Book</span>
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 7: Remote Key Repair */}
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between">
              <div>
                <div className="relative h-24 sm:h-36 md:h-44 w-full overflow-hidden bg-slate-200">
                  <img
                    src="/assets/services/remote_key.jpg"
                    alt="Remote Key Repair"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-blue-950 text-yellow-400 flex items-center justify-center shadow-lg border-2 border-white">
                    <Radio className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                </div>
                <div className="p-2 sm:p-4 text-left space-y-0.5 sm:space-y-1">
                  <h3 className="text-[10px] sm:text-sm md:text-base font-black text-blue-950 leading-tight">Remote Key Repair</h3>
                  <p className="text-[8px] sm:text-xs font-semibold text-slate-500">Remote, Key Shell, Battery Replacement & Circuit Repair</p>
                </div>
              </div>
              <div className="p-1.5 sm:p-3 bg-white border-t border-slate-200">
                <button
                  onClick={scrollToQueryForm}
                  className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl font-extrabold text-[9px] sm:text-xs bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <span>Book Service</span>
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 3. TRUSTED & LOCATIONS FOOTER BAR          */}
      {/* ========================================== */}
      <section id="about-us" className="bg-blue-950 text-white py-8 sm:py-10 px-3 sm:px-6 lg:px-8 border-b border-blue-900">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Highlights Header */}
          <div className="text-center space-y-1.5">
            <span className="text-[10px] sm:text-xs font-extrabold text-yellow-400 uppercase tracking-widest">
              Trusted • Fast • Reliable
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">Our Service Guarantees</h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 text-center text-[10px] sm:text-xs font-bold">
            <div className="bg-blue-900/60 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-blue-800">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
              <span>24x7 Emergency</span>
            </div>
            <div className="bg-blue-900/60 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-blue-800">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
              <span>20-30 Min Arrival</span>
            </div>
            <div className="bg-blue-900/60 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-blue-800">
              <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
              <span>On-site Service</span>
            </div>
            <div className="bg-blue-900/60 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-blue-800">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
              <span>Latest Machines</span>
            </div>
            <div className="bg-blue-900/60 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-blue-800">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
              <span>Satisfaction Guaranteed</span>
            </div>
            <div className="bg-blue-900/60 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-blue-800">
              <BadgeIndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
              <span>Transparent Pricing</span>
            </div>
          </div>

          {/* Locations Banner */}
          <div className="bg-white text-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-yellow-400 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-950 text-yellow-400 flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-base font-black text-blue-950 leading-snug">
                  {SITE_DATA.primaryLocation}
                </h4>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5">
                  {SITE_DATA.servingAreas}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 4. PUBLIC QUERY FORM AT BOTTOM (#query-form)*/}
      {/* ZERO WHITESPACE PADDING ABOVE & BELOW      */}
      {/* ========================================== */}
      <section id="query-form" className="py-0 bg-slate-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <PublicQueryPage />
        </div>
      </section>

    </div>
  );
};

export default HomePage;
