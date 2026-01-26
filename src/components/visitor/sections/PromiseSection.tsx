"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Utensils, Brush, Headset, Maximize } from "lucide-react";
import { ImageWithFallback } from "@/components/common/utils/ImageWithFallback";

const promises = [
  { 
    title: "Gourmet Dining", 
    desc: "Authentic North & South Indian meals prepared with locally sourced ingredients in FSSAI-standard kitchens.", 
    icon: <Utensils className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000",
    size: "lg" 
  },
  { 
    title: "Pristine Care", 
    desc: "Daily professional housekeeping ensuring your sanctuary remains spotless and refreshed.", 
    icon: <Brush className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000",
    size: "sm"
  },
  { 
    title: "Concierge Support", 
    desc: "Responsive, proactive assistance. We've mastered the art of hospitality for over 50,000 residents.", 
    icon: <Headset className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000",
    size: "sm"
  },
  { 
    title: "Fortress Safety", 
    desc: "Military-grade biometric access, 24/7 AI-monitored CCTV, and elite on-site security personnel.", 
    icon: <ShieldCheck className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1000",
    size: "lg" 
  },
  { 
    title: "Unrivaled Spaciousness", 
    desc: "Designed for freedom. Expansive common areas and oversized rooms that redefine urban co-living density.", 
    icon: <Maximize className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1000",
    size: "full" 
  },
];

export default function PromiseSection() {
  return (
    <section id="promise" className="bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 py-24 lg:py-32 transition-colors">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Editorial Header - Professional Contrast */}
        <div className="mb-20 space-y-6 max-w-3xl">
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-8 bg-orange-600" />
            <span className="text-orange-600 font-bold tracking-[0.2em] uppercase text-[10px]">
              The Living Promise
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
            Our <span className="italic font-serif font-light text-zinc-500">Uncompromising</span> Standards.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed">
            Beyond a room, we curate an ecosystem of excellence where safety, comfort, 
            and community converge into a seamless living experience.
          </p>
        </div>

        {/* Bento Grid with refined typography */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {promises.map((item, i) => (
            <motion.div
              key={item.title}
              className={`group relative overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 min-h-[400px] flex flex-col justify-end p-8
                ${item.size === "lg" ? "md:col-span-4" : ""}
                ${item.size === "sm" ? "md:col-span-2" : ""}
                ${item.size === "full" ? "md:col-span-6 min-h-[400px] lg:min-h-[500px]" : ""}
              `}
            >
              {/* Image & Overlay with Fallback */}
              <div className="absolute inset-0 z-0">
                <ImageWithFallback 
                  src={item.image} 
                  alt={item.title}
                  fallbackType="generic"
                  width={1000}
                  height={600}
                  useNextImage={true}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/20 to-transparent" />
              </div>
              
              {/* Card Content - Improved Hierarchy */}
              <div className="relative z-10">
                <div className="mb-4 h-12 w-12 rounded-xl bg-orange-600 text-white flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}