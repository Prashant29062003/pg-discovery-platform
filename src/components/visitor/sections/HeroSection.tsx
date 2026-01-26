"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Users, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ImageWithFallback } from "@/components/common/utils/ImageWithFallback";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-zinc-950 pt-4 lg:pt-0">
      <div className="container mx-auto px-6 lg:px-14 py-10 lg:py-20 lg:grid lg:lg:grid-cols-2 flex flex-col-reverse gap-12 items-center">
        
        {/* Left Content: Text & Actions */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 space-y-6 lg:space-y-8 order-2 lg:order-1 text-center lg:text-left"
        >
          <div className="flex justify-center lg:justify-start">
            <Badge className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-none px-4 py-1.5 text-xs lg:text-sm font-bold rounded-full">
              ✨ #1 Rated Co-living in Gurugram
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
            Elevate Your <br />
            <span className="text-orange-600 ">Living Standard.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            Experience luxury co-living designed for professionals. Fully managed 
            homes with premium amenities and a vibrant community.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 h-12 lg:h-14 text-base font-bold shadow-xl shadow-orange-600/20 w-full sm:w-auto transition-all active:scale-95"
              asChild
            >
              <Link href="/pgs">Explore PGs</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full px-8 h-12 lg:h-14 text-base border-zinc-200 dark:border-zinc-800 dark:text-white w-full sm:w-auto hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95"
            >
              <PlayCircle className="mr-2 h-5 w-5 text-orange-600" /> Virtual Tour
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="flex items-center justify-center lg:justify-start gap-6 lg:gap-8 pt-8 border-t border-zinc-100 dark:border-zinc-900">
            <div>
              <p className="text-xl lg:text-2xl font-bold text-zinc-900 dark:text-white">500+</p>
              <p className="text-[10px] lg:text-xs text-zinc-500 uppercase tracking-widest font-bold">Happy Residents</p>
            </div>
            <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div>
              <div className="flex items-center gap-1 justify-center lg:justify-start">
                <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                <p className="text-xl lg:text-2xl font-bold text-zinc-900 dark:text-white">4.9</p>
              </div>
              <p className="text-[10px] lg:text-xs text-zinc-500 uppercase tracking-widest font-bold">Google Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Right Visual Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[350px] sm:h-[450px] lg:h-[600px] w-full rounded-2xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl order-1 lg:order-2 group"
        >
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80" 
            alt="Luxury PG Room in Gurugram"
            fallbackType="generic"
            useNextImage={true}
            width={1200}
            height={800}
            priority={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-in-out will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Floating Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-4 lg:p-6 rounded-2xl lg:rounded-3xl flex items-center justify-between shadow-2xl"
          >
            <div className="flex items-center gap-3 lg:gap-4 text-white">
              <div className="bg-orange-600 p-2 lg:p-3 rounded-xl lg:rounded-2xl shrink-0 animate-pulse">
                <Users className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] lg:text-sm font-medium opacity-80 uppercase tracking-tight">Join the Elite</p>
                <p className="text-sm lg:text-base font-bold truncate">Next move-in: Oct 1st</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}