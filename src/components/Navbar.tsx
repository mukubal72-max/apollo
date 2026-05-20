import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, HeartPulse, Clock, MapPin, MessageCircle, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { siteConfig, setIsOpdPopupOpen } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Medical Services', path: '/services' },
    { name: 'Health Check up', path: '/checkups' },
    { name: 'OPD Schedule', path: '/opd-schedule' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm border-b border-slate-200">
      {/* Top Bar - Orange */}
      <div className="bg-[#f39223] text-white px-4 md:px-8 py-1">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-medium gap-2">
          <div className="flex items-center gap-2">
            <Clock size={12} className="opacity-80" />
            <span>Working Hours : Monday - Sunday : 9:00 AM - 6:30 PM</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin size={12} className="opacity-80" />
              <span>Basti, Uttar Pradesh - 272002</span>
            </div>
            <Link to="/admin" className="bg-white/20 hover:bg-white/40 px-3 py-1 rounded transition-all font-black text-[9px] uppercase tracking-wider">
              Staff Access
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header - White with logo and contact info */}
      <div className="bg-white px-4 md:px-8 py-3">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <img 
                src={siteConfig.logo || "https://www.apolloclinic.com/assets/images/logo.png"} 
                alt={siteConfig.name} 
                className="h-20 md:h-24 w-auto object-contain" 
              />
            </div>
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Clinic Licensee</p>
              <h1 className="text-sm font-black text-primary uppercase tracking-tighter leading-none">C SQUARE MEDCO LLP</h1>
            </div>
          </Link>

          {/* Contact Icons Section */}
          <div className="hidden lg:flex items-center gap-0 font-bold text-[#007a8e]">
            <a href={`tel:${siteConfig.contact?.split(',')[0]?.trim() || '8004055501'}`} className="flex items-center gap-2 hover:text-[#f39223] transition-colors px-4">
              <Phone size={18} className="text-[#f39223]" />
              <span className="text-[11px] uppercase tracking-wide">Call Now</span>
            </a>
            <div className="w-px h-6 bg-slate-200"></div>
            <a href={`https://wa.me/91${siteConfig.contact?.split(',')[0]?.replace(/[^0-9]/g, '') || '8004055501'}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-green-600 transition-colors px-4">
              <MessageCircle size={18} className="text-green-600" />
              <span className="text-[11px] uppercase tracking-wide">WhatsApp</span>
            </a>
            <div className="w-px h-6 bg-slate-200"></div>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-[#f39223] transition-colors px-4">
              <Mail size={18} className="text-[#f39223]" />
              <span className="text-[11px] uppercase tracking-wide">Email</span>
            </a>
            <div className="w-px h-6 bg-slate-200"></div>
            <a 
              href="https://www.google.com/maps?rlz=1C1JJTC_enIN1094IN1094&gs_lcrp=EgZjaHJvbWUqCAgBEAAYFhgeMgYIABBFGDkyCAgBEAAYFhgeMggIAhAAGBYYHjIICAMQABgWGB4yCAgEEAAYFhgeMgYIBRBFGD0yBggGEEUYPTIGCAcQRRg80gEJMTA1MDdqMGo3qAIAsAIA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KSlZDOiA0ZA5MeI7cOrvIN2e&daddr=Railway+Station+Rd,+near+Navin+Fal+Mandi,+Basti,+Uttar+Pradesh+272001" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#f39223] transition-colors px-4"
            >
              <MapPin size={18} className="text-[#f39223]" />
              <span className="text-[11px] uppercase tracking-wide">Clinic Locator</span>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden text-primary" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Navigation Bar - Dark Teal */}
      <nav className="bg-[#007a8e] hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-10">
            {navLinks.map((link, i) => (
              <React.Fragment key={link.path}>
                <Link
                  to={link.path}
                  className={`px-6 h-full flex items-center text-[11px] font-bold uppercase tracking-tight transition-all border-b-4 border-transparent ${
                    location.pathname === link.path 
                    ? 'bg-black text-white' 
                    : 'text-white hover:bg-black/10'
                  }`}
                >
                  {link.name}
                </Link>
                {i < navLinks.length - 1 && (
                  <div className="w-px h-5 bg-white/30"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="lg:hidden fixed inset-0 z-[100] bg-[#007a8e]"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setIsOpen(false)} className="text-white">
                <X size={40} />
              </button>
            </div>
            <div className="flex flex-col items-center gap-4 py-10 overflow-y-auto max-h-[calc(100vh-100px)]">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-bold uppercase tracking-widest ${
                    location.pathname === link.path ? 'text-secondary' : 'text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button 
                onClick={() => { setIsOpdPopupOpen(true); setIsOpen(false); }}
                className="mt-4 px-10 py-4 bg-secondary text-white rounded-full font-black uppercase tracking-widest shadow-xl flex shrink-0"
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
