import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Download,
  Printer,
  Phone,
  Mail,
  MapPin,
  Globe,
  Calendar,
  AlertTriangle,
  Lock,
  MessageSquare,
  Scale,
  UserCheck,
  ChevronRight,
  Building2,
} from 'lucide-react';
import privacyPolicyPdf from '../assets/Privacy_Policy___Terms_of_Service_-_Apollo_Clinic_Basti_2a873f04.pdf';

interface PrivacyPolicyProps {
  initialSection?: 'privacy' | 'terms';
}

export default function PrivacyPolicy({ initialSection }: PrivacyPolicyProps) {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    const targetId =
      hash ||
      (initialSection === 'terms' || location.pathname === '/terms-of-service'
        ? 'terms-of-service'
        : null);

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash, initialSection]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const metadataRows = [
    { label: 'Website', value: 'www.apolloclinicbasti.com', icon: Globe },
    { label: 'Effective Date', value: 'November 14, 2026', icon: Calendar },
    { label: 'Operating Entity', value: 'Apollo Clinic Basti (C Square Medco LLP)', icon: Building2 },
    { label: 'Clinic Phone', value: '8004055501', icon: Phone, href: 'tel:8004055501' },
    { label: 'Clinic Address', value: '2788 Station Road, Basti, Uttar Pradesh, India', icon: MapPin },
    { label: 'Support Email', value: 'csquare.medco@gmail.com', icon: Mail, href: 'mailto:csquare.medco@gmail.com' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#005f6e] via-[#007a8e] to-[#005f6e] text-white py-16 md:py-24 px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#f39223]/15 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-amber-300 mb-6">
            <ShieldCheck size={14} className="text-[#f39223]" />
            <span>Apollo Clinic Basti • Legal &amp; Compliance Documentation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none font-display mb-4">
            Privacy Policy <span className="text-[#f39223]">&amp;</span> Terms of Service
          </h1>
          <p className="text-base md:text-lg text-white/85 font-medium max-w-3xl leading-relaxed mb-8">
            Official Website Governance, Patient Data Protection &amp; Digital Communication Terms
          </p>

          {/* Quick Actions & Section Jump */}
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <button
              type="button"
              onClick={() => scrollToSection('privacy-policy')}
              className="px-5 py-3 bg-white text-[#007a8e] hover:bg-slate-100 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Lock size={14} />
              <span>Part I: Privacy Policy</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('terms-of-service')}
              className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-xl font-black text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Scale size={14} />
              <span>Part II: Terms of Service</span>
            </button>
            <a
              href={privacyPolicyPdf}
              download="Apollo-Clinic-Basti-Privacy-Policy-Terms-of-Service.pdf"
              className="px-5 py-3 bg-[#f39223] hover:bg-[#e08215] text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-black/20 transition-all flex items-center gap-2"
            >
              <Download size={14} />
              <span>Download Official PDF</span>
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 -mt-8 relative z-20 space-y-10">
        {/* Clinic Governance Metadata Card */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200/80 overflow-hidden">
          <div className="bg-slate-50 px-6 md:px-8 py-4 border-b border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText size={16} className="text-[#007a8e]" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-700">
                Document Control &amp; Entity Details
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#007a8e] bg-[#007a8e]/10 px-3 py-1 rounded-full">
              Effective: Nov 14, 2026
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:gap-px bg-slate-100">
            {metadataRows.map((item) => (
              <div key={item.label} className="bg-white p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#007a8e]/10 text-[#007a8e] flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-bold text-slate-900 hover:text-[#007a8e] transition-colors break-words"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-bold text-slate-900 break-words">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PART I: PRIVACY POLICY */}
        <article
          id="privacy-policy"
          className="scroll-mt-28 bg-white rounded-[2.5rem] shadow-xl border border-slate-200/80 p-6 sm:p-10 md:p-14 space-y-10"
        >
          <div className="border-b-2 border-[#007a8e]/15 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f39223] block mb-2">
                Section I • Data Protection
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#007a8e] uppercase tracking-tight font-display">
                Part I: Privacy Policy
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl self-start">
              <ShieldCheck size={16} className="text-[#007a8e]" />
              <span>DPDP Act, 2023 Compliant</span>
            </div>
          </div>

          {/* 1. Introduction */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                1
              </span>
              <span>Introduction</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base pl-0 sm:pl-11">
              Apollo Clinic Basti ("we," "our," or "us") is committed to protecting the privacy,
              confidentiality, and security of the personal and medical information entrusted to us by
              patients, visitors, and users ("you" or "your") of{' '}
              <strong className="text-slate-800">www.apolloclinicbasti.com</strong> (the "Website"). This
              Privacy Policy outlines how we collect, process, store, share, and safeguard your information
              in accordance with the <strong className="text-slate-800">Digital Personal Data Protection (DPDP) Act, 2023</strong>,
              the <strong className="text-slate-800">Information Technology Act, 2000</strong>, and applicable
              Indian healthcare regulations.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                2
              </span>
              <span>Information We Collect</span>
            </h3>
            <div className="sm:pl-11 space-y-4">
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                We collect information necessary to schedule appointments, deliver diagnostic and clinical
                care, communicate test reports, and improve website usability:
              </p>
              <div className="grid gap-3">
                {[
                  {
                    title: 'Personal Identification Information',
                    desc: 'Full name, age, date of birth, gender, residential address, mobile number (including WhatsApp-enabled numbers), and email address.',
                  },
                  {
                    title: 'Sensitive Personal Data & Medical Information',
                    desc: 'Health history, symptoms, doctor consultation notes, prescriptions, diagnostic test orders, pathology and radiology reports, and immunization records.',
                  },
                  {
                    title: 'Transaction & Billing Details',
                    desc: 'Payment receipts, invoice records, and insurance or TPA details. We do not store full debit/credit card numbers or UPI PINs on our servers; all online payments are processed via PCI-DSS-compliant third-party payment gateways.',
                  },
                  {
                    title: 'Technical & Usage Data',
                    desc: 'IP address, browser type, device details, cookies, and pages visited on our Website, collected to maintain security and optimize user experience.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70"
                  >
                    <p className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
                      <ChevronRight size={14} className="text-[#f39223] shrink-0" />
                      <span>{item.title}:</span>
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed pl-5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Purpose of Data Collection & Processing */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                3
              </span>
              <span>Purpose of Data Collection &amp; Processing</span>
            </h3>
            <div className="sm:pl-11 space-y-3">
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                We process your personal data strictly for lawful healthcare and operational purposes, including:
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-600">
                {[
                  'Booking, confirming, rescheduling, or canceling doctor consultations, health checkup packages, and diagnostic tests.',
                  'Generating and delivering digital lab reports, prescriptions, and clinical summaries.',
                  'Sending transactional appointment confirmations, queue or schedule alerts, and post-consultation follow-up instructions via SMS, RCS, WhatsApp, phone call, or email.',
                  'Responding to patient inquiries, feedback, or grievance requests submitted through the Website or official messaging channels.',
                  'Complying with statutory medical record-keeping obligations, public health reporting, and regulatory audits in India.',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#007a8e] mt-2 shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 4. WhatsApp Report Delivery & SMS/RCS Notifications */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                4
              </span>
              <span>WhatsApp Report Delivery &amp; SMS/RCS Notifications</span>
            </h3>
            <div className="sm:pl-11 space-y-4">
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                By providing your mobile number during online booking, registration, or diagnostic billing on{' '}
                <strong className="text-slate-800">www.apolloclinicbasti.com</strong>, you expressly consent to
                receive communications from Apollo Clinic Basti across digital messaging channels under the
                following terms:
              </p>
              <div className="rounded-2xl bg-[#007a8e]/[0.04] border border-[#007a8e]/15 p-5 sm:p-6 space-y-4">
                {[
                  {
                    title: 'Digital Diagnostic Report Delivery via WhatsApp',
                    desc: 'Upon your request or registration, pathology reports, radiology summaries, prescriptions, and billing invoices may be transmitted as encrypted PDF documents or secure download links directly to your registered WhatsApp number via authorized WhatsApp Business API providers.',
                  },
                  {
                    title: 'Transactional SMS & RCS Alerts',
                    desc: 'You authorize us to send service-related alerts—including appointment confirmations, doctor schedule updates, sample collection alerts, and report-ready notifications—even if your number is registered on the National Do Not Disturb (DND) registry, as permitted under TRAI guidelines for transactional healthcare communications.',
                  },
                  {
                    title: 'User Responsibility for Shared Devices',
                    desc: 'Because WhatsApp messages and SMS alerts are delivered directly to your registered mobile number, you are responsible for maintaining password or biometric security on your personal mobile device to prevent unauthorized third-party viewing of your medical reports.',
                  },
                  {
                    title: 'Opt-Out & Alternative Delivery',
                    desc: 'You may opt out of receiving medical reports via WhatsApp or promotional health updates at any time by replying "STOP" on WhatsApp, emailing csquare.medco@gmail.com, or informing our front desk. If you opt out of digital WhatsApp delivery, physical copies of your reports remain available for collection at our clinic reception.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <MessageSquare size={16} className="text-[#007a8e] mt-1 shrink-0" />
                    <div className="text-sm text-slate-600 leading-relaxed">
                      <strong className="text-slate-900">{item.title}: </strong>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Consent & Your Rights (DPDP Act, 2023) */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                5
              </span>
              <span>Consent &amp; Your Rights (DPDP Act, 2023)</span>
            </h3>
            <div className="sm:pl-11 space-y-3">
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                As a Data Principal under Indian law, you have the right to:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  {
                    title: 'Access & Review',
                    desc: 'Request a summary of the personal data we hold about you.',
                  },
                  {
                    title: 'Correction & Updating',
                    desc: 'Request rectification of inaccurate or incomplete personal, mobile number, or demographic records.',
                  },
                  {
                    title: 'Withdrawal of Consent',
                    desc: 'Withdraw your consent for WhatsApp report delivery or non-essential health notifications at any time.',
                  },
                  {
                    title: 'Erasure',
                    desc: 'Request deletion of personal data that is no longer required for clinical care or mandated by statutory medical retention laws.',
                  },
                ].map((right) => (
                  <div key={right.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-2 font-black text-slate-900 text-sm mb-1">
                      <UserCheck size={15} className="text-[#007a8e]" />
                      <span>{right.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{right.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. Data Sharing & Disclosure */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                6
              </span>
              <span>Data Sharing &amp; Disclosure</span>
            </h3>
            <div className="sm:pl-11 space-y-3">
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                We do not sell, rent, or trade your personal or medical information to third parties. Information
                may be shared strictly on a need-to-know basis with:
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#f39223] mt-2 shrink-0" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-900">Treating Physicians &amp; Diagnostic Partners: </strong>
                    Doctors, specialists, and accredited partner laboratories involved in your diagnosis and
                    treatment.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#f39223] mt-2 shrink-0" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-900">Technology &amp; Messaging Providers: </strong>
                    Authorized IT, Hospital Management System (HMS), DLT-registered SMS/RCS gateways, WhatsApp
                    Business Solution Providers (BSPs), and payment gateway partners bound by strict
                    confidentiality and data protection agreements.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#f39223] mt-2 shrink-0" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-900">Legal &amp; Regulatory Authorities: </strong>
                    Government agencies, health departments, or law enforcement bodies when required under
                    applicable Indian law or court orders.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 7. Data Security & Retention */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                7
              </span>
              <span>Data Security &amp; Retention</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base sm:pl-11">
              We implement administrative, technical, and physical safeguards—including encrypted data
              transmission (SSL/TLS), role-based access controls, and secure servers—to protect your records
              against unauthorized access, alteration, or disclosure. Medical records are retained in accordance
              with guidelines prescribed by the <strong className="text-slate-800">National Medical Commission (NMC)</strong> and
              applicable state and central healthcare laws.
            </p>
          </section>

          {/* 8. Cookies & Third-Party Links */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                8
              </span>
              <span>Cookies &amp; Third-Party Links</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base sm:pl-11">
              Our Website may use cookies to remember user preferences and analyze traffic patterns. You may
              disable cookies through your browser settings, though certain interactive features may be affected.
              The Website may contain links to external portals (such as parent network pages or payment
              gateways); we are not responsible for the privacy practices of external websites.
            </p>
          </section>

          {/* 9. Grievance Officer & Contact Details */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                9
              </span>
              <span>Grievance Officer &amp; Contact Details</span>
            </h3>
            <div className="sm:pl-11 space-y-4">
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                For questions, data access or correction requests, WhatsApp/SMS opt-outs, or privacy-related
                grievances, please contact our Grievance Officer:
              </p>
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#007a8e] text-white">
                      <th className="py-3.5 px-5 font-black uppercase text-xs tracking-wider w-1/3">
                        Designation / Detail
                      </th>
                      <th className="py-3.5 px-5 font-black uppercase text-xs tracking-wider">
                        Contact Information
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="py-3.5 px-5 font-bold text-slate-700 bg-slate-50">Grievance Officer</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        Clinic Administrator, Apollo Clinic Basti
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-bold text-slate-700 bg-slate-50">Clinic Address</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        2788 Station Road, Basti, Uttar Pradesh, India
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-bold text-slate-700 bg-slate-50">Phone Number</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        <a href="tel:8004055501" className="text-[#007a8e] hover:underline">
                          8004055501
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-bold text-slate-700 bg-slate-50">Support Email</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        <a href="mailto:csquare.medco@gmail.com" className="text-[#007a8e] hover:underline">
                          csquare.medco@gmail.com
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-bold text-slate-700 bg-slate-50">Official Website</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-900">www.apolloclinicbasti.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </article>

        {/* PART II: TERMS OF SERVICE */}
        <article
          id="terms-of-service"
          className="scroll-mt-28 bg-white rounded-[2.5rem] shadow-xl border border-slate-200/80 p-6 sm:p-10 md:p-14 space-y-10"
        >
          <div className="border-b-2 border-[#007a8e]/15 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f39223] block mb-2">
                Section II • Website Usage &amp; Clinical Governance
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#007a8e] uppercase tracking-tight font-display">
                Part II: Terms of Service
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl self-start">
              <Scale size={16} className="text-[#007a8e]" />
              <span>Jurisdiction: Basti, UP</span>
            </div>
          </div>

          {/* 1. Acceptance of Terms */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#f39223] text-white text-xs font-black flex items-center justify-center shrink-0">
                1
              </span>
              <span>Acceptance of Terms</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base sm:pl-11">
              Welcome to <strong className="text-slate-800">www.apolloclinicbasti.com</strong> (the "Website"),
              operated by Apollo Clinic Basti (C Square Medco LLP), located at 2788 Station Road, Basti, Uttar
              Pradesh, India. By accessing, browsing, or using this Website to book appointments, request
              callbacks, or receive digital healthcare communications, you agree to comply with and be bound by
              these Terms of Service. If you do not agree with any part of these terms, please discontinue use of
              the Website.
            </p>
          </section>

          {/* 2. Medical Disclaimer */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#f39223] text-white text-xs font-black flex items-center justify-center shrink-0">
                2
              </span>
              <span>Medical Disclaimer (No Emergency or Substitute Advice)</span>
            </h3>
            <div className="sm:pl-11 space-y-4">
              <div className="rounded-2xl bg-amber-50 border-l-4 border-[#f39223] p-5 flex items-start gap-4">
                <AlertTriangle size={22} className="text-[#f39223] shrink-0 mt-0.5" />
                <div className="text-sm text-amber-950 leading-relaxed">
                  <strong className="font-black uppercase tracking-wide block mb-1">Emergency Notice</strong>
                  Do not use this Website, WhatsApp, or SMS channels for medical emergencies. In case of a
                  life-threatening condition, acute chest pain, trauma, or severe distress, visit the nearest
                  emergency hospital facility immediately.
                </div>
              </div>
              <ul className="space-y-3 text-sm sm:text-base text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#007a8e] mt-2 shrink-0" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-900">Informational Purpose Only: </strong>
                    All health articles, service descriptions, diagnostic package details, and doctor profiles
                    published on this Website are for general informational purposes only and do not constitute
                    formal medical advice, diagnosis, or treatment.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#007a8e] mt-2 shrink-0" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-900">Doctor-Patient Relationship: </strong>
                    Accessing this Website or submitting an online inquiry does not establish a formal
                    doctor-patient relationship until an in-person or authorized clinical consultation takes
                    place.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Appointments, Diagnostics & Digital Report Delivery */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#f39223] text-white text-xs font-black flex items-center justify-center shrink-0">
                3
              </span>
              <span>Appointments, Diagnostics &amp; Digital Report Delivery</span>
            </h3>
            <ul className="sm:pl-11 space-y-3 text-sm sm:text-base text-slate-600">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#007a8e] mt-2 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-slate-900">Scheduling &amp; Availability: </strong>
                  Appointment slots booked online are subject to doctor availability and clinical exigencies.
                  Apollo Clinic Basti reserves the right to reschedule or reassign appointments in case of
                  unforeseen physician unavailability, with prior notice via SMS, WhatsApp, or phone call.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#007a8e] mt-2 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-slate-900">Patient Obligations: </strong>
                  You agree to provide an accurate, active mobile number and truthful personal and medical
                  details during registration. You must arrive at least 15 minutes prior to your scheduled
                  appointment and carry valid government-issued photo identification and previous medical
                  records.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#007a8e] mt-2 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-slate-900">WhatsApp &amp; Electronic Report Delivery: </strong>
                  Digital diagnostic reports sent via WhatsApp or email are provided as a convenience service
                  alongside physical reports available at the clinic. While we verify mobile numbers at
                  registration, Apollo Clinic Basti shall not be liable for unauthorized disclosure resulting
                  from an incorrect mobile number submitted by the patient, shared mobile devices, or
                  third-party messaging platform outages. Diagnostic test turnaround times are indicative and may
                  vary depending on clinical validation or specialized lab processing requirements.
                </span>
              </li>
            </ul>
          </section>

          {/* 4. Consent to Electronic Communications */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#f39223] text-white text-xs font-black flex items-center justify-center shrink-0">
                4
              </span>
              <span>Consent to Electronic Communications (WhatsApp &amp; SMS)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base sm:pl-11">
              By submitting your contact information on{' '}
              <strong className="text-slate-800">www.apolloclinicbasti.com</strong>, you authorize Apollo Clinic
              Basti to contact you via phone call, SMS, RCS, WhatsApp, or email regarding your appointments,
              diagnostic reports, billing receipts, and clinic updates. Standard carrier data or messaging rates,
              if any, apply as per your telecom plan. To opt out of non-transactional alerts or WhatsApp report
              delivery, contact us at{' '}
              <a href="mailto:csquare.medco@gmail.com" className="font-bold text-[#007a8e] hover:underline">
                csquare.medco@gmail.com
              </a>{' '}
              or call{' '}
              <a href="tel:8004055501" className="font-bold text-[#007a8e] hover:underline">
                8004055501
              </a>
              .
            </p>
          </section>

          {/* 5. Payments, Cancellations & Refunds */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#f39223] text-white text-xs font-black flex items-center justify-center shrink-0">
                5
              </span>
              <span>Payments, Cancellations &amp; Refunds</span>
            </h3>
            <ul className="sm:pl-11 space-y-3 text-sm sm:text-base text-slate-600">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#007a8e] mt-2 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-slate-900">Fees: </strong>
                  Consultation charges, diagnostic fees, and health checkup package prices displayed on the
                  Website are in Indian Rupees (INR) and are subject to revision without prior notice.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#007a8e] mt-2 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-slate-900">Cancellations &amp; Rescheduling: </strong>
                  Appointments or health checkups may be rescheduled or canceled by calling{' '}
                  <strong className="text-slate-800">8004055501</strong> or emailing{' '}
                  <strong className="text-slate-800">csquare.medco@gmail.com</strong> prior to the scheduled
                  slot.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#007a8e] mt-2 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-slate-900">Refund Policy: </strong>
                  Refunds for prepaid appointments or unavailed diagnostic packages canceled within the eligible
                  window will be processed back to the original payment source within 7 to 10 working days,
                  subject to applicable gateway or administrative deductions. No refunds will be issued once a
                  consultation has been completed or a diagnostic sample has been collected.
                </span>
              </li>
            </ul>
          </section>

          {/* 6. User Conduct */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#f39223] text-white text-xs font-black flex items-center justify-center shrink-0">
                6
              </span>
              <span>User Conduct</span>
            </h3>
            <div className="sm:pl-11 space-y-3">
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                When using <strong className="text-slate-800">www.apolloclinicbasti.com</strong>, you agree not to:
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-600">
                {[
                  "Submit false, misleading, or fraudulent appointment bookings or register another person's mobile number without their authorization.",
                  "Attempt to gain unauthorized access to the Website's backend systems, patient portals, servers, or networks.",
                  'Upload or transmit malware, automated scraping bots, or disruptive code that interferes with Website operations.',
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#f39223] mt-2 shrink-0" />
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 7. Intellectual Property Rights */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#f39223] text-white text-xs font-black flex items-center justify-center shrink-0">
                7
              </span>
              <span>Intellectual Property Rights</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base sm:pl-11">
              All content on <strong className="text-slate-800">www.apolloclinicbasti.com</strong>—including
              text, graphics, layout, service descriptions, and digital assets—is the property of Apollo Clinic
              Basti or its respective licensors/franchisors and is protected under applicable Indian copyright
              and trademark laws. Unauthorized reproduction, distribution, or commercial exploitation of Website
              content is strictly prohibited.
            </p>
          </section>

          {/* 8. Limitation of Liability */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#f39223] text-white text-xs font-black flex items-center justify-center shrink-0">
                8
              </span>
              <span>Limitation of Liability</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base sm:pl-11">
              To the fullest extent permitted by applicable law, Apollo Clinic Basti, its partners, doctors, and
              staff shall not be liable for any indirect, incidental, or consequential damages arising out of your
              use of—or inability to use—the Website, delays in SMS or WhatsApp delivery caused by telecom or
              third-party platform disruptions, or reliance on general informational content published online.
            </p>
          </section>

          {/* 9. Modifications to Terms */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#f39223] text-white text-xs font-black flex items-center justify-center shrink-0">
                9
              </span>
              <span>Modifications to Terms</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base sm:pl-11">
              We reserve the right to update or modify these Terms of Service at any time. Revised terms take
              effect immediately upon posting on this page. Continued use of the Website constitutes acceptance
              of the updated terms.
            </p>
          </section>

          {/* 10. Governing Law & Jurisdiction */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#f39223] text-white text-xs font-black flex items-center justify-center shrink-0">
                10
              </span>
              <span>Governing Law &amp; Jurisdiction</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base sm:pl-11">
              These Terms of Service shall be governed by and construed in accordance with the laws of India. Any
              disputes arising out of or relating to the use of this Website shall be subject to the exclusive
              jurisdiction of the competent courts in <strong className="text-slate-900">Basti, Uttar Pradesh, India</strong>.
            </p>
          </section>

          {/* 11. Contact Us */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#f39223] text-white text-xs font-black flex items-center justify-center shrink-0">
                11
              </span>
              <span>Contact Us</span>
            </h3>
            <div className="sm:pl-11 space-y-4">
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                For support, appointment assistance, or queries regarding these Terms of Service, please reach
                out to us at:
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <a
                  href="tel:8004055501"
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#007a8e] transition-all flex items-start gap-3"
                >
                  <Phone size={18} className="text-[#007a8e] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">8004055501</p>
                  </div>
                </a>
                <a
                  href="mailto:csquare.medco@gmail.com"
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#007a8e] transition-all flex items-start gap-3"
                >
                  <Mail size={18} className="text-[#007a8e] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5 break-all">csquare.medco@gmail.com</p>
                  </div>
                </a>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <MapPin size={18} className="text-[#007a8e] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Address</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
                      Apollo Clinic Basti, 2788 Station Road, Basti, Uttar Pradesh, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom PDF & Navigation Bar */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <Link
              to="/"
              className="text-xs font-black uppercase tracking-widest text-[#007a8e] hover:text-[#f39223] transition-colors"
            >
              &larr; Back to Home
            </Link>
            <a
              href={privacyPolicyPdf}
              download="Apollo-Clinic-Basti-Privacy-Policy-Terms-of-Service.pdf"
              className="px-6 py-3 bg-[#007a8e] hover:bg-[#005f6e] text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
            >
              <Download size={15} />
              <span>Download Signed Compliance PDF</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
