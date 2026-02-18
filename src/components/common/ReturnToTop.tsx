"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReturnToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Debounce scroll handling
      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        
        // Determine scroll direction (with threshold to avoid rapid changes)
        const scrollDelta = currentScrollY - lastScrollY;
        if (Math.abs(scrollDelta) > 5) { // Only update if significant scroll
          const newDirection = scrollDelta > 0 ? 'down' : 'up';
          
          if (newDirection !== scrollDirection) {
            setScrollDirection(newDirection);
          }
          setLastScrollY(currentScrollY);
        }
        
        // Show button when scrolling up and past 300px
        const shouldShow = currentScrollY > 300 && scrollDirection === 'up';
        
        if (shouldShow !== isVisible) {
          setIsVisible(shouldShow);
        }
      }, 100); // 100ms debounce
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastScrollY, scrollDirection, isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.5
          }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button
            onClick={scrollToTop}
            size="lg"
            className="rounded-full w-12 h-12 bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="Return to top"
          >
            <ChevronUp className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform duration-300" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
