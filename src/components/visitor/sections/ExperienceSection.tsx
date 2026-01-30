"use client";

import { motion, Variants } from "framer-motion";
import { ImageWithFallback } from "@/components/common/utils/ImageWithFallback";
import {
    Users2,
    Wallet2,
    MapPin,
    PiggyBank,
    ShieldCheck,
    ArrowUpRight,
    Sparkles
} from "lucide-react";

const FALLBACK_IMAGES = {
    room: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
    community: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
};

const experiences = [
    {
        icon: <Users2 className="h-5 w-5" />,
        title: "Community of Peers",
        desc: "Curated social circles for ambitious students & professionals.",
        color: "text-blue-600",
        bg: "bg-blue-500/10"
    },
    {
        icon: <Wallet2 className="h-5 w-5" />,
        title: "All-Inclusive Rent",
        desc: "One bill covers high-speed WiFi, AC, laundry, and maintenance.",
        color: "text-orange-600",
        bg: "bg-orange-500/10"
    },
    {
        icon: <MapPin className="h-5 w-5" />,
        title: "Prime Locations",
        desc: "Walking distance of major tech parks & transit hubs.",
        color: "text-emerald-600",
        bg: "bg-emerald-500/10"
    },
    {
        icon: <PiggyBank className="h-5 w-5" />,
        title: "Financial Ease",
        desc: "Zero brokerage fees and standard 1-month security deposit.",
        color: "text-purple-600",
        bg: "bg-purple-500/10"
    }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ExperienceSection() {
    return (
        <section id="experience" className="relative bg-background py-20 lg:py-32 overflow-hidden transition-colors">
            {/* Subtle Background Glow for UX */}
            <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/5 blur-[120px] rounded-full" />
            
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT SIDE: Visual Storytelling (Desktop: Order 1, Mobile: Order 2) */}
                    <div className="relative order-2 lg:order-1 mt-12 lg:mt-0">
                        <div className="grid grid-cols-12 gap-3 md:gap-4">
                            {/* Main Large Image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="col-span-8 md:col-span-7 relative h-[380px] md:h-[550px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden group shadow-2xl"
                            >
                                <ImageWithFallback
                                    src={FALLBACK_IMAGES.room}
                                    alt="Luxury Room"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </motion.div>

                            {/* Side Stack */}
                            <div className="col-span-4 md:col-span-5 flex flex-col gap-3 md:gap-4">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="relative h-1/2 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-lg"
                                >
                                    <ImageWithFallback
                                        src={FALLBACK_IMAGES.community}
                                        alt="Community"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="relative h-1/2 rounded-[1.5rem] md:rounded-[2.5rem] bg-orange-600 p-5 md:p-8 text-white flex flex-col justify-between overflow-hidden shadow-xl"
                                >
                                    <div className="relative z-10">
                                        <p className="text-3xl md:text-5xl font-black tracking-tight">100+</p>
                                        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-orange-100/80 mt-1">Verified Members</p>
                                    </div>
                                    <ArrowUpRight className="h-5 w-5 text-white/40 self-end" />
                                    {/* Abstract background shape */}
                                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Floating Trust Badge - Hidden on very small screens for better UX */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="absolute -bottom-6 -left-2 md:-left-12 bg-card/95 backdrop-blur-md p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-xl border border-border flex items-center gap-4 z-20"
                        >
                            <div className="h-10 w-10 md:h-12 md:w-12 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                                <ShieldCheck className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <div>
                                <p className="font-bold text-foreground text-sm md:text-base">Premium Security</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Verified Sanctuary</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT SIDE: Content (Desktop: Order 2, Mobile: Order 1) */}
                    <div className="order-1 lg:order-2">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="space-y-6 md:space-y-8"
                        >
                            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/20">
                                <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                                <span className="text-orange-700 dark:text-orange-400 text-[10px] font-bold uppercase tracking-widest">The Elite Standard</span>
                            </motion.div>

                            <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] text-balance">
                                Not just a PG, <br />
                                <span className="text-orange-600 dark:text-orange-500 italic font-medium">your sanctuary.</span>
                            </motion.h2>
                            
                            <motion.p variants={itemVariants} className="text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed font-medium text-pretty">
                                Elevate your living experience with high-end hospitality and a community designed for high-performers.
                            </motion.p>

                            {/* EXPERIENCE GRID */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                                {experiences.map((exp, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{ y: -4 }}
                                        className="p-6 rounded-3xl bg-muted/50 border border-border hover:bg-card transition-all duration-300 group shadow-sm hover:shadow-xl"
                                    >
                                        <div className={`h-10 w-10 rounded-xl ${exp.bg} ${exp.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            {exp.icon}
                                        </div>
                                        <h4 className="font-bold text-foreground text-md mb-1.5">{exp.title}</h4>
                                        <p className="text-xs text-muted-foreground leading-normal">{exp.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}