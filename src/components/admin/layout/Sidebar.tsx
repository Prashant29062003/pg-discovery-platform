"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, LayoutDashboard, Wallet, MessageSquare, Heart, Settings, Camera, Users, ShieldCheck } from "lucide-react";
import { cn } from "@/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const menuItems = [
    { icon: Home, label: "Store", href: "/pgs" },
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: MessageSquare, label: "Enquiries", href: "/dashboard/enquiries" },
    { icon: Camera, label: "Life Gallery", href: "/dashboard/gallery" }, // NEW: Manage Life @ PG
    { icon: Users, label: "Guests", href: "/dashboard/guests" },
    { icon: ShieldCheck, label: "Safety Audit", href: "/dashboard/safety" }, // NEW: Safety management
    { icon: Wallet, label: "Wallet", href: "/wallet" },
    { icon: MessageSquare, label: "Message", href: "/messages" },
    { icon: Heart, label: "Likes", href: "/likes" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="h-screen w-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between py-6 transition-colors duration-300">
            {/* Logo Area (Mobile/Tablet usually hide this, handled by parent layout) */}
            
            {/* Menu Items */}
            <nav className="space-y-2 px-3">
                <TooltipProvider delayDuration={0}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link 
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                            isActive 
                                                ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500" 
                                                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="absolute left-0 w-1 h-6 bg-orange-500 rounded-r-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}
                                        <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="ml-2">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </TooltipProvider>
            </nav>

            {/* Settings at bottom */}
            <div className="px-3">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link 
                            href="/settings"
                            className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200"
                        >
                            <Settings className="w-5 h-5" />
                            <span className="text-sm font-medium">Settings</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                        Settings
                    </TooltipContent>
                </Tooltip>
            </div>
        </aside>
    );
}
