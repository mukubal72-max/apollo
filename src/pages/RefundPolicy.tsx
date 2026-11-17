import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Building2,
  RefreshCcw,
  Clock,
  CheckCircle2,
  Scale,
  Lock,
} from 'lucide-react';
import compliancePackPdf from '../assets/Website_Compliance_Pack_-_Apollo_Clinic_Basti_d22fa4e0.pdf';

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const metadataRows = [
    { label: 'Website', value: 'www.apolloclinicbasti.com', icon: Globe },
    { label: 'Effective Date', value: 'November 14, 2026', icon: Calendar },
    { label: 'Operating Entity', value: 'Apollo Clinic Basti (C Square Medco LLP)', icon: Building2 },
    { label: 'Clinic Phone', value: '8004055501', icon: Phone, href: 'tel:8004055501' },
    { label: 'Address', value: '2788 Station Road, Basti, Uttar Pradesh, India', icon: MapPin },
    { label: 'Support Email', value: 'csquare.medco@gmail.com', icon: Mail, href: 'mailto:csquare.medco@gmail.com' },
  ];

  const refundRules = [
    {
      category: 'Doctor Consultations',
      cancellation:
        'May be rescheduled or canceled at least 2 hours prior to the scheduled appointment slot by calling 8004055501.',
      eligibility:
        'Full refund (less payment gateway charges, if any) for timely cancellations. No refund for missed appointments (no-shows) or completed consultations.',
    },
    {
      category: 'Pathology & Radiology Diagnostics',
      cancellation:
        'May be canceled or rescheduled prior to sample collection or diagnostic imaging scan.',
      eligibility:
        'Full refund if canceled before sample draw or scan. Once a biological sample is collected or a scan is initiated, no refund applies.',
    },
    {
      category: 'Home Sample Collection',
      cancellation:
        'Must be canceled or rescheduled at least 2 hours before the assigned phlebotomist visit window.',
      eligibility:
        'Full refund if canceled before phlebotomist dispatch. If the phlebotomist has already been dispatched, home visit convenience charges are non-refundable.',
    },
    {
      category: 'Preventive Health Checkup Packages',
      cancellation:
        'May be rescheduled or canceled at least 4 hours prior to the scheduled fasting/checkup slot.',
      eligibility:
        'Full refund for unavailed packages canceled within the window. Partially availed packages are non-refundable once initial tests begin.',
    },
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
            <span>Apollo Clinic Basti • Website Compliance &amp; Policy Pack</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none font-display mb-4">
            Refund <span className="text-[#f39223]">&amp;</span> Cancellation Policy
          </h1>
          <p className="text-base md:text-lg text-white/85 font-medium max-w-3xl leading-relaxed mb-8">
            Refund Policy, Form Consent &amp; Website Disclaimers — Supplementary Legal &amp; DPDP Act Compliance Copy for www.apolloclinicbasti.com
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <a
              href={compliancePackPdf}
              download="Apollo-Clinic-Basti-Refund-Policy-Compliance-Pack.pdf"
              className="px-5 py-3 bg-[#f39223] hover:bg-[#e08215] text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-black/20 transition-all flex items-center gap-2"
            >
              <Download size={14} />
              <span>Download Compliance PDF</span>
            </a>
            <Link
              to="/privacy-policy"
              className="px-5 py-3 bg-white text-[#007a8e] hover:bg-slate-100 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
            >
              <Lock size={14} />
              <span>Privacy Policy</span>
            </Link>
            <Link
              to="/terms-of-service"
              className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-xl font-black text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Scale size={14} />
              <span>Terms of Service</span>
            </Link>
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
        {/* Metadata Card */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200/80 overflow-hidden">
          <div className="bg-slate-50 px-6 md:px-8 py-4 border-b border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText size={16} className="text-[#007a8e]" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-700">
                Policy Control &amp; Clinic Contact Details
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

        {/* Refund & Cancellation Policy Article */}
        <article className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/80 p-6 sm:p-10 md:p-14 space-y-10">
          <div className="border-b-2 border-[#007a8e]/15 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f39223] block mb-2">
                Website Compliance &amp; Policy Pack
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#007a8e] uppercase tracking-tight font-display">
                Refund and Cancellation Policy
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl self-start">
              <RefreshCcw size={16} className="text-[#007a8e]" />
              <span>7–10 Working Days Refund</span>
            </div>
          </div>

          {/* 1. Overview & Scope */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                1
              </span>
              <span>Overview &amp; Scope</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base sm:pl-11">
              This Refund and Cancellation Policy governs all online and clinic-assisted bookings made
              through <strong className="text-slate-800">www.apolloclinicbasti.com</strong> for doctor
              consultations, pathology and radiology diagnostics, home sample collections, and preventive
              health checkup packages at Apollo Clinic Basti.
            </p>
          </section>

          {/* 2. Service-Wise Cancellation & Refund Rules */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                2
              </span>
              <span>Service-Wise Cancellation &amp; Refund Rules</span>
            </h3>
            <div className="sm:pl-11">
              {/* Desktop Table */}
              <div className="hidden md:block rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#007a8e] text-white">
                      <th className="py-4 px-5 font-black uppercase text-xs tracking-wider w-1/4">
                        Service Category
                      </th>
                      <th className="py-4 px-5 font-black uppercase text-xs tracking-wider w-[37.5%]">
                        Cancellation &amp; Rescheduling Terms
                      </th>
                      <th className="py-4 px-5 font-black uppercase text-xs tracking-wider w-[37.5%]">
                        Refund Eligibility
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {refundRules.map((row) => (
                      <tr key={row.category} className="align-top hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-5 font-black text-slate-900 bg-slate-50/60">
                          {row.category}
                        </td>
                        <td className="py-4 px-5 text-slate-600 leading-relaxed">{row.cancellation}</td>
                        <td className="py-4 px-5 text-slate-600 leading-relaxed">{row.eligibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="grid gap-4 md:hidden">
                {refundRules.map((row) => (
                  <div
                    key={row.category}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3"
                  >
                    <h4 className="text-sm font-black uppercase text-[#007a8e] tracking-wide">
                      {row.category}
                    </h4>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Cancellation &amp; Rescheduling Terms
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed">{row.cancellation}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Refund Eligibility
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed">{row.eligibility}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Clinic-Initiated Cancellations */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                3
              </span>
              <span>Clinic-Initiated Cancellations</span>
            </h3>
            <div className="sm:pl-11">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 sm:p-6 flex items-start gap-4">
                <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-emerald-950 leading-relaxed font-medium">
                  If an appointment or diagnostic test is canceled by Apollo Clinic Basti due to unforeseen
                  physician unavailability, equipment maintenance, or clinical exigencies, the patient will be
                  offered a <strong>complimentary priority reschedule</strong> or a{' '}
                  <strong>100% refund without any administrative deduction</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Refund Processing Timeline */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#007a8e] text-white text-xs font-black flex items-center justify-center shrink-0">
                4
              </span>
              <span>Refund Processing Timeline</span>
            </h3>
            <div className="sm:pl-11 grid sm:grid-cols-2 gap-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wide">
                  <Phone size={16} className="text-[#f39223]" />
                  <span>How to Request</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Submit cancellation or refund requests by calling{' '}
                  <a href="tel:8004055501" className="font-bold text-[#007a8e] hover:underline">
                    8004055501
                  </a>{' '}
                  or emailing{' '}
                  <a href="mailto:csquare.medco@gmail.com" className="font-bold text-[#007a8e] hover:underline">
                    csquare.medco@gmail.com
                  </a>{' '}
                  with your booking reference, patient name, and registered mobile number.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wide">
                  <Clock size={16} className="text-[#007a8e]" />
                  <span>Mode &amp; Timeline</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Approved refunds for online payments are credited back to the original payment method (UPI,
                  debit/credit card, or net banking) within <strong>7 to 10 working days</strong>, subject to
                  banking settlement cycles. Cash payments made at the clinic reception are refunded via bank
                  transfer or at the billing desk upon receipt verification.
                </p>
              </div>
            </div>
          </section>

          {/* Bottom Navigation & Download */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <Link
              to="/"
              className="text-xs font-black uppercase tracking-widest text-[#007a8e] hover:text-[#f39223] transition-colors"
            >
              &larr; Back to Home
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/privacy-policy"
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-wider transition-all"
              >
                Privacy Policy &amp; Terms
              </Link>
              <a
                href={compliancePackPdf}
                download="Apollo-Clinic-Basti-Refund-Policy-Compliance-Pack.pdf"
                className="px-6 py-3 bg-[#007a8e] hover:bg-[#005f6e] text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
              >
                <Download size={15} />
                <span>Download Compliance Pack PDF</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
