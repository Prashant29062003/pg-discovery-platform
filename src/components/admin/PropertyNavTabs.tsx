'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Camera, Users, ShieldCheck, DoorOpen } from "lucide-react";
import { cn } from "@/utils";

interface PropertyNavTabsProps {
  pgId: string;
  pgName?: string;
}

export function PropertyNavTabs({ pgId, pgName }: PropertyNavTabsProps) {
  const pathname = usePathname();

  const navItems = [
    { 
      icon: DoorOpen, 
      label: "Rooms", 
      href: `/admin/pgs/${pgId}/rooms`,
      description: "Manage rooms and beds"
    },
    { 
      icon: MessageSquare, 
      label: "Enquiries", 
      href: `/admin/pgs/${pgId}/enquiries`,
      description: "View inquiries"
    },
    { 
      icon: Camera, 
      label: "Gallery", 
      href: `/admin/pgs/${pgId}/gallery`,
      description: "Manage images"
    },
    { 
      icon: Users, 
      label: "Guests", 
      href: `/admin/pgs/${pgId}/guests`,
      description: "Manage residents"
    },
    { 
      icon: ShieldCheck, 
      label: "Safety Audit", 
      href: `/admin/pgs/${pgId}/safety`,
      description: "Safety records"
    },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {pgName && (
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            {pgName}
          </h2>
        )}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-200 text-sm font-medium border-b-2",
                  active
                    ? "text-orange-600 dark:text-orange-500 border-orange-600 dark:border-orange-500 bg-orange-50/50 dark:bg-orange-500/10"
                    : "text-zinc-600 dark:text-zinc-400 border-transparent hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
