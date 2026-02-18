"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Building, 
  Users, 
  Star,
  Send,
  CheckCircle2,
  ArrowRight,
  Wifi,
  Car,
  Dumbbell,
  Utensils,
  Tv,
  Wind,
  BedDouble,
  Calendar as CalendarIcon,
  ExternalLink,
  MousePointer2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/config/site";
import Link from "next/link";
import { useEnquiryStore, submitEnquiry } from "@/store/useEnquiryStore";

const formSchema = z.object({
  name: z.string().min(2, "Full name required").max(50),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile required"),
  email: z.string().email("Valid email required"),
  location: z.string().min(2, "Location required"),
  occupation: z.string().min(1, "Occupation required"),
  roomType: z.string().min(1, "Room type required"),
  moveInDate: z.string().min(1, "Move-in date required"),
  budget: z.string().min(1, "Budget range required"),
  message: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EnquiryPage() {
  const [isMapActive, setIsMapActive] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    currentEnquiry,
    setCurrentEnquiry,
    updateCurrentEnquiry,
    clearCurrentEnquiry,
    isSubmitting,
    setIsSubmitting
  } = useEnquiryStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      location: "",
      occupation: "",
      roomType: "",
      moveInDate: "",
      budget: "",
      message: "",
      amenities: [],
    },
  });

  // Load saved data from store on mount
  useEffect(() => {
    if (currentEnquiry && Object.keys(currentEnquiry).length > 0) {
      // Populate form with saved data
      Object.keys(currentEnquiry).forEach(key => {
        if (key in form.getValues()) {
          form.setValue(key as any, currentEnquiry[key as keyof typeof currentEnquiry]);
        }
      });
    }
  }, [currentEnquiry]); // Remove 'form' from dependencies

  // Lazy load map only when user scrolls near it or clicks to interact
  useEffect(() => {
    const handleScroll = () => {
      const mapSection = document.getElementById('map-section');
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

  const AMENITIES_OPTIONS = [
    { id: "WiFi", label: "WiFi", icon: Wifi },
    { id: "Parking", label: "Parking", icon: Car },
    { id: "Gym", label: "Gym", icon: Dumbbell },
    { id: "Food", label: "Food", icon: Utensils },
    { id: "TV", label: "TV", icon: Tv },
    { id: "AC", label: "AC", icon: Wind },
  ];

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(newAmenities);
    form.setValue("amenities", newAmenities);
    updateCurrentEnquiry({ amenities: newAmenities });
  };

  const handleMapInteraction = () => {
    if (!shouldLoadMap) {
      setShouldLoadMap(true);
    }
    setIsMapActive(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const result = await submitEnquiry({
        ...data,
        amenities: selectedAmenities
      }, 'enquiry-page');
      
      if (result.success) {
        setIsSubmitted(true);
        toast.success("✅ Enquiry submitted successfully! We'll contact you within 2 hours.");
        form.reset();
        setSelectedAmenities([]);
        clearCurrentEnquiry();
        
        // Reset success state after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        toast.error(result.error || "Failed to submit enquiry");
      }
    } catch (error) {
      toast.error("An error occurred while submitting your enquiry");
    }
  };

  // Auto-save form data to store with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const subscription = form.watch((value) => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Debounce the update to prevent too frequent calls
      timeoutId = setTimeout(() => {
        if (Object.keys(value).length > 0) {
          // Only update if there are actual values to save
          const hasValues = Object.values(value).some(val => 
            val !== undefined && val !== null && val !== ''
          );
          
          if (hasValues) {
            // Clean up the data before updating
            const cleanedValue = {
              ...value,
              amenities: value.amenities?.filter((a): a is string => a !== undefined) || []
            };
            updateCurrentEnquiry(cleanedValue);
          }
        }
      }, 500); // 500ms debounce
    });
    
    return () => {
      subscription.unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Remove updateCurrentEnquiry from dependencies to prevent re-runs

  // Map URLs from SITE_CONFIG
  const googleMapsUrl = SITE_CONFIG.mapUrl;
  const embedMapUrl = SITE_CONFIG.embedMapUrl;

  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-zinc-100/50 dark:bg-zinc-800/50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Badge className="mb-4 bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700">
                Fast Response Guaranteed
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
                Find Your Perfect
                <span className="text-orange-500">
                  {" "}PG Home
                </span>
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto mb-8">
                Connect with verified property managers instantly. Get response within 2 hours and find your ideal accommodation.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-500" />
                  <span>100% Verified Properties</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <span>2-Hour Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-500" />
                  <span>10,000+ Happy Tenants</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Enhanced Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-lg">
                  <CardHeader className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                      <MessageSquare className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                      Quick Enquiry Form
                    </CardTitle>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Fill in your requirements and we'll find the perfect PG for you
                    </p>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="w-10 h-10 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                          Enquiry Submitted Successfully!
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                          Our property managers will contact you within 2 hours with the best PG options matching your requirements.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} className="bg-zinc-900 hover:bg-zinc-800 text-white">
                          Submit Another Enquiry
                        </Button>
                      </motion.div>
                    ) : (
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Personal Information
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Input
                                placeholder="Full Name *"
                                {...form.register("name")}
                                className="h-12 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20"
                              />
                              {form.formState.errors.name && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                              )}
                            </div>
                            
                            <div>
                              <Input
                                placeholder="Phone Number *"
                                type="tel"
                                maxLength={10}
                                {...form.register("phone")}
                                className="h-12 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20"
                              />
                              {form.formState.errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <Input
                              placeholder="Email Address *"
                              type="email"
                              {...form.register("email")}
                              className="h-12 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20"
                            />
                            {form.formState.errors.email && (
                              <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                            )}
                          </div>
                        </div>

                        {/* Requirements */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location & Requirements
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Input
                                placeholder="Preferred Location *"
                                {...form.register("location")}
                                className="h-12 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20"
                              />
                              {form.formState.errors.location && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.location.message}</p>
                              )}
                            </div>
                            
                            <div>
                              <Select onValueChange={(value) => form.setValue("occupation", value)}>
                                <SelectTrigger className="h-12 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20">
                                  <SelectValue placeholder="Occupation *" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Student">Student</SelectItem>
                                  <SelectItem value="IT Professional">IT Professional</SelectItem>
                                  <SelectItem value="Business">Business</SelectItem>
                                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              {form.formState.errors.occupation && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.occupation.message}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Select onValueChange={(value) => form.setValue("roomType", value)}>
                                <SelectTrigger className="h-12 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20">
                                  <BedDouble className="w-4 h-4 mr-2" />
                                  <SelectValue placeholder="Room Type *" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SINGLE">Single Bed</SelectItem>
                                  <SelectItem value="DOUBLE">Double Sharing</SelectItem>
                                  <SelectItem value="TRIPLE">Triple Sharing</SelectItem>
                                </SelectContent>
                              </Select>
                              {form.formState.errors.roomType && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.roomType.message}</p>
                              )}
                            </div>
                            
                            <div>
                              <Input
                                type="date"
                                {...form.register("moveInDate")}
                                className="h-12 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20"
                                min={new Date().toISOString().split('T')[0]}
                              />
                              {form.formState.errors.moveInDate && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.moveInDate.message}</p>
                              )}
                            </div>
                            
                            <div>
                              <Select onValueChange={(value) => form.setValue("budget", value)}>
                                <SelectTrigger className="h-12 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20">
                                  <SelectValue placeholder="Budget Range *" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                                  <SelectItem value="10000-15000">₹10,000 - ₹15,000</SelectItem>
                                  <SelectItem value="15000-20000">₹15,000 - ₹20,000</SelectItem>
                                  <SelectItem value="20000-25000">₹20,000 - ₹25,000</SelectItem>
                                  <SelectItem value="25000-30000">₹25,000 - ₹30,000</SelectItem>
                                  <SelectItem value="30000+">₹30,000+</SelectItem>
                                </SelectContent>
                              </Select>
                              {form.formState.errors.budget && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.budget.message}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Wifi className="w-4 h-4" />
                            Preferred Amenities
                          </h4>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {AMENITIES_OPTIONS.map((amenity) => {
                              const Icon = amenity.icon;
                              const isSelected = selectedAmenities.includes(amenity.id);
                              
                              return (
                                <div
                                  key={amenity.id}
                                  onClick={() => handleAmenityToggle(amenity.id)}
                                  className={`
                                    flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                                    ${isSelected 
                                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 shadow-sm" 
                                      : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                                    }
                                  `}
                                >
                                  <Icon className="w-4 h-4" />
                                  <span className="text-sm">{amenity.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Message */}
                        <div>
                          <Textarea
                            placeholder="Additional requirements or message (optional)"
                            {...form.register("message")}
                            className="min-h-[100px] border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 resize-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20"
                          />
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-14 bg-zinc-900 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
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

                        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                          By submitting, you agree to receive instant contact from verified property managers
                        </p>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Contact Info & Stats */}
            <div className="space-y-6">
              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Phone</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">+91 98765 43210</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Email</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">contact@pgplatform.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Office</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Bangalore, India</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                      Why Choose Us
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-zinc-900 dark:text-white">500+</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">Verified PGs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-zinc-900 dark:text-white">10K+</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">Happy Tenants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-zinc-900 dark:text-white">4.8</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">Average Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-zinc-900 dark:text-white">24/7</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">Support</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Map Section */}
          <motion.div
            id="map-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-lg overflow-hidden">
              <CardHeader className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div className="space-y-4">
                    <CardTitle className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                      Find PGs Near You
                    </CardTitle>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-2xl">
                      Explore our network of verified PG properties across major cities. Click to interact with the map and explore nearby locations.
                    </p>
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      {SITE_CONFIG.address}
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button variant="outline" size="lg" className="rounded-2xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white h-14 px-8 text-base font-bold shadow-sm hover:shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 group" asChild>
                      <Link href={googleMapsUrl} target="_blank">
                        Open in Google Maps 
                        <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Optimized Map Container */}
                <div className="relative h-[500px] lg:h-[650px] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {/* Loading State */}
                  {!shouldLoadMap && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPin className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                          Interactive Map
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-4 max-w-sm">
                          Scroll down or click to load the interactive map with PG locations
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
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-zinc-300 border-t-zinc-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-zinc-600 dark:text-zinc-400">Loading map...</p>
                      </div>
                    </div>
                  )}

                  {/* Interaction Overlay - Only show when map is loaded but not active */}
                  {shouldLoadMap && isMapLoaded && !isMapActive && (
                    <div
                      className="absolute inset-0 z-20 bg-foreground/5 backdrop-blur-[1px] cursor-pointer flex flex-col items-center justify-center transition-all hover:bg-foreground/10"
                      onClick={handleMapInteraction}
                    >
                      <div className="bg-white/90 dark:bg-zinc-800/90 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-zinc-200 dark:border-zinc-700 scale-100 hover:scale-110 transition-transform duration-500">
                        <MousePointer2 className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                        <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">Interact with Street Map</span>
                      </div>
                    </div>
                  )}

                  {/* Optimized Map Iframe */}
                  {shouldLoadMap && (
                    <iframe
                      src={embedMapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      onLoad={() => setIsMapLoaded(true)}
                      title="PG Locations Map"
                      className={`
                        w-full h-full transition-all duration-1000
                        dark:invert dark:hue-rotate-180 dark:brightness-[0.7] dark:contrast-[1.2] dark:grayscale-[0.2]
                        ${!isMapActive ? "pointer-events-none" : "pointer-events-auto"}
                        ${!isMapLoaded ? "opacity-0" : "opacity-100"}
                      `}
                    ></iframe>
                  )}

                  {/* Floating Contact Card - Hide on mobile, show only on desktop */}
                  {isMapLoaded && (
                    <div className="hidden lg:block absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-auto z-30">
                      <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
                        className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-3xl p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-zinc-200/50 dark:border-zinc-700/50 max-w-sm relative overflow-hidden"
                      >
                        {/* Accent Decoration */}
                        <div className="absolute top-0 right-0 h-24 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full -mr-12 -mt-12 blur-2xl" />
                        
                        <h4 className="font-black text-zinc-900 dark:text-white text-xl tracking-tighter">Visit Our Office</h4>
                        <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-1 uppercase tracking-[0.3em] font-black opacity-80">
                          Premium PG Locations
                        </p>

                        <div className="mt-6 space-y-3">
                          <a
                            href={`tel:${SITE_CONFIG.supportPhone}`}
                            className="group flex items-center gap-4 p-3 -ml-3 rounded-2xl transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
                          >
                            <div className="h-12 w-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-lg shadow-zinc-900/20 group-hover:bg-orange-600 group-hover:rotate-12 transition-all">
                              <Phone className="h-6 w-6" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[9px] text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-[0.15em]">24/7 Support</p>
                              <p className="font-bold text-zinc-900 dark:text-white text-lg">
                                {SITE_CONFIG.supportPhone}
                              </p>
                            </div>
                          </a>

                          <div className="flex items-center gap-4 p-3 -ml-3 rounded-2xl">
                            <div className="h-12 w-12 rounded-2xl bg-zinc-800 text-white flex items-center justify-center shrink-0 shadow-lg shadow-zinc-800/20">
                              <Mail className="h-6 w-6" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[9px] text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-[0.15em]">Email Us</p>
                              <p className="font-bold text-zinc-900 dark:text-white text-sm">
                                {SITE_CONFIG.supportEmail}
                              </p>
                            </div>
                          </div>
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
                        className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-3xl border-t border-zinc-200/50 dark:border-zinc-700/50 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-black text-zinc-900 dark:text-white text-sm tracking-tighter">Visit Our Office</h4>
                            <p className="text-[8px] text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.2em] font-black opacity-80">
                              {SITE_CONFIG.address}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${SITE_CONFIG.supportPhone}`}
                              className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-lg shadow-zinc-900/20 hover:bg-orange-600 hover:rotate-12 transition-all"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                            <Button
                              onClick={() => window.open(googleMapsUrl, '_blank')}
                              size="sm"
                              className="h-10 px-4 bg-zinc-900 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-all"
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
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_100px_rgba(255,255,255,0.05)]"></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
