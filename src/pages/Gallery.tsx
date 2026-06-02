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
  HelpCircle 
} from 'lucide-react';

export default function Gallery() {
  const { siteConfig } = useAppContext();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1581595221475-ad663b52bc5b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1538108197017-c1a986ded3d7?auto=format&fit=crop&q=80&w=800",
  ];

  const images = useMemo(() => {
    if (siteConfig.gallery && siteConfig.gallery.length > 0) {
      return siteConfig.gallery;
    }
    return fallbackImages;
  }, [siteConfig.gallery]);

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
  }, [selectedIdx, images]);

  const handlePrev = () => {
    setZoomScale(1);
    setSelectedIdx((prev) => {
      if (prev === null) return null;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  };

  const handleNext = () => {
    setZoomScale(1);
    setSelectedIdx((prev) => {
      if (prev === null) return null;
      return prev === images.length - 1 ? 0 : prev + 1;
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
      link.download = `apollo-clinic-basti-poster-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-8">
        <div className="mb-12 md:mb-20 text-center md:text-left">
          <span className="text-[10px] font-black uppercase text-secondary tracking-[0.2em] mb-4 block">Visual Tour</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">
            Our <span className="text-primary">Facilities</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Take a look at our state-of-the-art clinic facilities and advanced medical departments in Basti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 border-t border-slate-100 pt-12">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedIdx(i)}
              className="group relative h-[360px] md:h-[440px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-xl border border-slate-200 bg-white cursor-pointer hover:border-primary/40 transition-all duration-300"
            >
              <img 
                src={img} 
                alt={`Clinic Facility Poster ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Eye Catchy Dark legibility gradient overlay (Default visible) */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-0" />

              {/* Eye Catchy Magnifier HUD details on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-8 md:p-10 z-10">
                <div className="flex justify-end">
                  <span className="bg-white/90 backdrop-blur-sm text-primary font-black uppercase text-[10px] tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                    Expand Details
                  </span>
                </div>
                
                <div className="flex flex-col items-start">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg mb-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Eye size={20} className="text-white" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#f39223] mb-1">Clinic Infrastructure Poster</p>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider">Expand To Fullscreen View</h3>
                </div>
              </div>

              {/* Static simple bottom legend displayed by default */}
              <div className="absolute bottom-0 inset-x-0 p-8 md:p-10 group-hover:hidden transition-all pointer-events-none z-10 flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#f39223] mb-1 drop-shadow-sm">Clinical Poster {i + 1}</p>
                <p className="text-white font-black uppercase tracking-widest text-xs truncate drop-shadow-md">Tap to view full details</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox / Fullscreen Viewer */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-slate-950/98 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-white/5 backdrop-blur-md z-30 shrink-0">
              {/* Title / Counter */}
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-xs uppercase font-black text-secondary tracking-widest">
                    Interactive Lightbox
                  </span>
                </div>
                <div className="hidden md:block w-px h-4 bg-white/20"></div>
                <span className="text-white font-black text-xs uppercase tracking-wider">
                  Poster {selectedIdx + 1} of {images.length}
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
                    className="p-2 text-white hover:text-secondary disabled:opacity-40 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button 
                    onClick={handleResetZoom}
                    disabled={zoomScale === 1}
                    className="p-2 text-white hover:text-secondary disabled:opacity-40 transition-colors"
                    title="Reset Zoom"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button 
                    onClick={handleZoomIn}
                    disabled={zoomScale === 3}
                    className="p-2 text-white hover:text-secondary disabled:opacity-40 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>

                {/* Open in New Tab - DIRECT FULFILLMENT */}
                <a 
                  href={images[selectedIdx]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-white/15 text-white/90 hover:text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all border border-white/15"
                  title="Open image in full size / download in raw tab"
                >
                  <ExternalLink size={16} className="text-secondary" />
                  <span className="hidden md:inline">Open in New Tab</span>
                </a>

                {/* Download */}
                <button 
                  onClick={() => handleDownload(images[selectedIdx!], selectedIdx!)}
                  className="p-3 bg-white/5 hover:bg-white/15 text-white/90 hover:text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all border border-white/15"
                  title="Download picture locally"
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

            {/* Main Interactive Stage */}
            <div className="relative flex-1 flex items-center justify-between px-2 sm:px-6 md:px-12 py-4 select-none overflow-hidden z-20">
              {/* Left Arrow */}
              <button 
                onClick={handlePrev}
                className="p-4 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-secondary text-white hover:text-secondary transition-all hover:scale-110 shrink-0 z-30"
                aria-label="Previous Poster"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Central Dynamic Image viewport with optional zoom/scroll */}
              <div className="flex-1 h-full flex items-center justify-center overflow-auto p-4 relative">
                <motion.div 
                  key={selectedIdx}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-full max-h-full flex items-center justify-center"
                >
                  <img 
                    src={images[selectedIdx]} 
                    alt={`Apollo Basti facility ${selectedIdx + 1}`} 
                    style={{ transform: `scale(${zoomScale})`, transformOrigin: 'center center' }}
                    className="max-w-[85vw] max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10 transition-transform duration-300 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>

              {/* Right Arrow */}
              <button 
                onClick={handleNext}
                className="p-4 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-secondary text-white hover:text-secondary transition-all hover:scale-110 shrink-0 z-30"
                aria-label="Next Poster"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Legend / Instructions */}
            <div className="bg-slate-950/90 border-t border-white/5 py-5 px-8 text-center shrink-0 z-30">
              <div className="max-w-xl mx-auto flex flex-col items-center gap-1.5">
                <p className="text-white/80 font-black text-sm uppercase tracking-widest font-display">
                  Apollo Clinic Basti Infrastructure & clinical updates
                </p>
                <p className="text-secondary font-black text-[10px] uppercase tracking-wider">
                  Tip: Use the 'Open in New Tab' button to print, save or inspect high resolution details of this schedule.
                </p>
                <p className="text-slate-500 font-bold text-[9px] uppercase tracking-wider mt-1 flex items-center gap-1.5">
                  <HelpCircle size={11} className="text-slate-600" />
                  Navigation: Keyboard arrows Left/Right, Close with Escape
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
