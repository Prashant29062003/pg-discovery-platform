'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down more than 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Scroll to Top FAB - Show on all devices when scrolled */}
      <Button
        onClick={scrollToTop}
        className={cn(
          "fixed right-4 bottom-4 z-40 w-12 h-12 rounded-full shadow-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300",
          // Animate in/out based on scroll position
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
        )}
        size="icon"
        title="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </Button>
    </>
  );
}
