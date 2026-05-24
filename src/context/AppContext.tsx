import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { OPDDoctor, Service, SiteConfig, Appointment, Testimonial, Department, HealthPackage, ClinicDocument } from '../types';
import { INITIAL_OPD_SCHEDULE, INITIAL_SERVICES, SITE_CONFIG, INITIAL_TESTIMONIALS, INITIAL_DEPARTMENTS, INITIAL_HEALTH_PACKAGES } from '../constants';
import { supabase } from '../lib/supabase';

interface AppContextType {
  siteConfig: SiteConfig;
  setSiteConfig: (config: SiteConfig, syncToDb?: boolean) => void;
  opdDoctors: OPDDoctor[];
  setOpdDoctors: (doctors: OPDDoctor[], syncToDb?: boolean) => void;
  services: Service[];
  setServices: (services: Service[]) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[], syncToDb?: boolean) => void;
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[], syncToDb?: boolean) => void;
  departments: Department[];
  setDepartments: (departments: Department[], syncToDb?: boolean) => void;
  healthPackages: HealthPackage[];
  setHealthPackages: (packages: HealthPackage[], syncToDb?: boolean) => void;
  documents: ClinicDocument[];
  setDocuments: (documents: ClinicDocument[], syncToDb?: boolean) => void;
  isOpdPopupOpen: boolean;
  setIsOpdPopupOpen: (open: boolean) => void;
  selectedPackageId: string | null;
  setSelectedPackageId: (id: string | null) => void;
  isInitialLoadDone: boolean;
  
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
  const [opdDoctors, setOpdDoctors] = useState<OPDDoctor[]>([]);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [healthPackages, setHealthPackages] = useState<HealthPackage[]>([]);
  const [documents, setDocuments] = useState<ClinicDocument[]>([]);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
  const [siteConfigDbId, setSiteConfigDbId] = useState<string | null>(null);

  // Sync refs to hold last-synced data for safe diff checks (avoids stale comparison on save clicks)
  const syncedDoctorsRef = useRef<OPDDoctor[]>([]);
  const syncedPackagesRef = useRef<HealthPackage[]>([]);
  const syncedTestimonialsRef = useRef<Testimonial[]>([]);
  const syncedDepartmentsRef = useRef<Department[]>([]);
  const syncedDocumentsRef = useRef<ClinicDocument[]>([]);

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

      if (site) {
        const fetched = site.config_data as SiteConfig;
        const merged: SiteConfig = {
          ...SITE_CONFIG,
          ...fetched,
          promotionPopup: fetched.promotionPopup ? {
            ...SITE_CONFIG.promotionPopup!,
            ...fetched.promotionPopup
          } : SITE_CONFIG.promotionPopup,
          posters: fetched.posters || SITE_CONFIG.posters || []
        };
        setSiteConfig(merged);
        setSiteConfigDbId(site.id);
      }
      if (docs) {
        const mappedDocs = docs.map(d => ({
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
        }));
        setOpdDoctors(mappedDocs);
        syncedDoctorsRef.current = mappedDocs;
      }
      if (pkgs) {
        const mappedPkgs = pkgs.map(p => ({
          id: p.id,
          name: p.name,
          actualPrice: p.actual_price,
          offerPrice: p.offer_price,
          totalTests: p.total_tests,
          tests: p.tests,
          discountBadge: p.discount_badge,
          description: p.description
        }));
        setHealthPackages(mappedPkgs);
        syncedPackagesRef.current = mappedPkgs;
      }
      if (apps) {
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
      if (tests) {
        setTestimonials(tests);
        syncedTestimonialsRef.current = tests;
      }
      if (depts) {
        const mappedDepts = depts.map(d => ({
          id: d.id,
          name: d.name,
          headOfDepartment: d.head_of_department,
          description: d.description
        }));
        setDepartments(mappedDepts);
        syncedDepartmentsRef.current = mappedDepts;
      }
      if (clinicFiles) {
        const mappedDocs = clinicFiles.map(f => ({
          id: f.id,
          name: f.name,
          fileData: f.file_url,
          uploadDate: f.upload_date
        }));
        setDocuments(mappedDocs);
        syncedDocumentsRef.current = mappedDocs;
      }
    } catch (e) {
      console.error("Supabase load exception:", e);
    } finally {
      setIsInitialLoadDone(true);
    }
  };

  useEffect(() => {
    loadData();

    // Setup Supabase Realtime channel for synchronization across all devices and browsers
    let channel: any = null;
    if (supabase) {
      channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public'
          },
          () => {
            loadData();
          }
        )
        .subscribe();
    }

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
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Use a wrapped setter for siteConfig to avoid auto-sync during load
  const wrappedSetSiteConfig = async (config: SiteConfig, syncToDb = true) => {
    const oldConfig = siteConfig;
    setSiteConfig(config);
    if (syncToDb && supabase && isInitialLoadDone) {
      const idToUse = siteConfigDbId || '00000000-0000-0000-0000-000000000001';
      const { data: { user } } = await supabase.auth.getUser();
      const payload: any = { id: idToUse, config_data: config };
      if (user) {
        payload.created_by = user.id;
      }
      const { error } = await supabase.from('site_config').upsert(payload);
      if (error) {
        console.error("Site sync error:", error);
        setSiteConfig(oldConfig);
        throw new Error(error.message || "Failed to sync site configuration with database.");
      }
    }
  };

  const wrappedSetDoctors = async (doctors: OPDDoctor[], syncToDb = true) => {
    const oldDoctors = opdDoctors;
    setOpdDoctors(doctors);
    if (syncToDb && supabase && isInitialLoadDone) {
      // Diff to only upsert new or modified doctors
      const changedOrNew = doctors.filter(newDoc => {
        const oldDoc = syncedDoctorsRef.current.find(o => o.id === newDoc.id);
        if (!oldDoc) return true;
        return JSON.stringify(oldDoc) !== JSON.stringify(newDoc);
      });

      if (changedOrNew.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        const dbDocs = changedOrNew.map(d => {
          const payload: any = {
            id: d.id,
            name: d.name,
            specialty: d.specialty,
            qualifications: d.qualifications,
            experience: d.experience,
            department_id: d.departmentId || null,
            availability_type: d.availabilityType,
            available_days: d.availableDays,
            visiting_date: d.visitingDate,
            location: d.location,
            photo: d.photo,
            is_available: d.isAvailable,
            expiry_date: d.expiryDate,
            fee: d.fee,
            consultation_time: d.consultationTime
          };
          if (user) {
            payload.created_by = user.id;
          }
          return payload;
        });
        const { error } = await supabase.from('opd_doctors').upsert(dbDocs);
        if (error) {
          console.error("Doctors sync error:", error);
          setOpdDoctors(oldDoctors);
          throw new Error(error.message || "Failed to sync doctors roster with database.");
        }
        syncedDoctorsRef.current = doctors;
      }
    }
  };

  const wrappedSetPackages = async (pkgs: HealthPackage[], syncToDb = true) => {
    const oldPkgs = healthPackages;
    setHealthPackages(pkgs);
    if (syncToDb && supabase && isInitialLoadDone) {
      // Diff to only upsert new or modified packages
      const changedOrNew = pkgs.filter(newPkg => {
        const oldPkg = syncedPackagesRef.current.find(o => o.id === newPkg.id);
        if (!oldPkg) return true;
        return JSON.stringify(oldPkg) !== JSON.stringify(newPkg);
      });

      if (changedOrNew.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        const dbPkgs = changedOrNew.map(p => {
          const payload: any = {
            id: p.id,
            name: p.name,
            actual_price: p.actualPrice,
            offer_price: p.offerPrice,
            total_tests: p.totalTests,
            tests: p.tests,
            discount_badge: p.discountBadge,
            description: p.description
          };
          if (user) {
            payload.created_by = user.id;
          }
          return payload;
        });
        const { error } = await supabase.from('health_packages').upsert(dbPkgs);
        if (error) {
          console.error("Packages sync error:", error);
          setHealthPackages(oldPkgs);
          throw new Error(error.message || "Failed to sync health packages with database.");
        }
        syncedPackagesRef.current = pkgs;
      }
    }
  };

  const wrappedSetTestimonials = async (tests: Testimonial[], syncToDb = true) => {
    const oldTests = testimonials;
    setTestimonials(tests);
    if (syncToDb && supabase && isInitialLoadDone) {
      // Diff to only upsert new or modified testimonials
      const changedOrNew = tests.filter(newTest => {
        const oldTest = syncedTestimonialsRef.current.find(o => o.id === newTest.id);
        if (!oldTest) return true;
        return JSON.stringify(oldTest) !== JSON.stringify(newTest);
      });

      if (changedOrNew.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        const payload = changedOrNew.map(t => {
          const item: any = {
            id: t.id,
            name: t.name,
            rating: t.rating,
            review: t.review,
            photo: t.photo
          };
          if (user) {
            item.created_by = user.id;
          }
          return item;
        });
        const { error } = await supabase.from('testimonials').upsert(payload);
        if (error) {
          console.error("Testimonials sync error:", error);
          setTestimonials(oldTests);
          throw new Error(error.message || "Failed to sync testimonials with database.");
        }
        syncedTestimonialsRef.current = tests;
      }
    }
  };

  const wrappedSetDepartments = async (depts: Department[], syncToDb = true) => {
    const oldDepts = departments;
    setDepartments(depts);
    if (syncToDb && supabase && isInitialLoadDone) {
      // Diff to only upsert new or modified departments
      const changedOrNew = depts.filter(newDept => {
        const oldDept = syncedDepartmentsRef.current.find(o => o.id === newDept.id);
        if (!oldDept) return true;
        return JSON.stringify(oldDept) !== JSON.stringify(newDept);
      });

      if (changedOrNew.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        const dbDepts = changedOrNew.map(d => {
          const payload: any = {
            id: d.id,
            name: d.name,
            head_of_department: d.headOfDepartment,
            description: d.description
          };
          if (user) {
            payload.created_by = user.id;
          }
          return payload;
        });
        const { error } = await supabase.from('departments').upsert(dbDepts);
        if (error) {
          console.error("Departments sync error:", error);
          setDepartments(oldDepts);
          throw new Error(error.message || "Failed to sync departments with database.");
        }
        syncedDepartmentsRef.current = depts;
      }
    }
  };

  const wrappedSetDocuments = async (docs: ClinicDocument[], syncToDb = true) => {
    const oldDocs = documents;
    setDocuments(docs);
    if (syncToDb && supabase && isInitialLoadDone) {
      // Diff to only upsert new or modified documents
      const changedOrNew = docs.filter(newDoc => {
        const oldDoc = syncedDocumentsRef.current.find(o => o.id === newDoc.id);
        if (!oldDoc) return true;
        return JSON.stringify(oldDoc) !== JSON.stringify(newDoc);
      });

      if (changedOrNew.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        const dbFiles = changedOrNew.map(d => {
          const payload: any = {
            id: d.id,
            name: d.name,
            file_url: d.fileData,
            upload_date: d.uploadDate
          };
          if (user) {
            payload.created_by = user.id;
          }
          return payload;
        });
        const { error } = await supabase.from('clinic_documents').upsert(dbFiles);
        if (error) {
          console.error("Documents sync error:", error);
          setDocuments(oldDocs);
          throw new Error(error.message || "Failed to sync clinical documents with database.");
        }
        syncedDocumentsRef.current = docs;
      }
    }
  };

  const wrappedSetAppointments = async (newApps: Appointment[], syncToDb = true) => {
    const oldApps = appointments;
    setAppointments(newApps);
    if (syncToDb && supabase && isInitialLoadDone && newApps.length > 0) {
      // Diff to only upsert new or modified appointments.
      // This is crucial for anonymous patient bookings to avoid RLS violation errors 
      // when attempting to upsert existing appointments of other patients!
      const changedOrNew = newApps.filter(newApp => {
        const oldApp = oldApps.find(o => o.id === newApp.id);
        if (!oldApp) return true;
        return JSON.stringify(oldApp) !== JSON.stringify(newApp);
      });

      if (changedOrNew.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        const dbApps = changedOrNew.map(a => {
          const payload: any = {
            id: a.id,
            patient_name: a.patientName,
            patient_phone: a.patientPhone,
            patient_whatsapp: a.patientWhatsapp,
            patient_address: a.patientAddress,
            doctor_id: a.doctorId || null,
            date: a.date,
            time: a.time,
            status: a.status,
            type: a.type,
            is_home_collection: a.isHomeCollection,
            claim_offer: a.claimOffer,
            final_price: a.finalPrice
          };
          if (user) {
            payload.created_by = user.id;
          }
          return payload;
        });
        const { error } = await supabase.from('appointments').upsert(dbApps);
        if (error) {
          console.error("Appointments sync error:", error);
          setAppointments(oldApps);
          throw new Error(error.message || "Failed to save appointment to database.");
        }
      }
    }
  };

  const deleteDoctor = async (id: string) => {
    const oldDocs = opdDoctors;
    setOpdDoctors(prev => prev.filter(d => d.id !== id));
    if (supabase) {
      const { error } = await supabase.from('opd_doctors').delete().eq('id', id);
      if (error) {
        setOpdDoctors(oldDocs);
        throw new Error(error.message || "Failed to delete doctor from database.");
      }
      syncedDoctorsRef.current = syncedDoctorsRef.current.filter(d => d.id !== id);
    }
  };

  const deleteAppointment = async (id: string) => {
    const oldApps = appointments;
    setAppointments(prev => prev.filter(a => a.id !== id));
    if (supabase) {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) {
        setAppointments(oldApps);
        throw new Error(error.message || "Failed to delete appointment from database.");
      }
    }
  };

  const deletePackage = async (id: string) => {
    const oldPackages = healthPackages;
    setHealthPackages(prev => prev.filter(p => p.id !== id));
    if (supabase) {
      const { error } = await supabase.from('health_packages').delete().eq('id', id);
      if (error) {
        setHealthPackages(oldPackages);
        throw new Error(error.message || "Failed to delete health package from database.");
      }
      syncedPackagesRef.current = syncedPackagesRef.current.filter(p => p.id !== id);
    }
  };

  const deleteTestimonial = async (id: string) => {
    const oldTests = testimonials;
    setTestimonials(prev => prev.filter(t => t.id !== id));
    if (supabase) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) {
        setTestimonials(oldTests);
        throw new Error(error.message || "Failed to delete testimonial from database.");
      }
      syncedTestimonialsRef.current = syncedTestimonialsRef.current.filter(t => t.id !== id);
    }
  };

  const deleteDepartment = async (id: string) => {
    const oldDepts = departments;
    setDepartments(prev => prev.filter(d => d.id !== id));
    if (supabase) {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) {
        setDepartments(oldDepts);
        throw new Error(error.message || "Failed to delete department from database.");
      }
      syncedDepartmentsRef.current = syncedDepartmentsRef.current.filter(d => d.id !== id);
    }
  };

  const deleteDocument = async (id: string) => {
    const oldDocs = documents;
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (supabase) {
      const { error } = await supabase.from('clinic_documents').delete().eq('id', id);
      if (error) {
        setDocuments(oldDocs);
        throw new Error(error.message || "Failed to delete document from database.");
      }
      syncedDocumentsRef.current = syncedDocumentsRef.current.filter(d => d.id !== id);
    }
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
      isInitialLoadDone,
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
