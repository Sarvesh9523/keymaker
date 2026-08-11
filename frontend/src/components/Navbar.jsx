import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SITE_DATA } from '../config/siteData';
import {
  Key,
  Phone,
  MessageSquare,
  Menu,
  X,
  Home,
  Layers,
  Info,
  Image as ImageIcon,
  Mail,
} from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const scrollToSection = (id, tabName) => {
    setActiveTab(tabName);
    setMobileMenuOpen(false);

    const doScroll = () => {
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -85; // Account for sticky navbar height
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(doScroll, 150);
    } else {
      doScroll();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Logo & Hindi Tagline */}
          <Link
            to="/"
            onClick={() => scrollToSection('hero', 'home')}
            className="flex items-center gap-3 group focus:outline-none shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-yellow-400 flex items-center justify-center text-blue-950 shadow-md shadow-yellow-400/30 group-hover:scale-105 transition-transform duration-200">
              <Key className="w-6 h-6 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-blue-950 tracking-tight">{SITE_DATA.brandName}</span>
                <span className="text-2xl font-black text-yellow-500">.</span>
              </div>
              <p className="text-[11px] font-bold text-slate-600 tracking-tight">
                {SITE_DATA.hindiTagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-700">
            <button
              onClick={() => scrollToSection('hero', 'home')}
              className={`relative py-1 transition-colors hover:text-blue-600 ${
                activeTab === 'home' ? 'text-blue-900 font-extrabold' : ''
              }`}
            >
              <span>Home</span>
              {activeTab === 'home' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-1 bg-yellow-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('services-cards', 'services')}
              className={`relative py-1 transition-colors hover:text-blue-600 ${
                activeTab === 'services' ? 'text-blue-900 font-extrabold' : ''
              }`}
            >
              <span>Services</span>
              {activeTab === 'services' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-1 bg-yellow-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('about-us', 'about')}
              className={`relative py-1 transition-colors hover:text-blue-600 ${
                activeTab === 'about' ? 'text-blue-900 font-extrabold' : ''
              }`}
            >
              <span>About Us</span>
              {activeTab === 'about' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-1 bg-yellow-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('services-cards', 'gallery')}
              className={`relative py-1 transition-colors hover:text-blue-600 ${
                activeTab === 'gallery' ? 'text-blue-900 font-extrabold' : ''
              }`}
            >
              <span>Gallery</span>
              {activeTab === 'gallery' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-1 bg-yellow-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('query-form', 'contact')}
              className={`relative py-1 transition-colors hover:text-blue-600 ${
                activeTab === 'contact' ? 'text-blue-900 font-extrabold' : ''
              }`}
            >
              <span>Contact</span>
              {activeTab === 'contact' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-1 bg-yellow-400 rounded-full" />
              )}
            </button>
          </div>

          {/* Right Call & WhatsApp Pills */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Phone Button */}
            <a
              href={SITE_DATA.callUrl}
              className="bg-blue-950 hover:bg-blue-900 text-white py-2.5 px-4 rounded-2xl flex items-center gap-3 shadow-md border border-blue-900 transition-all hover:scale-[1.02]"
            >
              <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-yellow-300">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black tracking-wider text-white">{SITE_DATA.phone}</div>
                <div className="text-[10px] font-semibold text-slate-300">Call Now (24x7)</div>
              </div>
            </a>

            {/* WhatsApp Button */}
            <a
              href={SITE_DATA.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-50 text-slate-900 py-2.5 px-4 rounded-2xl flex items-center gap-3 shadow-sm border border-slate-300 transition-all hover:scale-[1.02]"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                <MessageSquare className="w-4 h-4 fill-white" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900">WhatsApp Us</div>
                <div className="text-[10px] font-semibold text-slate-500">Quick Response</div>
              </div>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-blue-50 text-blue-900 hover:bg-blue-100 transition-colors focus:outline-none border border-blue-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-blue-950" /> : <Menu className="w-6 h-6 text-blue-950" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b-2 border-yellow-400 px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-2xl">
          <button
            onClick={() => scrollToSection('hero', 'home')}
            className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-between transition-all ${
              activeTab === 'home'
                ? 'bg-blue-950 text-white shadow-md'
                : 'text-slate-800 hover:bg-blue-50 hover:text-blue-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-yellow-400' : 'text-blue-600'}`} />
              <span>Home</span>
            </div>
            {activeTab === 'home' && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
          </button>

          <button
            onClick={() => scrollToSection('services-cards', 'services')}
            className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-between transition-all ${
              activeTab === 'services'
                ? 'bg-blue-950 text-white shadow-md'
                : 'text-slate-800 hover:bg-blue-50 hover:text-blue-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className={`w-4 h-4 ${activeTab === 'services' ? 'text-yellow-400' : 'text-blue-600'}`} />
              <span>Our Services</span>
            </div>
            {activeTab === 'services' && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
          </button>

          <button
            onClick={() => scrollToSection('about-us', 'about')}
            className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-between transition-all ${
              activeTab === 'about'
                ? 'bg-blue-950 text-white shadow-md'
                : 'text-slate-800 hover:bg-blue-50 hover:text-blue-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Info className={`w-4 h-4 ${activeTab === 'about' ? 'text-yellow-400' : 'text-blue-600'}`} />
              <span>About Us & Guarantees</span>
            </div>
            {activeTab === 'about' && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
          </button>

          <button
            onClick={() => scrollToSection('services-cards', 'gallery')}
            className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-between transition-all ${
              activeTab === 'gallery'
                ? 'bg-blue-950 text-white shadow-md'
                : 'text-slate-800 hover:bg-blue-50 hover:text-blue-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <ImageIcon className={`w-4 h-4 ${activeTab === 'gallery' ? 'text-yellow-400' : 'text-blue-600'}`} />
              <span>Service Gallery</span>
            </div>
            {activeTab === 'gallery' && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
          </button>

          <button
            onClick={() => scrollToSection('query-form', 'contact')}
            className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-between transition-all ${
              activeTab === 'contact'
                ? 'bg-blue-950 text-white shadow-md'
                : 'text-slate-800 hover:bg-blue-50 hover:text-blue-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className={`w-4 h-4 ${activeTab === 'contact' ? 'text-yellow-400' : 'text-blue-600'}`} />
              <span>Contact & Query Form</span>
            </div>
            {activeTab === 'contact' && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
          </button>

          {/* Quick Emergency Action Pills */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              href={SITE_DATA.callUrl}
              className="w-full py-3.5 px-4 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-black text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Phone className="w-4 h-4 text-blue-950" />
              <span>Call Now (24x7): {SITE_DATA.phone}</span>
            </a>

            <a
              href={SITE_DATA.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Us (Quick Response)</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
