"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnquiryForm from "./EnquiryForm";

export function FloatingEnquiry() {
  const { user, isLoaded } = useUser();
  const [showEnquiry, setShowEnquiry] = useState(false);
  
  // Show to all users (both logged in and guests)
  if (!isLoaded) return null;
  
  // Don't show enquiry form to owners
  const userRole = (user?.publicMetadata as any)?.role;
  if (userRole === 'owner') return null;

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed right-6 bottom-6 z-40">
        <Button 
          onClick={() => setShowEnquiry(true)}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 active:scale-95 flex items-center justify-center group relative"
        >
          <MessageCircle className="h-6 w-6" />
          
          {/* Floating Label */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold px-3 py-2 rounded-lg pointer-events-none">
              Enquire
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-l-slate-900 dark:border-l-slate-100"></div>
            </div>
          </div>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-emerald-600 animate-pulse opacity-40"></div>
        </Button>
      </div>

      {/* Floating Modal */}
      {showEnquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEnquiry(false)}
          />
          <div className="relative w-full max-w-md z-10">
            <EnquiryForm 
              title="Send Your Enquiry"
              showContactOptions={true}
              managerName="Property Manager"
              onSuccess={() => setShowEnquiry(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}