import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

import GoogleMap from '../components/GoogleMap';

export default function Contact() {
  const { siteConfig } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-slate-500 text-lg mb-12">
              Have questions about our OPD schedule or services? Contact our team for assistance.
              We are committed to providing you with the best healthcare support in Basti.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Phone Number</h4>
                  <p className="text-slate-500">{siteConfig.contact}</p>
                  <div className="mt-2 p-3 bg-secondary/5 rounded-xl border border-secondary/10">
                    <p className="text-secondary font-black text-xs uppercase tracking-widest">Free Home Sample Collection till 10 km</p>
                    <p className="font-bold text-slate-700">9250877505</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Collection Time: 6:00 AM - 6:30 PM</p>
                  </div>
                  <p className="text-slate-500 text-sm italic mt-2">Emergency Assistance</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Email Address</h4>
                  <p className="text-slate-500">{siteConfig.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Clinic Address</h4>
                  <p className="text-slate-500 font-bold uppercase tracking-tight">Apollo Clinic Basti, Station Road, Basti - 272002</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Opening Hours</h4>
                  <p className="text-slate-500">Mon - Sun: 9:00 AM - 6:30 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 h-80 relative bg-slate-200 text-left">
              <GoogleMap className="absolute inset-0 w-full h-full" />
            </div>
          </motion.div>
        </div>

        <div className="lg:w-1/2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100"
          >
            <h3 className="text-2xl font-bold mb-8">Send us a Message</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Full Name</label>
                  <input type="text" className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Phone</label>
                  <input type="tel" className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="+91 ..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Inquiry Type</label>
                <select className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary transition-all bg-white">
                  <option>Appointment Booking</option>
                  <option>General Inquiry</option>
                  <option>Diagnostic Services</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Message</label>
                <textarea className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary transition-all h-32" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all">
                Send Message <Send size={18} />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-4">
              <p className="text-sm text-slate-400">Prefer WhatsApp?</p>
              <a href="#" className="flex items-center gap-2 text-green-600 font-bold hover:underline">
                <MessageCircle size={20} /> Chat with us
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
