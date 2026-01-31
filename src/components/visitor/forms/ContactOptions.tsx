"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, MessageCircle, Mail, Globe, Facebook, Instagram, 
  ExternalLink, Copy, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { showToast } from "@/utils/toast";

interface ContactOptionsProps {
  pgId?: string;
  managerName: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  onClose?: () => void;
  className?: string;
}

export default function ContactOptions({
  pgId,
  managerName,
  phoneNumber,
  whatsappNumber,
  email,
  website,
  facebook,
  instagram,
  onClose,
  className
}: ContactOptionsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      showToast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      showToast.error("Failed to copy");
    }
  };

  const openWhatsApp = (phone?: string) => {
    const number = phone || phoneNumber;
    if (!number) return;
    
    const cleanNumber = number.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${managerName}, I'm interested in your PG property. Can you provide more details?`);
    window.open(`https://wa.me/91${cleanNumber}?text=${message}`, '_blank');
  };

  const openPhone = (phone?: string) => {
    const number = phone || phoneNumber;
    if (!number) return;
    window.open(`tel:${number}`, '_blank');
  };

  const openEmail = (emailAddress?: string) => {
    const emailToUse = emailAddress || email;
    if (!emailToUse) return;
    
    const subject = encodeURIComponent(`Inquiry about PG Property`);
    const body = encodeURIComponent(`Hi ${managerName},\n\nI'm interested in your PG property. Could you please provide more details about availability and pricing?\n\nThank you!`);
    window.open(`mailto:${emailToUse}?subject=${subject}&body=${body}`, '_blank');
  };

  const contactMethods = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      available: !!(whatsappNumber || phoneNumber),
      action: () => openWhatsApp(whatsappNumber),
      description: 'Chat instantly on WhatsApp'
    },
    {
      id: 'phone',
      name: 'Call',
      icon: Phone,
      color: 'bg-blue-500 hover:bg-blue-600',
      available: !!phoneNumber,
      action: () => openPhone(),
      description: 'Direct phone call'
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-purple-500 hover:bg-purple-600',
      available: !!email,
      action: () => openEmail(),
      description: 'Send email inquiry'
    },
    {
      id: 'website',
      name: 'Website',
      icon: Globe,
      color: 'bg-orange-500 hover:bg-orange-600',
      available: !!website,
      action: () => window.open(website, '_blank'),
      description: 'Visit official website'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      available: !!facebook,
      action: () => window.open(facebook, '_blank'),
      description: 'Connect on Facebook'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-500 hover:bg-pink-600',
      available: !!instagram,
      action: () => window.open(instagram, '_blank'),
      description: 'Follow on Instagram'
    }
  ].filter(method => method.available);

  const availableMethods = contactMethods.filter(method => method.available);

  if (availableMethods.length === 0) {
    return null;
  }

  return (
    <div 
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "relative max-w-md mx-auto w-full p-px rounded-2xl bg-gradient-to-b from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 shadow-2xl", 
        className
      )}
    >
      <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-[1.9rem] p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Contact {managerName}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Choose your preferred contact method
          </p>
        </div>
        {/* Contact Methods Grid */}
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {availableMethods.map((method, index) => {
              const Icon = method.icon;
              const isCopied = copied === method.id;
              
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Button
                    onClick={method.action}
                    className={cn(
                      "w-full h-20 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200 group relative overflow-hidden",
                      method.color,
                      "text-white shadow-lg hover:shadow-xl active:scale-95"
                    )}
                  >
                    {/* Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <Icon className="h-6 w-6 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-semibold text-sm">{method.name}</div>
                      <div className="text-xs opacity-90">{method.description}</div>
                    </div>
                  </Button>

                  {/* Copy Button for Phone/Email */}
                  {(method.id === 'phone' || method.id === 'email') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        const text = method.id === 'phone' 
                          ? phoneNumber 
                          : email;
                        copyToClipboard(text!, method.name);
                      }}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                    >
                      {isCopied ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-zinc-500" />
                      )}
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Quick Info */}
        <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Quick response guaranteed</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Available 24/7 for inquiries</span>
          </div>
        </div>
      </div>
    </div>
  );
}
