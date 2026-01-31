"use client";

import { useState } from "react";
import EnquiryForm from "@/components/visitor/forms/EnquiryForm";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Mail, MapPin, Clock, ShieldCheck, Building, Users, Star } from "lucide-react";

export default function EnquiryPage() {
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're here to help and answer any questions you might have. We look forward to hearing from you.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Contact Info */}
            <div className="space-y-8">
              {/* Contact Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/20 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">+91 98765 43210</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mon-Fri from 8am to 5pm.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">contact@pgplatform.com</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We'll respond as soon as possible.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Office</h3>
                      <p className="text-gray-600 dark:text-gray-300">123 MG Road, Bangalore</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Karnataka 560001, India</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/20 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why Choose Us</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Building className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">500+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Verified PGs</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">10,000+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Happy Tenants</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Star className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">4.8</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Average Rating</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">24/7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Enquiry Form */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/20 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>
                
                <EnquiryForm 
                  title=""
                  showContactOptions={true}
                  managerName="Property Manager"
                  onSuccess={() => setShowEnquiry(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
