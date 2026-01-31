'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from "next-themes";
import { useUser } from '@clerk/nextjs';
import { 
  ChevronRight, Menu, Globe, 
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

const SKIPPED_SEGMENTS = new Set(['inventory', 'dashboard']);

export function AdminNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const { user, isLoaded } = useUser();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const result: { label: string; href: string }[] = [];
    
    // Check if we're in a property page
    const pgIdIndex = segments.findIndex(s => s.length > 20 || (s.length > 10 && /\d/.test(s)));
    const isPropertyPage = pgIdIndex !== -1 && pgIdIndex < segments.length - 1;
    const propertyTabIndex = pgIdIndex + 1;
    const currentTab = isPropertyPage ? segments[propertyTabIndex] : null;
    
    for (let index = 0; index < segments.length; index++) {
      const segment = segments[index];
      
      // Check if this is an ID
      const isId = segment.length > 20 || (segment.length > 10 && /\d/.test(segment));
      
      // Skip IDs and dashboard segment
      if (isId || SKIPPED_SEGMENTS.has(segment.toLowerCase())) {
        continue;
      }

      // Skip the [pgId] dynamic segment
      if (segment.includes('[') || segment.includes(']')) {
        continue;
      }

      // For property pages: inject "Rooms" as parent if current tab is not rooms
      if (isPropertyPage && index === propertyTabIndex && currentTab !== 'rooms') {
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
    <nav className="sticky top-0 z-30 w-full bg-card/80 backdrop-blur-md border-b border-border px-8 h-14 sm:h-16 flex items-center justify-between transition-colors">
      
      {/* LEFT SIDE - Mobile Menu Toggle & Breadcrumbs */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-accent text-muted-foreground shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* BREADCRUMBS CONTAINER - Responsive */}
        <div className="flex items-center text-sm font-medium min-w-0 flex-wrap">
          {/* Dashboard Icon - Always visible */}
          <Link 
            href="/admin" 
            className="flex items-center gap-1.5 text-muted-foreground hover:text-orange-600 transition-colors shrink-0"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          {/* Segment Divider - Desktop only */}
          {breadcrumbs.length > 0 && (
            <ChevronRight className="hidden md:block w-4 h-4 mx-2 text-muted-foreground shrink-0" />
          )}

          {/* Breadcrumb List - Desktop Only */}
          <div className="hidden md:flex items-center min-w-0 flex-wrap">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              return (
                <div key={crumb.href} className="flex items-center min-w-0">
                  {isLast ? (
                    <span className="text-foreground truncate font-semibold px-1">
                      {crumb.label}
                    </span>
                  ) : (
                    <>
                        <Link
                          href={crumb.href}
                          className="text-muted-foreground hover:text-orange-600 transition-colors truncate max-w-[120px] lg:max-w-[150px]"
                        >
                          {crumb.label}
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground shrink-0" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Essential Actions Only */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0 ">
        {/* Live Site - Icon on Mobile, Icon+Text on Larger */}
        <Link href="/" target="_blank">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-orange-600 w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 lg:w-auto lg:h-10 lg:px-3"
            title="View Live Site"
          >
            <Globe className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
            <span className="hidden lg:inline ml-2">Live Site</span>
          </Button>
        </Link>

        {/* Theme Toggle - Fully Responsive */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-muted-foreground hover:bg-accent"
          title="Toggle Theme"
        >
          <Sun className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4 block dark:hidden" />
          <Moon className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4 hidden dark:block" />
        </Button>

        {/* User Menu - Responsive Design */}
        <div className="border-l border-border h-7 xs:h-8 sm:h-9 lg:h-10 flex items-center pl-1 xs:pl-2 sm:pl-3 lg:pl-4">
          {!isLoaded ? (
            <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="scale-75 xs:scale-85 sm:scale-90 lg:scale-100">
              <UserMenu variant="default" showLabel={true} />
            </div>
          ) : (
            <div className="scale-75 xs:scale-85 sm:scale-90 lg:scale-100">
              <Link href="/sign-in">
                <Button size="sm" className="rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 xs:px-3 h-6 xs:h-7 sm:h-8 lg:h-9">
                  <span className="hidden sm:inline">Login</span>
                  <span className="sm:hidden">👤</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}