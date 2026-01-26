'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, LayoutDashboard, Wallet, MessageSquare, Heart, Settings, 
  Camera, Users, ShieldCheck, ChevronLeft, Store, Plus, DoorOpen
} from "lucide-react";
import { cn } from "@/utils"; // Ensure you have your clsx/tailwind-merge utility here
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from '@/context/SidebarContext';

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Home, label: "Properties", href: "/admin/pgs" },
    { icon: Store, label: "Store Front", href: "/pgs" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { isOpen, setIsOpen, isMobileOpen, setIsMobileOpen } = useSidebar();

    // Helper to determine active state
    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full py-4">
            {/* Header / Logo Area */}
            <div className={cn("h-14 flex items-center px-4 mb-6", isOpen ? "justify-between" : "justify-center")}>
                {isOpen ? (
                    <div className="flex flex-col">
                         <span className="font-bold text-lg tracking-tight">Admin<span className="text-orange-600">Panel</span></span>
                         <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Property Manager</span>
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
                        AP
                    </div>
                )}
                
                {/* Desktop Collapse Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="hidden md:flex p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    <ChevronLeft className={cn("w-5 h-5 transition-transform duration-300", !isOpen && "rotate-180")} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200">
                <TooltipProvider delayDuration={0}>
                    {menuItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Tooltip key={item.href} delayDuration={isOpen ? 1000 : 0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)} // Close mobile menu on click
                                        className={cn(
                                            "flex items-center relative group rounded-xl transition-all duration-200 ease-in-out",
                                            isOpen ? "px-4 py-3 gap-3" : "justify-center p-3 aspect-square",
                                            active
                                                ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500"
                                                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                                        )}
                                    >
                                        {active && (
                                            <motion.div
                                                layoutId="active-nav-pill"
                                                className="absolute left-0 w-1 h-1/2 top-1/4 bg-orange-500 rounded-r-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}
                                        
                                        <item.icon className={cn("flex-shrink-0 transition-transform duration-300", active ? "scale-100" : "group-hover:scale-110", isOpen ? "w-5 h-5" : "w-6 h-6")} />
                                        
                                        {/* Label - Only shown if open */}
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.span
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Link>
                                </TooltipTrigger>
                                {/* Tooltip only shows when sidebar is collapsed */}
                                {!isOpen && (
                                    <TooltipContent side="right" className="font-medium bg-zinc-900 text-white border-zinc-800 ml-2">
                                        {item.label}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        );
                    })}
                </TooltipProvider>
            </nav>

            {/* Quick Actions / Footer */}
            <div className={cn("px-3 mt-auto pt-4 space-y-3 border-t border-zinc-100 dark:border-zinc-800")}>
                {/* Quick Action Button */}
                <div>
                    <Tooltip delayDuration={isOpen ? 1000 : 0}>
                        <TooltipTrigger asChild>
                            <Link href="/admin/pgs/new" className="w-full">
                                <button className={cn(
                                    "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                    "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-500/20"
                                )}>
                                    <Plus className="w-4 h-4" />
                                    {isOpen && <span>Add Property</span>}
                                </button>
                            </Link>
                        </TooltipTrigger>
                        {!isOpen && <TooltipContent side="right" className="text-xs">Add Property</TooltipContent>}
                    </Tooltip>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex-shrink-0" />
                    {isOpen && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold truncate">Admin User</span>
                            <span className="text-xs text-zinc-500 truncate">admin@example.com</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* --- DESKTOP SIDEBAR --- */}
            <aside
                className={cn(
                    "hidden md:flex flex-col fixed inset-y-0 left-0 z-30 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out shadow-sm",
                    isOpen ? "w-64" : "w-20"
                )}
            >
                <SidebarContent />
            </aside>

            {/* --- MOBILE SIDEBAR (Drawer) --- */}
            <div className="md:hidden">
                {/* Backdrop */}
                <div 
                    className={cn(
                        "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                        isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                />
                
                {/* Slide-out Panel */}
                <aside 
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-300 ease-out",
                        isMobileOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    {/* Force open state for mobile content rendering */}
                    {(() => {
                        const originalIsOpen = isOpen; 
                        // Temporarily mocking isOpen as true for mobile render
                        // Note: In a real app, you might want separate render logic, 
                        // but re-using SidebarContent with styling overrides works too.
                        return (
                             <div className="h-full sidebar-mobile-override">
                                <SidebarContent /> 
                             </div>
                        )
                    })()}
                </aside>
            </div>
        </>
    );
}