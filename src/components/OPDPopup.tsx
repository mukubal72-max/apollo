import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Stethoscope, Phone, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import React, { useState, useEffect } from 'react';
import { OPDDoctor } from '../types';
import { generateUUID } from '../lib/supabase';

export default function OPDPopup() {
  const { 
    isOpdPopupOpen, 
    setIsOpdPopupOpen, 
    opdDoctors, 
    appointments, 
    setAppointments, 
    siteConfig,
    selectedPackageId,
    setSelectedPackageId,
    healthPackages
  } = useAppContext();
  const [selectedDoctor, setSelectedDoctor] = useState<OPDDoctor | null>(null);
  const [step, setStep] = useState<'list' | 'form' | 'success'>('list');
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [patientData, setPatientData] = useState({ 
    name: '', 
    phone: '', 
    whatsapp: '',
    address: '',
    claimOffer: false,
    date: new Date().toISOString().split('T')[0],
    time: '10:00'
  });
  const [dateError, setDateError] = useState('');
  const [isHomeCollection, setIsHomeCollection] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  const selectedPackage = healthPackages.find(p => p.id === selectedPackageId);
  const packagePrice = selectedPackage?.offerPrice || 0;
  const discountAmount = isHomeCollection ? Math.round(packagePrice * 0.1) : 0;
  const finalPrice = packagePrice - discountAmount;

  React.useEffect(() => {
    if (isOpdPopupOpen && selectedPackageId) {
      setStep('form');
      setFormStep(1);
    }
  }, [isOpdPopupOpen, selectedPackageId]);

  const isDoctorExpired = (doctor: OPDDoctor) => {
    if (!doctor.expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(doctor.expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return today > expiry;
  };

  const handleBook = (doctor: OPDDoctor) => {
    setSelectedDoctor(doctor);
    setStep('form');
    setFormStep(1);
  };

  const shareOnWhatsApp = () => {
    const rawMessage = `*Booking Confirmed - Apollo Clinic Basti*\n\n` +
      `*Patient:* ${patientData.name}\n` +
      `*Type:* ${selectedPackage ? 'Health Package' : 'Doctor Consultation'}\n` +
      `*Reference:* ${selectedPackage ? selectedPackage.name : selectedDoctor?.name}\n` +
      `*Date:* ${formatDate(patientData.date)}\n` +
      `*Time:* ${patientData.time}\n` +
      (isHomeCollection ? `*Home Collection:* YES (10% Discount Applied)\n` : '') +
      (patientData.claimOffer ? `*Claimed Special Offer:* YES\n` : '') +
      `*Address:* ${patientData.address}\n` +
      `*Contact:* ${patientData.phone}\n` +
      (selectedPackage ? `*Total Amount:* ₹${finalPrice}\n` : '') +
      `\n_Please confirm my booking._`;

    const message = encodeURIComponent(rawMessage);

    // Send to clinic number instead of patient self-share
    const firstPhone = siteConfig.contact?.split(',')[0] || '8004055501';
    const clinicNumber = firstPhone.replace(/[^0-9]/g, '') || '8004055501';
    const whatsappUrl = `https://wa.me/91${clinicNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    if (selectedDoctor) {
      if (selectedDoctor.consultationTime) {
        // Extract start time from "10:00 AM - 02:00 PM"
        const startTimeMatch = selectedDoctor.consultationTime.match(/(\d{2}:\d{2})/);
        if (startTimeMatch) {
          setPatientData(prev => ({ ...prev, time: startTimeMatch[1] }));
        }
      }
      if (selectedDoctor.availabilityType === 'visiting') {
        setPatientData(prev => ({ ...prev, date: selectedDoctor.visitingDate }));
      } else if (selectedDoctor.availabilityType === 'regular' && selectedDoctor.availableDays?.length) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let current = new Date();
        let found = false;
        // Check next 30 days
        for (let i = 0; i < 30; i++) {
          const dayName = days[current.getDay()];
          if (selectedDoctor.availableDays.includes(dayName)) {
            setPatientData(prev => ({ ...prev, date: current.toISOString().split('T')[0] }));
            found = true;
            break;
          }
          current.setDate(current.getDate() + 1);
        }
      }
    }
  }, [selectedDoctor]);

  const validateDate = (dateStr: string, doctor?: OPDDoctor | null) => {
    if (!doctor || !dateStr) {
      setDateError('');
      return;
    }

    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    if (doctor.availabilityType === 'regular') {
      if (!doctor.availableDays?.includes(dayName)) {
        setDateError(`${doctor.name} is only available on ${doctor.availableDays?.join(', ')}.`);
      } else {
        setDateError('');
      }
    } else {
      if (dateStr !== doctor.visitingDate) {
        const formattedVisiting = new Date(doctor.visitingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
        setDateError(`${doctor.name} is only visiting on ${formattedVisiting}.`);
      } else {
        setDateError('');
      }
    }
  };

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateError && formStep === 2) return;
    if (formStep === 1) {
      setFormStep(2);
      return;
    }
    if (!selectedDoctor && !selectedPackageId) return;

    const newAppointment = {
      id: generateUUID(),
      patientName: patientData.name,
      patientPhone: patientData.phone,
      patientWhatsapp: patientData.whatsapp,
      patientAddress: patientData.address,
      doctorId: selectedDoctor?.id || selectedPackageId || '',
      date: patientData.date,
      time: patientData.time,
      status: 'pending' as const,
      type: selectedPackageId ? 'package' as const : 'doctor' as const,
      isHomeCollection: isHomeCollection,
      claimOffer: patientData.claimOffer,
      finalPrice: selectedPackage ? finalPrice : (selectedDoctor?.fee || 600)
    };

    setAppointments([...appointments, newAppointment]);
    setStep('success');
    
    // Automatically trigger WhatsApp share
    const rawMessage = `*Booking Confirmed - Apollo Clinic Basti*\n\n` +
      `*Patient:* ${patientData.name}\n` +
      `*Type:* ${selectedPackageId ? 'Health Package' : 'Doctor Consultation'}\n` +
      `*Reference:* ${selectedPackage ? selectedPackage.name : selectedDoctor?.name}\n` +
      `*Date:* ${formatDate(patientData.date)}\n` +
      `*Time:* ${patientData.time}\n` +
      (isHomeCollection ? `*Home Collection:* YES (10% Discount Applied)\n` : '') +
      (patientData.claimOffer ? `*Claimed Special Offer:* YES\n` : '') +
      `*Address:* ${patientData.address}\n` +
      `*Contact:* ${patientData.phone}\n` +
      (selectedPackage ? `*Total Amount:* ₹${finalPrice}\n` : '') +
      `\n_Please confirm my booking._`;

    const message = encodeURIComponent(rawMessage);
    const firstPhone = siteConfig.contact?.split(',')[0] || '8004055501';
    const clinicNumber = firstPhone.replace(/[^0-9]/g, '') || '8004055501';
    window.open(`https://wa.me/91${clinicNumber}?text=${message}`, '_blank');
  };

  const closePopup = () => {
    setIsOpdPopupOpen(false);
    setTimeout(() => {
      setStep('list');
      setFormStep(1);
      setSelectedDoctor(null);
      setSelectedPackageId(null);
      setIsHomeCollection(false);
      setDateError('');
      setPatientData({ 
        name: '', 
        phone: '', 
        whatsapp: '',
        address: '',
        claimOffer: false,
        date: new Date().toISOString().split('T')[0],
        time: '10:00'
      });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpdPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-6">
                <img src={siteConfig.logo || "https://www.apolloclinic.com/assets/images/logo.png"} alt="Apollo" className="h-10 hidden sm:block" />
                <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
                <div>
                   <h2 className="text-xl md:text-2xl font-black text-primary uppercase tracking-tight leading-none font-display">
                    {step === 'list' ? 'OPD Schedule of Super-Specialists' : step === 'form' ? 'Confirm Appointment' : 'Success'}
                  </h2>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">
                    Doctors From Delhi and Lucknow • Unit of Apollo Gorakhpur
                  </p>
                </div>
              </div>
              <button 
                onClick={closePopup}
                className="w-10 h-10 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-grow overflow-y-auto bg-slate-50/50">
              <AnimatePresence mode="wait">
                {step === 'list' && (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-x-auto scrollbar-thin">
                      <div className="min-w-[600px]">
                        <table className="w-full text-left border-collapse">
                        <thead className="hidden md:table-header-group">
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-5 font-black uppercase tracking-widest text-[10px] text-slate-500">Specialty</th>
                            <th className="p-5 font-black uppercase tracking-widest text-[10px] text-slate-500">Consultant</th>
                            <th className="p-5 font-black uppercase tracking-widest text-[10px] text-slate-500 text-center">Visiting Date</th>
                            <th className="p-5 font-black uppercase tracking-widest text-[10px] text-slate-500 text-center">Book Appointment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {opdDoctors.map((doctor, i) => {
                            const expired = isDoctorExpired(doctor);
                            return (
                              <tr 
                                key={doctor.id} 
                                className={`group border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors ${(!doctor.isAvailable || expired) ? 'opacity-50' : ''}`}
                              >
                                <td className="p-5 align-middle">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                                      <Stethoscope size={24} />
                                    </div>
                                    <span className="font-black text-xs md:text-sm text-primary uppercase tracking-tight">{doctor.specialty}</span>
                                  </div>
                                </td>
                                <td className="p-5 align-middle">
                                  <div>
                                    <h4 className="font-black text-sm text-slate-800 uppercase leading-none mb-1">{doctor.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{doctor.qualifications}</p>
                                  </div>
                                </td>
                                <td className="p-5 align-middle text-center">
                                  <motion.span 
                                    animate={(!expired) ? {
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
                                    className={`text-xs font-black uppercase tracking-tight px-3 py-1 rounded-full ${expired ? 'bg-red-50 text-red-400 line-through blur-[1.5px]' : 'bg-slate-100 text-slate-700'}`}
                                  >
                                    {doctor.visitingDate}
                                  </motion.span>
                                </td>
                                <td className="p-5 align-middle text-center">
                                  <button 
                                    disabled={!doctor.isAvailable || expired}
                                    onClick={() => handleBook(doctor)}
                                    className="px-6 py-2.5 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md shadow-secondary/20 disabled:bg-slate-200 disabled:shadow-none"
                                  >
                                    {expired ? 'Not Available' : 'Book Appointment'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

                {step === 'form' && (selectedDoctor || selectedPackageId) && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-xl mx-auto py-12 px-6"
                   >
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => formStep === 1 ? setStep('list') : setFormStep(1)} 
                            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                          >
                            <ArrowLeft size={20} className="text-primary" />
                          </button>
                          <h3 className="text-xl font-black uppercase text-primary">
                            {formStep === 1 ? 'Step 1: Patient info' : 'Step 2: Schedule'}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-1.5 rounded-full transition-all duration-500 ${formStep === 1 ? 'bg-secondary w-12' : 'bg-slate-100'}`} />
                          <div className={`w-8 h-1.5 rounded-full transition-all duration-500 ${formStep === 2 ? 'bg-secondary w-12' : 'bg-slate-100'}`} />
                        </div>
                      </div>

                      <form onSubmit={submitBooking} className="space-y-6">
                        <AnimatePresence mode="wait">
                          {formStep === 1 ? (
                            <motion.div
                              key="step1"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="space-y-6"
                            >
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Patient Name</label>
                                <input 
                                  required
                                  value={patientData.name}
                                  onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                                  placeholder="Full Name"
                                  className="w-full py-4 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                                />
                              </div>
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mobile Number</label>
                                  <input 
                                    required
                                    type="tel"
                                    value={patientData.phone}
                                    onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                                    placeholder="00000 00000"
                                    className="w-full py-4 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold font-mono"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">WhatsApp Number</label>
                                  <input 
                                    type="tel"
                                    value={patientData.whatsapp}
                                    onChange={(e) => setPatientData({...patientData, whatsapp: e.target.value})}
                                    placeholder="WhatsApp Number"
                                    className="w-full py-4 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold font-mono"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Patient Address</label>
                                <input 
                                  required
                                  value={patientData.address}
                                  onChange={(e) => setPatientData({...patientData, address: e.target.value})}
                                  placeholder="City, Area, Landmark"
                                  className="w-full py-4 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                                />
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="step2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-6"
                            >
                              <div className="grid md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Appointment Date</label>
                                    {selectedDoctor ? (
                                      <select 
                                        required
                                        value={patientData.date}
                                        onChange={(e) => setPatientData({...patientData, date: e.target.value})}
                                        className="w-full py-4 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold appearance-none"
                                      >
                                        {selectedDoctor.availabilityType === 'visiting' ? (
                                          <option value={selectedDoctor.visitingDate}>{formatDate(selectedDoctor.visitingDate)}</option>
                                        ) : (
                                          (() => {
                                            const options = [];
                                            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                            let current = new Date();
                                            // Show next 4 occurrences
                                            while (options.length < 4) {
                                              const dayName = days[current.getDay()];
                                              if (selectedDoctor.availableDays?.includes(dayName)) {
                                                const dateStr = current.toISOString().split('T')[0];
                                                options.push(
                                                  <option key={dateStr} value={dateStr}>
                                                    {current.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })}
                                                  </option>
                                                );
                                              }
                                              current.setDate(current.getDate() + 1);
                                            }
                                            return options;
                                          })()
                                        )}
                                      </select>
                                    ) : (
                                      <input 
                                        required
                                        type="date"
                                        value={patientData.date}
                                        onChange={(e) => setPatientData({...patientData, date: e.target.value})}
                                        className="w-full py-4 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                                      />
                                    )}
                                  </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Time Slot</label>
                                  <select 
                                    required
                                    value={patientData.time}
                                    onChange={(e) => setPatientData({...patientData, time: e.target.value})}
                                    className="w-full py-4 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                                  >
                                    <option value="06:00">06:00 AM</option>
                                    <option value="06:30">06:30 AM</option>
                                    <option value="07:00">07:00 AM</option>
                                    <option value="08:00">08:00 AM</option>
                                    <option value="09:00">09:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="01:00">01:00 PM</option>
                                    <option value="02:00">02:00 PM</option>
                                    <option value="03:00">03:00 PM</option>
                                    <option value="04:00">04:00 PM</option>
                                    <option value="05:00">05:00 PM</option>
                                    <option value="06:00">06:00 PM</option>
                                    <option value="06:30">06:30 PM</option>
                                  </select>
                                </div>
                              </div>

                              <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <input 
                                      type="checkbox"
                                      id="home-collection"
                                      checked={isHomeCollection}
                                      onChange={(e) => setIsHomeCollection(e.target.checked)}
                                      className="w-5 h-5 rounded border-slate-300 text-secondary focus:ring-secondary"
                                    />
                                    <label htmlFor="home-collection" className="text-xs font-black uppercase text-slate-600 cursor-pointer">
                                      Opt for Home Sample Collection (6:00 AM - 6:30 PM)
                                    </label>
                                  </div>
                                  {isHomeCollection && (
                                    <motion.span 
                                      initial={{ opacity: 0, x: 10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase"
                                    >
                                      10% Discount Applied
                                    </motion.span>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-3 border-t border-secondary/10 pt-4">
                                  <input 
                                    type="checkbox"
                                    id="claim-offer"
                                    checked={patientData.claimOffer}
                                    onChange={(e) => setPatientData({...patientData, claimOffer: e.target.checked})}
                                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                  />
                                  <label htmlFor="claim-offer" className="text-xs font-black uppercase text-slate-600 cursor-pointer">
                                    Claim Special Promotional Offer (if applicable)
                                  </label>
                                </div>
                              </div>

                              <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 mb-8 flex items-center justify-between">
                                <div className="flex flex-col sm:flex-row gap-6 w-full text-left">
                                  <div className="flex-1 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm">
                                      <User size={20} />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">
                                        {selectedPackage ? 'Health Package' : 'Consulting Specialist'}
                                      </p>
                                      <h4 className="text-sm font-black text-primary uppercase">
                                        {selectedPackage ? selectedPackage.name : selectedDoctor?.name}
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="flex-1 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm">
                                      <Calendar size={20} />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Date & Time</p>
                                      <h4 className="text-sm font-black text-primary uppercase">{formatDate(patientData.date)} • {patientData.time}</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <button 
                          type="submit"
                          className="w-full py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-secondary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                        >
                          {formStep === 1 ? 'Continue to Schedule' : 'Confirm & Book Now'}
                          {formStep === 1 && <ChevronRight size={18} />}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl mx-auto py-12 px-6"
                   >
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden">
                      <div className="w-20 h-20 bg-green-500 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200 rotate-12">
                        <CheckCircle2 size={40} />
                      </div>
                      
                      <h3 className="text-3xl font-black text-primary uppercase tracking-tighter mb-2 leading-none">Booking Confirmed!</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-tight text-[10px] mb-10">We have received your request at Apollo Clinic Basti.</p>
                      
                      {/* Booking Bill / Summary */}
                      <div className="bg-slate-50 rounded-[2rem] p-8 mb-10 text-left border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                          <span className="text-[10px] font-black uppercase text-slate-400">Patient Name</span>
                          <span className="text-sm font-black text-slate-800 uppercase">{patientData.name}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                          <span className="text-[10px] font-black uppercase text-slate-400">Reference</span>
                          <span className="text-sm font-black text-primary uppercase">
                            {selectedPackage ? selectedPackage.name : selectedDoctor?.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                          <span className="text-[10px] font-black uppercase text-slate-400">Date & Time</span>
                          <span className="text-sm font-bold text-slate-600">{formatDate(patientData.date)} at {patientData.time}</span>
                        </div>
                        {selectedDoctor && (
                          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                            <span className="text-[10px] font-black uppercase text-slate-400">Registration Fee</span>
                            <span className="text-sm font-black text-secondary uppercase">₹{selectedDoctor.fee || 600}</span>
                          </div>
                        )}
                        {selectedPackage && (
                          <>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                              <span className="text-[10px] font-black uppercase text-slate-400">Package Price</span>
                              <span className="text-sm font-bold text-slate-600">₹{packagePrice}</span>
                            </div>
                            {isHomeCollection && (
                               <div className="flex justify-between items-center border-b border-slate-200 pb-4 text-green-600">
                                <span className="text-[10px] font-black uppercase">Home Collection Disc. (10%)</span>
                                <span className="text-sm font-black">- ₹{discountAmount}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-xs font-black uppercase text-slate-900">Total Payable</span>
                              <span className="text-2xl font-black text-secondary tracking-tighter">₹{finalPrice}</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={shareOnWhatsApp}
                          className="flex-1 flex items-center justify-center gap-3 py-5 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-xl shadow-[#25D366]/20"
                        >
                          <Phone size={16} fill="currentColor" /> Share on WhatsApp
                        </button>
                        <button 
                          onClick={closePopup}
                          className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-xl"
                        >
                          Finish Booking
                        </button>
                      </div>
                      
                      <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-4">
                        <div className="flex -space-x-2">
                          {[
                            { name: 'RK', bg: 'bg-primary text-white' },
                            { name: 'SS', bg: 'bg-secondary text-white' },
                            { name: 'AP', bg: 'bg-accent/80 text-white' }
                          ].map((avatar, idx) => (
                            <div key={idx} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black uppercase tracking-tight ${avatar.bg} shadow-sm`}>
                              {avatar.name}
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Join 5,000+ healthy patients in Basti</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                   <Phone size={14} className="text-secondary" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">Appointment Desk: {siteConfig.contact?.split(',')[0] || '8004055501'}</span>
                 </div>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">© {siteConfig.name || 'Apollo Clinic Basti'} • Unit of Apollo Gorakhpur Group</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
