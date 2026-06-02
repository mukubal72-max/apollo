import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Calendar, Facebook, Instagram } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';
import ServicesPage from './pages/Services';
import OPDPage from './pages/OPD';
import Contact from './pages/Contact';
import HealthPackages from './pages/HealthPackages';
import Gallery from './pages/Gallery';
import OPDPopup from './components/OPDPopup';
import { useEffect } from 'react';

function AppContent() {
  const { setIsOpdPopupOpen, siteConfig } = useAppContext();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Dynamic Favicon setup
  useEffect(() => {
    // Update Favicon if custom logo exists
    if (siteConfig.logo) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = siteConfig.logo;
      }
    }
  }, [siteConfig.logo]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <OPDPopup />
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 print:hidden">
        <a 
          href={`https://wa.me/${(() => {
            const clean = (siteConfig.contact?.split(',')[0] || '8004055501').replace(/[^0-9]/g, '');
            return clean.length === 10 ? `91${clean}` : clean;
          })()}`}
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:scale-110 transition-all group"
        >
          <MessageCircle size={30} className="group-hover:rotate-12 transition-all" />
          <span className="absolute right-16 bg-white/90 backdrop-blur-sm text-green-600 px-3 py-1 rounded-lg text-xs font-black shadow-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none uppercase tracking-widest whitespace-nowrap">Chat on WhatsApp</span>
        </a>
        <a 
          href={`tel:${siteConfig.contact || '8004055501'}`}
          className="w-14 h-14 bg-secondary text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:scale-110 transition-all lg:hidden group"
        >
          <Phone size={24} />
          <span className="absolute right-16 bg-white/90 backdrop-blur-sm text-secondary px-3 py-1 rounded-lg text-xs font-black shadow-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none uppercase tracking-widest whitespace-nowrap">Call Support</span>
        </a>
        <button 
          onClick={() => setIsOpdPopupOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:scale-110 transition-all group"
        >
          <Calendar size={24} />
          <span className="absolute right-16 bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-lg text-xs font-black shadow-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none uppercase tracking-widest whitespace-nowrap">Book Appointment</span>
        </button>
      </div>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/checkups" element={<HealthPackages />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/opd-schedule" element={<OPDPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      
      <footer className="bg-[#007a8e] text-white pt-20 pb-10 border-t border-white/10">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <img src={siteConfig.logo || "https://www.apolloclinic.com/assets/images/logo.png"} alt="Apollo" className="h-12 w-auto bg-white p-2 rounded-xl" />
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                  <span className="text-secondary">Apollo</span> <span className="text-white">Clinic Basti</span>
                </h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-md uppercase font-medium">
                Providing top-tier healthcare and diagnostic services with specialized care in Basti and surrounding regions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                    <MapPin size={18} className="text-secondary" />
                  </div>
                  <span className="text-xs md:text-sm font-black uppercase tracking-wider leading-snug">APOLLO CLINIC BASTI, Station Road, Basti - 272002</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                    <Phone size={18} className="text-secondary" />
                  </div>
                  <span className="text-xs md:text-sm font-black uppercase tracking-widest">8004055501, 05542451088</span>
                </div>
              </div>
              
              <div className="mt-8 border-t border-white/10 pt-6">
                <h4 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-4 text-[#f39223]">Connect With Us</h4>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://www.facebook.com/share/1BHSEeR7sr/?mibextid=wwXIfr" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#145ec7] text-white px-5 py-3 rounded-full text-xs uppercase tracking-wider font-extrabold transition-all shadow-md shadow-black/20 hover:scale-105 hover:shadow-lg active:scale-95 duration-200"
                  >
                    <Facebook size={14} className="text-white fill-white" />
                    <span>Clinic Facebook</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/apolloclinicbasti?igsh=MXg4eW1tdXV0ZWRjOA==" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white px-5 py-3 rounded-full text-xs uppercase tracking-wider font-extrabold transition-all shadow-md shadow-black/20 hover:scale-105 hover:shadow-lg active:scale-95 duration-200"
                  >
                    <Instagram size={14} className="text-white" />
                    <span>Clinic Instagram</span>
                  </a>
                  <a 
                    href="https://www.facebook.com/share/18f3aBNC8b/?mibextid=wwXIfr" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#145ec7] text-white px-5 py-3 rounded-full text-xs uppercase tracking-wider font-extrabold transition-all shadow-md shadow-black/20 hover:scale-105 hover:shadow-lg active:scale-95 duration-200"
                  >
                    <Facebook size={14} className="text-white fill-white" />
                    <span>Dental Facebook</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/apollodental_basti?igsh=MWdzN2J3NXFtOXBnbA==" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white px-5 py-3 rounded-full text-xs uppercase tracking-wider font-extrabold transition-all shadow-md shadow-black/20 hover:scale-105 hover:shadow-lg active:scale-95 duration-200"
                  >
                    <Instagram size={14} className="text-white" />
                    <span>Dental Instagram</span>
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-6 text-orange-400">Quick Links</h4>
              <ul className="space-y-3.5 font-black text-xs md:text-[13px] tracking-widest uppercase">
                <li><Link to="/" className="text-white/85 hover:text-white transition-colors hover:underline">Home</Link></li>
                <li><Link to="/about" className="text-white/85 hover:text-white transition-colors hover:underline">About Us</Link></li>
                <li><Link to="/services" className="text-white/85 hover:text-white transition-colors hover:underline">Medical Services</Link></li>
                <li><Link to="/checkups" className="text-white/85 hover:text-white transition-colors hover:underline">Health Check up</Link></li>
                <li><Link to="/opd-schedule" className="text-white/85 hover:text-white transition-colors hover:underline">OPD Schedule</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-6 text-orange-400">Staff Support</h4>
              <div className="p-6 bg-white/10 rounded-3xl border border-white/20">
                <p className="text-xs font-black uppercase text-white/70 mb-3">Internal Login</p>
                <Link to="/admin" className="text-base md:text-lg font-black text-white px-6 py-2.5 bg-secondary hover:bg-secondary/90 rounded-2xl hover:scale-105 active:scale-95 transition-all inline-block shadow-lg shadow-black/10">Staff Access</Link>
                <p className="text-[10px] md:text-xs font-bold text-white/50 italic mt-4">Authorized Personnel Only</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">&copy; {new Date().getFullYear()} Apollo Clinic Basti. {siteConfig.footerOwner || "Apollo Clinic Basti"}.</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Powered by Digital Communique Private Limited</p>
            </div>
            <div className="flex gap-8 uppercase font-bold text-[10px] tracking-widest">
              <span className="text-white/60 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="text-white/60 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
