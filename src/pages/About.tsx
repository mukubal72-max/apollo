import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { 
  Users, 
  Stethoscope, 
  Microscope, 
  HeartPulse, 
  Syringe, 
  Accessibility, 
  UserCheck, 
  Target, 
  Compass, 
  ShieldCheck,
  FileText,
  Download
} from 'lucide-react';

export default function About() {
  const { documents } = useAppContext();
  const offers = [
    { 
      title: "Multi-specialty Consultations", 
      icon: <Stethoscope className="text-secondary" size={24} />, 
      desc: "Expert guidance from specialized doctors across various medical fields." 
    },
    { 
      title: "Advanced Diagnostics", 
      icon: <Microscope className="text-secondary" size={24} />, 
      desc: "State-of-the-art pathology and diagnostic services for accurate results." 
    },
    { 
      title: "Preventive Check-ups", 
      icon: <HeartPulse className="text-secondary" size={24} />, 
      desc: "Comprehensive wellness programs designed for early detection and prevention." 
    },
    { 
      title: "Vaccination Services", 
      icon: <Syringe className="text-secondary" size={24} />, 
      desc: "Routine and specialized vaccinations for children and adults." 
    },
    { 
      title: "Physiotherapy Support", 
      icon: <Accessibility className="text-secondary" size={24} />, 
      desc: "Expert rehabilitation and recovery services for improved mobility." 
    },
    { 
      title: "Day-care Services", 
      icon: <UserCheck className="text-secondary" size={24} />, 
      desc: "Hassle-free outpatient medical services for same-day procedures." 
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-secondary font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
              Redefining Healthcare
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-primary uppercase tracking-tighter mb-6 leading-[0.9] font-display">
              <span className="text-secondary">Apollo</span> Clinic <br /> Basti
            </h1>
            <p className="text-xl md:text-2xl font-bold text-slate-800 uppercase tracking-tight max-w-3xl mx-auto border-t-4 border-secondary pt-4 inline-block">
              Trusted Care. Advanced Healthcare. Everyday Commitment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white p-8 md:p-16 rounded-[4rem] border-2 border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1">
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium mb-8">
                  At <span className="text-primary font-black uppercase">Apollo Clinic Basti</span>, we are committed to redefining healthcare delivery in Eastern Uttar Pradesh by combining clinical excellence, advanced medical technology, and compassionate patient care under one roof.
                </p>
                <div className="space-y-6 text-slate-600 font-medium italic">
                  <p>
                    Operated by <span className="text-primary font-bold">C Square Medco LLP</span>, Apollo Clinic Basti is a licensed partner of <span className="text-primary font-bold">Apollo Health and Lifestyle Limited</span>, bringing the trusted legacy of the Apollo healthcare ecosystem closer to the people of Basti and nearby regions.
                  </p>
                  <p>
                    Our clinic is designed to offer a seamless and patient-friendly healthcare experience with a strong focus on quality, accessibility, and trust. We aim to provide comprehensive healthcare solutions for individuals and families at every stage of life.
                  </p>
                  <p>
                    With a team of experienced doctors, trained healthcare professionals, and modern medical infrastructure, Apollo Clinic Basti follows globally inspired healthcare standards while maintaining a personalized and community-focused approach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Offers Section */}
      <section className="py-24 bg-primary px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 font-display">What We Offer</h2>
            <div className="h-1.5 w-24 bg-secondary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-[3rem] border border-white/20 hover:bg-white/20 transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  {offer.icon}
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">{offer.title}</h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed">{offer.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-white/80 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-white/30"></span>
              Patient-first care with modern clinical systems
              <span className="w-8 h-[1px] bg-white/30"></span>
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[4rem] border-2 border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                  <Compass className="text-secondary" size={24} />
                </div>
                <h3 className="text-2xl font-black text-primary uppercase tracking-tight mb-4">Our Vision</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  To become the most trusted and preferred healthcare destination in the region by delivering world-class medical care with compassion, ethics, and excellence.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[4rem] border-2 border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="text-primary" size={24} />
                </div>
                <h3 className="text-2xl font-black text-primary uppercase tracking-tight mb-4">Our Mission</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  To provide accessible, affordable, and high-quality healthcare services that improve the overall well-being of the communities we serve.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="mb-12">
             <ShieldCheck className="mx-auto text-secondary mb-6" size={64} />
             <h2 className="text-3xl md:text-5xl font-black text-primary uppercase tracking-tighter mb-8 font-display">Our Commitment</h2>
             <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium mb-12 max-w-2xl mx-auto">
               At Apollo Clinic Basti, every patient is at the center of everything we do. We are committed to delivering healthcare that is not only clinically advanced but also humane, transparent, and dependable.
             </p>
          </div>
          
          {/* Documents Display */}
          {documents.length > 0 && (
            <div className="mt-12 text-left bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
              <h3 className="text-lg font-black text-primary uppercase tracking-tight mb-8 flex items-center gap-3">
                <FileText className="text-secondary" /> Clinic Certificates & Public Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <a 
                    key={doc.id}
                    href={doc.fileData}
                    download={doc.name}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-secondary hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                        <FileText size={20} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-secondary transition-colors">{doc.name}</span>
                    </div>
                    <Download size={16} className="text-slate-300 group-hover:text-secondary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="inline-block p-1 bg-slate-100 rounded-[2.5rem] mt-16">
            <div className="bg-white px-10 py-6 rounded-[2.2rem] border border-slate-200">
               <p className="text-primary font-black uppercase text-xl md:text-2xl tracking-tighter">
                 Apollo Clinic Basti
               </p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1 mb-4">
                 Managed by C Square Medco LLP
               </p>
               <div className="flex gap-4 justify-center">
                 <span className="w-2 h-2 rounded-full bg-secondary"></span>
                 <span className="w-2 h-2 rounded-full bg-primary/30"></span>
                 <span className="w-2 h-2 rounded-full bg-primary/30"></span>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
