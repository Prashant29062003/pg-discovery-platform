"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, ExternalLink, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SITE_CONFIG } from "@/config";
import { motion } from "framer-motion";

export default function LocationSection() {
    const [isMapActive, setIsMapActive] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [shouldLoadMap, setShouldLoadMap] = useState(false);
    
    const googleMapsUrl = SITE_CONFIG.mapUrl;
    const embedUrl = SITE_CONFIG.embedMapUrl;

    // Lazy load map only when user scrolls near it or clicks to interact
    useEffect(() => {
        const handleScroll = () => {
            const mapSection = document.getElementById('location-map-section');
            if (mapSection) {
                const rect = mapSection.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight + 500; // Load 500px before visible
                if (isVisible && !shouldLoadMap) {
                    setShouldLoadMap(true);
                }
            }
        };

        // Initial check
        handleScroll();
        
        // Add scroll listener with throttling
        let scrollTimeout: NodeJS.Timeout;
        const throttledHandleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 100);
        };
        
        window.addEventListener('scroll', throttledHandleScroll);
        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [shouldLoadMap]);

    const handleMapInteraction = () => {
        if (!shouldLoadMap) {
            setShouldLoadMap(true);
        }
        setIsMapActive(true);
    };

    return (
        <section id="location" className="relative w-full py-24 lg:py-32 px-6 lg:px-14 bg-gradient-to-b from-background to-card transition-colors duration-500 overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-widest">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            Prime Location
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                            Reach Us
                        </h2>
                        <p className="text-muted-foreground flex items-center gap-2 text-lg lg:text-xl italic">
                            <MapPin className="h-6 w-6 text-orange-600 shrink-0 not-italic" />
                            {SITE_CONFIG.address}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Button variant="outline" size="lg" className="rounded-2xl border-border bg-card text-foreground h-14 px-8 text-base font-bold shadow-sm hover:shadow-md transition-all active:scale-95 group" asChild>
                            <Link href={googleMapsUrl} target="_blank">
                                Open in Google Maps 
                                <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Optimized Map Container */}
                <motion.div
                    id="location-map-section"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative h-[500px] lg:h-[650px] w-full rounded-[2.5rem] lg:rounded-[4rem] overflow-hidden shadow-2xl border-4 lg:border-[12px] border-border bg-muted group"
                >
                    {/* Loading State */}
                    {!shouldLoadMap && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    Interactive Map
                                </h3>
                                <p className="text-muted-foreground mb-4 max-w-sm">
                                    Scroll down or click to load the interactive map
                                </p>
                                <Button 
                                    onClick={handleMapInteraction}
                                    className="bg-zinc-900 hover:bg-zinc-800 text-white"
                                >
                                    Load Map
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Map Loading Indicator */}
                    {shouldLoadMap && !isMapLoaded && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted">
                            <div className="text-center">
                                <div className="w-12 h-12 border-4 border-zinc-300 border-t-zinc-600 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Loading map...</p>
                            </div>
                        </div>
                    )}

                    {/* Interaction Overlay - Only show when map is loaded but not active */}
                    {shouldLoadMap && isMapLoaded && !isMapActive && (
                        <div
                            className="absolute inset-0 z-20 bg-foreground/5 backdrop-blur-[1px] cursor-pointer flex flex-col items-center justify-center transition-all group-hover:bg-foreground/10"
                            onClick={handleMapInteraction}
                        >
                            <div className="bg-card/90 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-border scale-100 group-hover:scale-110 transition-transform duration-500">
                                <MousePointer2 className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                                <span className="font-bold text-sm tracking-tight text-foreground">Interact with Street Map</span>
                            </div>
                        </div>
                    )}

                    {/* Optimized Map Iframe */}
                    {shouldLoadMap && (
                        <iframe
                            src={embedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            onLoad={() => setIsMapLoaded(true)}
                            title="Location Map"
                            className={cn(
                                "w-full h-full transition-all duration-1000",
                                // Enhanced Street Mode Dark Filter
                                "dark:invert dark:hue-rotate-180 dark:brightness-[0.7] dark:contrast-[1.2] dark:grayscale-[0.2]",
                                !isMapActive ? "pointer-events-none" : "pointer-events-auto",
                                !isMapLoaded ? "opacity-0" : "opacity-100"
                            )}
                        ></iframe>
                    )}

                    {/* Floating Premium Contact Card - Hide on mobile, show only on desktop */}
                    {isMapLoaded && (
                        <div className="hidden lg:block absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-auto z-30">
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
                                className="bg-card/70 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border max-w-sm relative overflow-hidden"
                            >
                                {/* Accent Decoration */}
                                <div className="absolute top-0 right-0 h-24 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full -mr-12 -mt-12 blur-2xl" />
                                
                                <h4 className="font-black text-foreground text-2xl tracking-tighter">The Elite Venue</h4>
                                <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-1 uppercase tracking-[0.3em] font-black opacity-80">
                                    Managed Luxury Living
                                </p>

                                <div className="mt-8 space-y-2">
                                    <a
                                        href={`tel:${SITE_CONFIG.supportPhone}`}
                                        className="group/btn flex items-center gap-5 p-3 -ml-3 rounded-3xl transition-all hover:bg-accent"
                                    >
                                        <div className="h-12 w-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-lg shadow-zinc-900/20 group-hover/btn:rotate-12 transition-all">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em]">24/7 Support</p>
                                            <p className="font-bold text-foreground text-lg">
                                                {SITE_CONFIG.supportPhone}
                                            </p>
                                        </div>
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Mobile Contact Bar - Fixed at bottom on mobile only */}
                    {isMapLoaded && (
                        <div className="lg:hidden absolute bottom-0 left-0 right-0 z-30">
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
                                className="bg-card/95 backdrop-blur-3xl border-t border-border p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-black text-foreground text-sm tracking-tighter">The Elite Venue</h4>
                                        <p className="text-[8px] text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.2em] font-black opacity-80">
                                            {SITE_CONFIG.address}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={`tel:${SITE_CONFIG.supportPhone}`}
                                            className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-lg shadow-zinc-900/20 hover:rotate-12 transition-all"
                                        >
                                            <Phone className="h-4 w-4" />
                                        </a>
                                        <Button
                                            onClick={() => window.open(googleMapsUrl, '_blank')}
                                            size="sm"
                                            className="h-10 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all"
                                        >
                                            <MapPin className="w-3 h-3 mr-1" />
                                            Maps
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Professional Vignette Overlay */}
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_100px_rgba(255,255,255,0.05)] rounded-[2.5rem] lg:rounded-[4rem]"></div>
                </motion.div>
            </div>
        </section>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}