import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash2, Edit, Settings, Users, Activity, Lock, Upload, Image as ImageIcon, Calendar, Check, X, Phone, User, Clock, Shield, FlaskConical, FileText, MessageCircle, HelpCircle, Mail, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OPDDoctor, Appointment, Testimonial, Department, HealthPackage, ClinicDocument, Media, MessageLog, StaffAccount, Template } from '../types';
import { supabase, generateUUID } from '../lib/supabase';
import heroBannerImage from '../assets/images/basti_hero_banner_1779695031243.png';

export default function Admin() {
  const { 
    opdDoctors, setOpdDoctors, 
    siteConfig, setSiteConfig, 
    services, setServices, 
    appointments, setAppointments,
    testimonials, setTestimonials,
    departments, setDepartments,
    healthPackages, setHealthPackages,
    documents, setDocuments,
    deleteDoctor: removeDoctor,
    deleteAppointment: removeAppointment,
    deletePackage: removePackage,
    deleteTestimonial: removeTestimonial,
    deleteDepartment: removeDepartment,
    deleteDocument: removeDocument
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'site' | 'doctors' | 'services' | 'appointments' | 'testimonials' | 'marketing' | 'departments' | 'checkups' | 'documents' | 'media' | 'messages' | 'staff' | 'templates'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'supabase' | 'legacy'>('supabase');
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);

  // NEW Custom Admin entity states
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [messageLogs, setMessageLogs] = useState<MessageLog[]>([]);
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([]);
  const [templatesList, setTemplatesList] = useState<Template[]>([]);

  // Form states for Sending Messages
  const [msgRecipient, setMsgRecipient] = useState('');
  const [msgSelectedTemplate, setMsgSelectedTemplate] = useState<string>('');
  const [msgVariables, setMsgVariables] = useState<{[key: string]: string}>({});
  const [msgBody, setMsgBody] = useState('');
  const [msgType, setMsgType] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');

  // Form states for Staff Accounts
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<'admin' | 'staff' | 'doctor'>('staff');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffIsActive, setStaffIsActive] = useState(true);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  // Form states for Message Templates
  const [tplName, setTplName] = useState('');
  const [tplContent, setTplContent] = useState('');
  const [tplType, setTplType] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [tplPlaceholders, setTplPlaceholders] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Fetch functions
  const fetchMedia = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setMediaList(data || []);
    } catch (e) {
      console.error("Error fetching media:", e);
    }
  };

  const fetchMessages = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('message_logs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setMessageLogs(data || []);
    } catch (e) {
      console.error("Error fetching message logs:", e);
    }
  };

  const fetchStaff = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('staff_accounts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setStaffAccounts(data || []);
    } catch (e) {
      console.error("Error fetching staff accounts:", e);
    }
  };

  const fetchTemplates = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setTemplatesList(data || []);
    } catch (e) {
      console.error("Error fetching templates:", e);
    }
  };

  // Auto loaders
  useEffect(() => {
    if (isAuthenticated && supabase) {
      fetchMedia();
      fetchMessages();
      fetchStaff();
      fetchTemplates();
    }
  }, [isAuthenticated]);

  // Dynamic templates listener to set correct fields when choosing templates
  useEffect(() => {
    if (!msgSelectedTemplate) {
      setMsgBody('');
      setMsgVariables({});
      return;
    }
    const tpl = templatesList.find(t => t.id === msgSelectedTemplate);
    if (tpl) {
      setMsgBody(tpl.content);
      setMsgType(tpl.type);
      const vars: {[key: string]: string} = {};
      if (tpl.placeholder_keys && tpl.placeholder_keys.length > 0) {
         tpl.placeholder_keys.forEach(k => {
           vars[k] = '';
         });
      } else {
         const matches = tpl.content.match(/\{\{([^}]+)\}\}/g);
         if (matches) {
           matches.forEach(m => {
             const key = m.replace(/\{\{|\}\}/g, '').trim();
             vars[key] = '';
           });
         }
      }
      setMsgVariables(vars);
    }
  }, [msgSelectedTemplate, templatesList]);

  const getInterpolatedMessage = () => {
    let text = msgBody;
    Object.entries(msgVariables).forEach(([key, val]) => {
      text = text.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), val || `[${key}]`);
    });
    return text;
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const { error } = await supabase.from('media').insert({
          name: file.name,
          file_url: base64,
          file_type: file.type,
          file_size: file.size
        });
        if (error) throw error;
        showToast("Media uploaded successfully!");
        fetchMedia();
      } catch (err: any) {
        showToast("Upload failed: " + err.message, "error");
      }
    };
    reader.readAsDataURL(file);
  };

  const deleteMediaItem = async (id: string) => {
    customConfirm('Are you sure you want to delete this media item?', async () => {
      try {
        const { error } = await supabase.from('media').delete().eq('id', id);
        if (error) throw error;
        showToast("Media item deleted!");
        fetchMedia();
      } catch (err: any) {
        showToast("Deletion failed: " + err.message, "error");
      }
    });
  };

  const useMediaAsHero = async (fileUrl: string) => {
    setSiteConfig({ ...siteConfig, heroBanner: fileUrl });
    showToast("Homepage Hero Banner updated! Save config to persist.");
  };

  const useMediaAsPoster = async (fileUrl: string) => {
    const currentPosters = siteConfig.posters || [];
    if (currentPosters.includes(fileUrl)) {
      showToast("Already in posters collection!", "info");
      return;
    }
    setSiteConfig({ ...siteConfig, posters: [...currentPosters, fileUrl] });
    showToast("Poster added to collection! Save config to persist.");
  };

  const handleSendMessage = async () => {
    if (!msgRecipient) {
      showToast("Please enter a recipient contact!", "error");
      return;
    }
    const finalMsg = getInterpolatedMessage();
    if (!finalMsg) {
      showToast("Message content is empty!", "error");
      return;
    }

    try {
      const { error } = await supabase.from('message_logs').insert({
        recipient: msgRecipient,
        message: finalMsg,
        template_type: msgType,
        status: 'sent'
      });
      if (error) throw error;
      showToast("Message sent and logged successfully!");
      setMsgRecipient('');
      setMsgSelectedTemplate('');
      fetchMessages();
    } catch (err: any) {
      showToast("Failed to log message: " + err.message, "error");
    }
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail) {
      showToast("Name and Email are required!", "error");
      return;
    }
    try {
      const payload = {
        name: staffName,
        email: staffEmail,
        role: staffRole,
        phone: staffPhone,
        is_active: staffIsActive
      };
      if (editingStaffId) {
        const { error } = await supabase.from('staff_accounts').update(payload).eq('id', editingStaffId);
        if (error) throw error;
        showToast("Staff account updated!");
      } else {
        const { error } = await supabase.from('staff_accounts').insert(payload);
        if (error) throw error;
        showToast("Staff account registered!");
      }
      setStaffName('');
      setStaffEmail('');
      setStaffRole('staff');
      setStaffPhone('');
      setStaffIsActive(true);
      setEditingStaffId(null);
      fetchStaff();
    } catch (err: any) {
      showToast("Failed to save staff: " + err.message, "error");
    }
  };

  const startEditStaff = (staff: StaffAccount) => {
    setStaffName(staff.name);
    setStaffEmail(staff.email);
    setStaffRole(staff.role);
    setStaffPhone(staff.phone || '');
    setStaffIsActive(staff.is_active);
    setEditingStaffId(staff.id);
  };

  const handleDeleteStaff = async (id: string) => {
    customConfirm("Are you sure you want to delete this staff account?", async () => {
      try {
        const { error } = await supabase.from('staff_accounts').delete().eq('id', id);
        if (error) throw error;
        showToast("Staff account removed!");
        fetchStaff();
      } catch (err: any) {
        showToast("Failed to delete staff: " + err.message, "error");
      }
    });
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplName || !tplContent) {
      showToast("Template Name and Content are required!", "error");
      return;
    }
    const keys = tplPlaceholders
      ? tplPlaceholders.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    try {
      const payload = {
        name: tplName,
        content: tplContent,
        type: tplType,
        placeholder_keys: keys
      };
      if (editingTemplateId) {
        const { error } = await supabase.from('templates').update(payload).eq('id', editingTemplateId);
        if (error) throw error;
        showToast("Template updated!");
      } else {
        const { error } = await supabase.from('templates').insert(payload);
        if (error) throw error;
        showToast("Template created!");
      }
      setTplName('');
      setTplContent('');
      setTplType('whatsapp');
      setTplPlaceholders('');
      setEditingTemplateId(null);
      fetchTemplates();
    } catch (err: any) {
      showToast("Failed to save template: " + err.message, "error");
    }
  };

  const startEditTemplate = (tpl: Template) => {
    setTplName(tpl.name);
    setTplContent(tpl.content);
    setTplType(tpl.type);
    setTplPlaceholders(tpl.placeholder_keys ? tpl.placeholder_keys.join(', ') : '');
    setEditingTemplateId(tpl.id);
  };

  const handleDeleteTemplate = async (id: string) => {
    customConfirm("Are you sure you want to delete this template?", async () => {
      try {
        const { error } = await supabase.from('templates').delete().eq('id', id);
        if (error) throw error;
        showToast("Template deleted!");
        fetchTemplates();
      } catch (err: any) {
        showToast("Failed to delete template: " + err.message, "error");
      }
    });
  };

  const logoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [savingStatus, setSavingStatus] = useState<{[key: string]: boolean}>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const [activeAppointmentForm, setActiveAppointmentForm] = useState<Partial<Appointment> | null>(null);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
  } | null>(null);

  const customConfirm = (message: string, onConfirm: () => void | Promise<void>, title = "Are you sure?") => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        await onConfirm();
        setConfirmState(null);
      },
      onCancel: () => {
        setConfirmState(null);
      }
    });
  };

  const [promoEdit, setPromoEdit] = useState(siteConfig.promotionPopup || {
    enabled: true,
    title: "10% OFF ON HOME COLLECTION",
    description: "Book any health checkup package today and get an additional 10% FLAT discount on home sample collection services in Basti.",
    offerText: "10% off"
  });

  // Monitor Supabase Auth state
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !session.user.is_anonymous) {
        setActiveUser(session.user);
        setIsAuthenticated(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && !session.user.is_anonymous) {
        setActiveUser(session.user);
        setIsAuthenticated(true);
      } else if (!session) {
        setActiveUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Synchronize promoEdit with siteConfig when it loads
  useEffect(() => {
    if (siteConfig.promotionPopup) {
      setPromoEdit(siteConfig.promotionPopup);
    }
  }, [siteConfig.promotionPopup]);

  const triggerSave = async (tab: string, saveData: () => Promise<void> | void) => {
    setSavingStatus({ ...savingStatus, [tab]: true });
    try {
      await saveData();
      setTimeout(() => {
        setSavingStatus({ ...savingStatus, [tab]: false });
      }, 1500);
    } catch (e: any) {
      showToast('Save failed: ' + (e.message || e), 'error');
      setSavingStatus({ ...savingStatus, [tab]: false });
    }
  };

  const savePromotion = () => {
    triggerSave('marketing', () => {
      setSiteConfig({ ...siteConfig, promotionPopup: promoEdit });
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (loginMethod === 'legacy') {
      if (password === 'admin@12345') {
        if (supabase) {
          setLoading(true);
          try {
            const legacyEmail = 'admin@clinic.com';
            const legacyPassword = 'admin@12345';
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: legacyEmail,
              password: legacyPassword
            });
            if (signInError) {
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: legacyEmail,
                password: legacyPassword
              });
              if (!signUpError && signUpData.user) {
                setActiveUser(signUpData.user);
              }
            } else if (signInData.user) {
              setActiveUser(signInData.user);
            }
          } catch (e) {
            console.error("Legacy Supabase login login/signup handler:", e);
          } finally {
            setLoading(false);
          }
        }
        setIsAuthenticated(true);
      } else {
        setAuthError('Wrong passcode!');
      }
      return;
    }

    if (!supabase) {
      setAuthError('Supabase is not initialized. Please configure API keys.');
      return;
    }

    setLoading(true);
    try {
      let finalEmail = email.trim();
      if (finalEmail && !finalEmail.includes('@')) {
        finalEmail = `${finalEmail}@clinic.com`;
      }

      // Try signing in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password
      });

      if (signInError) {
        // If sign in fails, attempt to create/sign up the account automatically
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: finalEmail,
          password
        });

        if (signUpError) {
          setAuthError(signInError.message || signUpError.message);
        } else if (signUpData.user) {
          setActiveUser(signUpData.user);
          setIsAuthenticated(true);
        }
      } else if (signInData.user) {
        setActiveUser(signInData.user);
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Stats for dashboard
  const stats = {
    doctors: opdDoctors.length,
    services: services.length,
    appointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    reviews: testimonials.length,
    posters: siteConfig.posters?.length || 0,
    departments: departments.length,
    documents: documents.length
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    if (year.length !== 4) return dateStr; // Not YYYY-MM-DD
    return `${day}-${month}-${year}`;
  };

  // Helper to handle image uploads to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit for posters/banners
        showToast('File is too large! Please upload an image smaller than 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPoster = (base64: string) => {
    const currentPosters = siteConfig.posters || [];
    setSiteConfig({ ...siteConfig, posters: [...currentPosters, base64] });
  };

  const deletePoster = (index: number) => {
    customConfirm('Are you sure you want to delete this clinical poster?', () => {
      const currentPosters = [...(siteConfig.posters || [])];
      currentPosters.splice(index, 1);
      setSiteConfig({ ...siteConfig, posters: currentPosters });
    }, 'Delete Poster');
  };

  const addGalleryImage = (base64: string) => {
    const currentGallery = siteConfig.gallery || [];
    setSiteConfig({ ...siteConfig, gallery: [...currentGallery, base64], defaultGalleryDisabled: true });
  };

  const deleteGalleryImage = (index: number) => {
    customConfirm('Are you sure you want to delete this gallery image?', () => {
      const currentGallery = [...(siteConfig.gallery || [])];
      currentGallery.splice(index, 1);
      setSiteConfig({ ...siteConfig, gallery: currentGallery });
    }, 'Delete Image');
  };

  // Doctor Management
  const addDoctor = () => {
    const newDoc: OPDDoctor = {
      id: generateUUID(),
      name: 'New Doctor',
      specialty: 'Specialty',
      qualifications: 'Qualification',
      experience: 'Experience (Years)',
      availabilityType: 'visiting',
      availableDays: [],
      visitingDate: new Date().toISOString().split('T')[0],
      location: 'At Basti Branch',
      isAvailable: true,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fee: 600,
      consultationTime: '10:00 AM - 02:00 PM'
    };
    setOpdDoctors([newDoc, ...opdDoctors], false);
  };

  const updateDoctor = (id: string, updates: Partial<OPDDoctor>) => {
    setOpdDoctors(opdDoctors.map(doc => doc.id === id ? { ...doc, ...updates } : doc), false);
  };

  const deleteDoctor = async (id: string) => {
    customConfirm('Are you sure you want to delete this doctor?', async () => {
      await removeDoctor(id);
    }, 'Delete Doctor');
  };

  // Appointment Management
  const notifyPatientViaWhatsApp = (app: Appointment) => {
    const doctor = opdDoctors.find(d => d.id === app.doctorId);
    const pkg = healthPackages.find(p => p.id === app.doctorId);
    const refName = app.type === 'package' ? (pkg?.name || 'Health Package') : (doctor?.name || 'General Appointment');
    
    const message = encodeURIComponent(
      `*Appointment Confirmed - Apollo Clinic Basti*\n\n` +
      `Dear ${app.patientName},\n` +
      `Your appointment for *${refName}* has been *ACCEPTED & CONFIRMED*.\n\n` +
      `*Date:* ${formatDate(app.date)}\n` +
      `*Time:* ${app.time || 'As per slot'}\n` +
      `*Status:* Confirmed\n\n` +
      `Clinic Address: Railway Station Rd, near Navin Fal Mandi, Basti, Uttar Pradesh 272001\n` +
      `Contact: 8004055501\n\n` +
      `_Please reach 15 minutes before your time._`
    );
    
    const phone = app.patientWhatsapp || app.patientPhone;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    window.open(`https://wa.me/${finalPhone}?text=${message}`, '_blank');
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    const app = appointments.find(a => a.id === id);
    if (app) {
      if (status === 'confirmed') {
        const updatedList = appointments.map(a => a.id === id ? { ...a, status } : a);
        setAppointments(updatedList, false);
        triggerSave('appointments', () => setAppointments(updatedList, true));
        
        customConfirm('Appointment confirmed! Would you like to send a WhatsApp notification to the patient?', () => {
          notifyPatientViaWhatsApp(app);
        }, 'Appointment Confirmed');
      } else if (status === 'cancelled') {
        customConfirm('Are you sure you want to CANCEL this appointment?', () => {
          const updatedList = appointments.map(a => a.id === id ? { ...a, status } : a);
          setAppointments(updatedList, false);
          triggerSave('appointments', () => setAppointments(updatedList, true));
        }, 'Cancel Appointment');
      } else {
        const updatedList = appointments.map(a => a.id === id ? { ...a, status } : a);
        setAppointments(updatedList, false);
        triggerSave('appointments', () => setAppointments(updatedList, true));
      }
    }
  };

  const deleteAppointment = async (id: string) => {
    customConfirm('Are you sure you want to delete this appointment record?', async () => {
      await removeAppointment(id);
    }, 'Delete Record');
  };

  // Testimonial Management
  const addTestimonial = () => {
    const newTest: Testimonial = {
      id: generateUUID(),
      name: 'Patient Name',
      rating: 5,
      review: 'Write your review here...',
    };
    setTestimonials([newTest, ...testimonials], false);
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, ...updates } : t), false);
  };

  const deleteTestimonial = async (id: string) => {
    customConfirm('Are you sure you want to delete this testimonial?', async () => {
      await removeTestimonial(id);
    }, 'Delete Testimonial');
  };

  // Department Management
  const addDepartment = () => {
    const newDept: Department = {
      id: generateUUID(),
      name: 'New Department',
      headOfDepartment: 'HOD Name',
      description: 'Department description...'
    };
    setDepartments([newDept, ...departments], false);
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments(departments.map(d => d.id === id ? { ...d, ...updates } : d), false);
  };

  const deleteDepartment = async (id: string) => {
    customConfirm('Are you sure you want to delete this department?', async () => {
      await removeDepartment(id);
    }, 'Delete Department');
  };

  // Health Package Management
  const addHealthPackage = () => {
    const newPkg: HealthPackage = {
      id: generateUUID(),
      name: 'New Health Package',
      actualPrice: 0,
      offerPrice: 0,
      totalTests: 0,
      tests: [],
    };
    setHealthPackages([newPkg, ...healthPackages], false);
  };

  const updateHealthPackage = (id: string, updates: Partial<HealthPackage>) => {
    setHealthPackages(healthPackages.map(hp => hp.id === id ? { ...hp, ...updates } : hp), false);
  };

  const deleteHealthPackage = async (id: string) => {
    customConfirm('Are you sure you want to delete this health package?', async () => {
      await removePackage(id);
    }, 'Delete Package');
  };

  // Document Management
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) { // 2MB limit
        showToast('File is too large! Please upload a file smaller than 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDoc: ClinicDocument = {
          id: generateUUID(),
          name: file.name,
          fileData: reader.result as string,
          uploadDate: new Date().toLocaleDateString(),
        };
        setDocuments([newDoc, ...documents]);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteDocument = async (id: string) => {
    customConfirm('Are you sure you want to delete this document?', async () => {
      await removeDocument(id);
    }, 'Delete Document');
  };

  const updateDocumentName = (id: string, name: string) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, name } : d));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center container mx-auto px-4 py-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 max-w-md w-full"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-center mb-6 uppercase tracking-tighter">Admin Panel Access</h2>
          
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => { setLoginMethod('supabase'); setAuthError(''); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                loginMethod === 'supabase' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Cloud Admin
            </button>
            <button
              onClick={() => { setLoginMethod('legacy'); setAuthError(''); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                loginMethod === 'legacy' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Passcode
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginMethod === 'supabase' ? (
              <>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Cloud Admin ID / Email</label>
                  <input 
                    type="text" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-sm"
                    placeholder="Enter email or admin ID"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-sm"
                    placeholder="Enter password"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Internal Passcode</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-6 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-sm"
                  placeholder="Enter passcode"
                />
                <p className="text-[10px] font-medium text-slate-400 mt-2 ml-1 leading-relaxed">
                  Notice: Passcode login uses session-token mapping. Recommended for offline tests.
                </p>
              </div>
            )}

            {authError && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold text-center">
                {authError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/30 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all uppercase tracking-widest text-xs"
            >
              {loading ? 'Authenticating...' : loginMethod === 'supabase' ? 'Sign In Cloud' : 'Confirm Access'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 bg-white rounded-3xl shadow-xl p-4 border border-slate-100 h-fit lg:sticky lg:top-32">
          <div className="flex flex-col gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'site', label: 'Clinic Setup', icon: Settings },
              { id: 'marketing', label: 'Popup & Posters', icon: ImageIcon },
              { id: 'departments', label: 'Departments', icon: Shield },
              { id: 'checkups', label: 'Health Packages', icon: FlaskConical },
              { id: 'doctors', label: 'Doctor Roster', icon: Users },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'testimonials', label: 'Reviews', icon: Clock },
              { id: 'services', label: 'Services', icon: Activity },
              { id: 'media', label: 'Media Manager', icon: ImageIcon },
              { id: 'messages', label: 'Message Panel', icon: MessageCircle },
              { id: 'staff', label: 'Staff Accounts', icon: Users },
              { id: 'templates', label: 'Templates', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold ${
                  activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="mt-8 flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-all"
            >
              <Lock size={20} /> Log Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <Users size={24} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Staff</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900">{stats.doctors}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase mt-1">Specialists Online</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                      <Calendar size={24} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Requests</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900">{stats.appointments}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase mt-1">
                    {stats.pendingAppointments} <span className="text-orange-500">Pending Confirmation</span>
                  </p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                      <Check size={24} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Reviews</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900">{stats.reviews}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase mt-1">Verified Experiences</p>
                </div>

                <div className="lg:col-span-3 bg-primary p-1 rounded-[2.5rem] mt-6">
                  <div className="bg-white p-10 rounded-[2.25rem] border border-white/20">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button onClick={() => setActiveTab('appointments')} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary transition-all text-left">
                        <Calendar className="text-primary mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase text-slate-400">View</p>
                        <p className="text-xs font-bold text-slate-800">Recent Bookings</p>
                      </button>
                      <button onClick={() => setActiveTab('doctors')} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary transition-all text-left">
                        <Plus className="text-secondary mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase text-slate-400">Add</p>
                        <p className="text-xs font-bold text-slate-800">New Specialist</p>
                      </button>
                      <button onClick={() => setActiveTab('site')} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary transition-all text-left">
                        <ImageIcon className="text-teal-500 mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase text-slate-400">Change</p>
                        <p className="text-xs font-bold text-slate-800">Clinic Logo</p>
                      </button>
                      <button onClick={() => setActiveTab('departments')} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary transition-all text-left">
                        <Shield className="text-green-500 mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase text-slate-400">Manage</p>
                        <p className="text-xs font-bold text-slate-800">Departments</p>
                      </button>
                      <button onClick={() => setActiveTab('promotions')} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary transition-all text-left">
                        <Upload className="text-blue-500 mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase text-slate-400">Upload</p>
                        <p className="text-xs font-bold text-slate-800">New Posters</p>
                      </button>
                      <button onClick={() => setActiveTab('documents')} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary transition-all text-left">
                        <FileText className="text-orange-500 mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase text-slate-400">Manage</p>
                        <p className="text-xs font-bold text-slate-800">Clinic Docs</p>
                      </button>
                      <button onClick={() => setActiveTab('testimonials')} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary transition-all text-left">
                        <Clock className="text-purple-500 mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase text-slate-400">Manage</p>
                        <p className="text-xs font-bold text-slate-800">Feedbacks</p>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'site' && (
              <motion.div
                key="site"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Clinic Configuration Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter font-display">Clinic Configuration</h2>
                    {savingStatus['site'] && <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full mb-8">Changes Saved!</span>}
                  </div>
                
                  <div className="grid gap-10">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Logo Section */}
                      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6">Clinic Logo</h3>
                          <div className="flex flex-col sm:flex-row items-center gap-8">
                            <div className="w-32 h-32 bg-white rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                              {(siteConfig.logo || "https://www.apolloclinic.com/assets/images/logo.png") ? (
                                <img 
                                  src={siteConfig.logo || "https://www.apolloclinic.com/assets/images/logo.png"} 
                                  alt="Clinic Logo" 
                                  className={`w-full h-full object-contain p-2 ${!siteConfig.logo ? 'opacity-30 grayscale' : ''}`} 
                                />
                              ) : (
                                <ImageIcon className="text-slate-200" size={48} />
                              )}
                            </div>
                            <div className="space-y-4">
                              {!siteConfig.logo && <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Showing Default Apollo Logo</p>}
                              <input 
                                type="file" 
                                hidden 
                                ref={logoInputRef}
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, (b64) => setSiteConfig({...siteConfig, logo: b64}))}
                              />
                              <button 
                                onClick={() => logoInputRef.current?.click()}
                                className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all shadow-sm text-xs uppercase"
                              >
                                <Upload size={18} /> Upload New Logo
                              </button>
                              <p className="text-[10px] text-slate-400">Recommended: Transparent PNG, under 200KB.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Homepage Hero Banner Section */}
                      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6 font-display">Homepage Hero Banner</h3>
                          <div className="flex flex-col sm:flex-row items-center gap-8">
                            <div className="w-48 h-32 bg-white rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative shadow-inner">
                              <img 
                                src={siteConfig.heroBanner || heroBannerImage} 
                                alt="Homepage Hero Banner" 
                                className="w-full h-full object-cover p-1 rounded-2xl" 
                              />
                            </div>
                            <div className="space-y-4 flex-grow">
                              {!siteConfig.heroBanner ? (
                                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Showing Pre-generated Basti Banner</p>
                              ) : (
                                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Showing Your Custom Banner</p>
                              )}
                              <input 
                                type="file" 
                                hidden 
                                ref={bannerInputRef}
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, (b64) => setSiteConfig({...siteConfig, heroBanner: b64}))}
                              />
                              <div className="flex flex-wrap gap-2">
                                <button 
                                  onClick={() => bannerInputRef.current?.click()}
                                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-1.5 hover:bg-slate-100 transition-all shadow-sm text-[10px] uppercase text-slate-700"
                                >
                                  <Upload size={14} /> Upload Banner
                                </button>
                                {siteConfig.heroBanner && (
                                  <button 
                                    onClick={() => setSiteConfig({...siteConfig, heroBanner: undefined})}
                                    className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm text-[10px] uppercase"
                                  >
                                    <Trash2 size={13} /> Reset
                                  </button>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400">File must be under 800KB. Ideal aspect ratio: 21:9.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* General Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400">Clinic Name</label>
                        <input 
                          value={siteConfig.name}
                          onChange={(e) => setSiteConfig({ ...siteConfig, name: e.target.value }, false)}
                          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400">Location Display</label>
                        <input 
                          value={siteConfig.location}
                          onChange={(e) => setSiteConfig({ ...siteConfig, location: e.target.value }, false)}
                          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400">Emergency Contact</label>
                        <input 
                          value={siteConfig.contact}
                          onChange={(e) => setSiteConfig({ ...siteConfig, contact: e.target.value }, false)}
                          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400">Public Email</label>
                        <input 
                          value={siteConfig.email ?? ""}
                          onChange={(e) => setSiteConfig({ ...siteConfig, email: e.target.value }, false)}
                          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400">Footer Owner / Copyright Owner</label>
                        <input 
                          value={siteConfig.footerOwner ?? ""}
                          placeholder="e.g., Apollo Clinic Basti"
                          onChange={(e) => setSiteConfig({ ...siteConfig, footerOwner: e.target.value }, false)}
                          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-8 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={() => triggerSave('site', () => setSiteConfig(siteConfig, true))}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                      >
                        {savingStatus['site'] ? 'Successfully Saved' : 'Save Configuration'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clinic Gallery & Infrastructure Photo Directory */}
                <div id="gallery-management-section" className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter font-display">Gallery & Facilities Photos</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase mt-1">Upload and arrange photographs shown in the visual Tour page</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        hidden 
                        ref={galleryInputRef}
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            Array.from(files).forEach((file: File) => {
                              if (file.size > 5000000) {
                                showToast(`${file.name} is too large! Max file size limit is 5MB.`, 'error');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  addGalleryImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                      />
                      <button 
                        onClick={() => galleryInputRef.current?.click()}
                        className="px-6 py-3.5 bg-secondary hover:bg-secondary/95 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg text-xs uppercase"
                      >
                        <Upload size={16} /> Upload New Photos
                      </button>
                    </div>
                  </div>

                  {(!siteConfig.gallery || siteConfig.gallery.length === 0) ? (
                    <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-150 flex items-center justify-center text-slate-400">
                        <ImageIcon size={32} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">No Custom Gallery Photos Uploaded</p>
                        <p className="text-[10px] text-slate-400 max-w-sm uppercase font-semibold mx-auto leading-relaxed">
                          The live &ldquo;Visual Tour&rdquo; page is currently using our pre-generated beautiful clinic infrastructure and advanced lab images by default.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {siteConfig.gallery.map((img, i) => (
                          <div 
                            key={i} 
                            className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-150"
                          >
                            <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-550" />
                            <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button 
                                onClick={() => deleteGalleryImage(i)}
                                className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all hover:scale-110 active:scale-90"
                                title="Delete Photo"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="absolute bottom-2 left-2 bg-slate-950/50 backdrop-blur-sm px-2 py-1 rounded-md">
                              <span className="text-[9px] font-black uppercase text-white tracking-widest">Image #{i + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Total Photos: {siteConfig.gallery.length} &bull; Autocommitted to configuration.
                        </p>
                        <button 
                          onClick={() => {
                            customConfirm('Are you sure you want to clear all custom clinic photos and restore default visual assets?', () => {
                              setSiteConfig({ ...siteConfig, gallery: [] });
                              showToast('Gallery restored to pre-generated default assets.', 'info');
                            }, 'Reset Gallery');
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] uppercase font-bold tracking-wider"
                        >
                          Restore Default Assets
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'doctors' && (
              <motion.div
                key="doctors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter font-display">Doctor Rostering</h2>
                    {savingStatus['doctors'] && <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">Syncing...</span>}
                  </div>
                  <button onClick={addDoctor} className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all">
                    <Plus size={20} /> Hire Doctor
                  </button>
                </div>

                <div className="space-y-8">
                  {opdDoctors.map((doc) => (
                    <div key={doc.id} className="p-8 rounded-[2rem] border border-slate-200 bg-slate-50/50 flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row gap-8">
                        {/* Doctor Photo */}
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-24 h-24 bg-white rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {doc.photo ? (
                              <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="text-slate-200" size={48} />
                            )}
                          </div>
                          <input 
                            type="file" 
                            hidden 
                            id={`photo-${doc.id}`}
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (b64) => updateDoctor(doc.id, { photo: b64 }))}
                          />
                          <button 
                            onClick={() => document.getElementById(`photo-${doc.id}`)?.click()}
                            className="text-[10px] uppercase font-black text-primary hover:underline"
                          >
                            Upload Photo
                          </button>
                        </div>

                        {/* Doctor Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Full Name</label>
                            <input 
                              value={doc.name} 
                              onChange={(e) => updateDoctor(doc.id, { name: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Department</label>
                            <select 
                              value={doc.departmentId || ''} 
                              onChange={(e) => updateDoctor(doc.id, { departmentId: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            >
                              <option value="">Select Department</option>
                              {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Availability Type</label>
                            <select 
                              value={doc.availabilityType || 'visiting'} 
                              onChange={(e) => updateDoctor(doc.id, { availabilityType: e.target.value as any })}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            >
                              <option value="visiting">Visiting (Specific Date)</option>
                              <option value="regular">Regular (Weekly Days)</option>
                            </select>
                          </div>

                          {doc.availabilityType === 'regular' ? (
                            <div className="space-y-1 col-span-full">
                              <label className="text-[10px] uppercase font-black text-slate-400">Available Days</label>
                              <div className="flex flex-wrap gap-2 pt-1">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                  const isSelected = doc.availableDays?.includes(day);
                                  return (
                                    <button
                                      key={day}
                                      onClick={() => {
                                        const current = doc.availableDays || [];
                                        const next = isSelected 
                                          ? current.filter(d => d !== day)
                                          : [...current, day];
                                        updateDoctor(doc.id, { availableDays: next });
                                      }}
                                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                        isSelected 
                                          ? 'bg-primary text-white border-primary shadow-md lg:scale-105' 
                                          : 'bg-white text-slate-400 border-slate-200 hover:border-primary/50'
                                      }`}
                                    >
                                      {day.slice(0, 3)}
                                    </button>
                                  );
                                })}
                               </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-400">Visiting Date</label>
                              <input 
                                type="date"
                                value={doc.visitingDate} 
                                onChange={(e) => updateDoctor(doc.id, { visitingDate: e.target.value })}
                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                              />
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Booking Deadline (Expiry Date)</label>
                            <input 
                              type="date"
                              value={doc.expiryDate} 
                              onChange={(e) => updateDoctor(doc.id, { expiryDate: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Consultation Fee (₹)</label>
                            <input 
                              type="number"
                              value={doc.fee || 600} 
                              onChange={(e) => updateDoctor(doc.id, { fee: Number(e.target.value) })}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Consultation Timing</label>
                            <input 
                              value={doc.consultationTime || '10:00 AM - 02:00 PM'} 
                              onChange={(e) => updateDoctor(doc.id, { consultationTime: e.target.value })}
                              placeholder="e.g. 10:00 AM - 02:00 PM"
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Specialty Area</label>
                            <input 
                              value={doc.specialty} 
                              onChange={(e) => updateDoctor(doc.id, { specialty: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Experience</label>
                            <input 
                              value={doc.experience} 
                              onChange={(e) => updateDoctor(doc.id, { experience: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Qualifications</label>
                            <input 
                              value={doc.qualifications} 
                              onChange={(e) => updateDoctor(doc.id, { qualifications: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Visiting Dates</label>
                            <input 
                              value={doc.visitingDate} 
                              onChange={(e) => updateDoctor(doc.id, { visitingDate: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Location</label>
                            <input 
                              value={doc.location} 
                              onChange={(e) => updateDoctor(doc.id, { location: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Expiry Date (Booking Deadline)</label>
                            <input 
                              type="date"
                              value={doc.expiryDate || ''} 
                              onChange={(e) => updateDoctor(doc.id, { expiryDate: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={doc.isAvailable}
                            onChange={(e) => updateDoctor(doc.id, { isAvailable: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                          />
                          <span className="text-xs font-black uppercase text-slate-600">Currently Available in Basti</span>
                        </label>
                        <button 
                          onClick={() => deleteDoctor(doc.id)} 
                          className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all font-black text-xs uppercase"
                        >
                          <Trash2 size={16} /> Retire Doctor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 pt-8 border-t border-slate-200 flex justify-end">
                  <button 
                    onClick={() => triggerSave('doctors', () => setOpdDoctors(opdDoctors, true))}
                    className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    {savingStatus['doctors'] ? 'Successfully Synced' : 'Sync All Doctor Data'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'appointments' && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
              >
                <div className="flex justify-between items-center mb-8 print:hidden">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter font-display">Patient Appointments</h2>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all text-xs uppercase"
                    >
                      <FileText size={18} /> Print Record
                    </button>
                    <button 
                      onClick={() => {
                        setActiveAppointmentForm({
                          id: undefined,
                          patientName: '',
                          patientPhone: '',
                          patientWhatsapp: '',
                          patientAddress: '',
                          doctorId: opdDoctors[0]?.id || '',
                          date: new Date().toISOString().split('T')[0],
                          time: '11:00 AM',
                          status: 'pending',
                          type: 'doctor',
                          isHomeCollection: false,
                          claimOffer: false,
                          finalPrice: opdDoctors[0]?.fee || 600
                        });
                      }}
                      className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:scale-105 transition-all text-xs uppercase"
                    >
                      <Plus size={18} /> New Appointment
                    </button>
                </div>
              </div>

              {appointments.length === 0 ? (
                  <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <Clock size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase text-xs">No appointments booked yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
                          <th className="p-4">Patient</th>
                          <th className="p-4">Type / Reference</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((app) => (
                          <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-800">{app.patientName}</span>
                                <div className="flex flex-col gap-1 mt-1">
                                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    <Phone size={10} /> Call: {app.patientPhone}
                                  </span>
                                  {app.patientWhatsapp && (
                                    <span className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                                      <Phone size={10} fill="currentColor" /> WA: {app.patientWhatsapp}
                                    </span>
                                  )}
                                  {app.patientAddress && (
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">
                                      Addr: {app.patientAddress}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full self-start mb-1 ${app.type === 'package' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                  {app.type || 'doctor'}
                                </span>
                                <span className="text-xs font-bold text-slate-600">
                                  {app.type === 'package' 
                                    ? healthPackages.find(p => p.id === app.doctorId)?.name || 'Unknown Package'
                                    : opdDoctors.find(d => d.id === app.doctorId)?.name || 'Unknown Doctor'
                                  }
                                </span>
                                {app.claimOffer && (
                                  <span className="text-[8px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full self-start mt-1 uppercase">Claimed Offer</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-600">
                              {formatDate(app.date)} {app.time && `• ${app.time}`}
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                app.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                                app.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-center gap-2">
                                <button 
                                  onClick={() => notifyPatientViaWhatsApp(app)}
                                  className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-all"
                                  title="Send WhatsApp Notification"
                                >
                                  <MessageCircle size={16} />
                                </button>
                                <button 
                                  onClick={() => {
                                    const printWindow = window.open('', '_blank');
                                    if (printWindow) {
                                      const doctorName = app.type === 'package' 
                                        ? healthPackages.find(p => p.id === app.doctorId)?.name 
                                        : opdDoctors.find(d => d.id === app.doctorId)?.name;
                                      
                                      printWindow.document.write(`
                                        <html>
                                          <head>
                                            <title>Appointment Slip - Apollo Clinic Basti</title>
                                            <style>
                                              body { font-family: sans-serif; padding: 40px; }
                                              .slip { border: 2px solid #007a8e; padding: 30px; border-radius: 20px; max-width: 500px; margin: auto; }
                                              .header { text-align: center; border-bottom: 2px solid #f39223; padding-bottom: 20px; margin-bottom: 20px; }
                                              .logo { font-size: 24px; font-weight: 900; color: #007a8e; }
                                              .brand { color: #f39223; }
                                              .info-row { display: flex; justify-between; margin-bottom: 12px; }
                                              .label { font-weight: bold; font-size: 10px; text-transform: uppercase; color: #666; }
                                              .value { font-weight: bold; font-size: 14px; text-align: right; flex-grow: 1; }
                                              .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #999; }
                                              @media print { .no-print { display: none; } }
                                            </style>
                                          </head>
                                          <body>
                                            <div class="slip">
                                              <div class="header">
                                                <div class="logo">Apollo <span class="brand">Clinic</span></div>
                                                <div style="font-size: 10px; font-weight: bold; margin-top: 4px;">BASTI • 8004055501</div>
                                              </div>
                                              <div class="info-row"><span class="label">Token ID:</span> <span class="value">${app.id.slice(-6)}</span></div>
                                              <div class="info-row"><span class="label">Patient:</span> <span class="value">${app.patientName}</span></div>
                                              <div class="info-row"><span class="label">Contact:</span> <span class="value">${app.patientPhone}</span></div>
                                              <div class="info-row"><span class="label">Date:</span> <span class="value">${formatDate(app.date)}</span></div>
                                              <div class="info-row"><span class="label">Time:</span> <span class="value">${app.time || 'General OPD'}</span></div>
                                              <div class="info-row"><span class="label">Type:</span> <span class="value" style="text-transform: uppercase;">${app.type || 'Doctor Consultation'}</span></div>
                                              <div class="info-row"><span class="label">Reference:</span> <span class="value">${doctorName || 'N/A'}</span></div>
                                              <div class="footer">
                                                Please bring this slip at the reception.<br>
                                                Apollo Clinic Basti - Caring for You.
                                              </div>
                                            </div>
                                            <script>window.print();</script>
                                          </body>
                                        </html>
                                      `);
                                      printWindow.document.close();
                                    }
                                  }}
                                  className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-primary hover:text-white transition-all"
                                  title="Print Slip"
                                >
                                  <FileText size={16} />
                                </button>
                                <button 
                                  onClick={() => updateAppointmentStatus(app.id, 'confirmed')}
                                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                                  title="Confirm"
                                >
                                  <Check size={16} />
                                </button>
                                <button 
                                  onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                                <button 
                                  onClick={() => setActiveAppointmentForm(app)}
                                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                  title="Edit Appointment"
                                >
                                  <Edit size={16} />
                                </button>
                                <button 
                                  onClick={() => deleteAppointment(app.id)}
                                  className="p-2 text-slate-300 hover:text-red-500 transition-all"
                                  title="Delete Record"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center print:hidden">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Patient Records Management System</p>
                  <button 
                    onClick={() => triggerSave('appointments', () => setAppointments(appointments, true))}
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    {savingStatus['appointments'] ? 'Status Updated' : 'Sync All Statuses'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'departments' && (
              <motion.div
                key="departments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter font-display">Medical Departments</h2>
                  <button onClick={addDepartment} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all text-xs uppercase">
                    <Plus size={20} /> Create Department
                  </button>
                </div>

                <div className="space-y-6">
                  {departments.map((dept) => (
                    <div key={dept.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 relative group">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400">Name</label>
                          <input 
                            value={dept.name}
                            onChange={(e) => updateDepartment(dept.id, { name: e.target.value })}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400">Head of Dept.</label>
                          <input 
                            value={dept.headOfDepartment}
                            onChange={(e) => updateDepartment(dept.id, { headOfDepartment: e.target.value })}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400">Description</label>
                          <textarea 
                            value={dept.description}
                            onChange={(e) => updateDepartment(dept.id, { description: e.target.value })}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteDepartment(dept.id)}
                        className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => triggerSave('departments', () => setDepartments(departments, true))}
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs"
                  >
                    {savingStatus['departments'] ? 'Successfully Saved' : 'Save Departments'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'checkups' && (
              <motion.div
                key="checkups"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter font-display">Health Checkup Packages</h2>
                  <button onClick={addHealthPackage} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all text-xs uppercase">
                    <Plus size={20} /> Create Package
                  </button>
                </div>

                <div className="space-y-8">
                  {healthPackages.map((pkg) => (
                    <div key={pkg.id} className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50 relative group">
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400">Package Name</label>
                          <input 
                            value={pkg.name}
                            onChange={(e) => updateHealthPackage(pkg.id, { name: e.target.value })}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400">Actual Price (₹)</label>
                          <input 
                            type="number"
                            value={pkg.actualPrice}
                            onChange={(e) => updateHealthPackage(pkg.id, { actualPrice: Number(e.target.value) })}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400">Offer Price (₹)</label>
                          <input 
                            type="number"
                            value={pkg.offerPrice}
                            onChange={(e) => updateHealthPackage(pkg.id, { offerPrice: Number(e.target.value) })}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400">Total Tests Count</label>
                          <input 
                            type="number"
                            value={pkg.totalTests}
                            onChange={(e) => updateHealthPackage(pkg.id, { totalTests: Number(e.target.value) })}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400">Discount Badge Text (e.g. 10% Discount on Home collection)</label>
                          <input 
                            value={pkg.discountBadge || ''}
                            onChange={(e) => updateHealthPackage(pkg.id, { discountBadge: e.target.value })}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                            placeholder="Optional badge text..."
                          />
                        </div>
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-[10px] uppercase font-black text-slate-400">Tests (Comma separated)</label>
                          <textarea 
                            value={pkg.tests.join(', ')}
                            onChange={(e) => updateHealthPackage(pkg.id, { tests: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '') })}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm"
                            rows={3}
                            placeholder="CBC, LFT, KFT..."
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteHealthPackage(pkg.id)}
                        className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 pt-8 border-t border-slate-200 flex justify-end">
                  <button 
                    onClick={() => triggerSave('checkups', () => setHealthPackages(healthPackages, true))}
                    className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    {savingStatus['checkups'] ? 'Successfully Published' : 'Publish Package Updates'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'marketing' && (
              <motion.div
                key="marketing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Promotion Popup Control */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter font-display">Special Offer Popup</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase mt-1">Shown to users visiting Health Packages</p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                      <input 
                        type="checkbox" 
                        checked={promoEdit.enabled}
                        onChange={(e) => setPromoEdit({...promoEdit, enabled: e.target.checked})}
                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-black uppercase text-slate-600">{promoEdit.enabled ? 'ACTIVE' : 'INACTIVE'}</span>
                    </label>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 ml-1">Popup Title</label>
                      <input 
                        value={promoEdit.title}
                        onChange={(e) => setPromoEdit({...promoEdit, title: e.target.value})}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none font-bold"
                        placeholder="Title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 ml-1">Description Text</label>
                      <textarea 
                        value={promoEdit.description}
                        onChange={(e) => setPromoEdit({...promoEdit, description: e.target.value})}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none font-medium text-sm leading-relaxed"
                        rows={3}
                        placeholder="Offer details..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 ml-1">Offer Summary (Short)</label>
                      <input 
                        value={promoEdit.offerText}
                        onChange={(e) => setPromoEdit({...promoEdit, offerText: e.target.value})}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none font-bold text-primary"
                        placeholder="Offer text (e.g. 10% OFF)"
                      />
                    </div>
                    <button 
                      onClick={savePromotion}
                      className="bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-primary/30 transition-all uppercase tracking-widest text-xs"
                    >
                      Save Popup Settings
                    </button>
                  </div>
                </div>

                {/* Posters Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter font-display">Clinical Posters & Banners</h2>
                    <input 
                      type="file" 
                      hidden 
                      ref={posterInputRef}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, addPoster)}
                    />
                    <button 
                      onClick={() => posterInputRef.current?.click()}
                      className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all text-xs uppercase"
                    >
                      <Upload size={20} /> Add Poster
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(siteConfig.posters || []).map((poster, idx) => (
                      <div key={idx} className="group relative rounded-[2rem] overflow-hidden border border-slate-200 shadow-md bg-white">
                        <img src={poster} alt={`Poster ${idx + 1}`} className="w-full h-auto aspect-[3/4] object-cover" />
                        <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-center items-center p-6 gap-3">
                          <button 
                            onClick={() => {
                              setSiteConfig({...siteConfig, heroBanner: poster});
                              showToast("Successfully set this image as the Homepage Hero Banner! It is now live on the Home page.", "success");
                            }}
                            className="w-full py-3 bg-secondary text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 text-[10px] uppercase shadow-lg border border-secondary"
                          >
                            <Upload size={14} /> Use as Home Banner
                          </button>
                          
                          <button 
                            onClick={() => deletePoster(idx)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold active:scale-95 transition-all text-[10px] uppercase flex items-center justify-center gap-1 shadow-md"
                          >
                            <Trash2 size={13} /> Delete Poster
                          </button>
                        </div>
                      </div>
                    ))}
                    {(siteConfig.posters || []).length === 0 && (
                      <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold uppercase text-xs">No clinical posters uploaded.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'testimonials' && (
              <motion.div
                key="testimonials"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter font-display">Patient Feedback</h2>
                  <button onClick={addTestimonial} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all text-xs uppercase">
                    <Plus size={20} /> Add Review
                  </button>
                </div>

                <div className="space-y-8">
                  {testimonials.map((t) => (
                    <div key={t.id} className="p-8 rounded-[2rem] border border-slate-200 bg-slate-50 flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {t.photo ? (
                              <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="text-slate-200" size={40} />
                            )}
                          </div>
                          <input 
                            type="file" 
                            hidden 
                            id={`test-photo-${t.id}`}
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (b64) => updateTestimonial(t.id, { photo: b64 }))}
                          />
                          <button 
                            onClick={() => document.getElementById(`test-photo-${t.id}`)?.click()}
                            className="text-[10px] uppercase font-black text-primary"
                          >
                            Upload Photo
                          </button>
                        </div>

                        <div className="flex-grow space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-400">Patient Name</label>
                              <input 
                                value={t.name}
                                onChange={(e) => updateTestimonial(t.id, { name: e.target.value })}
                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-400">Rating (1-5)</label>
                              <input 
                                type="number"
                                min="1"
                                max="5"
                                value={t.rating}
                                onChange={(e) => updateTestimonial(t.id, { rating: parseInt(e.target.value) })}
                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-slate-400">Patient Review</label>
                            <textarea 
                              value={t.review}
                              onChange={(e) => updateTestimonial(t.id, { review: e.target.value })}
                              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm h-24 leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4 border-t border-slate-200">
                        <button 
                          onClick={() => deleteTestimonial(t.id)}
                          className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all font-black text-xs uppercase"
                        >
                          <Trash2 size={16} /> Delete Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 pt-8 border-t border-slate-250 flex justify-end">
                  <button 
                    onClick={() => triggerSave('testimonials', () => setTestimonials(testimonials, true))}
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs"
                  >
                    {savingStatus['testimonials'] ? 'Successfully Saved' : 'Save Patient Reviews'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
              >
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8 font-display">Manage Clinical Services</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {services.map((service, i) => (
                    <div key={service.id} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col gap-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl">
                          {i + 1}
                        </span>
                        <div className="text-[10px] font-black uppercase text-slate-400">Service Identifier</div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black text-slate-400">Service Title</label>
                        <input 
                          value={service.title}
                          onChange={(e) => setServices(services.map(s => s.id === service.id ? { ...s, title: e.target.value } : s))}
                          className="w-full p-3 border border-slate-200 rounded-xl bg-white font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black text-slate-400">Contextual Description</label>
                        <textarea 
                          value={service.description}
                          onChange={(e) => setServices(services.map(s => s.id === service.id ? { ...s, description: e.target.value } : s))}
                          className="w-full p-3 border border-slate-200 rounded-xl bg-white text-sm h-32 leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter font-display">Document Management</h2>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="doc-upload"
                      hidden 
                      onChange={handleDocumentUpload}
                    />
                    <button 
                      onClick={() => document.getElementById('doc-upload')?.click()}
                      className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all text-xs uppercase"
                    >
                      <Upload size={20} /> Upload Document
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {documents.length === 0 ? (
                    <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                      <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-slate-400 font-bold uppercase text-xs">No documents uploaded yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc) => (
                        <div key={doc.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group">
                          <div className="flex items-center gap-4 flex-grow mr-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                              <FileText size={24} />
                            </div>
                            <div className="flex-grow">
                              <input 
                                value={doc.name}
                                onChange={(e) => updateDocumentName(doc.id, e.target.value)}
                                className="w-full bg-transparent border-b border-transparent focus:border-primary outline-none font-bold text-slate-800 text-sm py-1 transition-all"
                              />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Uploaded: {doc.uploadDate}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => deleteDocument(doc.id)}
                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-xs text-slate-500 font-medium">
                    <strong className="text-primary">Note:</strong> These documents will be listed on the "About Us" page for public viewing. You can click on the document name above to rename it.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'media' && (
              <motion.div
                key="media"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-slate-800"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1 font-display">Clinical Media & Asset Library</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest font-mono">Upload hero banners & promotion posters to display directly on the website</p>
                  </div>
                  <div>
                    <input 
                      type="file" 
                      id="media-uploader-input" 
                      accept="image/*"
                      hidden 
                      onChange={handleMediaUpload} 
                    />
                    <button 
                      type="button"
                      onClick={() => document.getElementById('media-uploader-input')?.click()}
                      className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all text-xs uppercase cursor-pointer"
                    >
                      <Upload size={16} /> Upload New Media
                    </button>
                  </div>
                </div>

                {mediaList.length === 0 ? (
                  <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase text-xs">No media assets in library.</p>
                    <p className="text-xs text-slate-400 mt-2">Upload clinical images or banners to manage website assets.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mediaList.map((item) => (
                      <div key={item.id} className="bg-slate-50 border border-slate-150 rounded-3xl overflow-hidden group flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                        {/* Thumbnail */}
                        <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                          {item.file_type?.startsWith('image/') ? (
                            <img 
                              src={item.file_url} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-all"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <FileText size={48} className="text-slate-400" />
                          )}
                          <div className="absolute top-3 right-3 flex gap-1">
                            <button 
                              type="button"
                              onClick={() => deleteMediaItem(item.id)}
                              className="p-2 bg-white/85 backdrop-blur-sm rounded-lg text-slate-400 hover:text-red-500 hover:bg-white shadow transition-all cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Metadata & Actions */}
                        <div className="p-5 flex flex-col gap-4 flex-grow justify-between">
                          <div>
                            <p className="font-bold text-slate-800 text-sm truncate" title={item.name}>{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">
                              Size: {(item.file_size / 1024).toFixed(1)} KB | Uploaded: {new Date(item.created_at || '').toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => useMediaAsHero(item.file_url)}
                              className="w-full text-center bg-white border border-slate-200 hover:border-primary text-slate-700 hover:text-primary font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Check size={14} /> Set as Hero Banner
                            </button>
                            <button
                              type="button"
                              onClick={() => useMediaAsPoster(item.file_url)}
                              className="w-full text-center bg-white border border-slate-200 hover:border-primary text-slate-700 hover:text-primary font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Plus size={14} /> Use as Clinic Poster
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-slate-800"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1 font-display">Communication Panel</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest font-mono">Draft custom alerts, parse templates, and track logged communication histories</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                  {/* Left Column: Composer */}
                  <div className="lg:col-span-2 bg-slate-50 border border-slate-105 p-6 rounded-[2.5rem] h-fit">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide mb-4">Compose Broadcast Message</h3>
                    
                    <div className="space-y-4">
                      {/* Recipient Input */}
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Recipient Number / Email</label>
                        <input 
                          type="text"
                          required
                          value={msgRecipient}
                          onChange={(e) => setMsgRecipient(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm text-slate-800 transition-all"
                          placeholder="e.g. +91 9876543210 or patient@gmail.com"
                        />
                      </div>

                      {/* Select Template dropdown */}
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Select Message Template (Optional)</label>
                        <select
                          value={msgSelectedTemplate}
                          onChange={(e) => setMsgSelectedTemplate(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm text-slate-800 transition-all cursor-pointer"
                        >
                          <option value="">-- No Template (Custom Draft) --</option>
                          {templatesList.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.type.toUpperCase()})</option>
                          ))}
                        </select>
                      </div>

                      {/* Channel type option if no template selected */}
                      {!msgSelectedTemplate && (
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Channel / Type</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['whatsapp', 'sms', 'email'] as const).map(ch => (
                              <button
                                key={ch}
                                type="button"
                                onClick={() => setMsgType(ch)}
                                className={`py-2 px-3 rounded-lg text-xs font-bold capitalize border transition-all cursor-pointer ${
                                  msgType === ch 
                                    ? 'bg-primary/15 border-primary text-primary font-black' 
                                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                {ch}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render dynamic variables if selected Template has variables */}
                      {msgSelectedTemplate && Object.keys(msgVariables).length > 0 && (
                        <div className="p-4 bg-white border border-slate-200/60 rounded-2xl space-y-3 shadow-inner">
                          <h4 className="text-[10px] font-black text-primary uppercase tracking-wider">Template Variables</h4>
                          {Object.keys(msgVariables).map((key) => (
                            <div key={key}>
                              <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">{key}</label>
                              <input 
                                type="text"
                                value={msgVariables[key]}
                                onChange={(e) => setMsgVariables({ ...msgVariables, [key]: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-primary rounded-lg outline-none font-medium text-xs transition-all text-slate-750"
                                placeholder={`Value for ${key}`}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Message Body Textarea */}
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Message Content</label>
                        <textarea
                          readOnly={!!msgSelectedTemplate}
                          value={msgSelectedTemplate ? getInterpolatedMessage() : msgBody}
                          onChange={(e) => setMsgBody(e.target.value)}
                          rows={4}
                          className={`w-full p-4 border border-slate-200 rounded-xl outline-none text-sm transition-all leading-relaxed ${
                            msgSelectedTemplate ? 'bg-slate-100/80 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-800 focus:border-primary'
                          }`}
                          placeholder="Draft message to send..."
                        />
                        {msgSelectedTemplate && (
                          <span className="text-[9px] text-slate-400 italic">Content is governed by template formatting. Modify variable values above.</span>
                        )}
                      </div>

                      {/* Dispatch Trigger */}
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        className="w-full py-3 h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] shadow-md hover:shadow-lg transition-all text-xs uppercase cursor-pointer"
                      >
                        <Send size={15} /> Confirm and Send Logs
                      </button>
                    </div>
                  </div>

                  {/* Right Column: History Log List */}
                  <div className="lg:col-span-3">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide mb-4">Logged Message History ({messageLogs.length})</h3>
                    {messageLogs.length === 0 ? (
                      <div className="py-16 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200/80">
                        <MessageCircle size={40} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-slate-400 font-bold uppercase text-[10px]">No communication dispatch transactions found.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-sm bg-white max-h-[580px] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="py-3.5 px-5 text-[10px] font-black uppercase text-slate-400">Recipient</th>
                              <th className="py-3.5 px-5 text-[10px] font-black uppercase text-slate-400">Message</th>
                              <th className="py-3.5 px-5 text-[10px] font-black uppercase text-slate-400">Channel</th>
                              <th className="py-3.5 px-5 text-[10px] font-black uppercase text-slate-400">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {messageLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50/50">
                                <td className="py-4 px-5 align-top">
                                  <div className="font-bold text-slate-800 text-xs">{log.recipient}</div>
                                  <div className="text-[9px] text-slate-400 font-bold mt-1 font-mono">{log.created_at ? new Date(log.created_at).toLocaleString() : ''}</div>
                                </td>
                                <td className="py-4 px-5 text-xs text-slate-600 align-top max-w-xs break-words">
                                  {log.message}
                                </td>
                                <td className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 align-top">
                                  {log.template_type}
                                </td>
                                <td className="py-4 px-5 align-top">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-600">
                                    <Check size={10} /> SENT
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'staff' && (
              <motion.div
                key="staff"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-slate-800"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1 font-display">Staff Registration Table</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest font-mono">Create and configure credentials for clinical assistants, doctors, and specialists</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                  {/* Left Column: Form */}
                  <form onSubmit={handleSaveStaff} className="lg:col-span-2 bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] h-fit space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                      {editingStaffId ? 'Update Staff Credentials' : 'New Staff Account'}
                    </h3>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Full Name *</label>
                      <input 
                        type="text"
                        required
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm text-slate-800"
                        placeholder="Dr. Rajesh Varma or Nurse Shreya"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Official Email Address *</label>
                      <input 
                        type="email"
                        required
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm text-slate-800"
                        placeholder="staff@apollodental.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Designation Role</label>
                        <select
                          value={staffRole}
                          onChange={(e) => setStaffRole(e.target.value as any)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-primary rounded-xl outline-none font-bold text-xs text-slate-800 cursor-pointer"
                        >
                          <option value="staff">Clinical Support</option>
                          <option value="doctor">Medical Doctor</option>
                          <option value="admin">System Admin</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Contact Phone</label>
                        <input 
                          type="text"
                          value={staffPhone}
                          onChange={(e) => setStaffPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm text-slate-800"
                          placeholder="Mobile line"
                        />
                      </div>
                    </div>

                    {/* Active Checkbox */}
                    <div className="flex items-center gap-3 py-1">
                      <input 
                        type="checkbox"
                        id="staff-active"
                        checked={staffIsActive}
                        onChange={(e) => setStaffIsActive(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer animate-none"
                      />
                      <label htmlFor="staff-active" className="text-xs font-bold text-slate-750 cursor-pointer select-none">Active Duty / Enable Access</label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-grow py-3 h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] shadow cursor-pointer text-xs uppercase"
                      >
                        <Check size={16} /> {editingStaffId ? 'Save Changes' : 'Register Account'}
                      </button>
                      {editingStaffId && (
                        <button
                          type="button"
                          onClick={() => {
                            setStaffName('');
                            setStaffEmail('');
                            setStaffRole('staff');
                            setStaffPhone('');
                            setStaffIsActive(true);
                            setEditingStaffId(null);
                          }}
                          className="px-4 py-3 h-12 bg-slate-200 border border-slate-300 text-slate-700 hover:bg-slate-300 rounded-xl font-bold text-xs uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Right Column: Cards Grid */}
                  <div className="lg:col-span-3 space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">Registered Officers ({staffAccounts.length})</h3>
                    {staffAccounts.length === 0 ? (
                      <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <Users size={48} className="mx-auto text-slate-200 mb-3" />
                        <p className="text-slate-400 font-bold uppercase text-xs">No clinical staff registered.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {staffAccounts.map((staff) => (
                          <div key={staff.id} className="p-6 bg-slate-50 hover:bg-slate-100 rounded-3xl border border-slate-150 transition-all flex flex-col justify-between group">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  staff.role === 'admin' 
                                    ? 'bg-purple-100 border border-purple-200 text-purple-700' 
                                    : staff.role === 'doctor'
                                      ? 'bg-blue-100 border border-blue-200 text-blue-700'
                                      : 'bg-emerald-100 border border-emerald-200 text-emerald-700'
                                }`}>
                                  {staff.role}
                                </span>
                                <h4 className="font-bold text-slate-800 text-sm mt-2">{staff.name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5 font-medium">{staff.email}</p>
                                {staff.phone && <p className="text-[10px] text-slate-400 mt-1 font-mono">📱 {staff.phone}</p>}
                              </div>
                              <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-all">
                                <button
                                  type="button"
                                  onClick={() => startEditStaff(staff)}
                                  className="p-2 text-slate-500 hover:text-primary hover:bg-white rounded-lg transition-all cursor-pointer"
                                  title="Edit staff details"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStaff(staff.id)}
                                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-white rounded-lg transition-all cursor-pointer"
                                  title="Delete Account"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="border-t border-slate-200/60 mt-4 pt-3 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                              <span>Status</span>
                              {staff.is_active ? (
                                <span className="text-emerald-500 font-bold">● Active on Duty</span>
                              ) : (
                                <span className="text-slate-400 font-bold">○ On Leave</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'templates' && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-slate-800"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1 font-display">Broadcast & SMS Templates</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest font-mono">Create and design structured message templates with placeholders for variable automation</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                  {/* Left Column: Form */}
                  <form onSubmit={handleSaveTemplate} className="lg:col-span-2 bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] h-fit space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                      {editingTemplateId ? 'Configure Template Settings' : 'New Template Preset'}
                    </h3>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Friendly Name / alias *</label>
                      <input 
                        type="text"
                        required
                        value={tplName}
                        onChange={(e) => setTplName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm text-slate-800"
                        placeholder="e.g. Booking Confirmation or Welcome SMS"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Channel / Type</label>
                        <select
                          value={tplType}
                          onChange={(e) => setTplType(e.target.value as any)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-primary rounded-xl outline-none font-bold text-xs text-slate-800 cursor-pointer"
                        >
                          <option value="whatsapp">WhatsApp Text</option>
                          <option value="sms">SMS Text</option>
                          <option value="email">Email Broadcast</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Placeholders (Comma Separated)</label>
                        <input 
                          type="text"
                          value={tplPlaceholders}
                          onChange={(e) => setTplPlaceholders(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm text-slate-800"
                          placeholder="e.g. name, date, doctor"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Template Content *</label>
                      <textarea
                        required
                        value={tplContent}
                        onChange={(e) => setTplContent(e.target.value)}
                        rows={5}
                        className="w-full p-4 border border-slate-200 rounded-xl outline-none text-sm transition-all bg-white text-slate-800 focus:border-primary leading-relaxed"
                        placeholder="Dear {{name}}, your booking is set for {{date}}."
                      />
                      <span className="text-[9px] text-slate-400 font-medium block mt-1 tracking-wide uppercase leading-normal">
                        Wrap your variables with double curly brackets like <strong className="text-primary">{"{{name}}"}</strong> to parse them during mass message routing.
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-grow py-3 h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] shadow cursor-pointer text-xs uppercase"
                      >
                        <Check size={16} /> {editingTemplateId ? 'Update Preset' : 'Add Preset'}
                      </button>
                      {editingTemplateId && (
                        <button
                          type="button"
                          onClick={() => {
                            setTplName('');
                            setTplContent('');
                            setTplType('whatsapp');
                            setTplPlaceholders('');
                            setEditingTemplateId(null);
                          }}
                          className="px-4 py-3 h-12 bg-slate-200 border border-slate-300 text-slate-700 hover:bg-slate-300 rounded-xl font-bold text-xs uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Right Column: Custom Presets Table */}
                  <div className="lg:col-span-3 space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">Saved Communication Presets ({templatesList.length})</h3>
                    {templatesList.length === 0 ? (
                      <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <FileText size={48} className="mx-auto text-slate-200 mb-3" />
                        <p className="text-slate-400 font-bold uppercase text-xs">No preset templates found.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {templatesList.map((tpl) => (
                          <div key={tpl.id} className="p-6 bg-slate-50 hover:bg-slate-100 rounded-3xl border border-slate-150 transition-all flex flex-col justify-between group">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="inline-block px-2.5 py-0.5 bg-slate-200 border border-slate-300 text-slate-700 rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                                  {tpl.type}
                                </span>
                                <h4 className="font-bold text-slate-800 text-sm mt-3">{tpl.name}</h4>
                                <p className="text-xs text-slate-600 mt-2 bg-white/80 p-4 border border-slate-200/60 rounded-2xl italic tracking-wide break-all whitespace-pre-line leading-relaxed">
                                  "{tpl.content}"
                                </p>
                              </div>
                              <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-all">
                                <button
                                  type="button"
                                  onClick={() => startEditTemplate(tpl)}
                                  className="p-2 text-slate-500 hover:text-primary hover:bg-white rounded-lg transition-all cursor-pointer"
                                  title="Edit Template"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTemplate(tpl.id)}
                                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-white rounded-lg transition-all cursor-pointer"
                                  title="Delete Preset"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            {tpl.placeholder_keys && tpl.placeholder_keys.length > 0 && (
                              <div className="border-t border-slate-200/60 mt-4 pt-3 flex flex-wrap gap-1.5 items-center">
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Placeholders:</span>
                                {tpl.placeholder_keys.map(k => (
                                  <span key={k} className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-md text-[8px] font-mono leading-none font-bold">
                                    {`{{${k}}}`}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeAppointmentForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl border border-slate-100 p-8 flex flex-col relative max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                      {activeAppointmentForm.id ? 'Edit Appointment' : 'New Appointment'}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 font-mono">Basti Clinic Registry System</p>
                  </div>
                  <button 
                    onClick={() => setActiveAppointmentForm(null)}
                    className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-4 pr-1">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Patient Name *</label>
                    <input 
                      type="text"
                      required
                      value={activeAppointmentForm.patientName || ''}
                      onChange={(e) => setActiveAppointmentForm({ ...activeAppointmentForm, patientName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm transition-all text-slate-800"
                      placeholder="Name of patient"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Mobile Phone *</label>
                      <input 
                        type="tel"
                        required
                        value={activeAppointmentForm.patientPhone || ''}
                        onChange={(e) => setActiveAppointmentForm({ ...activeAppointmentForm, patientPhone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm transition-all text-slate-800"
                        placeholder="e.g. 8004055501"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">WhatsApp Phone</label>
                      <input 
                        type="tel"
                        value={activeAppointmentForm.patientWhatsapp || ''}
                        onChange={(e) => setActiveAppointmentForm({ ...activeAppointmentForm, patientWhatsapp: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm transition-all text-slate-800"
                        placeholder="Leave blank to sync phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Patient Address</label>
                    <input 
                      type="text"
                      value={activeAppointmentForm.patientAddress || ''}
                      onChange={(e) => setActiveAppointmentForm({ ...activeAppointmentForm, patientAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm transition-all text-slate-800"
                      placeholder="Basti, UP"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Appointment Type</label>
                      <select 
                        value={activeAppointmentForm.type || 'doctor'}
                        onChange={(e) => {
                          const type = e.target.value as 'doctor' | 'package';
                          const firstId = type === 'package' ? (healthPackages[0]?.id || '') : (opdDoctors[0]?.id || '');
                          const defaultPrice = type === 'package' 
                            ? (healthPackages[0]?.offerPrice || 0) 
                            : (opdDoctors[0]?.fee || 600);
                          setActiveAppointmentForm({ 
                            ...activeAppointmentForm, 
                            type, 
                            doctorId: firstId, 
                            finalPrice: defaultPrice 
                          });
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm transition-all text-slate-800"
                      >
                        <option value="doctor">OPD Doctor Consultation</option>
                        <option value="package">Health Checkup Package</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                        Select {activeAppointmentForm.type === 'package' ? 'Package' : 'Doctor Specialist'}
                      </label>
                      <select 
                        value={activeAppointmentForm.doctorId || ''}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          let price = 0;
                          if (activeAppointmentForm.type === 'package') {
                            const pkg = healthPackages.find(p => p.id === selectedId);
                            price = pkg?.offerPrice || pkg?.actualPrice || 0;
                          } else {
                            const doc = opdDoctors.find(d => d.id === selectedId);
                            price = doc?.fee || 600;
                          }
                          setActiveAppointmentForm({ 
                            ...activeAppointmentForm, 
                            doctorId: selectedId,
                            finalPrice: price
                          });
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm transition-all text-slate-800"
                      >
                        {activeAppointmentForm.type === 'package' ? (
                          healthPackages.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (₹{p.offerPrice || p.actualPrice})</option>
                          ))
                        ) : (
                          opdDoctors.map(d => (
                            <option key={d.id} value={d.id}>{d.specialty} - {d.name} (Fee: ₹{d.fee || 600})</option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Appointment Date</label>
                      <input 
                        type="date"
                        required
                        value={activeAppointmentForm.date || ''}
                        onChange={(e) => setActiveAppointmentForm({ ...activeAppointmentForm, date: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm transition-all text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Appointment Time / Slot</label>
                      <input 
                        type="text"
                        value={activeAppointmentForm.time || ''}
                        onChange={(e) => setActiveAppointmentForm({ ...activeAppointmentForm, time: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm transition-all text-slate-800"
                        placeholder="e.g. 11:30 AM"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Total Pricing Amount</label>
                      <input 
                        type="number"
                        value={activeAppointmentForm.finalPrice || 0}
                        onChange={(e) => setActiveAppointmentForm({ ...activeAppointmentForm, finalPrice: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm transition-all text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Billing Status</label>
                      <select 
                        value={activeAppointmentForm.status || 'pending'}
                        onChange={(e) => setActiveAppointmentForm({ ...activeAppointmentForm, status: e.target.value as any })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl outline-none font-medium text-sm transition-all text-slate-800"
                      >
                        <option value="pending">Pending Review</option>
                        <option value="confirmed">Confirmed / Paid</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-6 mt-2 py-2">
                    {activeAppointmentForm.type === 'package' && (
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={!!activeAppointmentForm.isHomeCollection}
                          onChange={(e) => setActiveAppointmentForm({ ...activeAppointmentForm, isHomeCollection: e.target.checked })}
                          className="w-4 h-4 text-primary bg-slate-100 border-slate-200 rounded focus:ring-primary focus:ring-2"
                        />
                        <span className="text-xs text-slate-600 font-bold uppercase tracking-tight">Home Blood Collection</span>
                      </label>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={!!activeAppointmentForm.claimOffer}
                        onChange={(e) => setActiveAppointmentForm({ ...activeAppointmentForm, claimOffer: e.target.checked })}
                        className="w-4 h-4 text-primary bg-slate-100 border-slate-200 rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="text-xs text-slate-600 font-bold uppercase tracking-tight">Claim Promotional Offer</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-8 border-t border-slate-100 pt-6">
                  <button 
                    onClick={() => setActiveAppointmentForm(null)}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!activeAppointmentForm.patientName || !activeAppointmentForm.patientPhone || !activeAppointmentForm.doctorId || !activeAppointmentForm.date) {
                        showToast("Please fill in core Patient Details: Name, Phone, Doctor/Package and Date.", "error");
                        return;
                      }

                      const isEditing = !!activeAppointmentForm.id;
                      const targetId = activeAppointmentForm.id || generateUUID();

                      const completeRecord: Appointment = {
                        id: targetId,
                        patientName: activeAppointmentForm.patientName,
                        patientPhone: activeAppointmentForm.patientPhone,
                        patientWhatsapp: activeAppointmentForm.patientWhatsapp || activeAppointmentForm.patientPhone,
                        patientAddress: activeAppointmentForm.patientAddress || '',
                        doctorId: activeAppointmentForm.doctorId,
                        date: activeAppointmentForm.date,
                        time: activeAppointmentForm.time || '11:00 AM',
                        status: activeAppointmentForm.status || 'pending',
                        type: activeAppointmentForm.type || 'doctor',
                        isHomeCollection: !!activeAppointmentForm.isHomeCollection,
                        claimOffer: !!activeAppointmentForm.claimOffer,
                        finalPrice: Number(activeAppointmentForm.finalPrice) || 0
                      };

                      let updatedList = [];
                      if (isEditing) {
                        updatedList = appointments.map(a => a.id === targetId ? completeRecord : a);
                      } else {
                        updatedList = [completeRecord, ...appointments];
                      }

                      setAppointments(updatedList, false);
                      setActiveAppointmentForm(null);

                      // Trigger immediate sync
                      triggerSave('appointments', () => setAppointments(updatedList, true));
                    }}
                    className="px-8 py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:scale-105 transition-all"
                  >
                    {activeAppointmentForm.id ? 'Save & Sync Changes' : 'Confirm Appointment'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence>
            {confirmState && (
              <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={confirmState.onCancel}
                />
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 15 }}
                  className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 p-8 flex flex-col overflow-hidden z-10"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                      <HelpCircle size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        {confirmState.title || "Are you sure?"}
                      </h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 leading-none">Apollo Basti Clinic Manager</p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs font-semibold leading-relaxed mb-6">
                    {confirmState.message}
                  </p>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={confirmState.onCancel}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                    >
                      Cancel action
                    </button>
                    <button
                      type="button"
                      onClick={confirmState.onConfirm}
                      className="px-6 py-2.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                    >
                      Yes, Confirm
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Status Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 max-w-md"
          >
            <div className={`p-5 rounded-[2rem] shadow-2xl border flex items-start gap-4 ${
              toast.type === 'success' 
                ? 'bg-slate-900 border-slate-800 text-teal-400' 
                : toast.type === 'error'
                ? 'bg-rose-950 border-rose-900 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-orange-400'
            }`}>
              <div className="flex-grow">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Administrative Alert</p>
                <div className="text-white text-xs font-bold uppercase tracking-wide leading-relaxed">
                  {toast.message}
                </div>
              </div>
              <button 
                onClick={() => setToast(null)} 
                className="hover:bg-white/10 p-1.5 rounded-xl text-slate-400 hover:text-white transition-all shrink-0 mt-0.5"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
