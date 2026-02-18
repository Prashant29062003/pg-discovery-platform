'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, ChevronUp } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';

interface UserMenuProps {
  showLabel?: boolean;
  variant?: 'default' | 'circle';
}

export default function UserMenu({ showLabel = true, variant = 'default' }: UserMenuProps) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
    );
  }

  const isLoading = !isLoaded || !user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost"
          className={cn(
            // Removed default focus and added focus-visible for better Mouse UX
            "group flex items-center transition-all border border-transparent select-none",
            "hover:bg-zinc-100 dark:hover:bg-zinc-900",
            "active:scale-[0.98] focus:ring-0 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none",
            variant === 'circle' 
              ? "w-8 h-8 p-0 rounded-full justify-center" 
              : "w-full gap-3 p-2 h-auto rounded-xl justify-start bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800"
          )}
        >
          {/* Loading State - Always render same structure */}
          {isLoading ? (
            <div className={cn(
              "animate-pulse shrink-0 overflow-hidden flex items-center justify-center shadow-md border border-white/10",
              variant === 'circle' 
                ? "w-6 h-6 rounded-full bg-muted" 
                : "h-9 w-9 rounded-lg bg-muted"
            )} />
          ) : (
            <>
              {/* Avatar - Circle or Square based on variant */}
              <div className={cn(
                "shrink-0 overflow-hidden flex items-center justify-center shadow-md border border-white/10",
                variant === 'circle' 
                  ? "w-6 h-6 rounded-full bg-orange-600 shadow-orange-600/20" 
                  : "h-9 w-9 rounded-lg bg-orange-600 shadow-orange-600/20"
              )}>
                {user.imageUrl ? (
                  <Image 
                    src={user.imageUrl} 
                    alt={user.firstName || 'User'} 
                    width={variant === 'circle' ? 24 : 36} 
                    height={variant === 'circle' ? 24 : 36} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className={cn(
                    "text-white font-medium",
                    variant === 'circle' ? 'text-xs' : 'text-sm'
                  )}>
                    {user.firstName?.[0] || user.primaryEmailAddress?.emailAddress?.[0] || 'U'}
                  </span>
                )}
              </div>

              {/* Label for non-circle variant */}
              {variant !== 'circle' && (
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    {user.firstName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {user.publicMetadata?.role === 'owner' ? 'Admin' : 'User'}
                  </span>
                </div>
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Content - Only render when not loading */}
      {!isLoading && (
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href={user.publicMetadata?.role === 'owner' ? '/admin' : '/visitor/dashboard'} className="w-full cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={user.publicMetadata?.role === 'owner' ? '/admin/settings' : '/visitor/settings'} className="w-full cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 dark:text-red-400 cursor-pointer"
            onClick={() => signOut(() => router.push('/'))}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}