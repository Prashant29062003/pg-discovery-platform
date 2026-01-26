"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";

interface CityCardProps {
  name: string;
  description: string;
  image: string;
  fallbackImage?: string;
  count: number;
  slug: string;
}

export function CityCard({ name, description, image, fallbackImage, count, slug }: CityCardProps) {
  return (
    <Link href={`/pgs?city=${slug}`}>
      <motion.div 
        whileHover={{ y: -10 }}
        className="group relative h-[400px] w-full rounded-[2.5rem] overflow-hidden bg-zinc-200 dark:bg-zinc-800"
      >
        {/* Background Image */}
        <NextImage 
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-widest">
                <Building2 className="h-4 w-4" />
                {count} Properties
              </div>
              <h3 className="text-3xl font-bold text-white">{name}</h3>
              <p className="text-zinc-300 text-sm max-w-[200px] line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {description}
              </p>
            </div>

            {/* Circular Arrow Button */}
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-zinc-950 -rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-xl">
              <ArrowRight className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Top Glass Badge */}
        <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
          Hot Location
        </div>
      </motion.div>
    </Link>
  );
}
