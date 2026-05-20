import { OPDDoctor, Service, SiteConfig, Testimonial, Department, HealthPackage } from './types';

export const SITE_CONFIG: SiteConfig = {
  name: "Apollo Clinic Basti",
  location: "APOLLO CLINIC BASTI, Station Road, Basti - 272002",
  contact: "8004055501, 05542451088",
  email: "info@apollobasti.com",
  promotionPopup: {
    enabled: true,
    title: "10% OFF ON HOME COLLECTION",
    description: "Book any health checkup package today and get an additional 10% FLAT discount on home sample collection services in Basti.",
    offerText: "10% off on Home Collection"
  }
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: "1",
    title: "Consultation",
    description: "Expert consultation with top specialists from medical colleges.",
    iconName: "Stethoscope",
  },
  {
    id: "2",
    title: "Laboratory",
    description: "High-end pathology and biochemistry lab testing.",
    iconName: "FlaskConical",
  },
  {
    id: "3",
    title: "Radiology",
    description: "Multi-parameter radiology including Ultrasound & X-Ray.",
    iconName: "Activity",
  },
  {
    id: "4",
    title: "Cardiology",
    description: "Holistic heart care with ECG and ECHO facilities.",
    iconName: "HeartPulse",
  },
  {
    id: "5",
    title: "Physiotherapy",
    description: "Advanced physical therapy and rehabilitation services.",
    iconName: "User",
  },
  {
    id: "6",
    title: "Pharmacy",
    description: "Dedicated pharmacy with cold-chain maintenance.",
    iconName: "ShieldCheck",
  },
];

export const INITIAL_OPD_SCHEDULE: OPDDoctor[] = [
  {
    id: "3da4b9a1-8ea2-47d3-9bc4-e12345678901",
    name: "Dr. Sundeep Upadhyay",
    specialty: "Joint Pain and Rheumatic Disorders",
    qualifications: "D.M. (Rheumatology)",
    experience: "15 Years",
    availabilityType: 'visiting',
    visitingDate: "2026-03-26",
    location: "At Basti Branch",
    isAvailable: true,
    expiryDate: "2026-03-27",
    fee: 800,
    consultationTime: "11:00 AM - 03:00 PM"
  },
  {
    id: "3da4b9a1-8ea2-47d3-9bc4-e12345678902",
    name: "Dr. Shubhadeep Paul",
    specialty: "Endocrinology",
    qualifications: "D.M. (Endocrinology)",
    experience: "12 Years",
    availabilityType: 'visiting',
    visitingDate: "2026-03-21",
    location: "At Basti Branch",
    isAvailable: true,
    expiryDate: "2026-03-22",
    fee: 800,
    consultationTime: "10:00 AM - 02:00 PM"
  },
  {
    id: "3da4b9a1-8ea2-47d3-9bc4-e12345678903",
    name: "Dr. Shahzad Alam",
    specialty: "Kidney Diseases & Transplant",
    qualifications: "D.M. (Nephrologist)",
    experience: "10 Years",
    availabilityType: 'visiting',
    visitingDate: "2026-03-21",
    location: "At Basti Branch",
    isAvailable: true,
    expiryDate: "2026-03-21",
    fee: 800,
    consultationTime: "10:00 AM - 02:00 PM"
  },
  {
    id: "3da4b9a1-8ea2-47d3-9bc4-e12345678904",
    name: "Dr. A.K. Jain",
    specialty: "Cancer Care (Oncology)",
    qualifications: "M.D., D.M. (Oncology)",
    experience: "20 Years",
    availabilityType: 'visiting',
    visitingDate: "2026-05-30",
    location: "At Basti Branch",
    isAvailable: true,
    expiryDate: "2026-05-30",
    fee: 1000,
    consultationTime: "09:00 AM - 01:00 PM"
  },
  {
    id: "3da4b9a1-8ea2-47d3-9bc4-e12345678905",
    name: "Dr. Ritu Singh",
    specialty: "ENT (Ear, Nose, Throat)",
    qualifications: "M.S. (ENT)",
    experience: "8 Years",
    availabilityType: 'regular',
    availableDays: ['Wednesday'],
    visitingDate: "2026-05-20",
    location: "At Basti Branch",
    isAvailable: true,
    fee: 600,
    consultationTime: "10:00 AM - 04:00 PM"
  },
  {
    id: "3da4b9a1-8ea2-47d3-9bc4-e12345678906",
    name: "Dr. Sameer Gupta",
    specialty: "Dentistry",
    qualifications: "M.D.S. (Orthodontist)",
    experience: "7 Years",
    availabilityType: 'regular',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    visitingDate: "2026-03-01",
    location: "At Basti Branch",
    isAvailable: true,
    fee: 500,
    consultationTime: "10:30 AM - 06:30 PM"
  },
  {
    id: "3da4b9a1-8ea2-47d3-9bc4-e12345678907",
    name: "Dr. Vijay Pratap",
    specialty: "Critical Care",
    qualifications: "M.D. (Anesthesia & Critical Care)",
    experience: "14 Years",
    availabilityType: 'regular',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    visitingDate: "2026-03-01",
    location: "At Basti Branch",
    isAvailable: true,
    fee: 600,
    consultationTime: "10:00 AM - 06:00 PM"
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "6ef4b1c2-9da2-4b21-8ecb-999999111111",
    name: "Ramesh Kumar",
    rating: 5,
    review: "Excellent service and very knowledgeable doctors. The diagnostic facilities in Basti branch are top-notch.",
  },
  {
    id: "6ef4b1c2-9da2-4b21-8ecb-999999222222",
    name: "Suman Singh",
    rating: 5,
    review: "Convenient scheduling and very friendly staff. I didn't have to travel to Lucknow for my checkup.",
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'a90e3cd1-90fa-40ca-9e0c-111111111111',
    name: 'Rheumatology',
    headOfDepartment: 'Dr. Sundeep Upadhyay',
    description: 'Expertise in joint pains, arthritis, and autoimmune disorders.'
  },
  {
    id: 'a90e3cd1-90fa-40ca-9e0c-222222222222',
    name: 'Endocrinology',
    headOfDepartment: 'Dr. Shubhadeep Paul',
    description: 'Specialized care for diabetes, thyroid, and metabolic health.'
  },
  {
    id: 'a90e3cd1-90fa-40ca-9e0c-333333333333',
    name: 'Nephrology',
    headOfDepartment: 'Dr. Shahzad Alam',
    description: 'Advanced kidney care, dialysis, and transplant support.'
  },
  {
    id: 'a90e3cd1-90fa-40ca-9e0c-444444444444',
    name: 'Oncology',
    headOfDepartment: 'Dr. A.K. Jain',
    description: 'Early screening, diagnosis, and oncology consultations.'
  }
];

export const INITIAL_HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: 'e123fcbe-8067-4d82-8bc1-111111111111',
    name: 'Apollo Primary Health Check UP',
    actualPrice: 2721,
    offerPrice: 1499,
    totalTests: 68,
    tests: ['CBC', 'LFT', 'KFT', 'Urine Routine', 'Sugar Fasting', 'Lipid Profile', 'ESR', 'TSH', 'Blood Pressure'],
    discountBadge: '10% Discount on Home collection',
    description: 'Basic full-body checkup package.',
  },
  {
    id: 'e123fcbe-8067-4d82-8bc1-222222222222',
    name: 'Apollo Whole Body Health Check UP',
    actualPrice: 4228,
    offerPrice: 2099,
    totalTests: 80,
    tests: ['CBC', 'Sugar Fasting', 'Urine R/M', 'Lipid Profile', 'LFT', 'KFT', 'Blood Pressure', 'Calcium', 'HbA1c', 'ECG', 'ESR', 'Sodium', 'Potassium', 'Chloride', 'Thyroid Profile'],
    discountBadge: '10% Discount on Home collection',
    description: 'Comprehensive whole-body checkup package.',
  },
  {
    id: 'e123fcbe-8067-4d82-8bc1-333333333333',
    name: 'Apollo Executive Health Check UP',
    actualPrice: 6625,
    offerPrice: 3299,
    totalTests: 90,
    tests: ['CBC', 'LFT', 'KFT', 'Urine Routine', 'Sugar Fasting', 'Calcium', 'Lipid Profile', 'OPD Consultation', 'Sodium', 'Vitamin B12', 'Vitamin D, 25-Hydroxy', 'ECG', 'HbA1c', 'Potassium', 'Chloride', 'Blood Pressure', 'ESR'],
    discountBadge: '10% Discount on Home collection',
    description: 'Advanced executive health screening with doctor consultation.',
  }
];
