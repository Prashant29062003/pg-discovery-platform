"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EnquiryForm from "./EnquiryForm";

export function FloatingEnquiry() {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  
  // Show to all users (both logged in and guests)
  if (!isLoaded) return null;
  
  // Don't show enquiry form to owners
  const userRole = (user?.publicMetadata as any)?.role;
  if (userRole === 'owner') return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Floating Action Button */}
      <div className="fixed right-6 bottom-6 z-40">
        <Button 
          onClick={() => setOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 active:scale-95 flex items-center justify-center group relative"
        >
          <MessageCircle className="h-6 w-6" />
          
          {/* Floating Label */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold px-3 py-2 rounded-lg pointer-events-none">
              Quick Enquiry
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-l-zinc-900 dark:border-l-zinc-100"></div>
            </div>
          </div>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-blue-600 animate-pulse opacity-40"></div>
        </Button>
      </div>

      {/* Dialog Modal - Only closes with close button */}
      <DialogContent 
        className="max-w-md max-h-[90vh] flex flex-col overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-zinc-900 dark:to-zinc-800 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1 flex-1">
              <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Contact Property Manager
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-600 dark:text-zinc-400">
                Fill in your details for instant connection
              </DialogDescription>
            </div>
            
            {/* Close Button */}
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Form container - scrollable but fits in screen */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          <EnquiryForm 
            title="Send Enquiry" 
            onSuccess={() => setOpen(false)}
          />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-50 dark:bg-zinc-900 px-6 py-3 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-center gap-1.5">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-semibold">
              Property managers respond in &lt;2 hours
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}