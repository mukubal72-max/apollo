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
    id: "1",
    name: "Dr. Sundeep Upadhyay",
    specialty: "Joint Pain and Rheumatic Disorders",
    qualifications: "D.M. (Rheumatology)",
    experience: "15 Years",
    visitingDate: "12, 13 & 26, 27 Mar",
    location: "At Basti Branch",
    isAvailable: true,
    expiryDate: "2026-03-27",
  },
  {
    id: "2",
    name: "Dr. Shubhadeep Paul",
    specialty: "Endocrinology",
    qualifications: "D.M. (Endocrinology)",
    experience: "12 Years",
    visitingDate: "7, 8 Feb & 21, 22 Mar",
    location: "At Basti Branch",
    isAvailable: true,
    expiryDate: "2026-03-22",
  },
  {
    id: "3",
    name: "Dr. Shahzad Alam",
    specialty: "Kidney Diseases & Transplant",
    qualifications: "D.M. (Nephrologist)",
    experience: "10 Years",
    visitingDate: "7, & 21 Mar",
    location: "At Basti Branch",
    isAvailable: true,
    expiryDate: "2026-03-21",
  },
  {
    id: "4",
    name: "Dr. A.K. Jain",
    specialty: "Cancer Care (Oncology)",
    qualifications: "M.D., D.M. (Oncology)",
    experience: "20 Years",
    visitingDate: "15 & 30 May",
    location: "At Basti Branch",
    isAvailable: true,
    expiryDate: "2026-05-30",
  },
  {
    id: "5",
    name: "Dr. Ritu Singh",
    specialty: "ENT (Ear, Nose, Throat)",
    qualifications: "M.S. (ENT)",
    experience: "8 Years",
    visitingDate: "Every Wednesday",
    location: "At Basti Branch",
    isAvailable: true,
  },
  {
    id: "6",
    name: "Dr. Sameer Gupta",
    specialty: "Dentistry",
    qualifications: "M.D.S. (Orthodontist)",
    experience: "7 Years",
    visitingDate: "Daily Service",
    location: "At Basti Branch",
    isAvailable: true,
  },
  {
    id: "7",
    name: "Dr. Vijay Pratap",
    specialty: "Critical Care",
    qualifications: "M.D. (Anesthesia & Critical Care)",
    experience: "14 Years",
    visitingDate: "Always Available",
    location: "At Basti Branch",
    isAvailable: true,
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Ramesh Kumar",
    rating: 5,
    review: "Excellent service and very knowledgeable doctors. The diagnostic facilities in Basti branch are top-notch.",
  },
  {
    id: "2",
    name: "Suman Singh",
    rating: 5,
    review: "Convenient scheduling and very friendly staff. I didn't have to travel to Lucknow for my checkup.",
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: '1',
    name: 'Rheumatology',
    headOfDepartment: 'Dr. Sundeep Upadhyay',
    description: 'Expertise in joint pains, arthritis, and autoimmune disorders.'
  },
  {
    id: '2',
    name: 'Endocrinology',
    headOfDepartment: 'Dr. Shubhadeep Paul',
    description: 'Specialized care for diabetes, thyroid, and metabolic health.'
  },
  {
    id: '3',
    name: 'Nephrology',
    headOfDepartment: 'Dr. Shahzad Alam',
    description: 'Advanced kidney care, dialysis, and transplant support.'
  },
  {
    id: '4',
    name: 'Oncology',
    headOfDepartment: 'Dr. A.K. Jain',
    description: 'Early screening, diagnosis, and oncology consultations.'
  }
];

export const INITIAL_HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: 'hp1',
    name: 'Apollo Primary Health Check UP',
    actualPrice: 2721,
    offerPrice: 1499,
    totalTests: 68,
    tests: ['CBC', 'LFT', 'KFT', 'Urine Routine', 'Sugar Fasting', 'Lipid Profile', 'ESR', 'TSH', 'Blood Pressure'],
    discountBadge: '10% Discount on Home collection',
  },
  {
    id: 'hp2',
    name: 'Apollo Whole Body Health Check UP',
    actualPrice: 4228,
    offerPrice: 2099,
    totalTests: 80,
    tests: ['CBC', 'Sugar Fasting', 'Urine R/M', 'Lipid Profile', 'LFT', 'KFT', 'Blood Pressure', 'Calcium', 'HbA1c', 'ECG', 'ESR', 'Sodium', 'Potassium', 'Chloride', 'Thyroid Profile'],
    discountBadge: '10% Discount on Home collection',
  },
  {
    id: 'hp3',
    name: 'Apollo Executive Health Check UP',
    actualPrice: 6625,
    offerPrice: 3299,
    totalTests: 90,
    tests: ['CBC', 'LFT', 'KFT', 'Urine Routine', 'Sugar Fasting', 'Calcium', 'Lipid Profile', 'OPD Consultation', 'Sodium', 'Vitamin B12', 'Vitamin D, 25-Hydroxy', 'ECG', 'HbA1c', 'Potassium', 'Chloride', 'Blood Pressure', 'ESR'],
    discountBadge: '10% Discount on Home collection',
  }
];
