'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, LayoutDashboard, Settings, ChevronLeft, Store, Plus, X,
  MessageSquare, Camera, Users, ShieldCheck, Wallet, Heart,
  DoorOpen, ArrowLeft, Layers
} from "lucide-react";
import { cn } from "@/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from '@/context/SidebarContext';
import UserMenu from "@/components/visitor/dashboard/UserMenu";
import { useUser } from '@clerk/nextjs';

/**
 * MENU CONFIGURATIONS
 */
const GLOBAL_GROUPS = [
  {
    group: "General",
    items: [
      { icon: LayoutDashboard, label: "Overview", href: "/admin" },
      { icon: Home, label: "All Properties", href: "/admin/pgs" },
      { icon: Store, label: "Live Store Front", href: "/pgs" },
    ]
  },
  {
    group: "System",
    items: [
      { icon: Wallet, label: "Finance", href: "/admin/wallet" },
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ]
  }
];

const getPropertyGroups = (pgId: string) => [
  {
    group: "Property Management",
    items: [
      { icon: LayoutDashboard, label: "PG Dashboard", href: `/admin/pgs/${pgId}` },
      { icon: ShieldCheck, label: "Safety Audits", href: `/admin/pgs/${pgId}/safety` },
      { icon: Camera, label: "Life Gallery", href: `/admin/pgs/${pgId}/gallery` },
    ]
  },
  {
    group: "Inventory & Guests",
    items: [
      { icon: DoorOpen, label: "Rooms & Beds", href: `/admin/pgs/${pgId}/rooms` },
      { icon: MessageSquare, label: "Enquiries", href: `/admin/pgs/${pgId}/enquiries` },
      { icon: Users, label: "Current Guests", href: `/admin/pgs/${pgId}/guests` },
    ]
  }
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { user } = useUser();
    const { isOpen, setIsOpen, isMobileOpen, setIsMobileOpen } = useSidebar();

    // 1. Context Detection: Check if we are inside a specific PG route
    // Path format: /admin/pgs/[pgId]/...
    const segments = pathname.split('/');
    const pgsIndex = segments.indexOf('pgs');
    const pgId = (pgsIndex !== -1 && segments[pgsIndex + 1] && segments[pgsIndex + 1] !== 'new') 
        ? segments[pgsIndex + 1] 
        : null;

    const activeGroups = pgId ? getPropertyGroups(pgId) : GLOBAL_GROUPS;

    const isActive = (href: string) => pathname === href || (href !== '/admin' && pathname.startsWith(href));

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
        const showLabel = isMobile ? true : isOpen;

        return (
            <div className="flex flex-col h-full py-4">
                {/* Header */}
                <div className={cn("h-14 flex items-center px-4 mb-4", showLabel ? "justify-between" : "justify-center")}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-lg shadow-orange-600/20">
                            AP
                        </div>
                        {showLabel && (
                            <div className="flex flex-col">
                                <span className="font-bold text-base tracking-tight leading-none dark:text-white">Admin<span className="text-orange-600">Panel</span></span>
                                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-1">
                                    {pgId ? "Property View" : "Main Hub"}
                                </span>
                            </div>
                        )}
                    </div>
                    {isMobile ? (
                        <button onClick={() => setIsMobileOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    ) : (
                        <button onClick={() => setIsOpen(!isOpen)} className="hidden md:flex p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors">
                            <ChevronLeft className={cn("w-5 h-5 transition-transform duration-300", !isOpen && "rotate-180")} />
                        </button>
                    )}
                </div>

                {/* Context Switcher / Back Button (Only visible when managing a PG) */}
                {pgId && showLabel && (
                    <div className="px-3 mb-6">
                        <Link 
                            href="/admin/pgs"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors text-xs font-bold border border-zinc-200 dark:border-zinc-800"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Back to All Properties
                        </Link>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 space-y-6 px-3 overflow-y-auto no-scrollbar">
                    {activeGroups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-1">
                            {showLabel && (
                                <p className="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                    {group.group}
                                </p>
                            )}
                            <TooltipProvider delayDuration={0}>
                                {group.items.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Tooltip key={item.href} delayDuration={showLabel ? 1000 : 0}>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => isMobile && setIsMobileOpen(false)}
                                                    className={cn(
                                                        "flex items-center relative group rounded-xl transition-all duration-200",
                                                        showLabel ? "px-4 py-2.5 gap-3" : "justify-center p-3 aspect-square",
                                                        active 
                                                            ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600" 
                                                            : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                                                    )}
                                                >
                                                    <item.icon className={cn("shrink-0", active ? "w-5 h-5" : "w-5 h-5 group-hover:scale-110 transition-transform")} />
                                                    {showLabel && <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>}
                                                    {active && !showLabel && (
                                                        <motion.div layoutId="active-pill-desktop" className="absolute left-0 w-1 h-6 bg-orange-600 rounded-r-full" />
                                                    )}
                                                </Link>
                                            </TooltipTrigger>
                                            {!showLabel && <TooltipContent side="right" className="bg-zinc-900 text-white border-none">{item.label}</TooltipContent>}
                                        </Tooltip>
                                    );
                                })}
                            </TooltipProvider>
                        </div>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="px-3 mt-auto space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    {!pgId && (
                        <Link href="/admin/pgs/new" onClick={() => isMobile && setIsMobileOpen(false)}>
                            <button className={cn("w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-md shadow-orange-600/10", !showLabel && "aspect-square p-0")}>
                                <Plus className="w-5 h-5" />
                                {showLabel && <span>New Property</span>}
                            </button>
                        </Link>
                    )}

                    <div className={cn("flex items-center gap-3 p-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800", !showLabel && "justify-center")}>
                        <UserMenu />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <aside className={cn("hidden md:flex flex-col fixed inset-y-0 left-0 z-30 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300", isOpen ? "w-64" : "w-20")}>
                <SidebarContent />
            </aside>

            <AnimatePresence>
                {isMobileOpen && (
                    <div className="md:hidden fixed inset-0 z-[60]">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
                        <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-y-0 left-0 w-[280px] bg-white dark:bg-zinc-950 shadow-2xl">
                            <SidebarContent isMobile />
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}