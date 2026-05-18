
export interface OPDDoctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: string;
  departmentId?: string;
  availabilityType: 'regular' | 'visiting';
  availableDays?: string[]; // ['Monday', 'Wednesday']
  visitingDate: string;
  location: string;
  photo?: string; // Base64 or URL
  isAvailable: boolean;
  expiryDate?: string; // YYYY-MM-DD
  fee?: number;
  consultationTime?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientWhatsapp?: string;
  patientAddress?: string;
  doctorId: string; // Can be a Doctor ID or a Package ID
  date: string;
  time?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  type: 'doctor' | 'package';
  isHomeCollection?: boolean;
  claimOffer?: boolean;
  finalPrice?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  photo?: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  actualPrice: number;
  offerPrice: number;
  totalTests: number;
  tests: string[];
  description?: string;
  discountBadge?: string;
}

export interface Department {
  id: string;
  name: string;
  headOfDepartment: string;
  description: string;
  iconName?: string;
}

export interface ClinicDocument {
  id: string;
  name: string;
  fileData: string; // Base64 or URL
  uploadDate: string;
}

export interface PromotionPopup {
  enabled: boolean;
  title: string;
  description: string;
  offerText: string;
}

export interface SiteConfig {
  name: string;
  location: string;
  contact: string;
  email: string;
  logo?: string; // Base64 or URL
  posters?: string[]; // Array of Base64 strings for clinical posters
  promotionPopup?: PromotionPopup;
}
