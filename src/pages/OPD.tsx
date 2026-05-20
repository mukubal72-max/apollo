import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Calendar, User, Stethoscope, MapPin, FileText } from 'lucide-react';

export default function OPDPage() {
  const { opdDoctors, setIsOpdPopupOpen } = useAppContext();

  const isDoctorExpired = (doctor: any) => {
    if (!doctor.expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(doctor.expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return today > expiry;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">Today's OPD Schedule</h2>
          <p className="text-[10px] md:text-xs text-secondary font-black uppercase tracking-widest">Unit of Apollo Gorakhpur Group • Live from Admin Panel</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm print:hidden"
          >
            <FileText size={16} /> Print / Save PDF
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
            <Calendar size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-600">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white border-b border-slate-800">
              <th className="p-6 font-black uppercase tracking-widest text-[10px]">Status</th>
              <th className="p-6 font-black uppercase tracking-widest text-[10px]">Specialty</th>
              <th className="p-6 font-black uppercase tracking-widest text-[10px]">Consultant</th>
              <th className="p-6 font-black uppercase tracking-widest text-[10px]">Visiting Date</th>
              <th className="p-6 font-black uppercase tracking-widest text-[10px] text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {opdDoctors.map((doctor, index) => {
              const expired = isDoctorExpired(doctor);
              return (
                <motion.tr 
                  key={doctor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${(!doctor.isAvailable || expired) ? 'opacity-50 grayscale' : ''}`}
                >
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${(doctor.isAvailable && !expired) ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {(doctor.isAvailable && !expired) ? 'Available' : expired ? 'Expired' : 'Offline'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                        {doctor.photo ? (
                          <img src={doctor.photo} alt="" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <Stethoscope size={24} />
                        )}
                      </div>
                      <span className="font-black text-sm text-primary uppercase tracking-tight">{doctor.specialty}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div>
                      <h4 className="font-black text-sm text-slate-800 flex items-center gap-1 uppercase tracking-tight">
                        {doctor.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{doctor.qualifications}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[9px] font-black uppercase text-secondary bg-secondary/15 px-2.5 py-1 rounded bg-opacity-70">₹{doctor.fee || 600} Fee</span>
                        <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 px-2.5 py-1 rounded">{doctor.consultationTime || '10:00 AM - 02:00 PM'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <motion.span 
                        animate={(doctor.isAvailable && !expired) ? {
                          opacity: [1, 0.4, 1],
                          scale: [1, 1.05, 1],
                          backgroundColor: ['rgba(241, 245, 249, 1)', 'rgba(243, 146, 35, 0.2)', 'rgba(241, 245, 249, 1)'],
                          color: ['#334155', '#f39223', '#334155']
                        } : {}}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`text-xs font-black uppercase tracking-tight px-3 py-1 rounded-full self-start ${expired ? 'bg-red-50 text-red-400 line-through blur-[1.5px]' : 'bg-slate-100 text-slate-700'}`}
                      >
                        {doctor.availabilityType === 'regular' 
                          ? `Regular: ${doctor.availableDays?.map(d => d.substring(0,3)).join(', ')}`
                          : formatDate(doctor.visitingDate)
                        }
                      </motion.span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-70 italic px-3">{doctor.location}</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => setIsOpdPopupOpen(true)}
                      disabled={!doctor.isAvailable || expired}
                      className="px-8 py-3 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/20 disabled:bg-slate-200 disabled:scale-100 disabled:shadow-none"
                    >
                      {expired ? 'Not Available' : 'Book Appointment'}
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {opdDoctors.map((doctor, index) => {
          const expired = isDoctorExpired(doctor);
          return (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 flex flex-col gap-6 ${(!doctor.isAvailable || expired) ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-secondary">
                    {doctor.photo ? (
                      <img src={doctor.photo} alt="" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <Stethoscope size={28} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-primary uppercase tracking-tight text-lg leading-tight">{doctor.specialty}</h4>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight mt-1">{doctor.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{doctor.qualifications}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[8px] font-black uppercase text-secondary bg-secondary/15 px-2 py-0.5 rounded">₹{doctor.fee || 600} Fee</span>
                      <span className="text-[8px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{doctor.consultationTime || '10:00 AM - 02:00 PM'}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${(doctor.isAvailable && !expired) ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  {(doctor.isAvailable && !expired) ? 'Available' : expired ? 'Expired' : 'Offline'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{doctor.availabilityType === 'regular' ? 'Regular Schedule' : 'Visiting Date'}</p>
                  <motion.span 
                    animate={(doctor.isAvailable && !expired) ? {
                      opacity: [1, 0.4, 1],
                      color: ['#334155', '#f39223', '#334155']
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`text-xs font-black uppercase ${expired ? 'text-red-400 line-through blur-[1px]' : 'text-slate-700'}`}
                  >
                    {doctor.availabilityType === 'regular' 
                      ? doctor.availableDays?.map(d => d.slice(0,3)).join(', ')
                      : formatDate(doctor.visitingDate)
                    }
                  </motion.span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Location</p>
                  <p className="text-xs font-black text-slate-700 uppercase">{doctor.location}</p>
                </div>
              </div>

              <button 
                onClick={() => setIsOpdPopupOpen(true)}
                disabled={!doctor.isAvailable || expired}
                className="w-full py-4 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20 disabled:bg-slate-200"
              >
                {expired ? 'Not Available' : 'Book Now'}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 bg-slate-900 p-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Can't find your specialty?</h3>
          <p className="text-slate-400">Call our helpline for more information about visiting doctors.</p>
        </div>
        <button className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:bg-slate-200 transition-all">
          Contact Support
        </button>
      </div>
    </div>
  );
}
