"use client";

import { useState } from "react";
import { MapPin, Phone, ExternalLink, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SITE_CONFIG } from "@/config";
import { motion } from "framer-motion";

export default function LocationSection() {
    const [isMapActive, setIsMapActive] = useState(false);
    const googleMapsUrl = SITE_CONFIG.mapUrl;
    
    /**
     * PRO TIP: To get the best "Street Mode" look:
     * 1. Ensure your embedUrl in constants has `&maptype=roadmap`
     * 2. Ensure zoom is set to `&z=16`
     */
    const embedUrl = SITE_CONFIG.embedMapUrl;

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
                            Noble Enclave, Gali No. 6, Palam Vihar, Gurugram
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

                {/* Map Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative h-[500px] lg:h-[650px] w-full rounded-[2.5rem] lg:rounded-[4rem] overflow-hidden shadow-2xl border-4 lg:border-[12px] border-border bg-muted group"
                >
                    {/* Interaction Overlay */}
                    {!isMapActive && (
                        <div
                            className="absolute inset-0 z-20 bg-foreground/5 backdrop-blur-[1px] cursor-pointer flex flex-col items-center justify-center transition-all group-hover:bg-foreground/10"
                            onClick={() => setIsMapActive(true)}
                        >
                            <div className="bg-card/90 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-border scale-100 group-hover:scale-110 transition-transform duration-500">
                                <MousePointer2 className="h-5 w-5 text-orange-600" />
                                <span className="font-bold text-sm tracking-tight text-foreground">Interact with Street Map</span>
                            </div>
                        </div>
                    )}

                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        title="Location Map"
                        className={cn(
                            "w-full h-full transition-all duration-1000",
                            // Enhanced Street Mode Dark Filter
                            "dark:invert dark:hue-rotate-180 dark:brightness-[0.7] dark:contrast-[1.2] dark:grayscale-[0.2]",
                            !isMapActive ? "pointer-events-none" : "pointer-events-auto"
                        )}
                    ></iframe>

                    {/* Floating Premium Contact Card */}
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-auto z-30">
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
                            className="bg-card/70 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-border max-w-sm relative overflow-hidden"
                        >
                            {/* Accent Decoration */}
                            <div className="absolute top-0 right-0 h-24 w-24 bg-orange-600/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                            
                            <h4 className="font-black text-foreground text-2xl tracking-tighter">The Elite Venue</h4>
                            <p className="text-[10px] text-orange-600 dark:text-orange-500 mt-1 uppercase tracking-[0.3em] font-black opacity-80">
                                Managed Luxury Living
                            </p>

                            <div className="mt-8 space-y-2">
                                <a
                                    href={`tel:${SITE_CONFIG.supportPhone}`}
                                    className="group/btn flex items-center gap-5 p-3 -ml-3 rounded-3xl transition-all hover:bg-accent"
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-600/40 group-hover/btn:rotate-12 transition-all">
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