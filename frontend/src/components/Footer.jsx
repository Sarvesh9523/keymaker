import React from 'react';
import { SITE_DATA } from '../config/siteData';
import { Key, Mail, Phone, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-blue-100 text-slate-600 relative overflow-hidden">
      {/* Top accent border line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-5 space-y-2.5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-yellow-300 shadow-md shadow-blue-600/20">
                <Key className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-xl font-extrabold text-blue-950 tracking-tight">{SITE_DATA.brandName} Support</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Fast, 24x7 locksmith support query system with verified ticket generation and instant arrival.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{SITE_DATA.hindiTagline}</span>
            </div>
          </div>

          {/* Columns 2 & 3 in SAME ROW (2-Column Grid on Mobile) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-8 text-left border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
            
            {/* Column 2: Quick Navigation */}
            <div>
              <h4 className="text-xs font-extrabold text-blue-950 uppercase tracking-wider mb-2.5">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                <li>
                  <button
                    onClick={scrollToTop}
                    className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span>Home</span>
                  </button>
                </li>
                <li>
                  <a
                    href="#services-cards"
                    className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span>Services</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#query-form"
                    className="hover:text-blue-600 transition-colors flex items-center gap-1.5 text-blue-700 font-bold"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>Submit Query</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Support Channels */}
            <div>
              <h4 className="text-xs font-extrabold text-blue-950 uppercase tracking-wider mb-2.5">
                Support Channels
              </h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <a href={SITE_DATA.callUrl} className="font-bold text-slate-900 hover:underline">{SITE_DATA.phone}</a>
                </li>
                <li className="flex items-center gap-2 text-slate-700 truncate">
                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{SITE_DATA.email}</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-tight font-semibold">{SITE_DATA.address}</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-500">
          <p>© {new Date().getFullYear()} {SITE_DATA.brandName} Support. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Protected & Verified Support System</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
