import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

import { MapPin as MapPinIcon } from 'lucide-react';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface GoogleMapProps {
  className?: string;
}

const CLINIC_LOCATION = { lat: 26.799538365020165, lng: 82.76342897521197 };

export default function GoogleMap({ className }: GoogleMapProps) {
  if (!hasValidKey) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
          alt="Clinic Location Map Placeholder"
          className="w-full h-full object-cover opacity-60 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 backdrop-blur-[2px] p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg text-primary scale-110">
            <MapPinIcon size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase text-primary tracking-tight">Apollo Clinic Basti</h2>
          <p className="text-sm text-slate-900 font-bold uppercase tracking-wider mt-1">Founders Place, Katra Road, Basti</p>
          <a 
            href="https://www.google.com/maps?rlz=1C1JJTC_enIN1094IN1094&gs_lcrp=EgZjaHJvbWUqCAgBEAAYFhgeMgYIABBFGDkyCAgBEAAYFhgeMggIAhAAGBYYHjIICAMQABgWGB4yCAgEEAAYFhgeMgYIBRBFGD0yBggGEEUYPTIGCAcQRRg80gEJMTA1MDdqMGo3qAIAsAIA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KSlZDOiA0ZA5MeI7cOrvIN2e&daddr=Railway+Station+Rd,+near+Navin+Fal+Mandi,+Basti,+Uttar+Pradesh+272001" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 px-8 py-3 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            View on Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={CLINIC_LOCATION}
          defaultZoom={17}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          className="w-full h-full"
          style={{ borderRadius: 'inherit' }}
        >
          <AdvancedMarker position={CLINIC_LOCATION} title="Apollo Clinic Basti">
            <Pin background="#0072bc" glyphColor="#fff" borderColor="#005d9a" />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
