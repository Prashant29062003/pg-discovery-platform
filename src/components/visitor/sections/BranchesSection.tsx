"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Navigation, MapPin } from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/common/utils/ImageWithFallback";

import { NEIGHBOURHOODS } from "@/config"

export default function BranchesSection() {
  return (
    <section id="branches" className="py-24 lg:py-32 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900/50 transition-colors duration-500 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-14">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 font-black text-xs uppercase tracking-[0.2em] mb-4"
            >
              <Navigation className="h-3.5 w-3.5 fill-current" /> Discover Areas
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
              Popular <span className="text-orange-600">Neighbourhoods.</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-6 text-lg lg:text-xl max-w-xl leading-relaxed">
              Strategically located managed homes near DLF CyberHub, Golf Course Road, and major corporate transit points.
            </p>
          </div>

          <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
            <Link href="/pgs" className="group flex items-center gap-3 text-zinc-900 dark:text-white font-bold text-lg border-b-2 border-orange-600 pb-1 transition-all">
              View all locations
              <ArrowUpRight className="h-5 w-5 text-orange-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </motion.div>
        </div>

        {/* Locations Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 auto-rows-[400px]">
          {NEIGHBOURHOODS.map((loc, i) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn("group cursor-pointer relative rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700", loc.span)}
            >
              {/* Image with Zoom Effect */}
              <div className="absolute inset-0 w-full h-full">
                <ImageWithFallback
                  src={loc.image}
                  alt={loc.name}
                  fallbackType="neighbourhood"
                  customFallback={loc.fallbackImage}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              </div>

              {/* Card Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                    <MapPin className="h-3 w-3" />
                    {loc.city}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight leading-tight">
                    {loc.name}
                  </h3>

                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl text-white text-[11px] font-black border border-white/20 uppercase tracking-widest">
                      {loc.count}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/40 ring-4 ring-orange-600/20">
                      <ArrowUpRight className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Utility for cleaner class management
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}