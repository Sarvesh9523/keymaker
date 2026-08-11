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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-yellow-300 shadow-md shadow-blue-600/20">
                <Key className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-xl font-extrabold text-blue-950 tracking-tight">{SITE_DATA.brandName} Support</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Fast, reliable support query system with verified email protection and instant ticket creation.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Verified Email Support System
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-extrabold text-blue-950 uppercase tracking-wider mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Home</span>
                </button>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Services</span>
                </a>
              </li>
              <li>
                <a
                  href="#query-form"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 text-blue-700 font-bold"
                >
                  <span>Submit Support Query</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support Info */}
          <div>
            <h4 className="text-xs font-extrabold text-blue-950 uppercase tracking-wider mb-3">
              Support Channels
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <a href={SITE_DATA.callUrl} className="hover:underline font-bold text-slate-800">{SITE_DATA.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{SITE_DATA.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{SITE_DATA.address}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-500">
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
