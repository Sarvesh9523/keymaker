import React from 'react';
import { SITE_DATA } from '../config/siteData';

/**
 * KeyMaker Signature 3D Lock & 3D Key Opening Animated Loader
 * Renders a true 3D Key with extruded depth, bevel highlights, and 3D turning animation inside the 3D lock.
 * Features NO background card container.
 */
const KeyLockLoader = ({ text = "Unlocking Secure Portal...", fullScreen = true }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-6 text-center select-none p-4">
      
      {/* 3D Perspective Stage Container */}
      <div className="relative w-40 h-40 flex items-center justify-center [perspective:1000px]">
        
        {/* Ambient Radial Specular Glow */}
        <div className="absolute inset-0 rounded-full bg-yellow-400/25 blur-2xl animate-pulse pointer-events-none" />

        {/* 3D Lock & Key Scene */}
        <div className="relative w-36 h-36 flex items-center justify-center [transform-style:preserve-3d]">
          
          <svg
            viewBox="0 0 120 120"
            className="w-32 h-32 drop-shadow-[0_16px_32px_rgba(0,0,0,0.55)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Metallic 3D Gold Gradients */}
              <linearGradient id="gold3dGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="35%" stopColor="#FACC15" />
                <stop offset="70%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#713F12" />
              </linearGradient>

              {/* 3D Key Bright Gold Face Gradient */}
              <linearGradient id="keyFaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="50%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>

              {/* Metallic 3D Chrome Shackle Gradient */}
              <linearGradient id="chrome3dGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#E2E8F0" />
                <stop offset="70%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              {/* 3D Dark Slate Body Gradient */}
              <linearGradient id="darkBody3dGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              {/* 3D Specular Highlight */}
              <linearGradient id="specular3d" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 1. 3D Lock Shackle (Unlocks & Opens at ~700ms after key turns) */}
            <g className="animate-shackle3dOpen">
              {/* Shackle Depth Shadow Layer */}
              <path
                d="M40 50V32C40 20.9543 48.9543 12 60 12C71.0457 12 80 20.9543 80 32V44"
                stroke="#020617"
                strokeWidth="11"
                strokeLinecap="round"
                opacity="0.6"
                transform="translate(2.5, 4.5)"
              />
              {/* Shackle Main Metallic Body */}
              <path
                d="M40 50V32C40 20.9543 48.9543 12 60 12C71.0457 12 80 20.9543 80 32V44"
                stroke="url(#chrome3dGrad)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Shackle Specular Highlight */}
              <path
                d="M40 50V32C40 20.9543 48.9543 12 60 12"
                stroke="url(#specular3d)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>

            {/* 2. 3D Lock Body */}
            {/* Outer Bevel Ring */}
            <rect
              x="26"
              y="44"
              width="68"
              height="58"
              rx="14"
              fill="url(#gold3dGrad)"
              stroke="#CA8A04"
              strokeWidth="2"
            />
            {/* Inner Dark Body */}
            <rect
              x="30"
              y="48"
              width="60"
              height="50"
              rx="11"
              fill="url(#darkBody3dGrad)"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Specular Edge Glow */}
            <rect
              x="32"
              y="50"
              width="56"
              height="16"
              rx="8"
              fill="url(#specular3d)"
              opacity="0.25"
            />

            {/* 3D Keyhole Base Ring */}
            <circle cx="60" cy="68" r="8.5" fill="url(#gold3dGrad)" />
            <circle cx="60" cy="68" r="5.5" fill="#020617" />
            <path d="M57 69L55 83H65L63 69H57Z" fill="#020617" />

            {/* 3. EXTRUDED 3D GOLD KEY (Inside keyhole, turns 90deg at 600ms-700ms) */}
            <g className="animate-key3dTurn">
              {/* LAYER A: 3D Dark Rear Extrusion / Shadow */}
              <g transform="translate(3, 3.5)">
                <path
                  d="M60 97V65M60 82H68M60 89H66"
                  stroke="#422006"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="60" cy="104" r="8.5" fill="#422006" />
              </g>

              {/* LAYER B: 3D Gold Bevel Rim Extrusion */}
              <g transform="translate(1.5, 1.8)">
                <path
                  d="M60 97V65M60 82H68M60 89H66"
                  stroke="url(#gold3dGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="60" cy="104" r="8.5" fill="url(#gold3dGrad)" />
              </g>

              {/* LAYER C: 3D Bright Gold Front Face */}
              <path
                d="M60 97V65M60 82H68M60 89H66"
                stroke="url(#keyFaceGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="60" cy="104" r="7.5" fill="url(#keyFaceGrad)" stroke="#A16207" strokeWidth="1.5" />

              {/* LAYER D: 3D Specular Highlight Edge */}
              <path
                d="M59 96V65"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.85"
              />
              <circle cx="60" cy="104" r="3.5" fill="#020617" stroke="#CA8A04" strokeWidth="1" />
            </g>
          </svg>
        </div>

      </div>

      {/* Brand & Hindi Tagline Status Text (Clean, NO Card Background) */}
      <div className="space-y-1.5 z-10">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-2xl font-black text-blue-950 tracking-tight drop-shadow-sm">{SITE_DATA.brandName}</span>
          <span className="text-2xl font-black text-yellow-500">.</span>
        </div>
        <p className="text-xs font-extrabold text-slate-600 tracking-tight drop-shadow-sm">
          {SITE_DATA.hindiTagline}
        </p>
        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
          <p className="text-xs sm:text-sm font-black text-blue-800 uppercase tracking-wider drop-shadow-sm">{text}</p>
        </div>
      </div>

    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-md transition-all duration-300">
        {loaderContent}
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
