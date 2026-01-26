"use client";

import NextImage from "next/image";
import { motion } from "framer-motion";
import { EVENTS } from "@/config";
import MainLayout from "@/components/layout/MainLayout";
import { Calendar, MapPin } from "lucide-react";

// Professional Fallback: A high-quality abstract community image 
const DEFAULT_EVENT_IMAGE = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop";

export default function LifeGallery() {
  return (
    <MainLayout>
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">
            Life @ EliteVenue
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            More than just a room – we build a vibrant community that celebrates 
            every milestone together.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {EVENTS.map((event, i) => {
            const hasOwnerImage = event?.image && event?.image.length > 0;
            const imageSrc = hasOwnerImage ? event?.image : DEFAULT_EVENT_IMAGE;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                  <NextImage
                    src={imageSrc}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    priority={i < 3}
                    placeholder="blur"
                    // Transparent gray shimmer effect while loading
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Xw8AAkwBPGfL96MAAAAASUVORK5CYII="
                  />
                  
                  {/* Glassmorphism Badge for Default Images */}
                  {!hasOwnerImage && (
                    <div className="absolute bottom-4 right-4 backdrop-blur-md bg-white/20 border border-white/30 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-medium">
                      Community Photo
                    </div>
                  )}

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Section */}
                <div className="mt-6 px-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 transition-colors group-hover:text-orange-500">
                    {event.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      {event.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </MainLayout>
  );
}