'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PropertyBreadcrumbsProps {
  pgName?: string;
  pgId?: string;
  currentTab?: 'rooms' | 'enquiries' | 'gallery' | 'guests' | 'safety' | 'details' | 'edit' | 'preview';
}

const tabLabels: Record<string, string> = {
  rooms: 'Rooms',
  enquiries: 'Enquiries',
  gallery: 'Gallery',
  guests: 'Guests',
  safety: 'Safety Audit',
  details: 'Details',
  edit: 'Edit',
  preview: 'Preview',
};

export function PropertyBreadcrumbs({
  pgName = 'Property',
  pgId,
  currentTab,
}: PropertyBreadcrumbsProps) {
  const pathname = usePathname();

  // Determine current tab from pathname if not provided
  const detectedTab = currentTab || (
    pathname.includes('/rooms') ? 'rooms' :
    pathname.includes('/enquiries') ? 'enquiries' :
    pathname.includes('/gallery') ? 'gallery' :
    pathname.includes('/guests') ? 'guests' :
    pathname.includes('/safety') ? 'safety' :
    pathname.includes('/details') ? 'details' :
    pathname.includes('/edit') ? 'edit' :
    pathname.includes('/preview') ? 'preview' :
    undefined
  );

  const items: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin' },
    { label: 'Properties', href: '/admin/pgs' },
  ];

  if (pgId) {
    items.push({
      label: pgName,
      href: `/admin/pgs/${pgId}`,
    });
  }

  if (detectedTab) {
    items.push({
      label: tabLabels[detectedTab] || detectedTab,
      href: pgId ? `/admin/pgs/${pgId}/${detectedTab}` : '#',
    });
  }

  return (
    <nav className="flex items-center gap-1 text-sm px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40">
      <Link
        href="/admin/pgs"
        className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
          {index === items.length - 1 ? (
            <span className="text-zinc-900 dark:text-zinc-50 font-medium">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
