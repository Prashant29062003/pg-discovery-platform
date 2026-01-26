"use client";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

// Main branding page sections - IDs match actual page sections
const mainSections = [
  { id: "hero", label: "Hero" },
  { id: "promise", label: "Our Promise" },
  { id: "locations", label: "Cities" },
  { id: "experience", label: "Experience" },
  { id: "venue", label: "Location" },
  { id: "branches", label: "Neighbourhoods" },
  { id: "accordion", label: "FAQ" },
  { id: "testimonials", label: "Testimonials" },
];

// Visitor dashboard sections - professional naming with semantic IDs
const visitorSections = [
  { id: "dashboard-header", label: "Dashboard" },
  { id: "enquiries", label: "My Enquiries" },
  { id: "saved", label: "Saved Properties" },
  { id: "profile", label: "Profile Settings" },
];

interface DotNavProps {
  variant?: "main" | "visitor";
}

export default function ScrollProgressNav({ variant = "main" }: DotNavProps) {
  const sections = variant === "visitor" ? visitorSections : mainSections;
  const [active, setActive] = useState("hero");
  const [showLabels, setShowLabels] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setShowLabels(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowLabels(false), 4000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 300;
      
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          if (active !== section.id) {
            setActive(section.id);
            startTimer();
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    startTimer();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active]);

  return (
    <nav 
      aria-label="Side Navigation"
      className="fixed right-5 lg:right-10 top-1/2 -translate-y-1/2 z-[100] hidden sm:flex flex-col gap-5"
    >
      {sections.map((s, index) => {
        const isActive = active === s.id;
        
        return (
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            key={s.id}
            href={`#${s.id}`}
            className="group relative flex items-center justify-end"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {/* Professional Tooltip Label */}
            <span className={cn(
              "absolute right-12 px-4 py-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl",
              "text-zinc-900 dark:text-white text-[11px] font-bold tracking-widest uppercase",
              "border border-zinc-200/50 dark:border-white/10 shadow-2xl transition-all duration-500",
              "pointer-events-none select-none whitespace-nowrap",
              (isActive && showLabels)
                ? "opacity-100 translate-x-0 scale-100" 
                : "opacity-0 translate-x-4 scale-90 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100"
            )}>
              {s.label}
            </span>
            
            {/* The Interactive Dot Structure */}
            <div className="relative flex items-center justify-center h-6 w-6">
              {/* Active Progress Ring (SVG) */}
              <AnimatePresence>
                {isActive && (
                  <motion.svg
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-orange-500/20"
                    />
                    <motion.circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="63"
                      initial={{ strokeDashoffset: 63 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="text-orange-600"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>

              {/* Central Core Dot */}
              <div className={cn(
                "rounded-full transition-all duration-500 z-10",
                isActive 
                  ? "h-2 w-2 bg-orange-600" 
                  : "h-1.5 w-1.5 bg-zinc-400 group-hover:bg-orange-400 group-hover:scale-150"
              )} />
              
              {/* Hover Pulse Effect */}
              {!isActive && (
                <div className="absolute inset-0 rounded-full bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors duration-300" />
              )}
            </div>
          </motion.a>
        );
      })}
    </nav>
  );
}