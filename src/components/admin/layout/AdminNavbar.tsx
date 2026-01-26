'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from "next-themes";
import { useUser } from '@clerk/nextjs';
import { 
  ChevronRight, Menu, Bell, Globe, 
  Sun, Moon, LayoutDashboard, ChevronLeft 
} from 'lucide-react';

import { useSidebar } from '@/context/SidebarContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';
import UserMenu from "@/components/visitor/dashboard/UserMenu";

const ROUTE_LABELS: Record<string, string> = {
  admin: 'Dashboard',
  pgs: 'Properties',
  enquiries: 'Enquiries',
  settings: 'Settings',
  new: 'Create',
  edit: 'Edit',
  guests: 'Guests',
  rooms: 'Rooms',
  gallery: 'Gallery',
  safety: 'Safety Audit',
  preview: 'Preview',
  details: 'Details',
};

// Removed "inventory" to avoid redundant breadcrumbs
const SKIPPED_SEGMENTS = new Set(['inventory', 'dashboard']);

export function AdminNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const { user, isLoaded } = useUser();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const result: { label: string; href: string }[] = [];
    
    // Check if we're in a property page (has pgId followed by tabs like rooms, gallery, guests, safety)
    const pgIdIndex = segments.findIndex(s => s.length > 20 || (s.length > 10 && /\d/.test(s)));
    const isPropertyPage = pgIdIndex !== -1 && pgIdIndex < segments.length - 1;
    const propertyTabIndex = pgIdIndex + 1;
    const currentTab = isPropertyPage ? segments[propertyTabIndex] : null;
    
    for (let index = 0; index < segments.length; index++) {
      const segment = segments[index];
      
      // Check if this is an ID (MongoDB/UUID)
      const isId = segment.length > 20 || (segment.length > 10 && /\d/.test(segment));
      
      // Skip IDs and dashboard segment
      if (isId || SKIPPED_SEGMENTS.has(segment.toLowerCase())) {
        continue;
      }

      // Skip the [pgId] dynamic segment but keep track that we found it
      if (segment.includes('[') || segment.includes(']')) {
        continue;
      }

      // For property pages: inject "Rooms" as parent if current tab is not rooms
      if (isPropertyPage && index === propertyTabIndex && currentTab !== 'rooms') {
        // Add "Rooms" breadcrumb first
        const pgId = segments[pgIdIndex];
        const roomsHref = `/${segments.slice(0, pgIdIndex + 1).join('/')}/rooms`;
        result.push({ label: 'Rooms', href: roomsHref });
      }

      const href = `/${segments.slice(0, index + 1).join('/')}`;
      const label = ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      result.push({ label, href });
    }
    
    return result;
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 h-16 flex items-center justify-between transition-colors">
      
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* BREADCRUMBS CONTAINER */}
        <div className="flex items-center text-sm font-medium min-w-0">
          {/* Desktop: Show Admin Icon */}
          <Link 
            href="/admin" 
            className="hidden md:flex items-center gap-1.5 text-zinc-500 hover:text-orange-600 transition-colors shrink-0"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin</span>
          </Link>

          {/* Mobile "Back" indicator if deep in routes */}
          {breadcrumbs.length > 1 && (
             <Link href={breadcrumbs[breadcrumbs.length - 2].href} className="md:hidden p-1 text-zinc-400">
                <ChevronLeft className="w-4 h-4" />
             </Link>
          )}

          {/* Segment Divider (Desktop) */}
          {breadcrumbs.length > 0 && (
            <ChevronRight className="hidden md:block w-4 h-4 mx-2 text-zinc-300 shrink-0" />
          )}

          {/* Breadcrumb List */}
          <div className="flex items-center min-w-0">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              return (
                <div key={crumb.href} className={cn(
                    "flex items-center min-w-0",
                    // Mobile: Hide all except the last two segments to save space
                    index < breadcrumbs.length - 2 ? "hidden md:flex" : "flex"
                )}>
                  {isLast ? (
                    <span className="text-zinc-900 dark:text-zinc-100 truncate font-semibold px-1">
                      {crumb.label}
                    </span>
                  ) : (
                    <>
                        <Link
                          href={crumb.href}
                          className="text-zinc-500 hover:text-orange-600 transition-colors truncate max-w-[100px] md:max-w-[150px]"
                        >
                          {crumb.label}
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-1 text-zinc-300 shrink-0" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        <Link href="/" target="_blank" className="hidden lg:block">
          <Button variant="ghost" size="sm" className="gap-2 text-zinc-500 hover:text-orange-600">
            <Globe className="w-4 h-4" />
            <span>Live Site</span>
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full w-9 h-9 text-zinc-600 dark:text-zinc-400"
        >
          <Sun className="h-5 w-5 block dark:hidden" />
          <Moon className="h-5 w-5 hidden dark:block" />
        </Button>

        <div className="ml-1 md:ml-2 pl-2 md:pl-3 border-l border-zinc-200 dark:border-zinc-800 h-8 flex items-center">
          {!isLoaded ? (
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          ) : user ? (
            <UserMenu />
          ) : (
            <Link href="/sign-in">
              <Button size="sm" className="rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs px-4">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}