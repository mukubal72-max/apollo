import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ExternalLink, 
  Download, 
  Eye, 
  HelpCircle,
  PhoneCall,
  Calendar
} from 'lucide-react';

interface PosterMeta {
  title: string;
  subtitle: string;
  category: 'Specialist OPD' | 'Dental' | 'Health Packages' | 'General';
}

const POSTER_METADATA: Record<string, PosterMeta> = {
  'Apollo_Neuro': {
    title: 'Dr. Diwakar Shankar - Neurosurgery & Spine',
    subtitle: 'Senior Specialist from Apollo Medics Super Speciality Hospital Lucknow • Monthly Visiting OPD',
    category: 'Specialist OPD'
  },
  'Apollo_Dental': {
    title: 'Dr. Vikas Kumar - Apollo Dental Speciality Clinic',
    subtitle: 'B.D.S. Dental Surgeon • Mon to Fri 11:00 AM - 05:00 PM',
    category: 'Dental'
  },
  'Apollo_Gynno': {
    title: 'Dr. Shivangi Chaudhary - Gynecology & Obstetrics',
    subtitle: 'M.B.B.S., M.S., DNB • Laparoscopic Surgery & IVF Specialist • Tue & Fri 2:00 PM - 4:00 PM',
    category: 'Specialist OPD'
  },
  'Apollo_Child': {
    title: 'Dr. A. K. Patel - Pediatrics & Child Care',
    subtitle: 'M.B.B.S., DNB (Pediatrics) • Ex Cloudnine Hospital Delhi • Daily OPD Schedule',
    category: 'Specialist OPD'
  },
  'Apollo_Gen_Physician': {
    title: 'Dr. Ashraf Jamal - General Physician',
    subtitle: 'M.B.B.S., Dip. Card (Ex-Resident BHU) • Mon to Sat 2:00 PM - 6:00 PM',
    category: 'Specialist OPD'
  },
  'Apollo_OPD': {
    title: 'Apollo Super Speciality OPD Schedule',
    subtitle: 'Visiting Senior Specialists: Neuro, Cardio, Oncology, Urology from Apollo Hospital Lucknow',
    category: 'Specialist OPD'
  },
  'Apolloo_health_check_packages': {
    title: 'Apollo Preventive Health Check Packages',
    subtitle: 'Primary, Whole Body, Executive, Men & Women Screening with 10% Discount on Home Collection',
    category: 'Health Packages'
  }
};

function getPosterInfo(imgUrl: string, index: number): PosterMeta {
  for (const [key, meta] of Object.entries(POSTER_METADATA)) {
    if (imgUrl.includes(key)) return meta;
  }
  return {
    title: `Apollo Clinic Poster ${index + 1}`,
    subtitle: 'Official Medical Update & Diagnostic Service • Apollo Clinic Basti',
    category: 'General'
  };
}

export default function Gallery() {
  const { siteConfig, setIsOpdPopupOpen } = useAppContext();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Exact 7 authentic compressed posters from Apollo Clinic Basti
  const fallbackImages = [
    "/assets/aistudio/Apollo_Neuro_d157e19e.jpeg",
    "/assets/aistudio/Apollo_Dental_b9814089.jpeg",
    "/assets/aistudio/Apollo_Gynno_f9d7aea8.jpeg",
    "/assets/aistudio/Apollo_Child__1__e7446587.jpeg",
    "/assets/aistudio/Apollo_Gen_Physician_e09ab5f4.jpeg",
    "/assets/aistudio/Apollo_OPD__1__c3ebad57.jpeg",
    "/assets/aistudio/Apolloo_health_check_packages_6b14f49a.jpeg",
  ];

  const images = useMemo(() => {
    if (siteConfig.gallery && siteConfig.gallery.length > 0) {
      // Discard any legacy dummy unsplash URLs
      const filtered = siteConfig.gallery.filter(g => !g.includes('unsplash.com'));
      if (filtered.length > 0) return filtered;
    }
    return fallbackImages;
  }, [siteConfig.gallery]);

  // Filtered gallery view
  const filteredImages = useMemo(() => {
    if (activeFilter === 'All') return images;
    return images.filter((img, i) => {
      const meta = getPosterInfo(img, i);
      return meta.category === activeFilter;
    });
  }, [images, activeFilter]);

  // Handle keyboard navigation & lock background scroll
  useEffect(() => {
    if (selectedIdx === null) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIdx, filteredImages]);

  const handlePrev = () => {
    setZoomScale(1);
    setSelectedIdx((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredImages.length - 1 : prev - 1;
    });
  };

  const handleNext = () => {
    setZoomScale(1);
    setSelectedIdx((prev) => {
      if (prev === null) return null;
      return prev === filteredImages.length - 1 ? 0 : prev + 1;
    });
  };

  const handleClose = () => {
    setSelectedIdx(null);
    setZoomScale(1);
  };

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomScale(1);
  };

  const handleDownload = (imgUrl: string, index: number) => {
    try {
      const link = document.createElement('a');
      link.href = imgUrl;
      link.download = `apollo-clinic-basti-poster-${index + 1}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  const currentPoster = selectedIdx !== null ? filteredImages[selectedIdx] : null;
  const currentPosterInfo = currentPoster ? getPosterInfo(currentPoster, selectedIdx!) : null;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-8">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-black uppercase text-secondary tracking-[0.2em] mb-4 block">Official Posters & Gallery</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">
              Clinic <span className="text-primary">Gallery</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
              Explore authentic notices, specialist OPD schedules, pediatric, dental, and preventive health package posters for Apollo Clinic Basti.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {['All', 'Specialist OPD', 'Dental', 'Health Packages'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveFilter(tab);
                  setSelectedIdx(null);
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === tab
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab === 'All' ? `All Posters (${images.length})` : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 border-t border-slate-200/80 pt-10">
          {filteredImages.map((img, i) => {
            const meta = getPosterInfo(img, i);
            return (
              <motion.div
                key={img}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                onClick={() => setSelectedIdx(i)}
                className="group relative h-[420px] md:h-[480px] rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200 bg-slate-950 cursor-pointer hover:border-secondary/60 hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Poster Display with high fidelity contain */}
                <div className="relative flex-1 w-full overflow-hidden bg-slate-900 flex items-center justify-center p-3">
                  <img 
                    src={img} 
                    alt={meta.title} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md border border-white/10">
                      {meta.category}
                    </span>
                  </div>

                  {/* Expand Overlay Pill */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-secondary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      <Eye size={12} /> Click To View
                    </span>
                  </div>
                </div>

                {/* Card Footer Details */}
                <div className="p-5 bg-white border-t border-slate-100 flex items-center justify-between gap-4 z-10">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-secondary truncate">{meta.category}</p>
                    <h3 className="text-slate-900 font-black text-sm uppercase tracking-tight truncate">{meta.title}</h3>
                    <p className="text-slate-500 text-xs font-medium truncate mt-0.5">{meta.subtitle}</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-primary group-hover:text-white text-slate-700 flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <Eye size={18} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox / Fullscreen Viewer */}
      <AnimatePresence>
        {selectedIdx !== null && currentPoster && currentPosterInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-slate-950/98 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-white/10 backdrop-blur-md z-30 shrink-0">
              {/* Title / Counter */}
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-xs uppercase font-black text-secondary tracking-widest">
                    {currentPosterInfo.category}
                  </span>
                </div>
                <div className="hidden md:block w-px h-4 bg-white/20"></div>
                <span className="text-white font-black text-xs uppercase tracking-wider truncate max-w-xs md:max-w-md">
                  {currentPosterInfo.title}
                </span>
                <span className="text-slate-400 font-bold text-xs">
                  ({selectedIdx + 1} of {filteredImages.length})
                </span>
                {zoomScale > 1 && (
                  <span className="text-[10px] bg-secondary text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    Zoom: {Math.round(zoomScale * 100)}%
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 mr-2">
                  <button 
                    onClick={handleZoomOut}
                    disabled={zoomScale === 1}
                    className="p-2 text-white hover:text-secondary disabled:opacity-40 transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button 
                    onClick={handleResetZoom}
                    disabled={zoomScale === 1}
                    className="p-2 text-white hover:text-secondary disabled:opacity-40 transition-colors cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button 
                    onClick={handleZoomIn}
                    disabled={zoomScale === 3}
                    className="p-2 text-white hover:text-secondary disabled:opacity-40 transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>

                {/* Open in New Tab */}
                <a 
                  href={currentPoster} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-white/15 text-white/90 hover:text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all border border-white/15 cursor-pointer"
                  title="Open full resolution poster in a new tab"
                >
                  <ExternalLink size={16} className="text-secondary" />
                  <span className="hidden md:inline">Full Size</span>
                </a>

                {/* Download */}
                <button 
                  onClick={() => handleDownload(currentPoster, selectedIdx!)}
                  className="p-3 bg-white/5 hover:bg-white/15 text-white/90 hover:text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all border border-white/15 cursor-pointer"
                  title="Download poster"
                >
                  <Download size={16} />
                  <span className="hidden md:inline">Download</span>
                </button>

                {/* Close Button */}
                <button 
                  onClick={handleClose}
                  className="p-3 bg-secondary hover:bg-secondary/90 text-white rounded-2xl flex items-center justify-center aspect-square shadow-lg shadow-secondary/30 hover:scale-[1.05] active:scale-[0.95] transition-all cursor-pointer"
                  title="Close lightbox"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Stage */}
            <div className="relative flex-1 flex items-center justify-between px-2 sm:px-6 md:px-12 py-4 select-none overflow-hidden z-20">
              {/* Left Arrow */}
              <button 
                onClick={handlePrev}
                className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-secondary text-white hover:text-secondary transition-all hover:scale-110 shrink-0 z-30 cursor-pointer"
                aria-label="Previous Poster"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Central Dynamic Image Viewport */}
              <div className="flex-1 h-full flex items-center justify-center overflow-auto p-2 sm:p-4 relative">
                <motion.div 
                  key={currentPoster}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-full max-h-full flex items-center justify-center"
                >
                  <img 
                    src={currentPoster} 
                    alt={currentPosterInfo.title} 
                    style={{ transform: `scale(${zoomScale})`, transformOrigin: 'center center' }}
                    className="max-w-[85vw] max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/15 transition-transform duration-300 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>

              {/* Right Arrow */}
              <button 
                onClick={handleNext}
                className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-secondary text-white hover:text-secondary transition-all hover:scale-110 shrink-0 z-30 cursor-pointer"
                aria-label="Next Poster"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Details & Booking Action */}
            <div className="bg-slate-950/95 border-t border-white/10 py-4 px-6 md:px-12 text-center shrink-0 z-30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-white font-black text-sm uppercase tracking-wide">
                  {currentPosterInfo.title}
                </p>
                <p className="text-slate-400 text-xs font-medium mt-0.5">
                  {currentPosterInfo.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`tel:${siteConfig.contact?.split(',')[0] || '8004055501'}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border border-white/15 transition-all"
                >
                  <PhoneCall size={14} className="text-secondary" />
                  <span>Call: 8004055501</span>
                </a>
                <button
                  onClick={() => {
                    handleClose();
                    setIsOpdPopupOpen(true);
                  }}
                  className="px-5 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-secondary/30 transition-all cursor-pointer"
                >
                  <Calendar size={14} />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
