import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Check, FlaskConical, ArrowRight, ShieldCheck, Zap, X, Gift } from 'lucide-react';

export default function HealthPackages() {
  const { siteConfig, healthPackages, setIsOpdPopupOpen, setSelectedPackageId } = useAppContext();
  const [showOffer, setShowOffer] = React.useState(!!siteConfig.promotionPopup?.enabled);

  const promo = siteConfig.promotionPopup || {
    enabled: false,
    title: "",
    description: "",
    offerText: ""
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-32 pb-24">
      <AnimatePresence>
        {showOffer && promo.enabled && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden relative"
            >
              <button 
                onClick={() => setShowOffer(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all z-10"
              >
                <X size={20} />
              </button>

              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <Gift size={40} />
                </div>
                
                <span className="text-[10px] font-black uppercase text-secondary tracking-[0.3em] mb-4 block">Special Offer</span>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-[1.1] mb-6 font-display">
                  {promo.title}
                </h2>
                
                <p className="text-slate-500 font-medium leading-relaxed mb-10">
                  {promo.description}
                </p>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setShowOffer(false)}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all"
                  >
                    Claim This Offer
                  </button>
                  <button 
                    onClick={() => setShowOffer(false)}
                    className="text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-8">
          <div className="max-w-3xl text-center md:text-left">
            <span className="text-[10px] font-black uppercase text-secondary tracking-[0.2em] mb-4 block">Preventive Healthcare</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none font-display">
              Health Checkup <span className="text-primary">Packages</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
              Choose from our range of comprehensive health checkup packages designed for every stage of care at Apollo Clinic Basti.
            </p>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/50 print:hidden"
          >
            <FlaskConical size={16} /> Print Packages Info
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {healthPackages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative group hover:border-primary transition-all"
            >
              <div className="p-10 flex-grow">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                    <FlaskConical size={32} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-secondary/10 text-secondary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-right">
                      {pkg.totalTests} Tests Included
                    </div>
                    {pkg.discountBadge && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="bg-green-600 text-white px-3 py-2 rounded-2xl text-[9px] font-black uppercase tracking-tight shadow-xl shadow-green-600/30 border-2 border-white flex items-center gap-2"
                      >
                        <Zap size={10} fill="currentColor" /> {pkg.discountBadge}
                      </motion.div>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-tight">{pkg.name}</h3>
                
                <div className="flex items-baseline gap-3 mb-8">
                  <motion.span 
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-4xl font-black text-primary tracking-tighter"
                  >
                    ₹{pkg.offerPrice}
                  </motion.span>
                  <span className="text-slate-400 line-through text-lg font-bold">₹{pkg.actualPrice}</span>
                  <motion.span 
                    animate={{ 
                      scale: [1, 1.05, 1],
                      color: ['#22c55e', '#ef4444', '#22c55e']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-green-500 text-xs font-black uppercase tracking-widest ml-auto"
                  >
                    Save {Math.round((1 - pkg.offerPrice / pkg.actualPrice) * 100)}%
                  </motion.span>
                </div>

                <div className="space-y-4 mb-10">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 border-b border-slate-100 pb-2">Key Highlights</p>
                  <div className="grid grid-cols-1 gap-3">
                    {pkg.tests.slice(0, 10).map((test, j) => (
                      <div key={j} className="flex items-center gap-3 text-slate-600">
                        <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center text-green-500 flex-shrink-0">
                          <Check size={12} strokeWidth={4} />
                        </div>
                        <span className="text-sm font-semibold">{test}</span>
                      </div>
                    ))}
                    {pkg.tests.length > 10 && (
                      <p className="text-xs font-bold text-slate-400 mt-2">+ {pkg.tests.length - 10} more tests...</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-10 pt-0">
                <button 
                  onClick={() => {
                    setSelectedPackageId(pkg.id);
                    setIsOpdPopupOpen(true);
                  }}
                  className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-primary hover:scale-[1.02] transition-all shadow-xl shadow-slate-900/10 cursor-pointer"
                >
                  Book This Package <ArrowRight size={16} />
                </button>
              </div>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] -mr-16 -mt-16 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-32 grid md:grid-cols-2 gap-12">
          <div className="flex gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-secondary flex-shrink-0">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2 text-lg">Fast Reporting</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Digital reports delivered within 24 hours for most health checkup packages.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-primary flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2 text-lg">Home Collection</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Free home sample collection facility available within 10 KM of our Basti clinic.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
