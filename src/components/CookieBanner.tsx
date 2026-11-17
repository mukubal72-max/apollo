import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type CookieConsentChoice = 'all' | 'essential' | null;

export const COOKIE_CONSENT_STORAGE_KEY = 'apollo_basti_cookie_consent';

interface CookieBannerProps {
  visible: boolean;
  onSelect: (choice: 'all' | 'essential') => void;
}

export default function CookieBanner({ visible, onSelect }: CookieBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 lg:max-w-5xl lg:mx-auto z-50 print:hidden"
          role="dialog"
          aria-label="Cookie Consent Banner"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl text-white border border-white/15 rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#007a8e]/30 border border-[#007a8e]/50 flex items-center justify-center shrink-0 text-[#f39223] mt-0.5">
                <Cookie size={22} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#f39223]">
                  <ShieldCheck size={13} />
                  <span>DPDP-Compliant Cookie Notice</span>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  <strong className="text-white">We Value Your Privacy:</strong> Apollo Clinic Basti uses
                  essential cookies to ensure secure appointment booking and analytics cookies to improve your
                  browsing experience on <strong className="text-white">www.apolloclinicbasti.com</strong>. By
                  clicking &ldquo;Accept All,&rdquo; you consent to our use of cookies in accordance with our{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-[#f39223] hover:underline font-bold"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={() => onSelect('essential')}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={() => onSelect('all')}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#f39223] hover:bg-[#e08215] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-[#f39223]/30 transition-all cursor-pointer whitespace-nowrap"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
