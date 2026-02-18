"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone, 
  Mail, 
  User,
  MapPin,
  Calendar,
  Clock,
  Shield,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useEnquiryStore, submitEnquiry } from "@/store/useEnquiryStore";
import { SITE_CONFIG } from "@/config/site";

export default function BetweenPageEnquiry() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const {
    currentEnquiry,
    setCurrentEnquiry,
    updateCurrentEnquiry,
    clearCurrentEnquiry,
    isSubmitting,
    setIsSubmitting
  } = useEnquiryStore();

  // Smart scroll detection with direction
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
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Determine scroll direction (with threshold to avoid rapid changes)
        const scrollDelta = currentScrollY - lastScrollY;
        if (Math.abs(scrollDelta) > 5) { // Only update if significant scroll
          const newDirection = scrollDelta > 0 ? 'down' : 'up';
          
          if (newDirection !== scrollDirection) {
            setScrollDirection(newDirection);
          }
          setLastScrollY(currentScrollY);
        }
        
        // Smart visibility logic
        const isInMiddle = currentScrollY > windowHeight * 0.3 && currentScrollY < documentHeight - windowHeight * 2;
        const shouldShow = isInMiddle && scrollDirection === 'down';
        
        if (shouldShow !== isVisible) {
          setIsVisible(shouldShow);
        }
      }, 100); // 100ms debounce
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastScrollY, scrollDirection, isVisible]);

  // Auto-save form data
  useEffect(() => {
    if (Object.keys(currentEnquiry).length > 0) {
      const timer = setTimeout(() => {
        // Auto-save logic here if needed
        console.log('Auto-saving enquiry data:', currentEnquiry);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentEnquiry]);

  const handleInputChange = (field: string, value: string) => {
    updateCurrentEnquiry({ [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await submitEnquiry(currentEnquiry, 'quick-enquiry');
      
      if (result.success) {
        setShowSuccess(true);
        toast.success("✅ Enquiry submitted successfully! We'll contact you within 2 hours.");
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setIsExpanded(false);
        }, 3000);
      } else {
        toast.error(result.error || "Failed to submit enquiry");
      }
    } catch (error) {
      toast.error("An error occurred while submitting your enquiry");
    }
  };

  const handleQuickEnquiry = (field: string, value: string) => {
    if (field === 'phone') {
      // Use the support phone from SITE_CONFIG for quick call
      updateCurrentEnquiry({ phone: SITE_CONFIG.supportPhone });
      // Initiate phone call
      window.open(`tel:${SITE_CONFIG.supportPhone}`, '_blank');
    } else {
      updateCurrentEnquiry({ [field]: value });
    }
    setIsExpanded(true);
  };

  if (!isVisible && !isExpanded) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-8 left-8 -translate-x-4 md:translate-x-10 md:left-auto md:left-8 z-50 max-w-sm md:max-w-md"
      >
        {!isExpanded ? (
          // Compact quick enquiry buttons - Professional Design
          <motion.div
            className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.1)] p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-700 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                  Quick Enquiry
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Get instant response
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Enquire Now
              </Button>
            </div>
            
            {/* Professional Quick Actions */}
            <div className="flex gap-3 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickEnquiry('phone', SITE_CONFIG.supportPhone)}
                className="flex-1 border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl p-3 transition-all duration-300 backdrop-blur-sm"
              >
                <Phone className="w-4 h-4 mx-auto mb-1" />
                <span className="text-xs font-semibold">Call Now</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickEnquiry('message', 'Interested in PG accommodation')}
                className="flex-1 border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl p-3 transition-all duration-300 backdrop-blur-sm"
              >
                <MessageCircle className="w-4 h-4 mx-auto mb-1" />
                <span className="text-xs font-semibold">Message</span>
              </Button>
            </div>
          </motion.div>
        ) : (
          // Expanded enquiry form
          <motion.div
            className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 w-full max-w-md mx-auto max-h-[70vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            style={{ 
              maxHeight: 'calc(100vh - 250px)',
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 rounded-t-2xl p-6 border-b border-zinc-200/50 dark:border-zinc-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-700 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-lg">
                      Quick Enquiry
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      We respond within 2 hours
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8 p-0 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                </Button>
              </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 text-center"
              >
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
                </div>
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">
                  Enquiry Submitted!
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  We'll contact you within 2 hours
                </p>
              </motion.div>
            )}

            {/* Form */}
            {!showSuccess && (
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      placeholder="Name *"
                      value={currentEnquiry.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="h-10 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-orange-400"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Phone *"
                      type="tel"
                      value={currentEnquiry.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="h-10 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-orange-400"
                      required
                    />
                  </div>
                </div>

                <Input
                  placeholder="Email *"
                  type="email"
                  value={currentEnquiry.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-10 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-orange-400"
                  required
                />

                <Input
                  placeholder="Preferred Location *"
                  value={currentEnquiry.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="h-10 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-orange-400"
                  required
                />

                <Textarea
                  placeholder="Message (optional)"
                  value={currentEnquiry.message || ''}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="min-h-[80px] border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm resize-none focus:border-orange-500 dark:focus:border-orange-400"
                  rows={3}
                />

                {/* Trust indicators */}
                <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>2-hour response</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 bg-zinc-900 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Enquiry
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
