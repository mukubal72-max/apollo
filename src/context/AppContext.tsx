import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { OPDDoctor, Service, SiteConfig, Appointment, Testimonial, Department, HealthPackage, ClinicDocument } from '../types';
import { INITIAL_OPD_SCHEDULE, INITIAL_SERVICES, SITE_CONFIG, INITIAL_TESTIMONIALS, INITIAL_DEPARTMENTS, INITIAL_HEALTH_PACKAGES } from '../constants';
import { supabase } from '../lib/supabase';

interface AppContextType {
  siteConfig: SiteConfig;
  setSiteConfig: (config: SiteConfig) => void;
  opdDoctors: OPDDoctor[];
  setOpdDoctors: (doctors: OPDDoctor[]) => void;
  services: Service[];
  setServices: (services: Service[]) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  departments: Department[];
  setDepartments: (departments: Department[]) => void;
  healthPackages: HealthPackage[];
  setHealthPackages: (packages: HealthPackage[]) => void;
  documents: ClinicDocument[];
  setDocuments: (documents: ClinicDocument[]) => void;
  isOpdPopupOpen: boolean;
  setIsOpdPopupOpen: (open: boolean) => void;
  selectedPackageId: string | null;
  setSelectedPackageId: (id: string | null) => void;
  
  // Explicit Deletions
  deleteDoctor: (id: string) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isOpdPopupOpen, setIsOpdPopupOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  
  // States
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(SITE_CONFIG);
  const [opdDoctors, setOpdDoctors] = useState<OPDDoctor[]>(INITIAL_OPD_SCHEDULE);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [healthPackages, setHealthPackages] = useState<HealthPackage[]>(INITIAL_HEALTH_PACKAGES);
  const [documents, setDocuments] = useState<ClinicDocument[]>([]);

  // Initial Load from Supabase
  useEffect(() => {
    async function loadData() {
      if (!supabase) return;
      
      try {
        const [
          { data: site },
          { data: docs },
          { data: pkgs },
          { data: apps },
          { data: tests },
          { data: depts },
          { data: clinicFiles }
        ] = await Promise.all([
          supabase.from('site_config').select('*').single(),
          supabase.from('opd_doctors').select('*').order('created_at'),
          supabase.from('health_packages').select('*').order('created_at'),
          supabase.from('appointments').select('*').order('created_at', { ascending: false }),
          supabase.from('testimonials').select('*').order('created_at'),
          supabase.from('departments').select('*').order('created_at'),
          supabase.from('clinic_documents').select('*').order('created_at')
        ]);

        if (site) setSiteConfig(site.config_data as SiteConfig);
        if (docs) setOpdDoctors(docs);
        if (pkgs) setHealthPackages(pkgs);
        if (apps) setAppointments(apps);
        if (tests) setTestimonials(tests);
        if (depts) setDepartments(depts);
        if (clinicFiles) setDocuments(clinicFiles.map(f => ({
          id: f.id,
          name: f.name,
          fileData: f.file_url,
          uploadDate: f.upload_date
        })));
      } catch (e) {
        console.error("Supabase load error, using defaults:", e);
      }
    }
    loadData();
  }, []);

  // Sync Site Config
  useEffect(() => {
    localStorage.setItem('siteConfig', JSON.stringify(siteConfig));
    if (supabase) {
      supabase.from('site_config').upsert({ id: 'config', config_data: siteConfig }).then();
    }
  }, [siteConfig]);

  const wrappedSetDoctors = async (doctors: OPDDoctor[]) => {
    setOpdDoctors(doctors);
    if (supabase) await supabase.from('opd_doctors').upsert(doctors);
  };

  const wrappedSetPackages = async (pkgs: HealthPackage[]) => {
    setHealthPackages(pkgs);
    if (supabase) await supabase.from('health_packages').upsert(pkgs);
  };

  const wrappedSetTestimonials = async (tests: Testimonial[]) => {
    setTestimonials(tests);
    if (supabase) await supabase.from('testimonials').upsert(tests);
  };

  const wrappedSetDepartments = async (depts: Department[]) => {
    setDepartments(depts);
    if (supabase) await supabase.from('departments').upsert(depts);
  };

  const wrappedSetDocuments = async (docs: ClinicDocument[]) => {
    setDocuments(docs);
    if (supabase) {
      await supabase.from('clinic_documents').upsert(docs.map(d => ({
        id: d.id,
        name: d.name,
        file_url: d.fileData,
        upload_date: d.uploadDate
      })));
    }
  };

  const wrappedSetAppointments = async (newApps: Appointment[]) => {
    setAppointments(newApps);
    if (supabase && newApps.length > 0) {
      // Upsert the latest one or all (simple for now: just the first if it was an add)
      const latestApp = newApps[0];
      await supabase.from('appointments').upsert({
        id: latestApp.id,
        patient_name: latestApp.patientName,
        patient_phone: latestApp.patientPhone,
        patient_whatsapp: latestApp.patientWhatsapp,
        patient_address: latestApp.patientAddress,
        doctor_id: latestApp.doctorId,
        date: latestApp.date,
        time: latestApp.time,
        status: latestApp.status,
        type: latestApp.type,
        is_home_collection: latestApp.isHomeCollection,
        claim_offer: latestApp.claimOffer,
        final_price: latestApp.finalPrice
      });
    }
  };

  const deleteDoctor = async (id: string) => {
    setOpdDoctors(prev => prev.filter(d => d.id !== id));
    if (supabase) await supabase.from('opd_doctors').delete().eq('id', id);
  };

  const deleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    if (supabase) await supabase.from('appointments').delete().eq('id', id);
  };

  const deletePackage = async (id: string) => {
    setHealthPackages(prev => prev.filter(p => p.id !== id));
    if (supabase) await supabase.from('health_packages').delete().eq('id', id);
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    if (supabase) await supabase.from('testimonials').delete().eq('id', id);
  };

  const deleteDepartment = async (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    if (supabase) await supabase.from('departments').delete().eq('id', id);
  };

  const deleteDocument = async (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (supabase) await supabase.from('clinic_documents').delete().eq('id', id);
  };

  return (
    <AppContext.Provider value={{ 
      siteConfig, setSiteConfig, 
      opdDoctors, setOpdDoctors: wrappedSetDoctors, 
      services, setServices, 
      appointments, setAppointments: wrappedSetAppointments,
      testimonials, setTestimonials: wrappedSetTestimonials,
      departments, setDepartments: wrappedSetDepartments,
      healthPackages, setHealthPackages: wrappedSetPackages,
      documents, setDocuments: wrappedSetDocuments,
      isOpdPopupOpen, setIsOpdPopupOpen,
      selectedPackageId, setSelectedPackageId,
      deleteDoctor,
      deleteAppointment,
      deletePackage,
      deleteTestimonial,
      deleteDepartment,
      deleteDocument
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
