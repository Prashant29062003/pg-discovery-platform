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
  BedDouble, Calendar as CalendarIcon, Loader2, ShieldCheck, Lock
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

export default function EnquiryForm({ pgId, className, title = "Priority Enquiry", onSuccess }: { pgId?: string, className?: string, title?: string, onSuccess?: () => void }) {
  const { user, isLoaded } = useUser();
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
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
        showToast.error(data.message || "Failed to submit enquiry");
        return;
      }

      setStatus("success");
      showToast.success("Enquiry sent successfully!");
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
        "relative max-w-md mx-auto w-full p-px rounded-[2.5rem] bg-gradient-to-b from-zinc-200 to-zinc-400 dark:from-zinc-700 dark:to-zinc-900 shadow-2xl", 
        className
      )}
    >
      <Card className="border-0 overflow-visible bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl rounded-[2.4rem]">
        <CardHeader className="space-y-1 pb-6 pt-8 text-center border-b border-zinc-100 dark:border-zinc-900/50">
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3" />
              Direct Contact • Verified
            </span>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Connect with property managers in minutes
          </CardDescription>
        </CardHeader>

        <CardContent className="overflow-visible pt-6">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-500/5">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Request Sent!</h3>
                  <p className="text-sm text-zinc-500 mt-1">Our manager will call you shortly.</p>
                </div>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {!user && (
                    <div className="space-y-4 pb-2">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
                            <Input placeholder="Your full name" className="pl-11 h-11 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-blue-400 transition" {...field} />
                          </div>
                          <FormMessage className="text-[10px] font-semibold text-red-500 px-1" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
                            <Input placeholder="your@email.com" className="pl-11 h-11 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-blue-400 transition" {...field} />
                          </div>
                          <FormMessage className="text-[10px] font-semibold text-red-500 px-1" />
                        </FormItem>
                      )} />
                    </div>
                  )}

                  {/* ROW 1: PHONE & OCCUPATION */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Mobile</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
                          <Input 
                            placeholder="98xxxxxxxx" 
                            maxLength={10} 
                            type="tel"
                            className="pl-11 h-11 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-blue-400 transition" 
                            {...field} 
                          />
                        </div>
                        <FormMessage className="text-[10px] font-semibold text-red-500 px-1" />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="occupation" render={({ field }) => (
                      <FormItem className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Occupation</label>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-blue-400 px-4">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[150] rounded-lg">
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="IT Professional">IT Professional</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] font-semibold text-red-500 px-1" />
                      </FormItem>
                    )} />
                  </div>

                  {/* ROW 2: ROOM TYPE & MOVE-IN DATE */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="roomSharing" render={({ field }) => (
                      <FormItem className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Room Type</label>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-blue-400 px-4">
                              <BedDouble className="h-4 w-4 text-zinc-400 mr-2" />
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[150] rounded-lg">
                            <SelectItem value="SINGLE">Single Bed</SelectItem>
                            <SelectItem value="DOUBLE">Double Sharing</SelectItem>
                            <SelectItem value="TRIPLE">Triple Sharing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] font-semibold text-red-500 px-1" />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="moveInDate" render={({ field }) => (
                      <FormItem className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Move-in Date</label>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-11 w-full rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 px-4 justify-start font-normal focus:border-blue-400",
                                  !field.value && "text-zinc-400",
                                  field.value && "text-zinc-900 dark:text-zinc-50 border-blue-400"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                                <span className="truncate text-sm">{field.value ? format(field.value, "dd MMM") : "Select date"}</span>
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-[160] rounded-lg overflow-hidden" align="center" sideOffset={10}>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-[10px] font-semibold text-red-500 px-1" />
                      </FormItem>
                    )} />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all active:scale-[0.98] shadow-lg hover:shadow-xl ease-in-out mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Send Enquiry"
                    )}
                  </Button>

                  {/* Agreement Text */}
                  <div className="pt-2 text-center">
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      By submitting, you agree to receive contact from property managers
                    </p>
                  </div>
                </form>
              </Form>
            )}
          </AnimatePresence>
        </CardContent>
        
        <div className="pb-6 px-6 text-center border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-center gap-2 py-3 text-center">
            <Lock className="h-4 w-4 text-zinc-400" />
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-wide">
              Your data is secure and encrypted
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}