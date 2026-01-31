'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils';

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

interface AdminBreadcrumbsProps {
  className?: string;
  showBackButton?: boolean;
}

export function AdminBreadcrumbs({ className, showBackButton = true }: AdminBreadcrumbsProps) {
  const pathname = usePathname();

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

  // Don't show breadcrumbs on admin dashboard
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2 text-sm font-medium flex-wrap opacity-75", className)}>
      {/* Mobile Back Button */}
      {showBackButton && breadcrumbs.length > 1 && (
        <Link 
          href={breadcrumbs[breadcrumbs.length - 2].href} 
          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
          title="Go back"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}

      {/* Mobile Breadcrumbs - Full trail */}
      <div className="flex items-center flex-wrap gap-1 min-w-0 md:hidden">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <div key={crumb.href} className="flex items-center min-w-0">
              {index > 0 && (
                <ChevronRight className="w-3 h-3 mx-1 text-muted-foreground/50 flex-shrink-0" />
              )}
              {isLast ? (
                <span className="text-foreground font-medium truncate px-1 text-xs">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-orange-600 transition-colors truncate max-w-[60px] xs:max-w-[80px] text-xs"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
