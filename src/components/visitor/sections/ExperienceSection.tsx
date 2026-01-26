"use client";

import { motion } from "framer-motion";
import { ImageWithFallback } from "@/components/common/utils/ImageWithFallback";
import {
    Users2,
    Wallet2,
    MapPin,
    PiggyBank,
    ShieldCheck,
    Star,
    ArrowUpRight
} from "lucide-react";

const FALLBACK_IMAGES = {
    room: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
    community: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
};

const experiences = [
    {
        icon: <Users2 className="h-5 w-5" />,
        title: "Community of Peers",
        desc: "Curated social circles for ambitious students & working professionals."
    },
    {
        icon: <Wallet2 className="h-5 w-5" />,
        title: "All-Inclusive Rent",
        desc: "One bill covers high-speed WiFi, AC, laundry, and daily maintenance."
    },
    {
        icon: <MapPin className="h-5 w-5" />,
        title: "Prime Locations",
        desc: "Strategic placement within walking distance of major tech parks & metros."
    },
    {
        icon: <PiggyBank className="h-5 w-5" />,
        title: "Financial Ease",
        desc: "Zero brokerage fees and a standard 1-month security deposit policy."
    }
];

// Animation Variants - Proper Framer Motion typing
const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { 
            staggerChildren: 0.15, 
            delayChildren: 0.3 
        }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            duration: 0.6
        } 
    }
};

export default function ExperienceSection() {
    return (
        <section id="experience" className="bg-gradient-to-b from-white via-zinc-50 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900/50 dark:to-zinc-900/50 py-24 lg:py-32 transition-colors duration-500 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* LEFT SIDE: Visual Storytelling */}
                    <div className="relative order-2 lg:order-1">
                        <div className="grid grid-cols-12 gap-4">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className="col-span-7 relative h-[350px] md:h-[520px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden group shadow-2xl border border-zinc-200/20"
                            >
                                <ImageWithFallback
                                    src={FALLBACK_IMAGES.room}
                                    alt="Luxury Room Interior"
                                    fallbackType="generic"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                            </motion.div>

                            <div className="col-span-5 space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: -30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className="relative h-[160px] md:h-[250px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-lg"
                                >
                                    <ImageWithFallback
                                        src={FALLBACK_IMAGES.community}
                                        alt="Co-living Community"
                                        fallbackType="generic"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="relative h-[174px] md:h-[254px] rounded-[2rem] md:rounded-[3rem] bg-orange-600 p-8 text-white flex flex-col justify-between overflow-hidden shadow-xl"
                                >
                                    <div className="relative z-10">
                                        <p className="text-5xl font-black tracking-tighter leading-none font-sans">100+</p>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-100/90 mt-3">Verified Members</p>
                                    </div>
                                    <ArrowUpRight className="relative z-10 h-6 w-6 text-white/50 self-end" />
                                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Floating Trust Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7 }}
                            className="absolute -bottom-6 left-4 md:-left-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/40 dark:border-white/5 flex items-center gap-4 z-20"
                        >
                            <div className="h-12 w-12 bg-zinc-900 dark:bg-orange-600 rounded-2xl flex items-center justify-center text-white">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-white text-base">Premium Security</p>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Verified Sanctuary</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT SIDE: Content */}
                    <div className="order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                                    ))}
                                </div>
                                <span className="text-zinc-800 dark:text-zinc-300 text-[10px] font-black uppercase tracking-[0.2em]">The Elite Standard</span>
                            </div>

                            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.05]">
                                Not just a PG, <br />
                                <span className="text-orange-600 font-normal opacity-90">your sanctuary.</span>
                            </h2>
                            
                            <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
                                Elevate your living experience with high-end hospitality and a community designed for high-performers.
                            </p>
                        </motion.div>

                        {/* EXPERIENCE GRID: Fixed Variant Implementation */}
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-14"
                        >
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants} // Inherits from parent
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className="p-7 rounded-[2.5rem] bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-white/5 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 group relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm text-orange-600 flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                                            {exp.icon}
                                        </div>
                                        <h4 className="font-bold text-zinc-900 dark:text-white text-lg mb-2">{exp.title}</h4>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{exp.desc}</p>
                                    </div>
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 blur-2xl" />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}