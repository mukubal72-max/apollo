import React from 'react';
import { motion } from 'motion/react';

export default function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1581595221475-ad663b52bc5b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1538108197017-c1a986ded3d7?auto=format&fit=crop&q=80&w=800",
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-8">
        <div className="mb-12 md:mb-20 text-center md:text-left">
          <span className="text-[10px] font-black uppercase text-secondary tracking-[0.2em] mb-4 block">Visual Tour</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">
            Our <span className="text-primary">Facilities</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Take a look at our state-of-the-art clinic facilities and advanced medical departments in Basti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative h-[300px] md:h-[400px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-xl border border-slate-200 bg-white"
            >
              <img 
                src={img} 
                alt={`Clinic ${i}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                <p className="text-white font-black uppercase tracking-widest text-xs">Apollo Clinic Basti Infrastructure</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
