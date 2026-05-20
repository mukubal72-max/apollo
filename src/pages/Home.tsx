import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Activity, FlaskConical, HeartPulse, Stethoscope, Clock, ShieldCheck, MapPin, ChevronRight, User, Phone, Home as HomeIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useState, useMemo } from 'react';

import GoogleMap from '../components/GoogleMap';

export default function Home() {
  const { services, siteConfig, opdDoctors, setIsOpdPopupOpen, testimonials } = useAppContext();
  const [selectedLetter, setSelectedLetter] = useState<string | null>('A');
  const [activeCategory, setActiveCategory] = useState<'ailments' | 'treatments' | 'technologies'>('ailments');
  const [showPromo, setShowPromo] = useState(!!siteConfig.promotionPopup?.enabled);

  const promo = siteConfig.promotionPopup || {
    enabled: false,
    title: "",
    description: "",
    offerText: ""
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const ailmentsData = [
    { id: 'a1', category: 'ailments', letter: 'A', title: 'Asthma', description: 'Chronic respiratory condition causing airway inflammation and breathing difficulty.' },
    { id: 'a2', category: 'ailments', letter: 'A', title: 'Arthritis', description: 'Inflammation and stiffness of the joints, commonly treated by our Rheumatologists.' },
    { id: 'a3', category: 'ailments', letter: 'D', title: 'Diabetes', description: 'Metabolic disease that causes high blood sugar and requires regular monitoring.' },
    { id: 'a4', category: 'ailments', letter: 'B', title: 'Bronchitis', description: 'Inflammation of the lining of your bronchial tubes, which carry air to and from your lungs.' },
    { id: 'a5', category: 'ailments', letter: 'C', title: 'Cancer', description: 'Comprehensive oncology care including screening and visiting specialist consultations.' },
    { id: 'a6', category: 'ailments', letter: 'E', title: 'Eczema', description: 'Condition that makes your skin red and itchy, common in children but can occur at any age.' },
    { id: 'a7', category: 'ailments', letter: 'F', title: 'Fibromyalgia', description: 'Widespread muscle pain and tenderness, often accompanied by fatigue.' },
    { id: 'a8', category: 'ailments', letter: 'G', title: 'Gastritis', description: 'Inflammation of the protective lining of the stomach.' },
    { id: 'a9', category: 'ailments', letter: 'H', title: 'Hypertension', description: 'High blood pressure that can lead to heart disease and stroke if left untreated.' },
    { id: 'a10', category: 'ailments', letter: 'I', title: 'Insomnia', description: 'Persistent problems falling and staying asleep.' },
    { id: 'a11', category: 'ailments', letter: 'J', title: 'Jaundice', description: 'Yellowing of the skin and eyes caused by excess bilirubin.' },
    { id: 'a12', category: 'ailments', letter: 'K', title: 'Kidney Stones', description: 'Hard deposits made of minerals and salts that form inside kidneys.' },
    { id: 'a13', category: 'ailments', letter: 'L', title: 'Lupus', description: 'Autoimmune disease that causes inflammation in various parts of the body.' },
    { id: 'a14', category: 'ailments', letter: 'M', title: 'Migraine', description: 'Recurrent throbbing headache that typically affects one side of the head.' },
    { id: 'a15', category: 'ailments', letter: 'O', title: 'Obesity', description: 'Complex disease involving an excessive amount of body fat.' },
    { id: 'a16', category: 'ailments', letter: 'P', title: 'Psoriasis', description: 'Skin disease that causes itchy or sore patches of thick, red skin with silver scales.' },
    { id: 'a17', category: 'ailments', letter: 'S', title: 'Sinusitis', description: 'Inflammation or swelling of the tissue lining the sinuses.' },
    { id: 'a18', category: 'ailments', letter: 'T', title: 'Thyroid', description: 'Endocrine disorders affecting metabolism, growth, and development.' },
    { id: 'a19', category: 'ailments', letter: 'U', title: 'Ulcer', description: 'Open sores that develop on the inside lining of your stomach.' },
    { id: 'a20', category: 'ailments', letter: 'V', title: 'Vertigo', description: 'Sensation of whirling and loss of balance.' },
    { id: 'a21', category: 'ailments', letter: 'X', title: 'Xerostomia', description: 'Subjective sensation of dry mouth due to lack of saliva.' },
    { id: 'a22', category: 'ailments', letter: 'Y', title: 'Yeast Infection', description: 'Fungal infection that causes irritation, discharge and intense itchiness.' },
    { id: 'a23', category: 'ailments', letter: 'Z', title: 'Zoonosis', description: 'Infectious disease that has jumped from a non-human animal to humans.' },
    { id: 'a24', category: 'ailments', letter: 'Q', title: 'Q-Fever', description: 'Infection caused by Coxiella burnetii, a type of bacterium.' },
    { id: 'a25', category: 'ailments', letter: 'W', title: 'Warts', description: 'Small, fleshy bumps on the skin or mucous membrane caused by HPV.' },
    { id: 'a26', category: 'ailments', letter: 'N', title: 'Neuropathy', description: 'Damage or dysfunction of one or more nerves that typically results in numbness.' },
    { id: 'a27', category: 'ailments', letter: 'R', title: 'Reflux (GERD)', description: 'Digestive disorder that affects the ring of muscle between your esophagus and stomach.' },
    { id: 'a28', category: 'ailments', letter: 'K', title: 'Kidney Health', description: 'Comprehensive nephrology care for maintaining optimal kidney function and health.' },
    { id: 'a29', category: 'ailments', letter: 'O', title: 'Osteoporosis', description: 'Conditions that causes bones to become weak and brittle.' },
    { id: 'a30', category: 'ailments', letter: 'X', title: 'X-Ray Diagnostics', description: 'Advanced radiologic screening for early detection of skeletal issues.' },
    
    { id: 't1', category: 'treatments', letter: 'D', title: 'Dialysis', description: 'Clinical purification of blood for patients with kidney failure.' },
    { id: 't2', category: 'treatments', letter: 'C', title: 'Chemotherapy', description: 'Drug treatment used to kill fast-growing cells, commonly for cancer.' },
    { id: 't3', category: 'treatments', letter: 'I', title: 'IVF', description: 'In vitro fertilization for reproductive health and infertility.' },
    { id: 't4', category: 'treatments', letter: 'R', title: 'Root Canal', description: 'Endodontic procedure for dental infections and preserving teeth.' },
    { id: 't5', category: 'treatments', letter: 'A', title: 'Acupuncture', description: 'Traditional technique for pain relief and wellness.' },
    { id: 't6', category: 'treatments', letter: 'B', title: 'Biopsy', description: 'Removal of tissue to examine it for disease.' },
    { id: 't7', category: 'treatments', letter: 'E', title: 'Endoscopy', description: 'Nonsurgical procedure used to examine a person\'s digestive tract.' },
    { id: 't8', category: 'treatments', letter: 'F', title: 'Flu Vaccine', description: 'Annual vaccination to prevent influenza virus infection.' },
    { id: 't9', category: 'treatments', letter: 'H', title: 'Hormone Therapy', description: 'Treatment that adds, blocks, or removes hormones.' },
    { id: 't10', category: 'treatments', letter: 'L', title: 'Laser Therapy', description: 'Treatment using focused light for various medical conditions.' },
    { id: 't11', category: 'treatments', letter: 'P', title: 'Physiotherapy', description: 'Physical medicine and rehabilitation for movement and function.' },
    { id: 't12', category: 'treatments', letter: 'S', title: 'Surgery', description: 'Medical procedure involving incision with instruments.' },
    { id: 't13', category: 'treatments', letter: 'U', title: 'Ultrasound', description: 'Diagnostic imaging using sound waves.' },
    { id: 't14', category: 'treatments', letter: 'X', title: 'X-Ray Therapy', description: 'High-energy radiation used to treat various conditions.' },

    { id: 'tec1', category: 'technologies', letter: 'M', title: 'MRI Scan', description: 'Advanced magnetic resonance imaging for precise diagnostics.' },
    { id: 'tec2', category: 'technologies', letter: 'C', title: 'CT Scan', description: 'Computerized tomography for detailed cross-sectional body views.' },
    { id: 'tec3', category: 'technologies', letter: 'L', title: 'Laser Surgery', description: 'Precision surgery using focused light beams for minimal scarring.' },
    { id: 'tec4', category: 'technologies', letter: 'D', title: 'Digital X-Ray', description: 'Modern radiologic imaging using digital sensors for lower radiation.' },
    { id: 'tec5', category: 'technologies', letter: 'A', title: 'AI Diagnostics', description: 'Artificial intelligence tools assisting in early disease detection.' },
    { id: 'tec6', category: 'technologies', letter: 'E', title: 'ECHO', description: 'Echocardiogram using ultrasound to see how heart muscle and valves are working.' },
    { id: 'tec7', category: 'technologies', letter: 'H', title: 'HOLO Imaging', description: 'Advanced holographic medical visualization for surgical planning.' },
    { id: 'tec8', category: 'technologies', letter: 'P', title: 'PET Scan', description: 'Positron emission tomography for identifying cellular changes.' },
    { id: 'tec9', category: 'technologies', letter: 'R', title: 'Robotics', description: 'Robot-assisted surgical systems for greater precision.' },
    { id: 'tec10', category: 'technologies', letter: 'S', title: 'Sonography', description: 'High-frequency sound waves to produce images of structures within your body.' },
    { id: 'tec11', category: 'technologies', letter: '3', title: '3D Printing', description: 'Creation of medical implants and anatomical models.' }
  ];

  const filteredData = useMemo(() => {
    return ailmentsData.filter(item => 
      item.category === activeCategory && 
      (!selectedLetter || item.letter === selectedLetter)
    );
  }, [selectedLetter, activeCategory]);

  const lettersWithData = useMemo(() => {
    return new Set(ailmentsData.filter(item => item.category === activeCategory).map(item => item.letter));
  }, [activeCategory]);
  
  const availableLetters = useMemo(() => {
    const letters = new Set(opdDoctors.map(doc => doc.specialty[0].toUpperCase()));
    return Array.from(letters);
  }, [opdDoctors]);

  const filteredDoctors = useMemo(() => {
    if (!selectedLetter) return opdDoctors;
    return opdDoctors.filter(doc => doc.specialty.toUpperCase().startsWith(selectedLetter));
  }, [selectedLetter, opdDoctors]);

  return (
    <div className="flex flex-col gap-24 pb-20">
      <AnimatePresence>
        {showPromo && promo.enabled && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden relative"
            >
              <button 
                onClick={() => setShowPromo(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all z-10"
              >
                <X size={20} />
              </button>

              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <HeartPulse size={40} />
                </div>
                
                <span className="text-[10px] font-black uppercase text-secondary tracking-[0.3em] mb-4 block">Exclusive Announcement</span>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-[1.1] mb-6 font-display">
                  {promo.title}
                </h2>
                
                <p className="text-slate-500 font-medium leading-relaxed mb-10">
                  {promo.description}
                </p>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => {
                        setShowPromo(false);
                        setIsOpdPopupOpen(true);
                    }}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all"
                  >
                    View Schedule / Book Now
                  </button>
                  <button 
                    onClick={() => setShowPromo(false)}
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
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:h-[700px] flex items-center overflow-hidden mx-4 md:mx-8 mt-4 md:mt-8 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt="Apollo Clinical Excellence"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent z-10" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-20 py-24 md:py-32">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl text-white"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 backdrop-blur-md border border-white/10 rounded-full mb-8">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Medical Center Of Excellence</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-[1] tracking-tighter uppercase italic font-display">
                Advanced <br/>Health care<br/><span className="text-secondary not-italic uppercase">In Basti City.</span>
              </h1>
              <p className="text-base md:text-xl text-slate-300 max-w-xl mb-10 leading-relaxed font-bold uppercase tracking-tight">
                World-class specialists visiting regularly from Lucknow & Delhi to provide premium medical care at your doorstep.
              </p>
              <div className="flex flex-wrap gap-4 md:gap-6 mb-12">
                <button 
                  onClick={() => setIsOpdPopupOpen(true)}
                  className="w-full sm:w-auto px-10 py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-secondary/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>

              {/* Specific Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                {[
                  { label: 'Home Collection Centre', icon: FlaskConical },
                  { label: 'Day Care Support', icon: Activity },
                  { label: 'Health@home', icon: HomeIcon },
                  { label: 'Matanhelia Family', icon: HeartPulse }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all transform group-hover:-translate-y-1">
                      <item.icon size={24} className="md:size-30" />
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase text-white/80 tracking-widest text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clinical Posters / Banners Section */}
      {siteConfig.posters && siteConfig.posters.length > 0 && (
        <section className="container mx-auto px-8 mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase font-display">Clinical Insights</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Stay informed with our latest health clinical updates and super-specialist visiting schedules at Apollo Basti.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {siteConfig.posters.map((poster, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 bg-white"
              >
                <img src={poster} alt="Health Campaign" className="w-full h-auto object-cover group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl">
                    <Activity size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase font-display">Our Premium Services</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Experience healthcare excellence with our specialized medical services designed for your wellbeing.
            </p>
          </div>
          <Link to="/services" className="px-8 py-3 bg-slate-100 text-primary rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
            View All Services
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:translate-y-[-10px] transition-all border border-slate-100 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                {service.iconName === 'Stethoscope' && <Stethoscope size={36} />}
                {service.iconName === 'FlaskConical' && <FlaskConical size={36} />}
                {service.iconName === 'Activity' && <Activity size={36} />}
                {service.iconName === 'HeartPulse' && <HeartPulse size={36} />}
              </div>
              <h3 className="text-xl font-black text-primary mb-3 uppercase tracking-tight">{service.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Specialties Ecosystem */}
      <section className="bg-slate-50 py-16 md:py-32">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            {/* Left: Menu */}
            <div>
              <span className="text-[10px] font-black uppercase text-secondary tracking-[0.3em] mb-4 block">Our Ecosystem</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-[1.1] uppercase font-display">AN ECOSYSTEM FOR <br/><span className="text-primary underline underline-offset-8 decoration-secondary/40">CLINICAL EXCELLENCE</span></h2>
              <p className="text-slate-500 mb-12 max-w-md font-medium leading-relaxed">Find specialized care across our network of super-specialist doctors visiting regularly from Lucknow & Delhi.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-16">
                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm transition-all hover:shadow-xl hover:border-primary/20">
                  <div className="text-primary font-black text-4xl mb-2 tracking-tighter">50+</div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-tight">Medical <br/>Specialties</p>
                </div>
                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm transition-all hover:shadow-xl hover:border-secondary/20">
                  <div className="text-secondary font-black text-4xl mb-2 tracking-tighter">10k+</div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-tight">Patients <br/>Treated</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Visiting Specialists</p>
                  <Link to="/opd-schedule" className="text-[10px] font-black uppercase text-primary tracking-widest border-b border-primary pb-0.5">Explore All</Link>
                </div>
                {filteredDoctors.map((doc, i) => (
                  <motion.div 
                    layout
                    key={doc.id}
                    className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-primary group cursor-pointer transition-all"
                  >
                    <div className="flex gap-6 items-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 uppercase tracking-tight">{doc.specialty}</h4>
                        <p className="text-xs text-slate-500 font-bold opacity-60 uppercase mt-1">{doc.name}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">₹{doc.fee || 600} • {doc.consultationTime || '10:00 AM - 02:00 PM'}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-primary transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: A-Z Filter */}
            <div className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-slate-200/50 sticky top-32">
              <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {[
                  { id: 'ailments', label: 'Ailments' },
                  { id: 'treatments', label: 'Treatments' },
                  { id: 'technologies', label: 'Technologies' }
                ].map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id as any);
                      setSelectedLetter(null);
                    }}
                    className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
                      activeCategory === cat.id ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-6 gap-3 mb-10">
                {alphabet.map((letter) => {
                  const hasData = lettersWithData.has(letter);
                  const isSelected = selectedLetter === letter;
                  return (
                    <button
                      key={letter}
                      onClick={() => setSelectedLetter(isSelected ? null : letter)}
                      className={`aspect-square rounded-full flex items-center justify-center text-lg font-black transition-all ${
                        isSelected
                          ? 'bg-secondary text-white scale-110 shadow-lg'
                          : 'bg-white shadow-sm border border-slate-100 text-slate-600 hover:border-primary hover:text-primary'
                      } ${!hasData && !isSelected ? 'opacity-60 grayscale-[0.5]' : ''}`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              <div className="h-48 overflow-y-auto pr-4 scrollbar-hide mb-10 bg-slate-50 rounded-3xl p-6">
                {filteredData.length > 0 ? (
                  <div className="space-y-4">
                    {filteredData.map((item) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={item.id}
                        className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                      >
                        <h4 className="font-black text-primary text-xs uppercase tracking-tight group-hover:text-secondary transition-colors">{item.title}</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-2 line-clamp-2">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : selectedLetter ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner text-primary">
                      <HeartPulse size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest leading-normal">Information for <span className="text-primary font-black">"{selectedLetter}"</span> is being curated</p>
                      <p className="text-[8px] font-bold uppercase text-slate-400 mt-2">Please call {siteConfig.contact} for immediate clinical assistance.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-6 text-center p-8">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl text-primary mb-2">
                      <HeartPulse size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-2">Clinical Encyclopedia</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 max-w-[200px] leading-relaxed">
                        Select any alphabet to explore medical insights, diseases, and technologies at Apollo Clinic Basti.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full mt-4">
                      <div className="h-0.5 bg-slate-100 rounded-full"></div>
                      <div className="h-0.5 bg-primary/20 rounded-full"></div>
                      <div className="h-0.5 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] -mr-16 -mt-16" />
                <h4 className="text-xl font-black mb-4 uppercase tracking-tight relative z-10">Visiting from Lucknow?</h4>
                <p className="text-slate-400 text-sm mb-6 relative z-10">Our super-specialists visit every month from top hospitals in Delhi & Lucknow.</p>
                <button 
                  onClick={() => setIsOpdPopupOpen(true)}
                  className="w-full py-4 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-all relative z-10"
                >
                  View Visiting Dates
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <HealthPackagesPreview />

      {/* Map Section Heading */}
      <section className="container mx-auto px-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] font-black uppercase text-secondary tracking-[0.2em] mb-4 block">Visit Us</span>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4 font-display">
              Our Clinic <span className="text-primary underline decoration-secondary/30">Location</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              We are conveniently located in the heartbeat of Basti City, accessible from all major landmarks.
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map-section" className="container mx-auto px-8">
        <div className="rounded-[3.5rem] overflow-hidden shadow-2xl relative h-[500px] group border border-slate-200">
          <GoogleMap className="absolute inset-0 w-full h-full" />
          <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-96 bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
            <h3 className="text-2xl font-black text-primary uppercase tracking-tight mb-4">Find Us In Basti</h3>
            <p className="text-slate-600 text-sm font-medium mb-6 leading-relaxed">
              Visit our clinic for premium healthcare services and world-class diagnostic facilities.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">Address</p>
                  <p className="text-xs font-bold text-slate-800">{siteConfig.location}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-primary">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">Sample Collection Time</p>
                  <p className="text-xs font-bold text-slate-800">06:00 AM - 06:30 PM (Mon-Sun)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-primary">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">Call Us</p>
                  <p className="text-xs font-bold text-slate-800">{siteConfig.contact}</p>
                </div>
              </div>
            </div>
            <a 
              href="https://www.google.com/maps?rlz=1C1JJTC_enIN1094IN1094&gs_lcrp=EgZjaHJvbWUqCAgBEAAYFhgeMgYIABBFGDkyCAgBEAAYFhgeMggIAhAAGBYYHjIICAMQABgWGB4yCAgEEAAYFhgeMgYIBRBFGD0yBggGEEUYPTIGCAcQRRg80gEJMTA1MDdqMGo3qAIAsAIA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KSlZDOiA0ZA5MeI7cOrvIN2e&daddr=Railway+Station+Rd,+near+Navin+Fal+Mandi,+Basti,+Uttar+Pradesh+272001" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-8 w-full block py-4 bg-primary text-white text-center rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-8 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4 font-display">Patient Experiences</h2>
          <p className="text-slate-500 font-medium">Read why the residents of Basti trust us with their families' healthcare.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, star) => (
                    <span key={star} className={star < t.rating ? "text-secondary" : "text-slate-200"}>★</span>
                  ))}
                </div>
                <p className="text-slate-600 font-medium italic leading-relaxed mb-8">"{t.review}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary overflow-hidden">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{t.name}</h4>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Verified Patient</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Info (Repositioned/Restyled) */}
      <section className="container mx-auto px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl flex items-start gap-6 border-b-4 border-primary">
            <Clock className="text-primary mt-1" size={40} />
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Home Collection Centre</h3>
              <p className="text-slate-500 text-sm mb-6 font-medium">Available for urgent medical needs and trauma care in Basti.</p>
              <div className="px-6 py-3 bg-slate-50 rounded-xl inline-block font-black text-primary font-mono text-lg">{siteConfig.contact}</div>
            </div>
          </div>
          <div className="bg-primary p-10 rounded-[2.5rem] shadow-xl flex items-start gap-6 text-white relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mb-16 -mr-16" />
            <Stethoscope className="text-white/40 mt-1" size={40} />
            <div className="relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Our Doctors</h3>
              <p className="text-white/80 text-sm mb-6 font-medium">Expert specialists from Lucknow and Delhi visiting regularly to Basti branch.</p>
              <button 
                onClick={() => setIsOpdPopupOpen(true)}
                className="text-white font-black uppercase text-xs tracking-widest border-b-2 border-white pb-1 flex items-center gap-2 hover:translate-x-2 transition-all"
              >
                See Full Schedule <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl flex items-start gap-6 border-b-4 border-accent">
            <MapPin className="text-accent mt-1" size={40} />
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Our Location</h3>
              <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">{siteConfig.location}</p>
              <div className="flex items-center gap-2 text-xs font-black text-accent uppercase">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                TIMING: MON - SUN: 9:00 AM - 6:30 PM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-slate-900 py-32 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-20" />
        <div className="container mx-auto px-12 flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          <div className="max-w-xl">
            <h2 className="text-5xl font-black mb-8 leading-tight uppercase tracking-tighter font-display">Why Choose <br/><span className="text-secondary underline decoration-white">Apollo Clinic Basti?</span></h2>
            <div className="space-y-10">
              {[
                { title: "Expert Doctors", desc: "Top-notch specialists from leading hospitals in Delhi & Lucknow." },
                { title: "Modern Tech", desc: "Fully automated laboratory and diagnostic equipment." },
                { title: "Patient First", desc: "Compassionate care with personalized medical attention." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-white/10 rounded-2xl flex items-center justify-center text-accent">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <motion.div
              initial={{ rotate: 5, scale: 0.9 }}
              whileInView={{ rotate: 0, scale: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-secondary/20 blur-3xl -m-10 rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" 
                className="rounded-[3rem] shadow-2xl border-8 border-white/10 relative z-10 w-full max-w-md"
                alt="Medical Care"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HealthPackagesPreview() {
  const { healthPackages, setIsOpdPopupOpen, setSelectedPackageId } = useAppContext();
  
  if (!healthPackages || healthPackages.length === 0) return null;
  
  return (
    <section className="py-32 bg-slate-50">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase text-secondary tracking-[0.2em] mb-4 block">Smart Prevention</span>
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6 font-display">
              Preventive Health <span className="text-primary underline decoration-secondary/30">Packages</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Unlock better health with our specialized checkup plans designed by experts at Apollo Clinic Basti.
            </p>
          </div>
          <Link to="/checkups" className="group flex items-center gap-4 bg-white p-2 pr-8 rounded-full shadow-xl shadow-slate-200 border border-slate-100 hover:scale-105 transition-all">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
              <FlaskConical size={24} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-900">View All Packages</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {healthPackages.slice(0, 3).map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative group"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="text-primary">
                  <motion.div 
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="font-black text-3xl tracking-tighter"
                  >
                    ₹{pkg.offerPrice}
                  </motion.div>
                  <div className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded mt-1">Starting Price</div>
                </div>
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-secondary shadow-inner">
                  <FlaskConical size={24} />
                </div>
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">{pkg.name}</h4>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-8">{pkg.totalTests} Specialized Tests</p>
              
              <div className="flex gap-2">
                <Link to="/checkups" className="flex-1 flex items-center justify-center gap-3 py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-slate-100 transition-all">
                  Details <ArrowRight size={14} />
                </Link>
                <button 
                  onClick={() => {
                    setSelectedPackageId(pkg.id);
                    setIsOpdPopupOpen(true);
                  }}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

