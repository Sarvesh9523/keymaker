import React from 'react';
import { SITE_DATA } from '../config/siteData';
import WhatsAppIcon from './WhatsAppIcon';

/**
 * Floating WhatsApp Widget Button
 * Fixed at bottom right of screen across all devices
 */
const FloatingWhatsApp = () => {
  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center gap-2 group">
      {/* Optional Hover Label Tooltip */}
      <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat on WhatsApp
      </span>

      {/* Floating Action Button */}
      <a
        href={SITE_DATA.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with KeyMaker on WhatsApp"
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white focus:outline-none"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 fill-white relative z-10" />

        {/* Online Status Dot */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-white z-20" />
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
