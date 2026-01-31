"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  User, Phone, Mail, MapPin, CheckCircle2,
  BedDouble, Calendar as CalendarIcon, Loader2, ShieldCheck, Lock, MessageCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { showToast } from "@/utils/toast";
import { cn } from "@/utils";
import { useAutoSave } from "@/hooks/useAutoSave";
import ContactOptions from "./ContactOptions";

const formSchema = z.object({
  name: z.string().min(2, "Full name required").max(50),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile required"),
  email: z.string().email("Valid email required"),
  occupation: z.string().min(1, "Occupation required"),
  roomSharing: z.string().min(1, "Room type required"),
  moveInDate: z.any().refine((val) => val instanceof Date, {
    message: "Move-in date required",
  }),
});

export default function EnquiryForm({ 
  pgId, 
  className, 
  title = "Priority Enquiry", 
  onSuccess,
  // Contact options props
  managerName = "Property Manager",
  phoneNumber,
  whatsappNumber,
  email,
  website,
  facebook,
  instagram,
  showContactOptions = true
}: { 
  pgId?: string, 
  className?: string, 
  title?: string, 
  onSuccess?: () => void,
  managerName?: string,
  phoneNumber?: string,
  whatsappNumber?: string,
  email?: string,
  website?: string,
  facebook?: string,
  instagram?: string,
  showContactOptions?: boolean
}) {
  const { user, isLoaded } = useUser();
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", email: "", occupation: "", roomSharing: "", moveInDate: undefined },
  });

  useEffect(() => {
    if (isLoaded && user) {
      form.setValue("name", user.fullName || "");
      form.setValue("email", user.primaryEmailAddress?.emailAddress || "");
    }
  }, [isLoaded, user, form]);

  // Watch form changes for auto-save
  const watchedValues = form.watch();
  
  // Auto-save functionality for enquiry form
  const { loadFromLocalStorage, clearSavedData } = useAutoSave({
    key: `enquiry-draft-${pgId || 'general'}`,
    data: watchedValues,
    onSave: async (data) => {
      try {
        // Only save if there's actual data entered
        const hasData = data.name || data.email || data.phone || data.occupation || data.roomSharing || data.moveInDate;
        if (hasData) {
          console.log('Enquiry draft saved:', data);
        }
      } catch (error) {
        console.error('Enquiry draft save error:', error);
        throw error;
      }
    },
    debounceMs: 2000,
    showNotifications: false, // Don't show notifications for enquiry drafts
  });

  // Load saved enquiry data on mount
  useEffect(() => {
    const savedEnquiry = loadFromLocalStorage();
    if (savedEnquiry) {
      // Restore form values
      Object.keys(savedEnquiry).forEach(key => {
        if (key in form.getValues()) {
          form.setValue(key as any, savedEnquiry[key]);
        }
      });
    }
  }, [loadFromLocalStorage, form]);

  useEffect(() => {
    if (isLoaded && user) {
      form.setValue("name", user.fullName || "");
      form.setValue("email", user.primaryEmailAddress?.emailAddress || "");
    }
  }, [isLoaded, user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Validate that form has actual data before submitting
      const hasData = values.name && values.phone && values.email && values.occupation && values.roomSharing && values.moveInDate;
      if (!hasData) {
        showToast.error("Please fill in all required fields");
        return;
      }
      
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...values, 
          ...(pgId && !['elite-hub', 'general-inquiry', 'floating-drawer', 'navbar-modal'].includes(pgId) ? { pgId } : {}),
          roomType: values.roomSharing,
          moveInDate: values.moveInDate.toISOString(),
          message: `Looking for ${values.roomSharing} accommodation`
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error cases
        if (data.error?.includes('already submitted')) {
          showToast.warning(data.error || "You've already submitted an enquiry recently. Please try again later.");
        } else {
          showToast.error(data.message || data.error || "Failed to submit enquiry");
        }
        return;
      }

      setStatus("success");
      showToast.success("Enquiry sent successfully!");
      clearSavedData(); // Clear saved draft on successful submission
      form.reset();
      if (onSuccess) setTimeout(onSuccess, 2000);
    } catch (error) {
      console.error("Enquiry error:", error);
      showToast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "relative max-w-md mx-auto w-full", 
        className
      )}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        {/* Modern Header */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center mb-2">{title}</h3>
            <p className="text-center text-white/90 text-sm">
              Connect with verified property managers instantly
            </p>
            
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Instant Response</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Verified Properties</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 bg-white dark:bg-slate-900">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Enquiry Sent Successfully!
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Our manager will contact you within minutes
                </p>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {!user && (
                    <div className="space-y-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input 
                                placeholder="Your full name" 
                                className="pl-10 h-12 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input 
                                placeholder="Your email address" 
                                type="email"
                                className="pl-10 h-12 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input 
                              placeholder="Phone number" 
                              type="tel"
                              maxLength={10}
                              className="pl-10 h-12 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="occupation" render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all">
                              <SelectValue placeholder="Occupation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="IT Professional">IT Professional</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="roomSharing" render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all">
                              <BedDouble className="h-4 w-4 text-slate-400 mr-2" />
                              <SelectValue placeholder="Room Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SINGLE">Single Bed</SelectItem>
                            <SelectItem value="DOUBLE">Double Sharing</SelectItem>
                            <SelectItem value="TRIPLE">Triple Sharing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="moveInDate" render={({ field }) => (
                      <FormItem>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-12 w-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all justify-start text-left font-normal",
                                  !field.value && "text-slate-500"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "MMM dd, yyyy") : "Move-in date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Send Priority Enquiry
                      </>
                    )}
                  </Button>

                  {/* Contact Options Divider */}
                  {showContactOptions && (phoneNumber || whatsappNumber || email) && (
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-slate-900 px-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          OR CONTACT DIRECTLY
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Contact Options Button */}
                  {showContactOptions && (phoneNumber || whatsappNumber || email) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowContact(true)}
                      className="w-full h-11 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Quick Contact Options
                    </Button>
                  )}

                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                    By submitting, you agree to receive instant contact from verified property managers
                  </p>
                </form>
              </Form>
            )}
          </AnimatePresence>
        </CardContent>
      </div>

      {/* Contact Options Modal */}
      <AnimatePresence>
        {showContact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContact(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md z-10"
            >
              <ContactOptions
                pgId={pgId}
                managerName={managerName}
                phoneNumber={phoneNumber}
                whatsappNumber={whatsappNumber}
                email={email}
                website={website}
                facebook={facebook}
                instagram={instagram}
                onClose={() => setShowContact(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}