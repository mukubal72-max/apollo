import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Stethoscope, FlaskConical, Activity, HeartPulse, Shield, UserCheck, Microscope, Thermometer } from 'lucide-react';

export default function ServicesPage() {
  const { services, siteConfig, departments } = useAppContext();

  const extraServices = [
    { title: "Health@Home", icon: Shield, desc: "Immediate medical response for trauma and acute illness." },
    { title: "Day Care", icon: UserCheck, desc: "Minor surgical procedures with same-day discharge." },
    { title: "Advanced Pathology", icon: Microscope, desc: "Full spectrum of blood and tissue diagnostics." },
    { title: "Physiotherapy", icon: Thermometer, desc: "Recovery and rehabilitation services for all ages." },
  ];

  return (
    <div className="flex flex-col gap-20 py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black text-slate-900 mb-6 font-display uppercase tracking-tighter">Our Specializations</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-bold uppercase tracking-tight">
            Apollo Clinic Basti provides a wide umbrella of medical care, ranging from routine checkups to super-specialist consultations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 text-center">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-2xl hover:translate-y-[-10px] transition-all border border-slate-100 flex flex-col items-center group cursor-pointer"
            >
              <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                {service.iconName === 'Stethoscope' && <Stethoscope size={40} />}
                {service.iconName === 'FlaskConical' && <FlaskConical size={40} />}
                {service.iconName === 'Activity' && <Activity size={40} />}
                {service.iconName === 'HeartPulse' && <HeartPulse size={40} />}
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{service.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -mr-32 -mb-32" />
          <h2 className="text-4xl font-black mb-12 text-center font-display uppercase tracking-tighter">Additional Facilities</h2>
          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            {extraServices.map((item, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-16 h-16 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <item.icon size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-black mb-2 uppercase tracking-tight">{item.title}</h4>
                  <p className="text-slate-400 text-sm font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments Section */}
        {departments && departments.length > 0 && (
          <div className="mt-40">
            <div className="max-w-2xl mb-16">
              <span className="text-[10px] font-black uppercase text-secondary tracking-[0.2em] mb-4 block">Our Infrastructure</span>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4 font-display">Medical Departments</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                We have organized our medical excellence into specialized departments to provide the most focused care.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept, i) => (
                <motion.div 
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 hover:border-primary transition-all group"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all mb-6">
                    <Shield size={24} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{dept.name}</h4>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4">HOD: {dept.headOfDepartment}</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{dept.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Posters Section */}
        {siteConfig.posters && siteConfig.posters.length > 0 && (
          <div className="mt-40">
            <div className="max-w-2xl mb-16 text-center md:text-left">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4 font-display">Clinical Awareness</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Health education and campaign posters from our medical experts at Apollo Clinic Basti.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {siteConfig.posters.map((poster, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 bg-white"
                >
                  <img src={poster} alt="Clinical Poster" className="w-full h-auto" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
