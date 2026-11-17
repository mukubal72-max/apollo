import apolloBannerImg from './APOLLO_Banner_0ed0eadc.jpeg';
import apolloLogoImg from './Apollo_Logo_3d24d242.PNG';
import apolloNeuroImg from './Apollo_Neuro_d157e19e.jpeg';
import apolloDentalImg from './Apollo_Dental_b9814089.jpeg';
import apolloGynnoImg from './Apollo_Gynno_f9d7aea8.jpeg';
import apolloChildImg from './Apollo_Child__1__e7446587.jpeg';
import apolloGenPhysicianImg from './Apollo_Gen_Physician_e09ab5f4.jpeg';
import apolloOpdImg from './Apollo_OPD__1__c3ebad57.jpeg';
import apolloHealthPackagesImg from './Apolloo_health_check_packages_6b14f49a.jpeg';

export {
  apolloBannerImg,
  apolloLogoImg,
  apolloNeuroImg,
  apolloDentalImg,
  apolloGynnoImg,
  apolloChildImg,
  apolloGenPhysicianImg,
  apolloOpdImg,
  apolloHealthPackagesImg,
};

export const GALLERY_POSTER_ASSETS: string[] = [
  apolloNeuroImg,
  apolloDentalImg,
  apolloGynnoImg,
  apolloChildImg,
  apolloGenPhysicianImg,
  apolloOpdImg,
  apolloHealthPackagesImg,
];

export const GALLERY_POSTER_KEYS = [
  'Apollo_Neuro',
  'Apollo_Dental',
  'Apollo_Gynno',
  'Apollo_Child',
  'Apollo_Gen_Physician',
  'Apollo_OPD',
  'Apolloo_health_check_packages',
];

export function isGalleryDoctorPosterUrl(url?: string): boolean {
  if (!url) return false;
  return GALLERY_POSTER_KEYS.some((k) => url.includes(k)) || url.includes('basti_hero_banner_');
}

/**
 * Resolves stored paths (including legacy /assets/aistudio/... paths from DB)
 * to Vite-bundled asset URLs so images always render in dev and production/live servers.
 */
export function resolveClinicAsset(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Keep base64 data URIs and external HTTPS URLs (except legacy unsplash) untouched
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  if (trimmed.includes('APOLLO_Banner')) return apolloBannerImg;
  if (trimmed.includes('Apollo_Logo')) return apolloLogoImg;
  if (trimmed.includes('Apollo_Neuro')) return apolloNeuroImg;
  if (trimmed.includes('Apollo_Dental')) return apolloDentalImg;
  if (trimmed.includes('Apollo_Gynno')) return apolloGynnoImg;
  if (trimmed.includes('Apollo_Child')) return apolloChildImg;
  if (trimmed.includes('Apollo_Gen_Physician')) return apolloGenPhysicianImg;
  if (trimmed.includes('Apollo_OPD')) return apolloOpdImg;
  if (trimmed.includes('Apolloo_health_check_packages')) return apolloHealthPackagesImg;

  return trimmed;
}
