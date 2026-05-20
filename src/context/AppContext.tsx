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
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  // Initial Load & Sync from Supabase
  const loadData = async () => {
    if (!supabase) {
      setIsInitialLoadDone(true);
      return;
    }
    
    try {
      const [
        { data: site, error: siteErr },
        { data: docs, error: docsErr },
        { data: pkgs, error: pkgsErr },
        { data: apps, error: appsErr },
        { data: tests, error: testsErr },
        { data: depts, error: deptsErr },
        { data: clinicFiles, error: docsFileErr }
      ] = await Promise.all([
        supabase.from('site_config').select('*').single(),
        supabase.from('opd_doctors').select('*').order('created_at'),
        supabase.from('health_packages').select('*').order('created_at'),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('testimonials').select('*').order('created_at'),
        supabase.from('departments').select('*').order('created_at'),
        supabase.from('clinic_documents').select('*').order('created_at')
      ]);

      if (siteErr && siteErr.code !== 'PGRST116') console.error("Site config load error:", siteErr);
      if (docsErr) console.error("Doctors load error:", docsErr);
      if (pkgsErr) console.error("Packages load error:", pkgsErr);
      if (appsErr) console.error("Appointments load error:", appsErr);

      if (site) setSiteConfig(site.config_data as SiteConfig);
      if (docs && docs.length > 0) {
        setOpdDoctors(docs.map(d => ({
          id: d.id,
          name: d.name,
          specialty: d.specialty,
          qualifications: d.qualifications,
          experience: d.experience,
          departmentId: d.department_id,
          availabilityType: d.availability_type || 'visiting',
          availableDays: d.available_days || [],
          visitingDate: d.visiting_date,
          location: d.location,
          photo: d.photo,
          isAvailable: d.is_available,
          expiryDate: d.expiry_date,
          fee: d.fee,
          consultationTime: d.consultation_time
        })));
      }
      if (pkgs && pkgs.length > 0) {
        setHealthPackages(pkgs.map(p => ({
          id: p.id,
          name: p.name,
          actualPrice: p.actual_price,
          offerPrice: p.offer_price,
          totalTests: p.total_tests,
          tests: p.tests,
          discountBadge: p.discount_badge,
          description: p.description
        })));
      }
      if (apps && apps.length > 0) {
        setAppointments(apps.map(a => ({
          id: a.id,
          patientName: a.patient_name,
          patientPhone: a.patient_phone,
          patientWhatsapp: a.patient_whatsapp,
          patientAddress: a.patient_address,
          doctorId: a.doctor_id,
          date: a.date,
          time: a.time,
          status: a.status,
          type: a.type,
          isHomeCollection: a.is_home_collection,
          claimOffer: a.claim_offer,
          finalPrice: Number(a.final_price) || 0
        })));
      }
      if (tests && tests.length > 0) setTestimonials(tests);
      if (depts && depts.length > 0) {
        setDepartments(depts.map(d => ({
          id: d.id,
          name: d.name,
          headOfDepartment: d.head_of_department,
          description: d.description
        })));
      }
      if (clinicFiles && clinicFiles.length > 0) setDocuments(clinicFiles.map(f => ({
        id: f.id,
        name: f.name,
        fileData: f.file_url,
        uploadDate: f.upload_date
      })));
    } catch (e) {
      console.error("Supabase load exception:", e);
    } finally {
      setIsInitialLoadDone(true);
    }
  };

  useEffect(() => {
    loadData();

    // Focus handler for auto-refresh (if not on administrative panel)
    const handleFocus = () => {
      if (!window.location.pathname.toLowerCase().includes('/admin')) {
        loadData();
      }
    };

    window.addEventListener('focus', handleFocus);

    // Dynamic poll interval
    const interval = setInterval(() => {
      if (!window.location.pathname.toLowerCase().includes('/admin')) {
        loadData();
      }
    }, 10000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Use a wrapped setter for siteConfig to avoid auto-sync during load
  const wrappedSetSiteConfig = async (config: SiteConfig) => {
    setSiteConfig(config);
    if (supabase && isInitialLoadDone) {
      const { error } = await supabase.from('site_config').upsert({ id: 'config', config_data: config });
      if (error) console.error("Site sync error:", error);
    }
  };

  const wrappedSetDoctors = async (doctors: OPDDoctor[]) => {
    setOpdDoctors(doctors);
    if (supabase && isInitialLoadDone) {
      const dbDocs = doctors.map(d => ({
        id: d.id,
        name: d.name,
        specialty: d.specialty,
        qualifications: d.qualifications,
        experience: d.experience,
        department_id: d.departmentId,
        availability_type: d.availabilityType,
        available_days: d.availableDays,
        visiting_date: d.visitingDate,
        location: d.location,
        photo: d.photo,
        is_available: d.isAvailable,
        expiry_date: d.expiryDate,
        fee: d.fee,
        consultation_time: d.consultationTime
      }));
      const { error } = await supabase.from('opd_doctors').upsert(dbDocs);
      if (error) console.error("Doctors sync error:", error);
    }
  };

  const wrappedSetPackages = async (pkgs: HealthPackage[]) => {
    setHealthPackages(pkgs);
    if (supabase && isInitialLoadDone) {
      const dbPkgs = pkgs.map(p => ({
        id: p.id,
        name: p.name,
        actual_price: p.actualPrice,
        offer_price: p.offerPrice,
        total_tests: p.totalTests,
        tests: p.tests,
        discount_badge: p.discountBadge,
        description: p.description
      }));
      const { error } = await supabase.from('health_packages').upsert(dbPkgs);
      if (error) console.error("Packages sync error:", error);
    }
  };

  const wrappedSetTestimonials = async (tests: Testimonial[]) => {
    setTestimonials(tests);
    if (supabase && isInitialLoadDone) {
      const { error } = await supabase.from('testimonials').upsert(tests);
      if (error) console.error("Testimonials sync error:", error);
    }
  };

  const wrappedSetDepartments = async (depts: Department[]) => {
    setDepartments(depts);
    if (supabase && isInitialLoadDone) {
      const dbDepts = depts.map(d => ({
        id: d.id,
        name: d.name,
        head_of_department: d.headOfDepartment,
        description: d.description
      }));
      const { error } = await supabase.from('departments').upsert(dbDepts);
      if (error) console.error("Departments sync error:", error);
    }
  };

  const wrappedSetDocuments = async (docs: ClinicDocument[]) => {
    setDocuments(docs);
    if (supabase && isInitialLoadDone) {
      const dbFiles = docs.map(d => ({
        id: d.id,
        name: d.name,
        file_url: d.fileData,
        upload_date: d.uploadDate
      }));
      const { error } = await supabase.from('clinic_documents').upsert(dbFiles);
      if (error) console.error("Documents sync error:", error);
    }
  };

  const wrappedSetAppointments = async (newApps: Appointment[]) => {
    setAppointments(newApps);
    if (supabase && isInitialLoadDone && newApps.length > 0) {
      // For appointments, we might be adding or updating.
      // Easiest is to upsert the entire current list OR the ones that are likely new/changed.
      // Since it's usually small for a clinic, we'll upsert the whole array to be safe, 
      // but only if it's manageable. 
      const dbApps = newApps.map(a => ({
        id: a.id,
        patient_name: a.patientName,
        patient_phone: a.patientPhone,
        patient_whatsapp: a.patientWhatsapp,
        patient_address: a.patientAddress,
        doctor_id: a.doctorId,
        date: a.date,
        time: a.time,
        status: a.status,
        type: a.type,
        is_home_collection: a.isHomeCollection,
        claim_offer: a.claimOffer,
        final_price: a.finalPrice
      }));
      const { error } = await supabase.from('appointments').upsert(dbApps);
      if (error) console.error("Appointments sync error:", error);
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
      siteConfig, setSiteConfig: wrappedSetSiteConfig, 
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
