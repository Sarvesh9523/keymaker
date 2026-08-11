import React from 'react';
import { SITE_DATA } from '../config/siteData';

/**
 * KeyMaker Signature Animated Loader Component
 * Features an animated key inserting into a lock, turning, and opening the lock shackle.
 */
const KeyLockLoader = ({ text = "Securing Connection...", fullScreen = true }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-5 text-center select-none p-6">
      
      {/* Key & Lock Stage Box */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Ambient Glows */}
        <div className="absolute inset-0 rounded-3xl bg-yellow-400/25 animate-ping opacity-75 pointer-events-none" />
        <div className="absolute -inset-3 rounded-full bg-blue-600/20 blur-xl animate-pulse pointer-events-none" />

        {/* Lock Container */}
        <div className="relative w-24 h-24 bg-gradient-to-b from-blue-950 to-slate-900 rounded-2xl border-2 border-yellow-400/90 shadow-2xl flex items-center justify-center overflow-hidden">
          
          {/* Animated SVG Lock and Key */}
          <svg
            viewBox="0 0 100 100"
            className="w-16 h-16 text-yellow-400 drop-shadow-[0_4px_12px_rgba(250,204,21,0.5)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Lock Shackle (Unlocks & Lifts Up) */}
            <g className="animate-lockShackle">
              <path
                d="M34 45V28C34 19.1634 41.1634 12 50 12C58.8366 12 66 19.1634 66 28V39"
                stroke="#FACC15"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </g>

            {/* Lock Main Body */}
            <rect
              x="24"
              y="40"
              width="52"
              height="46"
              rx="10"
              fill="#0F172A"
              stroke="#FACC15"
              strokeWidth="5"
            />

            {/* Lock Keyhole Center */}
            <circle cx="50" cy="56" r="4.5" fill="#FACC15" />
            <path d="M47.5 57L46 70H54L52.5 57H47.5Z" fill="#FACC15" />

            {/* Key Inserting & Turning Animation */}
            <g className="animate-keyTurn">
              {/* Key Shaft & Teeth */}
              <path
                d="M50 82V56M50 71H56M50 76H54"
                stroke="#38BDF8"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Key Ring Bow */}
              <circle cx="50" cy="85" r="5" stroke="#38BDF8" strokeWidth="4" fill="#0F172A" />
            </g>
          </svg>
        </div>
      </div>

      {/* KeyMaker Brand & Status Message */}
      <div className="space-y-1.5 z-10">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-xl font-black text-blue-950 tracking-tight">{SITE_DATA.brandName}</span>
          <span className="text-xl font-black text-yellow-500">.</span>
        </div>
        <p className="text-[11px] font-bold text-slate-500 tracking-tight">
          {SITE_DATA.hindiTagline}
        </p>
        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
          <p className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">{text}</p>
        </div>
      </div>

    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md transition-all duration-300">
        <div className="bg-white/95 backdrop-blur-xl border-2 border-yellow-400/80 rounded-3xl shadow-2xl shadow-blue-950/30 max-w-sm w-full mx-4">
          {loaderContent}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {loaderContent}
    </div>
  );
};

export default KeyLockLoader;
